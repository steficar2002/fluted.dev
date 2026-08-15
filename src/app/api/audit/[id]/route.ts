import { NextResponse } from "next/server";
import { toTeaser } from "@/lib/audit/schema";
import { getAudit } from "@/lib/audit/store";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  if (!id || id.length > 64) {
    return NextResponse.json(
      { ok: false, error: "Audit not found." },
      { status: 404 },
    );
  }

  const record = await getAudit(id);
  if (!record) {
    return NextResponse.json(
      { ok: false, error: "Audit not found or expired." },
      { status: 404 },
    );
  }

  return NextResponse.json({ ok: true, teaser: toTeaser(record) });
}
