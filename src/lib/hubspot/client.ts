/**
 * Outbound HubSpot API calls (CRM). Uses private app access token.
 * @see https://developers.hubspot.com/docs/api/overview
 */
export function hubspotApiUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `https://api.hubapi.com${p}`;
}

export async function hubspotFetch(path: string, init?: RequestInit): Promise<Response> {
  const token = process.env.HUBSPOT_ACCESS_TOKEN;
  if (!token) {
    throw new Error("HUBSPOT_ACCESS_TOKEN is not set");
  }
  const headers = new Headers(init?.headers);
  headers.set("Authorization", `Bearer ${token}`);
  if (!headers.has("content-type") && init?.body) {
    headers.set("content-type", "application/json");
  }
  return fetch(hubspotApiUrl(path), { ...init, headers });
}
