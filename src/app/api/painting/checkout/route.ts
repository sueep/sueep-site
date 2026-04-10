import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { computePaintingQuote, parsePaintingQuotePayload } from "@/lib/paintingQuote";
import { getRequestOrigin } from "@/lib/requestOrigin";

/**
 * Creates a Stripe Checkout session for the deposit. Recomputes amount server-side.
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

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Painting project deposit — hold your spot",
              description: `Estimated range was provided online; final price confirmed by Sueep before work.`,
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
      },
    });

    if (!session.url) {
      return NextResponse.json({ error: "Checkout session missing URL" }, { status: 500 });
    }

    return NextResponse.json({ url: session.url });
  } catch (e) {
    console.error("/api/painting/checkout error", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
