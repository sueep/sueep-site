/** Public URL or path to the residential painting customer agreement (opens in a new tab from checkout). */
export const DEFAULT_RESIDENTIAL_PAINTING_CONTRACT_HREF = "/painting/contract";

export function getResidentialPaintingContractHref(): string {
  const fromEnv = process.env.NEXT_PUBLIC_RESIDENTIAL_PAINTING_CONTRACT_URL?.trim();
  if (fromEnv) return fromEnv;
  return DEFAULT_RESIDENTIAL_PAINTING_CONTRACT_HREF;
}
