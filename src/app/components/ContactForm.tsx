"use client";

import { useEffect, useState } from "react";

export default function ContactForm() {
  const [mounted, setMounted] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState("/thank-you?status=ok");
  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      setRedirectUrl(`${window.location.origin}/thank-you?status=ok`);
    }
  }, []);
  if (!mounted) return null;
  return (
    <div suppressHydrationWarning>
      <h2 className="text-2xl md:text-3xl font-bold uppercase">Contact Us</h2>
      <form
        className="mt-6 space-y-4"
        method="post"
        action="https://formsubmit.co/fc9c50165f29e01095f6f39726348f26"
        autoComplete="off"
      >
        <input type="hidden" name="_next" value={redirectUrl} />
        <input type="hidden" name="_cc" value="edwin@sueep.com" />
        {/* Honeypot */}
        <input type="text" name="_honey" style={{ display: "none" }} tabIndex={-1} autoComplete="off" />
        <input type="hidden" name="_subject" value="New website inquiry from sueep.com" />
        <input type="hidden" name="_template" value="table" />
        <input type="hidden" name="_captcha" value="false" />
        <input name="name" type="text" placeholder="Full Name" className="w-full rounded-md px-4 py-3 text-base bg-white text-gray-900 placeholder-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E73C6E]/50 focus:border-[#E73C6E]" required />
        <input name="_replyto" type="email" placeholder="Email" className="w-full rounded-md px-4 py-3 text-base bg-white text-gray-900 placeholder-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E73C6E]/50 focus:border-[#E73C6E]" required />
        <input name="company" type="text" placeholder="Company / Property" className="w-full rounded-md px-4 py-3 text-base bg-white text-gray-900 placeholder-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E73C6E]/50 focus:border-[#E73C6E]" />
        <textarea name="message" placeholder="Scope, timelines, requirements" rows={5} className="w-full rounded-md px-4 py-3 text-base bg-white text-gray-900 placeholder-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E73C6E]/50 focus:border-[#E73C6E]" required></textarea>
        <button type="submit" className="px-6 py-3 bg-[#E73C6E] text-white font-medium rounded-md hover:opacity-90">Send</button>
      </form>
    </div>
  );
}


