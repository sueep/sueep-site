import Link from "next/link";
import PaintingDepositTerms from "@/app/painting/PaintingDepositTerms";

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
          By placing your online deposit you agree to the terms below and any written estimate or contract Sueep provides for your specific job. When you pay, you&apos;ll see this same summary on our checkout page and confirm acceptance in Stripe&apos;s secure form before your card is charged.
        </p>
        <p className="mt-3 text-sm text-gray-500 leading-relaxed">
          You can host a longer PDF elsewhere and point production to it with{" "}
          <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">NEXT_PUBLIC_RESIDENTIAL_PAINTING_CONTRACT_URL</code>{" "}
          if needed; Stripe&apos;s dashboard Terms of service URL should match the agreement customers can read (this page or that URL).
        </p>

        <div className="mt-10">
          <PaintingDepositTerms />
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link href="/painting" className="text-[#E73C6E] font-medium hover:underline">
            ← Back to residential painting
          </Link>
        </div>
      </div>
    </main>
  );
}
