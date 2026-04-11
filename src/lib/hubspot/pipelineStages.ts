/**
 * Maps your three HubSpot deal pipelines + stages into ERP segment + lifecycle phase.
 *
 * Pipelines:
 * - Post-construction + Janitorial → ERP segment COMMERCIAL
 * - Residential → ERP segment RESIDENTIAL
 *
 * Stages (your naming):
 * - Commercial: Quote approved = awarded, Work in progress, Work completed
 * - Residential: Confirmed (= awarded), WIP, Work completed
 *
 * Set `HUBSPOT_PIPELINE_STAGE_MAP` in Vercel to a JSON string (see `.env.example`).
 * Get IDs: HubSpot → Settings → Data Management → Objects → Deals → Pipelines,
 * or inspect a deal’s `pipeline` / `dealstage` property values in the API.
 */

export type ErpSegment = "COMMERCIAL" | "RESIDENTIAL";

/** Awarded/confirmed & WIP should appear on Schedule/Gantt; completed = done in ERP. */
export type DealLifecyclePhase = "AWARDED" | "WIP" | "COMPLETED" | "OTHER";

export type HubSpotPipelineStageMap = {
  /** Post-construction pipeline object id (string from HubSpot) */
  postConstruction: { pipelineId: string; stages: { quoteApproved: string; workInProgress: string; workCompleted: string } };
  /** Janitorial pipeline */
  janitorial: { pipelineId: string; stages: { quoteApproved: string; workInProgress: string; workCompleted: string } };
  /** Residential pipeline — “Confirmed” plays the same role as commercial “Quote approved” */
  residential: { pipelineId: string; stages: { confirmed: string; workInProgress: string; workCompleted: string } };
};

export function parseHubSpotPipelineStageMap(): HubSpotPipelineStageMap | null {
  const raw = process.env.HUBSPOT_PIPELINE_STAGE_MAP?.trim();
  if (!raw) return null;
  try {
    return JSON.parse(raw) as HubSpotPipelineStageMap;
  } catch {
    console.error("HUBSPOT_PIPELINE_STAGE_MAP: invalid JSON");
    return null;
  }
}

/**
 * Given a deal’s `pipeline` + `dealstage` ids, returns ERP segment and lifecycle phase.
 * Returns null if pipeline isn’t one of the three configured pipelines.
 */
export function classifyHubSpotDealStage(
  pipelineId: string | null | undefined,
  dealStageId: string | null | undefined,
): { segment: ErpSegment; phase: DealLifecyclePhase } | null {
  if (!pipelineId || !dealStageId) return null;
  const cfg = parseHubSpotPipelineStageMap();
  if (!cfg) return null;

  if (pipelineId === cfg.residential.pipelineId) {
    const { confirmed, workInProgress, workCompleted } = cfg.residential.stages;
    if (dealStageId === confirmed) return { segment: "RESIDENTIAL", phase: "AWARDED" };
    if (dealStageId === workInProgress) return { segment: "RESIDENTIAL", phase: "WIP" };
    if (dealStageId === workCompleted) return { segment: "RESIDENTIAL", phase: "COMPLETED" };
    return { segment: "RESIDENTIAL", phase: "OTHER" };
  }

  const commercialPipelines = [cfg.postConstruction, cfg.janitorial] as const;
  for (const p of commercialPipelines) {
    if (pipelineId !== p.pipelineId) continue;
    const { quoteApproved, workInProgress, workCompleted } = p.stages;
    if (dealStageId === quoteApproved) return { segment: "COMMERCIAL", phase: "AWARDED" };
    if (dealStageId === workInProgress) return { segment: "COMMERCIAL", phase: "WIP" };
    if (dealStageId === workCompleted) return { segment: "COMMERCIAL", phase: "COMPLETED" };
    return { segment: "COMMERCIAL", phase: "OTHER" };
  }

  return null;
}

/** Stages that should create/update an ERP row for schedule & Gantt (not yet closed out). */
export function shouldSyncDealToErp(phase: DealLifecyclePhase): boolean {
  return phase === "AWARDED" || phase === "WIP";
}

/** Maps lifecycle to existing ERP `Project.status` (extend later if you add finer states). */
export function erpStatusFromPhase(phase: DealLifecyclePhase): "ACTIVE" | "COMPLETE" | "ON_HOLD" {
  if (phase === "COMPLETED") return "COMPLETE";
  if (phase === "OTHER") return "ON_HOLD";
  return "ACTIVE";
}
