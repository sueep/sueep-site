"use client";

import Link from "next/link";
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";
import PaintingDepositTermsCompact from "@/app/painting/PaintingDepositTermsCompact";

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
    <div
      id="painting-embedded-checkout"
      className="rounded-lg border border-gray-200 bg-white p-3 sm:p-4 shadow-sm scroll-mt-4"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2 gap-y-1">
        <h3 className="text-sm font-semibold text-gray-900">Payment</h3>
        <span className="text-[10px] font-medium uppercase tracking-wide text-gray-400">Stripe · Cards only</span>
      </div>

      <div className="mt-2">
        <PaintingDepositTermsCompact />
      </div>

      <div className="mt-3">
        {phase === "loading" && (
          <div className="flex min-h-[200px] items-center justify-center rounded-md border border-dashed border-gray-200 bg-gray-50/80 py-8 text-xs text-gray-500">
            Preparing secure checkout…
          </div>
        )}

        {phase === "error" && (
          <p className="text-xs text-red-600" role="alert">
            {errorMessage || "Checkout could not start. Try again or contact Sueep."}
          </p>
        )}

        {phase === "no_pk" && (
          <p className="text-xs text-gray-600 leading-snug">
            <code className="rounded bg-gray-100 px-1 py-0.5 text-[10px]">NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code>{" "}
            missing — card form can&apos;t load.
          </p>
        )}

        {phase === "test" && (
          <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-950">
            <p className="font-medium">Test mode</p>
            <p className="mt-1">Add STRIPE_SECRET_KEY for real charges.</p>
            <a
              href="/thank-you?status=ok&service=painting&deposit=simulated"
              className="mt-2 inline-block rounded-md bg-amber-800 px-3 py-1.5 text-xs font-medium text-white hover:opacity-90"
            >
              Simulate deposit
            </a>
          </div>
        )}

        {phase === "ready" && stripePromise && clientSecret && (
          <div className="min-h-[280px] sm:min-h-[300px]">
            <EmbeddedCheckoutProvider key={clientSecret} stripe={stripePromise} options={{ clientSecret }}>
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          </div>
        )}

        {phase === "ready" && (!stripePromise || !clientSecret) && (
          <div className="flex min-h-[120px] items-center justify-center rounded-md border border-dashed border-amber-100 bg-amber-50/40 py-6 text-xs text-gray-600">
            Payment form unavailable. Refresh or contact Sueep.
          </div>
        )}
      </div>

      <p className="mt-2 text-center">
        <Link href="/painting/contract" className="text-[11px] font-medium text-[#E73C6E] hover:underline">
          Customer agreement (full)
        </Link>
      </p>
    </div>
  );
}
