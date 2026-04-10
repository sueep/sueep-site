import Link from "next/link";

export const metadata = {
  title: "Residential painting customer agreement | Sueep",
  description: "Terms for residential painting deposits, scheduling, and project agreement with Sueep.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/painting/contract" },
};

export default function PaintingContractPage() {
  return (
    <main className="bg-white text-gray-900 min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-12 md:py-16">
        <p className="text-sm text-[#E73C6E] font-semibold uppercase tracking-wide">Sueep — residential painting</p>
        <h1 className="mt-2 text-3xl md:text-4xl font-bold">Customer agreement & deposit terms</h1>
        <p className="mt-4 text-gray-600 leading-relaxed">
          By placing your online deposit you agree to the terms below and any written estimate or contract Sueep provides for your specific job. Replace or extend this page with your full legal agreement or link a PDF via{" "}
          <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">NEXT_PUBLIC_RESIDENTIAL_PAINTING_CONTRACT_URL</code>{" "}
          in production if you host the document elsewhere.
        </p>

        <section className="mt-10 space-y-6 text-gray-800 leading-relaxed">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Deposit (50% of planning midpoint)</h2>
            <p className="mt-2 text-sm md:text-base">
              Your deposit equals fifty percent (50%) of the midpoint of the planning range shown online. It reserves crew time and allows Sueep to schedule your project and purchase paint and related materials. Final project price may differ after an on-site scope; any change will be documented before work proceeds.
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Scheduling & materials</h2>
            <p className="mt-2 text-sm md:text-base">
              After deposit, Sueep will confirm dates and material orders subject to product availability and weather for exterior work. Delays outside Sueep&apos;s control may require rescheduling.
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Cancellation & refunds</h2>
            <p className="mt-2 text-sm md:text-base">
              Describe your policy here (e.g. refundable until X days before start, non-refundable custom-order materials, etc.).
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Contact</h2>
            <p className="mt-2 text-sm md:text-base">
              Questions:{" "}
              <a href="mailto:contact@sueep.com" className="text-[#E73C6E] font-medium hover:underline">
                contact@sueep.com
              </a>{" "}
              or{" "}
              <a href="tel:+12672173596" className="text-[#E73C6E] font-medium hover:underline">
                (267) 217-3596
              </a>
              .
            </p>
          </div>
        </section>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link href="/painting" className="text-[#E73C6E] font-medium hover:underline">
            ← Back to residential painting
          </Link>
        </div>
      </div>
    </main>
  );
}
