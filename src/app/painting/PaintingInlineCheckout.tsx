"use client";

import Link from "next/link";
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";
import PaintingDepositTerms from "@/app/painting/PaintingDepositTerms";

export type InlineCheckoutPhase = "loading" | "ready" | "test" | "no_pk" | "error";

type Props = {
  /** After user clicks pay at least once */
  active: boolean;
  phase: InlineCheckoutPhase;
  clientSecret: string | null;
  stripePromise: ReturnType<typeof import("@stripe/stripe-js").loadStripe> | null;
  errorMessage?: string;
};

export default function PaintingInlineCheckout({ active, phase, clientSecret, stripePromise, errorMessage }: Props) {
  if (!active) return null;

  return (
    <div id="painting-embedded-checkout" className="mt-8 rounded-xl border border-gray-200 bg-white p-5 sm:p-6 shadow-sm scroll-mt-6">
      <h3 className="font-semibold text-lg text-gray-900">Secure payment</h3>
      <p className="mt-2 text-sm text-gray-600 leading-relaxed">
        Review the deposit terms, then enter your card in Stripe&apos;s form below. You&apos;ll accept the customer agreement before paying.
      </p>

      <div className="mt-6 pt-6 border-t border-gray-100">
        <PaintingDepositTerms />
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <p className="text-sm font-medium text-gray-900">Card payment</p>
        <p className="mt-1 text-xs text-gray-500">Secured by Stripe. Cards only.</p>

        {phase === "loading" && (
          <div className="mt-6 flex items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50 py-16 text-sm text-gray-500">
            Preparing secure checkout…
          </div>
        )}

        {phase === "error" && (
          <p className="mt-4 text-sm text-red-600" role="alert">
            {errorMessage || "Checkout could not start. Try again or contact Sueep."}
          </p>
        )}

        {phase === "no_pk" && (
          <p className="mt-4 text-sm text-gray-600 leading-relaxed">
            <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code> is not set, so the card form cannot load.
          </p>
        )}

        {phase === "test" && (
          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
            <p className="font-medium">Test mode</p>
            <p className="mt-1">
              Stripe is not configured. Add <code className="text-xs bg-amber-100 px-1 rounded">STRIPE_SECRET_KEY</code> for real charges.
            </p>
            <a
              href="/thank-you?status=ok&service=painting&deposit=simulated"
              className="mt-3 inline-block px-4 py-2 bg-amber-800 text-white text-sm font-medium rounded-md hover:opacity-90"
            >
              Simulate successful deposit (testing only)
            </a>
          </div>
        )}

        {phase === "ready" && stripePromise && clientSecret && (
          <div className="mt-6 min-h-[420px]">
            <EmbeddedCheckoutProvider key={clientSecret} stripe={stripePromise} options={{ clientSecret }}>
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          </div>
        )}

        {phase === "ready" && (!stripePromise || !clientSecret) && (
          <div className="mt-6 flex items-center justify-center rounded-lg border border-dashed border-amber-200 bg-amber-50/50 py-12 text-sm text-gray-600">
            Payment form is unavailable. Check configuration and refresh.
          </div>
        )}
      </div>

      <p className="mt-6 text-sm">
        <Link href="/painting/contract" className="text-[#E73C6E] font-medium hover:underline">
          Full customer agreement
        </Link>
      </p>
    </div>
  );
}
