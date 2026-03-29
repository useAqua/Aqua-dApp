import type { CampaignInfo } from "~/types/contracts";

/** Returns the 1-based current phase number for a campaign. */
export function getCurrentPhase(campaign: CampaignInfo): number {
  const now = BigInt(Math.floor(Date.now() / 1000));
  if (now < campaign.startTime) return 0;
  if (campaign.phaseDuration === BigInt(0)) return 1;
  const elapsed = now - campaign.startTime;
  return Number(elapsed / campaign.phaseDuration) + 1;
}

/** Returns the total number of phases for a campaign. */
export function getTotalPhases(campaign: CampaignInfo): number {
  if (campaign.phaseDuration === BigInt(0)) return 1;
  const duration = campaign.endTime - campaign.startTime;
  return Math.max(1, Number(duration / campaign.phaseDuration));
}

/** Formats a Unix timestamp (bigint) to a short date string. */
export function fmtDate(ts: bigint): string {
  return new Date(Number(ts) * 1000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

