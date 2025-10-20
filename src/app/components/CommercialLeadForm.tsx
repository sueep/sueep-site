"use client";

import { useEffect, useMemo, useState } from "react";

type SubmitState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success" }
  | { status: "error"; message: string };

export default function CommercialLeadForm() {
  const [mounted, setMounted] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>({ status: "idle" });
  const [redirectUrl, setRedirectUrl] = useState(() =>
    typeof window !== "undefined"
      ? `${window.location.origin}/thank-you?status=ok`
      : "/thank-you?status=ok"
  );
  const [errors, setErrors] = useState<{ email?: string; phone?: string }>();

  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setRedirectUrl(`${window.location.origin}/thank-you?status=ok`);
    }
  }, []);

  const buildingTypes = useMemo(() => ["Office", "School", "Medical", "Industrial", "Other"], []);
  const sqftRanges = useMemo(
    () => ["<5,000", "5,000–20,000", "20,000–100,000", "100,000+"],
    []
  );

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    const form = e.currentTarget;
    const emailInput = form.querySelector('input[name="email"]') as HTMLInputElement | null;
    const phoneInput = form.querySelector('input[name="phone"]') as HTMLInputElement | null;
    const nextErrors: { email?: string; phone?: string } = {};
    const email = (emailInput?.value || "").trim();
    const phone = (phoneInput?.value || "").trim();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const phoneOk = /^\+?[0-9\s\-()]{7,}$/.test(phone);
    if (!emailOk) nextErrors.email = "Please enter a valid email.";
    if (!phoneOk) nextErrors.phone = "Please enter a valid phone number.";
    if (nextErrors.email || nextErrors.phone) {
      e.preventDefault();
      setErrors(nextErrors);
    } else {
      setErrors({});
    }
  }

  if (!mounted) return null;

  return (
    <div id="estimate-form" className="max-w-xl">
      <h2 className="text-2xl md:text-3xl font-bold uppercase">Request a Commercial Cleaning Estimate</h2>
      <p className="mt-2 text-gray-600">Tell us about your building and we’ll prepare a tailored janitorial proposal.</p>
      <form
        onSubmit={onSubmit}
        className="mt-6 grid grid-cols-1 gap-4"
        method="post"
        action="/api/contact"
        autoComplete="off"
      >
        <input type="hidden" name="_next" value={redirectUrl} />
        {/* Honeypot */}
        <input type="text" name="_honey" style={{ display: "none" }} tabIndex={-1} autoComplete="off" />
        <input type="hidden" name="_subject" value="New website inquiry from sueep.com" />
        <input
          name="name"
          type="text"
          placeholder="Full Name"
          className="w-full rounded-md px-4 py-3 text-base bg-white text-gray-900 placeholder-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E73C6E]/50 focus:border-[#E73C6E]"
          required
        />
        <input
          name="company"
          type="text"
          placeholder="Company / Property"
          className="w-full rounded-md px-4 py-3 text-base bg-white text-gray-900 placeholder-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E73C6E]/50 focus:border-[#E73C6E]"
        />
        <div>
          <input
            name="email"
            type="email"
            placeholder="you@company.com *"
            className="w-full rounded-md px-4 py-3 text-base bg-white text-gray-900 placeholder-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E73C6E]/50 focus:border-[#E73C6E]"
            aria-invalid={Boolean(errors?.email)}
            aria-describedby={errors?.email ? "email-error" : undefined}
            required
            onInput={() => setErrors((prev) => ({ ...(prev || {}), email: undefined }))}
          />
          {errors?.email && (
            <p id="email-error" className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>
        <div>
          <input
            name="phone"
            type="tel"
            inputMode="tel"
            pattern="^\\+?[0-9\\s\\-()]{7,}$"
            placeholder="(555) 555-5555 *"
            className="w-full rounded-md px-4 py-3 text-base bg-white text-gray-900 placeholder-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E73C6E]/50 focus:border-[#E73C6E]"
            aria-invalid={Boolean(errors?.phone)}
            aria-describedby={errors?.phone ? "phone-error" : undefined}
            required
            onInput={() => setErrors((prev) => ({ ...(prev || {}), phone: undefined }))}
          />
          {errors?.phone && (
            <p id="phone-error" className="mt-1 text-sm text-red-600">{errors.phone}</p>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            name="buildingType"
            className="w-full rounded-md px-4 py-3 text-base bg-white text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E73C6E]/50 focus:border-[#E73C6E]"
            defaultValue=""
          >
            <option value="" disabled>Building Type</option>
            {buildingTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <select
            name="sqftRange"
            className="w-full rounded-md px-4 py-3 text-base bg-white text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E73C6E]/50 focus:border-[#E73C6E]"
            defaultValue=""
          >
            <option value="" disabled>Approx. Sq Ft</option>
            {sqftRanges.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
        {/* Removed service frequency and custom Sq Ft fields per request */}
        <textarea
          name="message"
          placeholder="Scope, frequency, timelines, requirements"
          rows={5}
          className="w-full rounded-md px-4 py-3 text-base bg-white text-gray-900 placeholder-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E73C6E]/50 focus:border-[#E73C6E]"
          required
        />
        <button
          type="submit"
          className="px-6 py-3 bg-[#E73C6E] text-white font-medium rounded-md hover:opacity-90"
        >
          Submit Request
        </button>
        <p className="text-xs text-gray-500">*Sueep specializes in ongoing contracts for commercial facilities only.*</p>
      </form>
    </div>
  );
}


