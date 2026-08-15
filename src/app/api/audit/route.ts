import { NextResponse } from "next/server";
import { verifyTurnstileToken } from "@/lib/audit/captcha";
import { runHomepageAudit } from "@/lib/audit/pipeline";
import { clientIp, rateLimit } from "@/lib/audit/rate-limit";
import { toTeaser } from "@/lib/audit/schema";
import { normalizeAuditUrl } from "@/lib/audit/url";

export const maxDuration = 60;

export async function POST(request: Request) {
  const ip = clientIp(request);
  const limited = rateLimit({
    key: `audit:create:${ip}`,
    limit: 3,
    windowMs: 60 * 60 * 1000,
  });
  if (!limited.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: `Too many audits from this network. Try again in ${limited.retryAfterSec}s.`,
      },
      { status: 429 },
    );
  }

  let body: { url?: string; captchaToken?: string };
  try {
    body = (await request.json()) as { url?: string; captchaToken?: string };
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON." },
      { status: 400 },
    );
  }

  const captcha = await verifyTurnstileToken(body.captchaToken, ip);
  if (!captcha.ok) {
    return NextResponse.json(
      { ok: false, error: captcha.error },
      { status: 400 },
    );
  }

  const normalized = normalizeAuditUrl(body.url ?? "");
  if (!normalized.ok) {
    return NextResponse.json(
      { ok: false, error: normalized.error },
      { status: 400 },
    );
  }

  try {
    const record = await runHomepageAudit(normalized.url);
    return NextResponse.json({
      ok: true,
      id: record.id,
      teaser: toTeaser(record),
    });
  } catch (err) {
    console.error("[audit]", err);
    const message =
      err instanceof Error
        ? err.message
        : "Audit failed. Please try again shortly.";
    return NextResponse.json({ ok: false, error: message }, { status: 502 });
  }
}
