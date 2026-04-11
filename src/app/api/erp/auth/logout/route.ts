import { NextResponse } from "next/server";
import { erpSessionCookieName } from "@/lib/erpSession";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(erpSessionCookieName, "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}
