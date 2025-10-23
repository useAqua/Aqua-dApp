import "server-only";
import { getContractConfigs } from "./contractConfig";
import { getTvls } from "./tvls";
import type { VaultConfigs, VaultTVLMap } from "~/types/contracts";
import type { Address } from "viem";

export interface UnifiedContextData {
  vaultConfigs: VaultConfigs;
  vaultNameToAddress: Map<string, Address>;
  vaultTVL: VaultTVLMap;
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

  const { vaultConfigs, vaultNameToAddress } = await getContractConfigs();
  const vaultTVL = await getTvls(vaultConfigs);

  const data: UnifiedContextData = {
    vaultConfigs,
    vaultNameToAddress,
    vaultTVL,
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
