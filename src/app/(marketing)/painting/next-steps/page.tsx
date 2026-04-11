import Link from "next/link";
import PaintingFollowUpFlow from "../PaintingFollowUpFlow";

export const metadata = {
  title: "Next steps — your painting estimate | Sueep",
  description: "Answer a few follow-up questions for an instant planning range and optional deposit after you submit your painting request.",
  robots: { index: false, follow: true },
};

export default function PaintingNextStepsPage() {
  return (
    <main className="bg-white text-gray-900 min-h-screen">
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-3xl mx-auto px-5 py-4 flex items-center justify-between gap-4">
          <Link href="/" className="text-sm font-medium text-gray-600 hover:text-[#E73C6E]">
            ← Sueep home
          </Link>
          <Link href="/painting" className="text-sm font-medium text-[#E73C6E] hover:opacity-90">
            Painting services
          </Link>
        </div>
      </header>
      <section className="max-w-3xl mx-auto px-5 py-10 md:py-14">
        <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-wide text-gray-900">Painting estimate — next steps</h1>
        <p className="mt-2 text-gray-600 text-sm md:text-base">
          Use this page if you skipped the questions on the thank-you screen. Submit the painting form first in this browser, then return here. Or{" "}
          <Link href="/thank-you?status=ok&service=painting" className="text-[#E73C6E] font-medium underline">
            open the thank-you page
          </Link>{" "}
          for the full flow.
        </p>
        <div className="mt-10">
          <PaintingFollowUpFlow variant="standalone" />
        </div>
      </section>
    </main>
  );
}
