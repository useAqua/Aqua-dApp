import "server-only";
import { getNewContractConfigs } from "./contractConfig";
import type { CampaignConfigs } from "~/types/contracts";

export interface UnifiedContextData {
  campaignConfig: CampaignConfigs;
}

let unifiedCache: {
  data: UnifiedContextData | null;
  timestamp: number;
} = {
  data: null,
  timestamp: 0,
};

const CACHE_TTL = 5 * 60 * 1000;

export async function getUnifiedContextData(): Promise<UnifiedContextData> {
  const now = Date.now();

  if (unifiedCache.data && now - unifiedCache.timestamp < CACHE_TTL) {
    return unifiedCache.data;
  }

  const campaignConfig = await getNewContractConfigs();

  const data: UnifiedContextData = {
    campaignConfig,
  };

  unifiedCache = {
    data,
    timestamp: now,
  };

  console.log({ updated: new Date(unifiedCache.timestamp).toISOString() });

  return data;
}

export function invalidateUnifiedCache(): void {
  unifiedCache = {
    data: null,
    timestamp: 0,
  };
}
