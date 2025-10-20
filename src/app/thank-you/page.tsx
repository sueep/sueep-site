import Link from "next/link";

export default function ThankYouPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const rawStatus = searchParams?.status;
  const status = Array.isArray(rawStatus) ? rawStatus[0] : rawStatus;
  const isError = status === "error";
  const isSkipped = status === "skipped";
  return (
    <main className="bg-white text-gray-900 min-h-[70vh] flex items-center">
      <section className="max-w-3xl mx-auto px-6 text-center">
        <div className={`mx-auto mb-6 w-16 h-16 rounded-full flex items-center justify-center ${isError ? "bg-red-100 text-red-700" : "bg-pink-100 text-[#E73C6E]"}`} suppressHydrationWarning>
          {isError ? (
            <svg viewBox="0 0 24 24" className="w-8 h-8" aria-hidden="true" suppressHydrationWarning>
              <path suppressHydrationWarning fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm1 15h-2v-2h2v2Zm0-4h-2V7h2v6Z"/>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="w-8 h-8" aria-hidden="true" suppressHydrationWarning>
              <path suppressHydrationWarning fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm-1 15-5-5 1.41-1.41L11 14.17l5.59-5.59L18 10l-7 7Z"/>
            </svg>
          )}
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold uppercase tracking-wide">
          {isError ? "Something went wrong" : "Thank you for reaching out"}
        </h1>
        <p className="mt-4 text-lg text-gray-700 max-w-2xl mx-auto">
          {isError
            ? "We couldn't send your message right now. Please try again in a few minutes or email us directly at contact@sueep.com."
            : isSkipped
              ? "Email sending is disabled in this environment. Your form submission reached the server successfully."
              : "Your message has been received. Our team will get back to you shortly."}
        </p>
        <div className="mt-8 flex gap-4 justify-center">
          <Link href="/commercial-cleaning" className="px-6 py-3 bg-[#E73C6E] text-white rounded-md font-medium hover:opacity-90">Back to Commercial Cleaning</Link>
          <a href="/commercial-cleaning#estimate-form" className="px-6 py-3 border border-gray-300 rounded-md font-medium hover:bg-gray-50">Submit Another Request</a>
        </div>
      </section>
    </main>
  );
}


