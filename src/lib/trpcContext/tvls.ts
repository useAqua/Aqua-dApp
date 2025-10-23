import "server-only";
import { rpcViemClient } from "../viemClient";
import lpShareCalculationOracle from "~/lib/contracts/lpShareCalculationOracle";
import type { VaultConfigs, VaultTVLMap, LPInfo } from "~/types/contracts";
import type { Address, ContractFunctionParameters } from "viem";
import { erc20Abi } from "viem";
import aqua_poinst_pool from "~/lib/contracts/aqua_poinst_pool";

type LPValueCall = ContractFunctionParameters<
  typeof lpShareCalculationOracle.abi,
  "view",
  "getLPInfo"
>;
type VaultTVLCall = ContractFunctionParameters<
  typeof aqua_poinst_pool.abi,
  "view",
  "getUserLPStake"
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
  const strategys: Address[] = [];
  const lpTokens: Address[] = [];

  vaultConfigs.forEach(({ lpToken, strategy }, vault) => {
    vaults.push(vault);
    lpTokens.push(lpToken);
    strategys.push(strategy);
  });

  const numVaults = vaults.length;

  const vaultBalanceCalls: VaultTVLCall[] = [];
  const lpValueCalls: LPValueCall[] = [];
  const decimalsCalls: DecimalsCall[] = [];

  for (let i = 0; i < numVaults; i++) {
    vaultBalanceCalls.push({
      ...aqua_poinst_pool,
      functionName: "getUserLPStake",
      args: [strategys[i]!, lpTokens[i]!],
    });
    lpValueCalls.push({
      ...lpShareCalculationOracle,
      functionName: "getLPInfo",
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
    const lpInfoResult = lpValueResult!.result as readonly [
      Address, // token0
      Address, // token1
      string, // symbol0
      string, // symbol1
      bigint, // reserve0
      bigint, // reserve1
      bigint, // price0
      bigint, // price1
      bigint, // fairValue
    ];
    const decimals = decimalsResult!.result as number;

    const lpInfo: LPInfo = {
      token0: lpInfoResult[0],
      token1: lpInfoResult[1],
      symbol0: lpInfoResult[2],
      symbol1: lpInfoResult[3],
      reserve0: lpInfoResult[4],
      reserve1: lpInfoResult[5],
      price0: lpInfoResult[6],
      price1: lpInfoResult[7],
      fairValue: lpInfoResult[8],
    };

    const fairValue = lpInfo.fairValue;
    const decimalDivisor = BigInt(10 ** decimals);
    const usdValueBigInt = (balance * fairValue) / decimalDivisor;
    const usdValue = Number(usdValueBigInt) / 1e18;
    const lpPriceNumber = Number(fairValue) / 1e18;

    vaultTvls.set(vaults[i]!, {
      value: balance,
      usdValue,
      lpPrice: lpPriceNumber,
      lpTokenAddress: lpTokens[i]!,
      decimals,
      lpInfo,
    });
  }

  return vaultTvls;
}
