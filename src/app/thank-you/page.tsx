import Link from "next/link";

export default function ThankYouPage() {
  return (
    <main className="bg-white text-gray-900">
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
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/painting#estimate-form" className="px-6 py-3 bg-[#E73C6E] text-white rounded-md font-medium hover:opacity-90">
              Submit Another Painting Request
            </a>
            <Link href="/painting" className="px-6 py-3 border border-gray-300 rounded-md font-medium hover:bg-gray-50">
              Back to Painting Page
            </Link>
          </div>
          <p className="mt-6 text-sm text-gray-600">
            Prefer to talk? <a className="font-semibold" href="tel:+12673178268">(267) 317-8268</a>
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


