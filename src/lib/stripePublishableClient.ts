import { loadStripe } from "@stripe/stripe-js";

const pk = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

/** Promise for Stripe.js (embedded Checkout on sueep.com). Null if publishable key is missing. */
export const paintingStripePromise = pk ? loadStripe(pk) : null;
