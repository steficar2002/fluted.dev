import { NextResponse } from "next/server";
import { notifyAuditUnlock } from "@/lib/audit/notify";
import { clientIp, rateLimit } from "@/lib/audit/rate-limit";
import { toTeaser } from "@/lib/audit/schema";
import { updateAudit } from "@/lib/audit/store";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(request: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const ip = clientIp(request);
  const limited = rateLimit({
    key: `audit:unlock:${ip}`,
    limit: 10,
    windowMs: 60 * 60 * 1000,
  });
  if (!limited.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: `Too many unlock attempts. Try again in ${limited.retryAfterSec}s.`,
      },
      { status: 429 },
    );
  }

  let body: {
    name?: string;
    email?: string;
    company?: string;
    notes?: string;
  };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON." },
      { status: 400 },
    );
  }

  const name = body.name?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const company = body.company?.trim() || undefined;
  const notes = body.notes?.trim() || undefined;

  if (!name || !email) {
    return NextResponse.json(
      { ok: false, error: "Name and email are required." },
      { status: 400 },
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { ok: false, error: "Enter a valid email." },
      { status: 400 },
    );
  }

  const updated = await updateAudit(id, (record) => ({
    ...record,
    unlocked: true,
    lead: {
      name,
      email,
      company,
      notes,
      unlockedAt: new Date().toISOString(),
    },
  }));

  if (!updated) {
    return NextResponse.json(
      { ok: false, error: "Audit not found or expired." },
      { status: 404 },
    );
  }

  try {
    await notifyAuditUnlock(updated);
  } catch (err) {
    console.error("[audit-notify]", err);
  }

  return NextResponse.json({ ok: true, teaser: toTeaser(updated) });
}
