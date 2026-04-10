/** Browser session payload so /painting/next-steps can continue after thank-you redirect. */
export const PAINTING_LEAD_STORAGE_KEY = "sueep_painting_lead_v1";

export type StoredPaintingLead = {
  name: string;
  email: string;
  phone: string;
  zip: string;
  serviceType: string;
  message: string;
};

export function parseStoredPaintingLead(raw: string | null): StoredPaintingLead | null {
  if (!raw) return null;
  try {
    const o = JSON.parse(raw) as Record<string, unknown>;
    const name = String(o.name || "").trim();
    const email = String(o.email || "").trim();
    const phone = String(o.phone || "").trim();
    const zip = String(o.zip || "").trim();
    const serviceType = String(o.serviceType || "").trim();
    const message = String(o.message || "").trim();
    if (!name || !email || !phone || !zip || !serviceType) return null;
    return { name, email, phone, zip, serviceType, message };
  } catch {
    return null;
  }
}
