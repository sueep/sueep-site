import { createHash, timingSafeEqual } from "crypto";

function safeSigEq(received: string, expectedHex: string): boolean {
  const a = Buffer.from(received.trim().toLowerCase(), "utf8");
  const b = Buffer.from(expectedHex.toLowerCase(), "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/**
 * Legacy private-app webhook validation (X-HubSpot-Signature v1): secret + raw body.
 * @see https://developers.hubspot.com/docs/api/webhooks/validating-requests
 */
export function verifyHubSpotWebhookV1(
  rawBody: string,
  signatureHeader: string | null | undefined,
  clientSecret: string,
): boolean {
  if (!signatureHeader || !clientSecret) return false;
  const expected = createHash("sha256").update(clientSecret + rawBody).digest("hex");
  return safeSigEq(signatureHeader, expected);
}

/**
 * v2: secret + HTTP method + full URI + body (CRM workflow / some endpoints).
 */
export function verifyHubSpotWebhookV2(
  method: string,
  requestUri: string,
  rawBody: string,
  signatureHeader: string | null | undefined,
  clientSecret: string,
): boolean {
  if (!signatureHeader || !clientSecret) return false;
  const source = `${clientSecret}${method.toUpperCase()}${requestUri}${rawBody}`;
  const expected = createHash("sha256").update(source).digest("hex");
  return safeSigEq(signatureHeader, expected);
}

/** Try v1, then v2 (common for POST webhooks). */
export function verifyHubSpotWebhookPost(
  request: Request,
  rawBody: string,
  signatureHeader: string | null | undefined,
  clientSecret: string,
): boolean {
  if (verifyHubSpotWebhookV1(rawBody, signatureHeader, clientSecret)) return true;
  const u = new URL(request.url);
  const requestUri = `${u.origin}${u.pathname}`;
  return verifyHubSpotWebhookV2("POST", requestUri, rawBody, signatureHeader, clientSecret);
}
