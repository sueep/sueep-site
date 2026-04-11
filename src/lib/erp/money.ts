/** USD cents ↔ display helpers for ERP. */

export function dollarsToCents(d: number): number {
  return Math.round(d * 100);
}

export function centsToDollars(c: number | null | undefined): string {
  if (c == null) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(c / 100);
}

export function parseMoneyInput(raw: string): number | null {
  const t = raw.trim().replace(/[$,]/g, "");
  if (t === "") return null;
  const n = Number(t);
  if (!Number.isFinite(n)) return null;
  return dollarsToCents(n);
}

/** Form/API value → cents: numbers are dollars; strings parsed as currency. */
export function inputToCents(v: unknown): number | null {
  if (v == null || v === "") return null;
  if (typeof v === "number" && Number.isFinite(v)) return dollarsToCents(v);
  if (typeof v === "string") return parseMoneyInput(v);
  return null;
}
