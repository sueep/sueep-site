import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
const TO_EMAIL = process.env.CONTACT_TO_EMAIL || "contact@sueep.com";
const FROM_EMAIL = process.env.RESEND_FROM || "Sueep Website <noreply@mail.sueep.com>";

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    const isFormPost =
      contentType.includes("application/x-www-form-urlencoded") ||
      contentType.includes("multipart/form-data");
    let name = "";
    let email = "";
    let company = "";
    let message = "";

    if (contentType.includes("application/json")) {
      const body = await req.json();
      name = String(body?.name || "");
      email = String(body?.email || "");
      company = String(body?.company || "");
      message = String(body?.message || "");
    } else if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
      const form = await req.formData();
      name = String(form.get("name") || "");
      email = String(form.get("email") || "");
      company = String(form.get("company") || "");
      message = String(form.get("message") || "");
    }

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const subject = `New website inquiry from ${name}`;
    const html = `
      <div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#111">
        <h2 style="margin:0 0 12px 0">Website Contact Form</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        ${company ? `<p><strong>Company / Property:</strong> ${escapeHtml(company)}</p>` : ""}
        <p><strong>Message:</strong></p>
        <pre style="white-space:pre-wrap;margin:0">${escapeHtml(message)}</pre>
      </div>
    `;

    if (!process.env.RESEND_API_KEY) {
      console.warn("RESEND_API_KEY not set - skipping actual email send. Returning success for dev.");
      if (isFormPost) {
        return NextResponse.redirect(new URL("/thank-you?status=skipped", req.url), { status: 303 });
      }
      return NextResponse.json({ ok: true, skipped: true });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const payload = {
      from: FROM_EMAIL,
      to: TO_EMAIL,
      subject,
      html,
      reply_to: email,
    } as const;
    console.log("/api/contact sending via Resend:", {
      from: payload.from,
      to: payload.to,
      hasKey: Boolean(process.env.RESEND_API_KEY),
    });
    await resend.emails.send(payload);

    if (isFormPost) {
      return NextResponse.redirect(new URL("/thank-you?status=ok", req.url), { status: 303 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("/api/contact error", err);
    try {
      const contentType = req.headers.get("content-type") || "";
      const isFormPost =
        contentType.includes("application/x-www-form-urlencoded") ||
        contentType.includes("multipart/form-data");
      if (isFormPost) {
        return NextResponse.redirect(new URL("/thank-you?status=error", req.url), { status: 303 });
      }
    } catch {}
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  const hasKey = Boolean(process.env.RESEND_API_KEY);
  const from = process.env.RESEND_FROM || null;
  const to = process.env.CONTACT_TO_EMAIL || "contact@sueep.com";
  return NextResponse.json({ hasKey, from, to });
}

function escapeHtml(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


