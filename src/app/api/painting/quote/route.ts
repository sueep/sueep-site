import { NextRequest, NextResponse } from "next/server";
import { computePaintingQuote, formatUsd, parsePaintingQuotePayload } from "@/lib/paintingQuote";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const input = parsePaintingQuotePayload(body);
    if (!input) {
      return NextResponse.json({ error: "Invalid quote request" }, { status: 400 });
    }

    const q = computePaintingQuote(input);
    return NextResponse.json({
      lowDollars: q.lowCents / 100,
      highDollars: q.highCents / 100,
      lowDisplay: formatUsd(q.lowCents),
      highDisplay: formatUsd(q.highCents),
      depositCents: q.depositCents,
      depositDisplay: formatUsd(q.depositCents),
      breakdown: q.breakdown,
      disclaimer: q.disclaimer,
    });
  } catch (e) {
    console.error("/api/painting/quote error", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
