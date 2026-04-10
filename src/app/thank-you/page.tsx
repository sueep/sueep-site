import Link from "next/link";
import Script from "next/script";
import PaintingFollowUpFlow from "@/app/painting/PaintingFollowUpFlow";

export default async function ThankYouPage({
  searchParams,
}: {
  // This project’s Next.js PageProps expects `searchParams` to be a Promise.
  // `await` also works if Next passes a plain object at runtime.
  searchParams?: Promise<{ status?: string; service?: string; deposit?: string }>;
}) {
  const sp = (searchParams ? await searchParams : undefined) ?? {};
  const service = String(sp.service || "").toLowerCase();
  const isCleaning = service === "cleaning";
  const status = String(sp.status || "").toLowerCase();
  const isOk = status === "ok";
  const deposit = String(sp.deposit || "").toLowerCase();
  const depositPaid = deposit === "paid";
  const depositSimulated = deposit === "simulated";
  return (
    <main className="bg-white text-gray-900">
      {isCleaning && isOk && (
        <Script id="cleaning-lead-form-conversion" strategy="afterInteractive">
          {`
if (typeof gtag === 'function') {
  console.log('[Ads] Cleaning lead-form conversion firing');
  gtag('event', 'conversion', {
    'send_to': 'AW-17637968786/DIKoCOSw7oQcEJKXuNpB',
    'value': 1.0,
    'currency': 'USD'
  });
} else {
  console.warn('[Ads] gtag is not defined; cleaning conversion not sent.');
}
          `}
        </Script>
      )}
      <section className="min-h-[66vh] flex items-center">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="mx-auto mb-6 w-16 h-16 rounded-full flex items-center justify-center bg-pink-100 text-[#E73C6E]">
            <svg viewBox="0 0 24 24" className="w-8 h-8" aria-hidden="true">
              <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm-1 15-5-5 1.41-1.41L11 14.17l5.59-5.59L18 10l-7 7Z"/>
            </svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold uppercase tracking-wide">
            Thanks—your request was received
          </h1>
          <p className="mt-4 text-lg text-gray-700 max-w-2xl mx-auto">
            A Sueep team member will reach out shortly to confirm details and timing.
          </p>
          {service === "painting" && depositPaid && (
            <p className="mt-3 text-sm text-gray-700 max-w-2xl mx-auto font-medium">
              Your deposit was received — thank you. We&apos;ll confirm your scope and schedule shortly.
            </p>
          )}
          {service === "painting" && depositSimulated && (
            <p className="mt-3 text-sm text-amber-800 max-w-2xl mx-auto bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
              Test mode: deposit was not charged. This confirmation is for local testing only.
            </p>
          )}
          {service === "painting" && isOk && !depositPaid && !depositSimulated && (
            <>
              <p className="mt-3 text-sm text-gray-700 max-w-2xl mx-auto">
                <strong>We&apos;re on it.</strong> You&apos;ll hear from us shortly. A few quick questions below help us show a planning range and optional deposit to hold your spot — same browser as when you submitted works best.
              </p>
              <div className="mt-8 max-w-xl mx-auto w-full text-left">
                <PaintingFollowUpFlow variant="thankYou" />
              </div>
              <p className="mt-10 text-sm text-gray-600 max-w-2xl mx-auto text-center">
                Need flexibility? Ask us about financing options available through Acorn Finance.
              </p>
            </>
          )}
          {service === "painting" && (!isOk || depositPaid || depositSimulated) && (
            <p className="mt-3 text-sm text-gray-600 max-w-2xl mx-auto">
              Need flexibility? Ask us about financing options available through Acorn Finance.
            </p>
          )}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            {isCleaning ? (
              <>
                <a
                  href="/commercial-cleaning#estimate-form"
                  className="px-6 py-3 bg-[#E73C6E] text-white rounded-md font-medium hover:opacity-90"
                >
                  Submit Another Cleaning Request
                </a>
                <Link
                  href="/commercial-cleaning"
                  className="px-6 py-3 border border-gray-300 rounded-md font-medium hover:bg-gray-50"
                >
                  Back to Commercial Cleaning Page
                </Link>
              </>
            ) : (
              <>
                <a
                  href="/painting#estimate-form"
                  className="px-6 py-3 bg-[#E73C6E] text-white rounded-md font-medium hover:opacity-90"
                >
                  Submit Another Painting Request
                </a>
                <Link
                  href="/painting"
                  className="px-6 py-3 border border-gray-300 rounded-md font-medium hover:bg-gray-50"
                >
                  Back to Painting Page
                </Link>
              </>
            )}
          </div>
          <p className="mt-6 text-sm text-gray-600">
            Prefer to talk?{" "}
            <a className="font-semibold" href="tel:+12672173596">
              267-217-3596
            </a>
          </p>
        </div>
      </section>
      <footer className="bg-black text-gray-400 text-sm py-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center justify-center gap-3">
            <img src="/sueeplogo.png" alt="Sueep logo" className="h-12 md:h-14 lg:h-16 w-auto" />
          </div>
          <div className="mt-4 flex justify-between items-center">
            <p>© {new Date().getFullYear()} Sueep LLC. All rights reserved.</p>
            <div className="flex gap-6" />
          </div>
        </div>
      </footer>
    </main>
  );
}


