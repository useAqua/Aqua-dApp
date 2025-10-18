import "server-only";
import { rpcViemClient } from "../viemClient";
import lpShareCalculationOracle from "~/lib/contracts/lpShareCalculationOracle";
import type { VaultConfigs, VaultTVLMap } from "~/types/contracts";
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

export async function getTvls(
  vaultConfigs: VaultConfigs,
): Promise<VaultTVLMap> {
  const vaultTvls: VaultTVLMap = new Map();

  const vaults: Address[] = [];
  const lpTokens: Address[] = [];

  vaultConfigs.forEach(({ lpToken }, vault) => {
    vaults.push(vault);
    lpTokens.push(lpToken);
  });

  const numVaults = vaults.length;

  const vaultBalanceCalls: VaultBalanceCall[] = [];
  const lpValueCalls: LPValueCall[] = [];
  const decimalsCalls: DecimalsCall[] = [];

  for (let i = 0; i < numVaults; i++) {
    vaultBalanceCalls.push({
      abi: vault_abi,
      address: vaults[i]!,
      functionName: "balance",
      args: [],
    });
    lpValueCalls.push({
      ...lpShareCalculationOracle,
      functionName: "calculateLPValue",
      args: [lpTokens[i]!],
    });
    decimalsCalls.push({
      abi: erc20Abi,
      address: lpTokens[i]!,
      functionName: "decimals",
      args: [],
    });
  }

  const results = await rpcViemClient.multicall({
    contracts: [...vaultBalanceCalls, ...lpValueCalls, ...decimalsCalls],
  });

  const balanceResults = results.slice(0, numVaults);
  const lpValueResults = results.slice(numVaults, numVaults * 2);
  const decimalsResults = results.slice(numVaults * 2);

  for (let i = 0; i < numVaults; i++) {
    const balanceResult = balanceResults[i];
    const lpValueResult = lpValueResults[i];
    const decimalsResult = decimalsResults[i];

    if (balanceResult?.status === "failure") {
      throw new Error(
        `Failed to fetch vault balance for ${vaults[i]}: ${balanceResult.error}`,
      );
    }

    if (lpValueResult?.status === "failure") {
      throw new Error(
        `Failed to fetch LP value for ${vaults[i]}: ${lpValueResult.error}`,
      );
    }

    if (decimalsResult?.status === "failure") {
      throw new Error(
        `Failed to fetch decimals for ${vaults[i]}: ${decimalsResult.error}`,
      );
    }

    const balance = balanceResult!.result as bigint;
    const lpPrice = lpValueResult!.result as bigint;
    const decimals = decimalsResult!.result as number;

    const decimalDivisor = BigInt(10 ** decimals);
    const usdValueBigInt = (balance * lpPrice) / decimalDivisor;
    const usdValue = Number(usdValueBigInt) / 1e18;
    const lpPriceNumber = Number(lpPrice) / 1e18;

    vaultTvls.set(vaults[i]!, {
      value: balance,
      usdValue,
      lpPrice: lpPriceNumber,
      lpTokenAddress: lpTokens[i]!,
      decimals,
    });
  }

  return vaultTvls;
}

let cachedTvls: {
  tvls: VaultTVLMap | null;
  timestamp: number;
} = {
  tvls: null,
  timestamp: 0,
};

const CACHE_TTL = 15 * 60 * 1000;

export async function getCachedTvls(
  vaultConfigs: VaultConfigs,
): Promise<VaultTVLMap> {
  const now = Date.now();

  if (cachedTvls.tvls && now - cachedTvls.timestamp < CACHE_TTL) {
    return cachedTvls.tvls;
  }

  const tvls = await getTvls(vaultConfigs);

  cachedTvls = {
    tvls,
    timestamp: now,
  };

  return tvls;
}

export function invalidateTvlCache(): void {
  cachedTvls = {
    tvls: null,
    timestamp: 0,
  };
}
