import "server-only";
import { rpcViemClient } from "../viemClient";
import lpShareCalculationOracle from "~/lib/contracts/lpShareCalculationOracle";
import type { VaultConfigs, VaultTvls } from "~/types/contracts";
import type { Address, ContractFunctionParameters } from "viem";
import vault_abi from "~/lib/contracts/vault_abi";
import { erc20Abi } from "viem";

type LPValueCall = ContractFunctionParameters<
  typeof lpShareCalculationOracle.abi,
  "view",
  "calculateLPValue"
>;
type VaultBalanceCall = ContractFunctionParameters<
  typeof vault_abi,
  "view",
  "balance"
>;
type DecimalsCall = ContractFunctionParameters<
  typeof erc20Abi,
  "view",
  "decimals"
>;

export async function getTvls(vaultConfigs: VaultConfigs): Promise<VaultTvls> {
  const vaultTvls: VaultTvls = new Map();
  const data: Record<"vault" | "lpToken", Address>[] = [];

  vaultConfigs.forEach(({ lpToken }, vault) => {
    data.push({
      vault,
      lpToken,
    });
  });

  const vaultBalanceCalls: VaultBalanceCall[] = [];
  const lpValueCalls: LPValueCall[] = [];
  const decimalsCalls: DecimalsCall[] = [];

  data.forEach(({ lpToken, vault }) => {
    vaultBalanceCalls.push({
      abi: vault_abi,
      address: vault,
      functionName: "balance",
      args: [],
    });
    lpValueCalls.push({
      ...lpShareCalculationOracle,
      functionName: "calculateLPValue",
      args: [lpToken],
    });
    decimalsCalls.push({
      abi: erc20Abi,
      address: lpToken,
      functionName: "decimals",
      args: [],
    });
  });

  const results = await rpcViemClient.multicall({
    contracts: [...vaultBalanceCalls, ...lpValueCalls, ...decimalsCalls],
  });

  // Split results into vault balances, LP values, and decimals
  const balanceResults = results.slice(0, vaultBalanceCalls.length);
  const lpValueResults = results.slice(
    vaultBalanceCalls.length,
    vaultBalanceCalls.length + lpValueCalls.length,
  );
  const decimalsResults = results.slice(
    vaultBalanceCalls.length + lpValueCalls.length,
  );

  data.forEach(({ vault }, index) => {
    const balanceResult = balanceResults[index];
    const lpValueResult = lpValueResults[index];
    const decimalsResult = decimalsResults[index];

    if (balanceResult?.status === "failure") {
      throw new Error(
        `Failed to fetch vault balance for ${vault}: ${balanceResult.error}`,
      );
    }

    if (lpValueResult?.status === "failure") {
      throw new Error(
        `Failed to fetch LP value for ${vault}: ${lpValueResult.error}`,
      );
    }

    if (decimalsResult?.status === "failure") {
      throw new Error(
        `Failed to fetch decimals for ${vault}: ${decimalsResult.error}`,
      );
    }

    const balance = balanceResult!.result as bigint;
    const lpPrice = lpValueResult!.result as bigint;
    const decimals = decimalsResult!.result as number;

    // Calculate USD value: (balance * lpPrice) / (10 ** decimals) / 1e18
    const decimalDivisor = BigInt(10 ** decimals);
    const usdValueBigInt = (balance * lpPrice) / decimalDivisor;
    const usdValue = Number(usdValueBigInt) / 1e18;
    const lpPriceNumber = Number(lpPrice) / 1e18;

    vaultTvls.set(vault, {
      value: balance,
      usdValue,
      lpPrice: lpPriceNumber,
      decimals,
    });
  });

  return vaultTvls;
}

/**
 * Cache for TVL data with TTL
 */
let cachedTvls: {
  tvls: VaultTvls | null;
  timestamp: number;
} = {
  tvls: null,
  timestamp: 0,
};

const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

/**
 * Gets TVL data with caching
 */
export async function getCachedTvls(
  vaultConfigs: VaultConfigs,
): Promise<VaultTvls> {
  const now = Date.now();

  // Return cached TVLs if still valid
  if (cachedTvls.tvls && now - cachedTvls.timestamp < CACHE_TTL) {
    return cachedTvls.tvls;
  }

  // Fetch fresh TVLs
  const tvls = await getTvls(vaultConfigs);

  // Update cache
  cachedTvls = {
    tvls,
    timestamp: now,
  };

  return tvls;
}

/**
 * Invalidates the TVL cache
 * Call this if you need to force a refresh
 */
export function invalidateTvlCache(): void {
  cachedTvls = {
    tvls: null,
    timestamp: 0,
  };
}
