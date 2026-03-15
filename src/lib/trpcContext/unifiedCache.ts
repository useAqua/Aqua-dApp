import "server-only";
import { getContractConfigs, getNewContractConfigs } from "./contractConfig";
import { getTvls } from "./tvls";
import type {
  CampaignConfigs,
  VaultConfigs,
  VaultTVLMap,
} from "~/types/contracts";
import type { Address } from "viem";

export interface UnifiedContextData {
  vaultConfigs: VaultConfigs;
  vaultNameToAddress: Map<string, Address>;
  vaultTVL: VaultTVLMap;
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

  // TODO: To be Dropped after IYO is fully integrated and tested.
  const { vaultConfigs, vaultNameToAddress } = await getContractConfigs();
  const vaultTVL = await getTvls(vaultConfigs);

  // Fetch new contract configs with IYO integration
  const campaignConfig = await getNewContractConfigs();

  const data: UnifiedContextData = {
    vaultConfigs,
    vaultNameToAddress,
    vaultTVL,
    campaignConfig,
  };

  unifiedCache = {
    data,
    timestamp: now,
  };

  console.log({
    updated: new Date(unifiedCache.timestamp).toISOString(),
  });

  return data;
}

export function invalidateUnifiedCache(): void {
  unifiedCache = {
    data: null,
    timestamp: 0,
  };
}
