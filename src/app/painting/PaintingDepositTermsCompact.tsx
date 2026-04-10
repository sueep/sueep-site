import Link from "next/link";

/** Short summary for inline checkout; full text stays on /painting/contract. */
export default function PaintingDepositTermsCompact() {
  return (
    <div className="rounded-md border border-gray-100 bg-gray-50/90 px-3 py-2">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">Deposit terms</p>
      <ul className="mt-1 text-[11px] leading-snug text-gray-600 space-y-0.5 list-disc pl-3.5 marker:text-gray-300">
        <li>50% of planning midpoint today — holds your date &amp; paint/material orders.</li>
        <li>Final price &amp; scope confirmed in writing before work begins.</li>
        <li>
          <Link href="/painting/contract" className="text-[#E73C6E] font-medium hover:underline">
            Full agreement
          </Link>
          {" · "}You&apos;ll also confirm in Stripe before paying.
        </li>
      </ul>
    </div>
  );
}
