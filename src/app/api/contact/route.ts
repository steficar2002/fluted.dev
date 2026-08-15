import { NextResponse } from "next/server";

type ContactBody = {
  name?: string;
  email?: string;
  notes?: string;
};

export async function POST(request: Request) {
  let body: ContactBody;
  try {
    body = (await request.json()) as ContactBody;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const name = body.name?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const notes = body.notes?.trim() ?? "";

  if (!name || !email || !notes) {
    return NextResponse.json(
      { ok: false, error: "Name, email, and notes are required." },
      { status: 400 },
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { ok: false, error: "Enter a valid email." },
      { status: 400 },
    );
  }

  console.info("[contact]", { name, email, notes });

  return NextResponse.json({ ok: true });
}
