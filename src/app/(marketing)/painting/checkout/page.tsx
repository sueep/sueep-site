import type { Metadata } from "next";
import PaintingCheckoutPageClient from "./PaintingCheckoutPageClient";

export const metadata: Metadata = {
  title: "Pay painting deposit | Sueep",
  description: "Review the residential painting deposit terms and pay securely with Stripe on sueep.com.",
  robots: { index: false, follow: false },
};

export default function PaintingCheckoutPage() {
  return <PaintingCheckoutPageClient />;
}
