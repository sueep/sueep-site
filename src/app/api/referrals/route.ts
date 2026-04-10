import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const TO_EMAIL = process.env.CONTACT_TO_EMAIL || "contact@sueep.com";
const FROM_EMAIL = process.env.RESEND_FROM || "Sueep Website <noreply@mail.sueep.com>";
const FORMSUBMIT_ENDPOINT =
  process.env.REFERRAL_FORMSUBMIT_ENDPOINT ||
  process.env.FORMSUBMIT_ENDPOINT ||
  "https://formsubmit.co/fc9c50165f29e01095f6f39726348f26";

/**
 * POST /api/referrals
 * Accepts form submissions from the agent referral landing page.
 * Wire email / CRM / webhooks here as needed.
 */
export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    const isFormPost =
      contentType.includes("application/x-www-form-urlencoded") ||
      contentType.includes("multipart/form-data");

    let agentName = "";
    let agentContact = "";
    let clientName = "";
    let propertyAddress = "";
    let serviceType = "";
    let notes = "";
    let honey = "";

    if (contentType.includes("application/json")) {
      const body = await req.json();
      agentName = String(body?.agentName || "");
      agentContact = String(body?.agentContact || "");
      clientName = String(body?.clientName || "");
      propertyAddress = String(body?.propertyAddress || "");
      serviceType = String(body?.serviceType || "");
      notes = String(body?.notes || "");
      honey = String(body?._honey || "");
    } else if (isFormPost) {
      const form = await req.formData();
      agentName = String(form.get("agentName") || "");
      agentContact = String(form.get("agentContact") || "");
      clientName = String(form.get("clientName") || "");
      propertyAddress = String(form.get("propertyAddress") || "");
      serviceType = String(form.get("serviceType") || "");
      notes = String(form.get("notes") || "");
      honey = String(form.get("_honey") || "");
    } else {
      return NextResponse.json({ error: "Unsupported content type" }, { status: 415 });
    }

    if (honey) {
      if (isFormPost) {
        return NextResponse.redirect(new URL("/referral?submitted=1", req.url), { status: 303 });
      }
      return NextResponse.json({ ok: true, skipped: true });
    }

    if (!agentName || !agentContact || !clientName || !propertyAddress || !serviceType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const subject = `Agent referral: ${clientName} — ${serviceType}`;
    const html = `
      <div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#111">
        <h2 style="margin:0 0 12px 0">Real estate agent referral</h2>
        <p><strong>Agent name:</strong> ${escapeHtml(agentName)}</p>
        <p><strong>Agent contact:</strong> ${escapeHtml(agentContact)}</p>
        <p><strong>Client name:</strong> ${escapeHtml(clientName)}</p>
        <p><strong>Property address:</strong> ${escapeHtml(propertyAddress)}</p>
        <p><strong>Service type:</strong> ${escapeHtml(serviceType)}</p>
        <p><strong>Notes:</strong></p>
        <pre style="white-space:pre-wrap;margin:0">${escapeHtml(notes || "—")}</pre>
      </div>
    `;

    if (!process.env.RESEND_API_KEY) {
      // Fallback so referrals still email contact@sueep.com when Resend isn't configured.
      try {
        const formPayload = new URLSearchParams();
        formPayload.set("name", agentName);
        formPayload.set("_replyto", agentContact);
        formPayload.set("_subject", subject);
        formPayload.set("_template", "table");
        formPayload.set("_captcha", "false");
        formPayload.set("_cc", TO_EMAIL);
        formPayload.set(
          "message",
          [
            `Agent name: ${agentName}`,
            `Agent contact: ${agentContact}`,
            `Client name: ${clientName}`,
            `Property address: ${propertyAddress}`,
            `Service type: ${serviceType}`,
            "",
            "Notes:",
            notes || "—",
          ].join("\n")
        );

        await fetch(FORMSUBMIT_ENDPOINT, {
          method: "POST",
          headers: { "content-type": "application/x-www-form-urlencoded" },
          body: formPayload.toString(),
        });
      } catch (e) {
        console.error("[api/referrals] FormSubmit fallback failed", e);
        if (isFormPost) {
          return NextResponse.redirect(new URL("/referral?submitted=0", req.url), { status: 303 });
        }
        return NextResponse.json({ error: "Fallback send failed" }, { status: 500 });
      }
    } else {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: FROM_EMAIL,
        to: TO_EMAIL,
        subject,
        html,
        reply_to: agentContact.includes("@") ? agentContact : undefined,
      });
    }

    if (isFormPost) {
      return NextResponse.redirect(new URL("/referral?submitted=1", req.url), { status: 303 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("/api/referrals error", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

function escapeHtml(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
