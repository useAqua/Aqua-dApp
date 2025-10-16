import "server-only";
import { rpcViemClient } from "./viemClient";
import aquaRegistry from "~/lib/contracts/aquaRegistry";
import {
  type Address,
  type ContractFunctionParameters,
  type ReadContractReturnType,
} from "viem";
import type { VaultConfigs } from "~/types/contracts";

type VaultInfoTuple = ReadContractReturnType<
  typeof aquaRegistry.abi,
  "getVaultInfo"
>;

type GetVaultInfoCall = ContractFunctionParameters<
  typeof aquaRegistry.abi,
  "view",
  "getVaultInfo"
>;

export async function getContractConfigs(): Promise<VaultConfigs> {
  const vaultConfigs: VaultConfigs = new Map();
  try {
    const allVaultAddresses = await rpcViemClient.readContract({
      ...aquaRegistry,
      functionName: "allVaultAddresses",
    });

    const vaultInfoCalls = allVaultAddresses.map(
      (address: Address): GetVaultInfoCall => ({
        ...aquaRegistry,
        functionName: "getVaultInfo",
        args: [address],
      }),
    );

    const results = await rpcViemClient.multicall({
      contracts: vaultInfoCalls,
    });

    results.forEach(({ status, result, error }, i) => {
      if (status === "failure") {
        throw new Error(`Contract call failed: ${error}`);
      }
      const [
        name,
        strategy,
        isPaused,
        tokens,
        blockNumber,
        retired,
        gasOverhead,
      ] = result as VaultInfoTuple;
      const [lpToken, token0, token1] = tokens;
      if (
        lpToken === undefined &&
        token0 === undefined &&
        token1 === undefined
      ) {
        throw new Error(
          `Invalid token data for vault at address: ${allVaultAddresses[i]}`,
        );
      } else {
        vaultConfigs.set(allVaultAddresses[i]!, {
          name,
          strategy,
          isPaused,
          token0: token0!,
          token1: token1!,
          lpToken: lpToken!,
          blockNumber,
          retired,
          gasOverhead,
        });
      }
    });
    return vaultConfigs;
  } catch (error) {
    console.error("Failed to fetch contract configs:", error);
    throw error;
  }
}

/**
 * Cache for contract addresses with TTL
 */
let cachedConfigs: {
  configs: VaultConfigs | null;
  timestamp: number;
} = {
  configs: null,
  timestamp: 0,
};

const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

/**
 * Gets contract configs with caching
 */
export async function getCachedContractConfigs(): Promise<VaultConfigs> {
  const now = Date.now();

  // Return cached configs if still valid
  if (cachedConfigs.configs && now - cachedConfigs.timestamp < CACHE_TTL) {
    return cachedConfigs.configs;
  }

  // Fetch fresh configs
  const configs = await getContractConfigs();

  // Update cache
  cachedConfigs = {
    configs,
    timestamp: now,
  };

  return configs;
}

/**
 * Invalidates the config cache
 * Call this if you need to force a refresh
 */
export function invalidateConfigCache(): void {
  cachedConfigs = {
    configs: null,
    timestamp: 0,
  };
}
