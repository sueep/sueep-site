"use client";

import { useCallback, useState } from "react";
import type { SqFtBand, PaintScope, CeilingScope, WallCondition, Occupancy, Timeline } from "@/lib/paintingQuote";

type WizardStep = "initial" | "details" | "quote";

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

export default function PaintingEstimateWizard() {
  const phoneHref = "tel:+12672173596";

  const [step, setStep] = useState<WizardStep>("initial");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [payLoading, setPayLoading] = useState(false);
  const [testModeDeposit, setTestModeDeposit] = useState(false);

  const [honey, setHoney] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [zip, setZip] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [message, setMessage] = useState("");

  const [roomCount, setRoomCount] = useState(2);
  const [sqFtBand, setSqFtBand] = useState<SqFtBand>("1200_2000");
  const [scope, setScope] = useState<PaintScope>("refresh_same");
  const [ceilings, setCeilings] = useState<CeilingScope>("no");
  const [wallCondition, setWallCondition] = useState<WallCondition>("good");
  const [occupancy, setOccupancy] = useState<Occupancy>("occupied");
  const [timeline, setTimeline] = useState<Timeline>("2_4_weeks");

  const [quote, setQuote] = useState<QuoteResponse | null>(null);

  const scrollToForm = useCallback(() => {
    document.getElementById("estimate-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const submitInitial = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/painting/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          zip,
          serviceType,
          message,
          _honey: honey,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Could not save your request. Try again or call us.");
        setLoading(false);
        return;
      }
      setStep("details");
      setTestModeDeposit(false);
      setQuote(null);
      scrollToForm();
    } catch {
      setError("Network error. Check your connection or call us.");
    } finally {
      setLoading(false);
    }
  };

  const submitDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTestModeDeposit(false);
    try {
      const res = await fetch("/api/painting/quote", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          serviceType,
          roomCount,
          sqFtBand,
          scope,
          ceilings,
          wallCondition,
          occupancy,
          timeline,
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
      scrollToForm();
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const payDeposit = async () => {
    setError("");
    setPayLoading(true);
    try {
      const res = await fetch("/api/painting/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          zip,
          serviceType,
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
        scrollToForm();
      }
    } catch {
      setError("Network error starting checkout.");
    } finally {
      setPayLoading(false);
    }
  };

  return (
    <div id="estimate-form">
      <h2 className="text-2xl md:text-3xl font-bold uppercase">Request a Painting Estimate</h2>
      <p className="mt-2 text-gray-600">
        Tell us about your project — we&apos;ll show a planning range and optional deposit to hold your spot. Final pricing is always confirmed by Sueep before work begins.
      </p>

      {/* Step indicator */}
      <ol className="mt-6 flex flex-wrap gap-2 text-xs sm:text-sm font-medium text-gray-600" aria-label="Steps">
        {[
          { id: "initial" as const, label: "1. Contact" },
          { id: "details" as const, label: "2. Scope" },
          { id: "quote" as const, label: "3. Quote & deposit" },
        ].map((s) => (
          <li
            key={s.id}
            className={`rounded-full px-3 py-1 border ${
              step === s.id ? "border-[#E73C6E] bg-pink-50 text-[#E73C6E]" : "border-gray-200 bg-white"
            }`}
          >
            {s.label}
          </li>
        ))}
      </ol>

      {error ? (
        <p className="mt-4 text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}

      {step === "initial" && (
        <form className="mt-6 grid grid-cols-1 gap-4" onSubmit={submitInitial} autoComplete="on">
          <input type="text" name="_hp" value={honey} onChange={(e) => setHoney(e.target.value)} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
          <input name="name" type="text" placeholder="Full Name" className={inputClass} required value={name} onChange={(e) => setName(e.target.value)} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="email"
              type="email"
              placeholder="you@example.com *"
              className={inputClass}
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              name="phone"
              type="tel"
              inputMode="tel"
              pattern="^\\+?[0-9\\s\\-()]{7,}$"
              placeholder="(555) 555-5555 *"
              className={inputClass}
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="zip"
              type="text"
              inputMode="numeric"
              pattern="[0-9]{5}"
              minLength={5}
              maxLength={5}
              title="Please enter a 5-digit ZIP code"
              placeholder="ZIP Code"
              className={inputClass}
              required
              value={zip}
              onChange={(e) => setZip(e.target.value)}
            />
            <select name="serviceType" className={selectClass} required value={serviceType} onChange={(e) => setServiceType(e.target.value)}>
              <option value="" disabled>
                Service Type
              </option>
              <option value="Interior Painting">Interior Painting</option>
              <option value="Exterior Painting">Exterior Painting</option>
              <option value="Trim & Doors">Trim & Doors</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <textarea
            name="message"
            placeholder="Rooms, colors, timing, any details we should know"
            rows={5}
            className={inputClass}
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-[#E73C6E] text-white font-medium rounded-md hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Sending…" : "Continue to scope questions"}
          </button>
          <p className="text-sm text-gray-600">
            Prefer to talk? Call{" "}
            <a href={phoneHref} className="font-semibold underline decoration-transparent hover:decoration-inherit">
              267-217-3596
            </a>
          </p>
        </form>
      )}

      {step === "details" && (
        <form className="mt-6 grid grid-cols-1 gap-5 bg-white border border-gray-200 rounded-lg p-5 sm:p-6" onSubmit={submitDetails}>
          <p className="text-sm text-gray-600">
            A few more questions help us narrow an on-the-spot planning range. You can go{" "}
            <button type="button" className="text-[#E73C6E] font-medium underline" onClick={() => setStep("initial")}>
              back
            </button>{" "}
            to edit your contact info.
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
            <select id="sqFtBand" className={selectClass} value={sqFtBand} onChange={(e) => setSqFtBand(e.target.value as SqFtBand)} required>
              <option value="under_1200">Under 1,200 sq ft</option>
              <option value="1200_2000">1,200 – 2,000 sq ft</option>
              <option value="2000_3500">2,000 – 3,500 sq ft</option>
              <option value="over_3500">Over 3,500 sq ft</option>
            </select>
          </div>
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
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-[#E73C6E] text-white font-medium rounded-md hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Calculating…" : "See instant planning range"}
          </button>
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
            <button
              type="button"
              onClick={payDeposit}
              disabled={payLoading}
              className="mt-4 w-full sm:w-auto px-6 py-3 bg-[#E73C6E] text-white font-semibold rounded-md hover:opacity-90 disabled:opacity-60"
            >
              {payLoading ? "Starting checkout…" : `Pay ${quote.depositDisplay} deposit`}
            </button>

            {testModeDeposit && (
              <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
                <p className="font-medium">Local test mode</p>
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

          <div className="flex flex-wrap gap-3">
            <button type="button" className="text-sm text-[#E73C6E] font-medium underline" onClick={() => setStep("details")}>
              Adjust scope answers
            </button>
            <button type="button" className="text-sm text-gray-600 underline" onClick={() => setStep("initial")}>
              Start over
            </button>
          </div>
        </div>
      )}

      <p className="mt-6 text-xs text-gray-500">
        Prefer predictable monthly costs? Ask about financing through Acorn Finance when we follow up.
      </p>
    </div>
  );
}
