"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";
import PaintingDepositTerms from "@/app/(marketing)/painting/PaintingDepositTerms";
import { PAINTING_CHECKOUT_STORAGE_KEY } from "@/lib/paintingLeadStorage";
import { paintingStripePromise } from "@/lib/stripePublishableClient";

type CheckoutStoredPayload = {
  name: string;
  email: string;
  phone: string;
  zip: string;
  serviceType: string;
  roomCount: number;
  sqFtBand: string;
  scope: string;
  ceilings: string;
  wallCondition: string;
  occupancy: string;
  timeline: string;
  depositDisplay?: string;
};

export default function PaintingCheckoutPageClient() {
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);
  const [error, setError] = useState("");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [testMode, setTestMode] = useState(false);
  const [depositDisplay, setDepositDisplay] = useState<string | null>(null);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    let cancelled = false;
    const raw = sessionStorage.getItem(PAINTING_CHECKOUT_STORAGE_KEY);
    if (!raw) {
      setError("missing_payload");
      return;
    }

    let payload: CheckoutStoredPayload;
    try {
      payload = JSON.parse(raw) as CheckoutStoredPayload;
    } catch {
      setError("invalid_payload");
      return;
    }

    if (payload.depositDisplay) {
      setDepositDisplay(payload.depositDisplay);
    }

    async function createSession() {
      try {
        const res = await fetch("/api/painting/checkout", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            name: payload.name,
            email: payload.email,
            phone: payload.phone,
            zip: payload.zip,
            serviceType: payload.serviceType,
            roomCount: payload.roomCount,
            sqFtBand: payload.sqFtBand,
            scope: payload.scope,
            ceilings: payload.ceilings,
            wallCondition: payload.wallCondition,
            occupancy: payload.occupancy,
            timeline: payload.timeline,
            checkoutUi: "embedded",
          }),
        });
        const data = (await res.json()) as {
          clientSecret?: string;
          testMode?: boolean;
          depositCents?: number;
          error?: string;
        };
        if (cancelled) return;
        if (!res.ok) {
          setError(typeof data.error === "string" ? data.error : "checkout_failed");
          return;
        }
        if (data.testMode) {
          setTestMode(true);
          return;
        }
        if (typeof data.clientSecret === "string" && data.clientSecret) {
          setClientSecret(data.clientSecret);
          return;
        }
        setError("no_client_secret");
      } catch {
        if (!cancelled) setError("network");
      }
    }

    void createSession();
    return () => {
      cancelled = true;
    };
  }, [hydrated]);

  if (!hydrated) {
    return (
      <main className="bg-white text-gray-900 min-h-screen flex items-center justify-center text-gray-500 text-sm">
        Loading…
      </main>
    );
  }

  if (error === "missing_payload" || error === "invalid_payload") {
    return (
      <main className="bg-white text-gray-900 min-h-screen">
        <div className="max-w-3xl mx-auto px-6 py-12 md:py-16">
          <h1 className="text-2xl font-bold text-gray-900">Start from your estimate</h1>
          <p className="mt-3 text-gray-600 leading-relaxed">
            Open this page after you click pay deposit from your quote. If you already closed that tab, continue from the painting estimate or next steps.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/painting#estimate-form" className="inline-flex px-5 py-2.5 bg-[#E73C6E] text-white text-sm font-medium rounded-md hover:opacity-90">
              Residential painting estimate
            </Link>
            <Link href="/painting/next-steps" className="inline-flex px-5 py-2.5 border border-gray-300 text-gray-800 text-sm font-medium rounded-md hover:bg-gray-50">
              Next steps
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (error && error !== "missing_payload" && error !== "invalid_payload") {
    return (
      <main className="bg-white text-gray-900 min-h-screen">
        <div className="max-w-3xl mx-auto px-6 py-12 md:py-16">
          <h1 className="text-2xl font-bold text-gray-900">Checkout couldn&apos;t start</h1>
          <p className="mt-3 text-gray-600 leading-relaxed">
            {error === "network"
              ? "Network error. Check your connection and try again."
              : "Something went wrong creating your payment session. Go back to your quote and try again, or contact Sueep."}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => router.push("/painting/next-steps")}
              className="inline-flex px-5 py-2.5 bg-[#E73C6E] text-white text-sm font-medium rounded-md hover:opacity-90"
            >
              Back to next steps
            </button>
            <Link href="/painting/contract" className="inline-flex px-5 py-2.5 border border-gray-300 text-gray-800 text-sm font-medium rounded-md hover:bg-gray-50">
              View customer agreement
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (testMode) {
    return (
      <main className="bg-white text-gray-900 min-h-screen">
        <div className="max-w-3xl mx-auto px-6 py-12 md:py-16">
          <p className="text-sm text-[#E73C6E] font-semibold uppercase tracking-wide">Sueep — residential painting</p>
          <h1 className="mt-2 text-3xl md:text-4xl font-bold">Deposit checkout (test mode)</h1>
          <p className="mt-4 text-gray-600 leading-relaxed">
            Stripe is not configured on this environment. Add <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">STRIPE_SECRET_KEY</code> and{" "}
            <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code> to enable the embedded form.
          </p>
          <div className="mt-10">
            <PaintingDepositTerms />
          </div>
          <a
            href="/thank-you?status=ok&service=painting&deposit=simulated"
            className="mt-10 inline-block px-6 py-3 bg-amber-800 text-white font-medium rounded-md hover:opacity-90"
          >
            Simulate successful deposit (testing only)
          </a>
        </div>
      </main>
    );
  }

  if (!paintingStripePromise) {
    return (
      <main className="bg-white text-gray-900 min-h-screen">
        <div className="max-w-3xl mx-auto px-6 py-12 md:py-16">
          <h1 className="text-2xl font-bold text-gray-900">Payments not configured</h1>
          <p className="mt-3 text-gray-600 leading-relaxed">
            Set <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code> in production so the secure card form can load.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-white text-gray-900 min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-12 md:py-16">
        <p className="text-sm text-[#E73C6E] font-semibold uppercase tracking-wide">Sueep — residential painting</p>
        <h1 className="mt-2 text-3xl md:text-4xl font-bold">Pay your deposit</h1>
        {depositDisplay ? (
          <p className="mt-3 text-lg text-gray-700">
            Amount due today: <strong className="text-gray-900">{depositDisplay}</strong>
          </p>
        ) : null}
        <p className="mt-4 text-gray-600 leading-relaxed">
          Below is a short summary of what you&apos;re agreeing to. Your card details are entered in Stripe&apos;s secure form on this same page. You&apos;ll confirm acceptance of the customer agreement there before paying.
        </p>

        <div className="mt-10">
          <PaintingDepositTerms />
        </div>

        <div className="mt-10 pt-8 border-t border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Payment</h2>
          <p className="mt-2 text-sm text-gray-600">Secured by Stripe. Cards only; Link is hidden for this checkout.</p>
          <div className="mt-6 min-h-[400px]">
            {clientSecret ? (
              <EmbeddedCheckoutProvider key={clientSecret} stripe={paintingStripePromise} options={{ clientSecret }}>
                <EmbeddedCheckout />
              </EmbeddedCheckoutProvider>
            ) : (
              <div className="flex items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50 py-16 text-sm text-gray-500">
                Preparing secure checkout…
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-4 text-sm">
          <Link href="/painting/contract" className="text-[#E73C6E] font-medium hover:underline">
            Full customer agreement (same terms)
          </Link>
          <Link href="/painting#estimate-form" className="text-gray-600 hover:text-gray-900 underline">
            Cancel and return to painting
          </Link>
        </div>
      </div>
    </main>
  );
}
