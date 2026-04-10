"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { SqFtBand, PaintScope, CeilingScope, WallCondition, Occupancy, Timeline } from "@/lib/paintingQuote";
import { parseStoredPaintingLead, PAINTING_LEAD_STORAGE_KEY, type StoredPaintingLead } from "@/lib/paintingLeadStorage";

type MainStep = "details" | "quote";
type DetailPage = 1 | 2 | 3;

type QuoteResponse = {
  lowDisplay: string;
  highDisplay: string;
  depositDisplay: string;
  depositCents: number;
  breakdown: string[];
  disclaimer: string;
};

const inputClass =
  "w-full rounded-md px-4 py-3 text-base bg-white text-gray-900 placeholder-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E73C6E]/50 focus:border-[#E73C6E]";
const selectClass = inputClass;
const labelClass = "block text-sm font-medium text-gray-700 mb-1";

const btnPrimary =
  "px-6 py-3 bg-[#E73C6E] text-white font-medium rounded-md hover:opacity-90 disabled:opacity-60 w-full sm:w-auto";
const btnSecondary =
  "px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 w-full sm:w-auto";

type Props = {
  /** Embedded on thank-you page vs standalone /painting/next-steps */
  variant?: "thankYou" | "standalone";
};

export default function PaintingFollowUpFlow({ variant = "standalone" }: Props) {
  const [lead, setLead] = useState<StoredPaintingLead | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const [step, setStep] = useState<MainStep>("details");
  const [detailPage, setDetailPage] = useState<DetailPage>(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [payLoading, setPayLoading] = useState(false);
  const [testModeDeposit, setTestModeDeposit] = useState(false);

  const [roomCount, setRoomCount] = useState(2);
  const [sqFtBand, setSqFtBand] = useState<SqFtBand>("1200_2000");
  const [scope, setScope] = useState<PaintScope>("refresh_same");
  const [ceilings, setCeilings] = useState<CeilingScope>("no");
  const [wallCondition, setWallCondition] = useState<WallCondition>("good");
  const [occupancy, setOccupancy] = useState<Occupancy>("occupied");
  const [timeline, setTimeline] = useState<Timeline>("2_4_weeks");

  const [quote, setQuote] = useState<QuoteResponse | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(PAINTING_LEAD_STORAGE_KEY);
      setLead(parseStoredPaintingLead(raw));
    } catch {
      setLead(null);
    }
    setHydrated(true);
  }, []);

  const scrollToFollowUp = useCallback(() => {
    document.getElementById("painting-follow-up")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const scrollTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const submitDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lead) return;
    setError("");
    setLoading(true);
    setTestModeDeposit(false);
    try {
      const res = await fetch("/api/painting/quote", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          serviceType: lead.serviceType,
          roomCount,
          sqFtBand,
          scope,
          ceilings,
          wallCondition,
          occupancy,
          timeline,
          leadContact: {
            name: lead.name,
            email: lead.email,
            phone: lead.phone,
            zip: lead.zip,
            message: lead.message,
          },
        }),
      });
      const data = (await res.json()) as QuoteResponse & { error?: string };
      if (!res.ok) {
        setError(data.error || "Could not build a quote.");
        setLoading(false);
        return;
      }
      setQuote({
        lowDisplay: data.lowDisplay,
        highDisplay: data.highDisplay,
        depositDisplay: data.depositDisplay,
        depositCents: data.depositCents,
        breakdown: data.breakdown,
        disclaimer: data.disclaimer,
      });
      setStep("quote");
      scrollTop();
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const payDeposit = async () => {
    if (!lead) return;
    setError("");
    setPayLoading(true);
    try {
      const res = await fetch("/api/painting/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: lead.name,
          email: lead.email,
          phone: lead.phone,
          zip: lead.zip,
          serviceType: lead.serviceType,
          roomCount,
          sqFtBand,
          scope,
          ceilings,
          wallCondition,
          occupancy,
          timeline,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Checkout could not start.");
        setPayLoading(false);
        return;
      }
      if (typeof data.url === "string" && data.url) {
        window.location.href = data.url;
        return;
      }
      if (data.testMode) {
        setTestModeDeposit(true);
        scrollTop();
      }
    } catch {
      setError("Network error starting checkout.");
    } finally {
      setPayLoading(false);
    }
  };

  const goNextFrom1 = () => {
    setError("");
    if (!Number.isFinite(roomCount) || roomCount < 1 || roomCount > 20) {
      setError("Please enter how many rooms or areas (1–20).");
      return;
    }
    setDetailPage(2);
    scrollToFollowUp();
  };

  const goNextFrom2 = () => {
    setError("");
    setDetailPage(3);
    scrollToFollowUp();
  };

  if (!hydrated) {
    return (
      <div className="min-h-[120px] flex items-center justify-center text-gray-500 text-sm" aria-hidden>
        Loading…
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-amber-950">
        <p className="font-semibold">We couldn&apos;t load your request</p>
        <p className="mt-2 text-sm leading-relaxed">
          Submit the form on the painting page first in this browser, then return to this thank-you page — or open{" "}
          <Link href="/painting/next-steps" className="underline font-medium">
            next steps
          </Link>{" "}
          after submitting.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/painting#estimate-form" className="inline-flex px-5 py-2.5 bg-[#E73C6E] text-white text-sm font-medium rounded-md hover:opacity-90">
            Painting estimate form
          </Link>
        </div>
      </div>
    );
  }

  const firstName = lead.name.split(/\s+/)[0] || lead.name;

  const detailLabels = ["Your space", "Paint scope", "Schedule"] as const;

  return (
    <div id="painting-follow-up">
      {variant === "standalone" && (
        <p className="text-sm text-gray-600">
          Hi {firstName} — thanks again for reaching out. We&apos;re on it and will follow up soon. A few short pages of questions help us show a planning range and optional deposit.
        </p>
      )}
      {variant === "thankYou" && step === "details" && (
        <div>
          <p className="text-base font-semibold text-gray-900">Help us narrow your estimate</p>
          <p className="mt-1 text-sm text-gray-600">Three quick steps — about a minute total.</p>
        </div>
      )}

      {step === "details" && (
        <ol className="mt-5 flex flex-wrap gap-2 text-xs font-medium text-gray-600" aria-label="Progress">
          {detailLabels.map((label, i) => {
            const n = (i + 1) as DetailPage;
            const active = detailPage === n;
            const done = detailPage > n;
            return (
              <li
                key={label}
                className={`rounded-full px-3 py-1 border ${
                  active ? "border-[#E73C6E] bg-pink-50 text-[#E73C6E]" : done ? "border-gray-300 bg-gray-50 text-gray-500" : "border-gray-200 bg-white text-gray-500"
                }`}
              >
                {i + 1}. {label}
              </li>
            );
          })}
        </ol>
      )}

      {step === "quote" && (
        <p className="mt-5 text-xs font-medium uppercase tracking-wide text-[#E73C6E]">Your quote</p>
      )}

      {error ? (
        <p className="mt-4 text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}

      {step === "details" && detailPage === 1 && (
        <div className="mt-6 grid grid-cols-1 gap-5 bg-white border border-gray-200 rounded-xl p-5 sm:p-6 shadow-sm">
          <p className="text-sm text-gray-600">
            Service from your request: <strong>{lead.serviceType}</strong>
          </p>
          <div>
            <label className={labelClass} htmlFor="roomCount">
              How many rooms or main areas are we painting? <span className="text-red-500">*</span>
            </label>
            <input
              id="roomCount"
              type="number"
              min={1}
              max={20}
              required
              className={inputClass}
              value={roomCount}
              onChange={(e) => setRoomCount(Number(e.target.value))}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="sqFtBand">
              Approximate home size <span className="text-red-500">*</span>
            </label>
            <select
              id="sqFtBand"
              className={selectClass}
              value={sqFtBand}
              onChange={(e) => setSqFtBand(e.target.value as SqFtBand)}
            >
              <option value="under_1200">Under 1,200 sq ft</option>
              <option value="1200_2000">1,200 – 2,000 sq ft</option>
              <option value="2000_3500">2,000 – 3,500 sq ft</option>
              <option value="over_3500">Over 3,500 sq ft</option>
            </select>
          </div>
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2">
            <button type="button" className={btnPrimary} onClick={goNextFrom1}>
              Next
            </button>
          </div>
        </div>
      )}

      {step === "details" && detailPage === 2 && (
        <div className="mt-6 grid grid-cols-1 gap-5 bg-white border border-gray-200 rounded-xl p-5 sm:p-6 shadow-sm">
          <fieldset>
            <legend className={labelClass}>Paint scope</legend>
            <div className="mt-2 space-y-2 text-sm">
              <label className="flex items-start gap-2 cursor-pointer">
                <input type="radio" name="scope" checked={scope === "refresh_same"} onChange={() => setScope("refresh_same")} className="mt-1" />
                <span>Refresh / same color (fewer coats where possible)</span>
              </label>
              <label className="flex items-start gap-2 cursor-pointer">
                <input type="radio" name="scope" checked={scope === "color_change"} onChange={() => setScope("color_change")} className="mt-1" />
                <span>Color change (more cut-in and coats likely)</span>
              </label>
            </div>
          </fieldset>
          <div>
            <label className={labelClass} htmlFor="ceilings">
              Ceilings
            </label>
            <select id="ceilings" className={selectClass} value={ceilings} onChange={(e) => setCeilings(e.target.value as CeilingScope)}>
              <option value="no">Not included</option>
              <option value="some">Some ceilings</option>
              <option value="all">All relevant ceilings</option>
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="wallCondition">
              Wall condition
            </label>
            <select
              id="wallCondition"
              className={selectClass}
              value={wallCondition}
              onChange={(e) => setWallCondition(e.target.value as WallCondition)}
            >
              <option value="good">Good — light cosmetic only</option>
              <option value="minor">Minor repairs (nail holes, small patches)</option>
              <option value="significant">Significant prep (many repairs / texture work)</option>
            </select>
          </div>
          <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-3 pt-2">
            <button type="button" className={btnSecondary} onClick={() => setDetailPage(1)}>
              Back
            </button>
            <button type="button" className={btnPrimary} onClick={goNextFrom2}>
              Next
            </button>
          </div>
        </div>
      )}

      {step === "details" && detailPage === 3 && (
        <form className="mt-6 grid grid-cols-1 gap-5 bg-white border border-gray-200 rounded-xl p-5 sm:p-6 shadow-sm" onSubmit={submitDetails}>
          <fieldset>
            <legend className={labelClass}>Occupancy</legend>
            <div className="mt-2 space-y-2 text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="occ" checked={occupancy === "empty"} onChange={() => setOccupancy("empty")} />
                Empty / easy access
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="occ" checked={occupancy === "occupied"} onChange={() => setOccupancy("occupied")} />
                Occupied — furniture in place
              </label>
            </div>
          </fieldset>
          <div>
            <label className={labelClass} htmlFor="timeline">
              When do you want to start?
            </label>
            <select id="timeline" className={selectClass} value={timeline} onChange={(e) => setTimeline(e.target.value as Timeline)}>
              <option value="asap">As soon as possible</option>
              <option value="2_4_weeks">Within 2–4 weeks</option>
              <option value="flexible">Flexible</option>
            </select>
          </div>
          <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-3 pt-2">
            <button type="button" className={btnSecondary} onClick={() => setDetailPage(2)}>
              Back
            </button>
            <button type="submit" disabled={loading} className={btnPrimary}>
              {loading ? "Calculating…" : "See instant planning range"}
            </button>
          </div>
        </form>
      )}

      {step === "quote" && quote && (
        <div className="mt-6 space-y-6">
          <div className="rounded-xl border border-gray-200 bg-gradient-to-b from-pink-50/80 to-white p-6 sm:p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-[#E73C6E]">Your planning range</p>
            <p className="mt-3 text-3xl sm:text-4xl font-extrabold text-gray-900">
              {quote.lowDisplay} – {quote.highDisplay}
            </p>
            <p className="mt-4 text-sm text-gray-600 leading-relaxed">{quote.disclaimer}</p>
            <ul className="mt-4 space-y-2 text-sm text-gray-700 list-disc pl-5">
              {quote.breakdown.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
            <h3 className="font-semibold text-lg text-gray-900">Hold your spot</h3>
            <p className="mt-2 text-sm text-gray-600">
              Place a refundable deposit (subject to written terms from Sueep) so we can prioritize your dates. Amount below is{" "}
              <strong>{quote.depositDisplay}</strong> — charged only after you complete secure checkout.
            </p>
            <button type="button" onClick={payDeposit} disabled={payLoading} className={`mt-4 ${btnPrimary}`}>
              {payLoading ? "Starting checkout…" : `Pay ${quote.depositDisplay} deposit`}
            </button>

            {testModeDeposit && (
              <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
                <p className="font-medium">Test mode</p>
                <p className="mt-1">
                  Stripe is not configured. Add <code className="text-xs bg-amber-100 px-1 rounded">STRIPE_SECRET_KEY</code> to{" "}
                  <code className="text-xs bg-amber-100 px-1 rounded">.env.local</code> for real payments.
                </p>
                <a
                  href="/thank-you?status=ok&service=painting&deposit=simulated"
                  className="mt-3 inline-block px-4 py-2 bg-amber-800 text-white text-sm font-medium rounded-md hover:opacity-90"
                >
                  Simulate successful deposit (testing only)
                </a>
              </div>
            )}
          </div>

          <button
            type="button"
            className="text-sm text-[#E73C6E] font-medium underline"
            onClick={() => {
              setStep("details");
              setDetailPage(3);
              scrollToFollowUp();
            }}
          >
            Adjust answers
          </button>
        </div>
      )}

      {variant === "standalone" && (
        <p className="mt-8 text-xs text-gray-500">
          Prefer predictable monthly costs? Ask about financing through Acorn Finance when we follow up.
        </p>
      )}
    </div>
  );
}
