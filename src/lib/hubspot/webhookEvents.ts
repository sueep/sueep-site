/** Shape of CRM webhook payloads HubSpot POSTs (array of events). */

export type HubSpotCrmWebhookEvent = {
  eventId: number;
  subscriptionId: number;
  portalId: number;
  occurredAt: number;
  subscriptionType: string;
  attemptNumber: number;
  objectId: number;
  changeSource?: string;
  changeFlag?: string;
  appId?: number;
};

export function parseHubSpotWebhookBody(raw: string): HubSpotCrmWebhookEvent[] | null {
  try {
    const data = JSON.parse(raw) as unknown;
    if (!Array.isArray(data)) return null;
    return data as HubSpotCrmWebhookEvent[];
  } catch {
    return null;
  }
}

/** Log-only handler until Deal/Job sync is implemented. */
export function handleHubSpotWebhookEvents(events: HubSpotCrmWebhookEvent[]): void {
  for (const e of events) {
    console.info("[hubspot webhook]", {
      subscriptionType: e.subscriptionType,
      objectId: e.objectId,
      portalId: e.portalId,
      occurredAt: e.occurredAt,
    });
  }
}
