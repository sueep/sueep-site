import { hubspotFetch } from "@/lib/hubspot/client";
import type { HubSpotPipelineStageMap } from "@/lib/hubspot/pipelineStages";
import { parseHubSpotPipelineStageMap } from "@/lib/hubspot/pipelineStages";

function collectAllDealStageIds(cfg: HubSpotPipelineStageMap): string[] {
  const ids = new Set<string>();
  const add = (s: Record<string, string>) => {
    Object.values(s).forEach((id) => ids.add(id));
  };
  add(cfg.postConstruction.stages);
  add(cfg.janitorial.stages);
  add(cfg.residential.stages);
  return [...ids];
}

export type HubSpotDealRecord = {
  id: string;
  properties: Record<string, string | null>;
};

/**
 * Fetch deals whose `dealstage` is one of your configured stages (all three pipelines).
 * HubSpot search API: POST /crm/v3/objects/deals/search
 */
export async function searchDealsInConfiguredStages(limit = 100): Promise<HubSpotDealRecord[]> {
  const cfg = parseHubSpotPipelineStageMap();
  if (!cfg) {
    throw new Error("HUBSPOT_PIPELINE_STAGE_MAP is not set");
  }
  const stageIds = collectAllDealStageIds(cfg);
  if (stageIds.length === 0) return [];

  const res = await hubspotFetch("/crm/v3/objects/deals/search", {
    method: "POST",
    body: JSON.stringify({
      filterGroups: [
        {
          filters: [
            {
              propertyName: "dealstage",
              operator: "IN",
              values: stageIds,
            },
          ],
        },
      ],
      properties: ["dealname", "amount", "pipeline", "dealstage", "closedate", "hs_is_closed"],
      limit,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HubSpot search failed: ${res.status} ${text}`);
  }

  const data = (await res.json()) as { results?: HubSpotDealRecord[] };
  return data.results ?? [];
}
