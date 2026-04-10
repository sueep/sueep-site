import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { resolvePaintingContractAbsoluteUrl } from "@/lib/paintingContract";
import { computePaintingQuote, parsePaintingQuotePayload } from "@/lib/paintingQuote";
import { getRequestOrigin } from "@/lib/requestOrigin";

/**
 * Creates a Stripe Checkout session for the deposit. Recomputes amount server-side.
 * Terms acceptance is on Stripe Checkout: consent_collection.terms_of_service + custom_text.
 *
 * Stripe Dashboard → Settings → Public business details: set "Terms of service" URL to the same
 * page as NEXT_PUBLIC_RESIDENTIAL_PAINTING_CONTRACT_URL or https://YOUR_DOMAIN/painting/contract
 * (required when terms_of_service is "required", or session creation may fail).
 *
 * Without STRIPE_SECRET_KEY, returns testMode so the UI can simulate locally.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body?.email || "").trim();
    const name = String(body?.name || "").trim();
    const input = parsePaintingQuotePayload(body);

    if (!input || !email || !name) {
      return NextResponse.json({ error: "Invalid checkout request" }, { status: 400 });
    }

    const quote = computePaintingQuote(input);
    const secret = process.env.STRIPE_SECRET_KEY;

    if (!secret) {
      return NextResponse.json({
        testMode: true,
        depositCents: quote.depositCents,
        message:
          "Stripe is not configured. Set STRIPE_SECRET_KEY in .env.local to test real checkout. Use the button in the wizard to simulate success locally.",
      });
    }

    const stripe = new Stripe(secret);
    const origin = getRequestOrigin(req);
    const contractUrl = resolvePaintingContractAbsoluteUrl(origin);

    const termsMessage =
      `I agree to the [Sueep residential painting customer agreement](${contractUrl}), including the **50% deposit** (of the planning midpoint) to **schedule** the job and **order paint and materials**. Final project price will be **confirmed in writing** before work begins.`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: email,
      payment_method_types: ["card"],
      consent_collection: {
        terms_of_service: "required",
      },
      custom_text: {
        terms_of_service_acceptance: {
          message: termsMessage,
        },
      },
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Residential painting deposit (50% of planning midpoint)",
              description:
                "Secures scheduling and paint/material orders. You will accept the customer agreement on this page before paying. Final price confirmed in writing before work.",
            },
            unit_amount: quote.depositCents,
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/thank-you?status=ok&service=painting&deposit=paid`,
      cancel_url: `${origin}/painting#estimate-form`,
      metadata: {
        name,
        email,
        serviceType: input.serviceType,
        roomCount: String(input.roomCount),
        sqFtBand: input.sqFtBand,
        deposit_type: "50pct_planning_midpoint",
        terms_at: "stripe_checkout",
      },
      // Hide Stripe Link (green “pay with Link”) on this session when supported by your API version.
      wallet_options: {
        link: { display: "never" },
      },
    } as Stripe.Checkout.SessionCreateParams);

    if (!session.url) {
      return NextResponse.json({ error: "Checkout session missing URL" }, { status: 500 });
    }

    return NextResponse.json({ url: session.url });
  } catch (e) {
    console.error("/api/painting/checkout error", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
