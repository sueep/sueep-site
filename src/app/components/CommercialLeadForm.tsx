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
  const [errors, setErrors] = useState<{ email?: string; phone?: string }>();

  useEffect(() => {
    setMounted(true);
  }, []);

  const buildingTypes = useMemo(() => ["Office", "School", "Medical", "Industrial", "Other"], []);
  const sqftRanges = useMemo(
    () => ["<5,000", "5,000–20,000", "20,000–100,000", "100,000+"],
    []
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitState.status === "submitting") return;

    const form = e.currentTarget;
    const formData = new FormData(form);

    const name = String(formData.get("name") || "").trim();
    const company = String(formData.get("company") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const buildingType = String(formData.get("buildingType") || "");
    const sqftRange = String(formData.get("sqftRange") || "");
    const message = String(formData.get("message") || "").trim();

    const nextErrors: { email?: string; phone?: string } = {};
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const phoneOk = /^\+?[0-9\s\-()]{7,}$/.test(phone);
    if (!emailOk) nextErrors.email = "Please enter a valid email.";
    if (!phoneOk) nextErrors.phone = "Please enter a valid phone number.";
    setErrors(nextErrors);
    if (nextErrors.email || nextErrors.phone) return;

    const composedMessage = [
      company ? `Company: ${company}` : null,
      buildingType ? `Building Type: ${buildingType}` : null,
      sqftRange ? `Approx. Sq Ft: ${sqftRange}` : null,
      message ? `Message: ${message}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    try {
      setSubmitState({ status: "submitting" });
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, email, company, phone, message: composedMessage }),
      });
      if (!res.ok) throw new Error("Failed to submit");
      setSubmitState({ status: "success" });
      form.reset();
    } catch (err) {
      setSubmitState({ status: "error", message: "Something went wrong. Please try again." });
    }
  }

  if (!mounted) return null;

  return (
    <div id="estimate-form" className="max-w-xl">
      <h2 className="text-2xl md:text-3xl font-bold uppercase">Request a Commercial Cleaning Estimate</h2>
      <p className="mt-2 text-gray-600">Tell us about your building and we’ll prepare a tailored janitorial proposal.</p>
      <form onSubmit={onSubmit} className="mt-6 grid grid-cols-1 gap-4">
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
          disabled={submitState.status === "submitting"}
          className="px-6 py-3 bg-[#E73C6E] text-white font-medium rounded-md hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitState.status === "submitting" ? "Submitting..." : "Submit Request"}
        </button>
        <p className="text-xs text-gray-500">*Sueep specializes in ongoing contracts for commercial facilities only.*</p>
        {submitState.status === "success" && (
          <p className="text-green-600 text-sm">Thanks! We9ll reach out shortly.</p>
        )}
        {submitState.status === "error" && (
          <p className="text-red-600 text-sm">{submitState.message}</p>
        )}
      </form>
    </div>
  );
}


