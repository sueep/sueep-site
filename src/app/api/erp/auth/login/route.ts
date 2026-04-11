import { NextResponse } from "next/server";
import { createErpSessionToken, erpSessionCookieName, erpSessionCookieOptions } from "@/lib/erpSession";

export async function POST(req: Request) {
  const password = process.env.ERP_ACCESS_PASSWORD;
  if (!password) {
    return NextResponse.json({ error: "ERP not configured (ERP_ACCESS_PASSWORD)" }, { status: 503 });
  }

  let body: { password?: string };
  try {
    body = (await req.json()) as { password?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (typeof body.password !== "string" || body.password !== password) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  let token: string;
  try {
    token = await createErpSessionToken();
  } catch {
    return NextResponse.json({ error: "ERP_SESSION_SECRET missing or too short" }, { status: 503 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(erpSessionCookieName, token, erpSessionCookieOptions(60 * 60 * 24 * 7));
  return res;
}
