import {
  type Address,
  type ContractFunctionParameters,
  erc20Abi,
  formatUnits,
} from "viem";
import type { VaultTVLMap } from "~/types/contracts";
import { rpcViemClient } from "~/lib/viemClient";
import strategy_abi from "~/lib/contracts/strategy_gte_points";

type ERC20Call<
  T extends
    | "symbol"
    | "name"
    | "allowance"
    | "balanceOf"
    | "decimals"
    | "totalSupply",
> = ContractFunctionParameters<typeof erc20Abi, "view", T>;

type StrategyCall<T extends "lastHarvest" | "depositFee" | "withdrawFee"> =
  ContractFunctionParameters<typeof strategy_abi, "view", T>;

type UserLPWalletBalances = Map<
  Address,
  {
    balance: number;
    balanceUsd: number;
  }
>;

export const getUserLPWalletBalances = async (
  vaultTvl: VaultTVLMap,
  user?: Address,
): Promise<UserLPWalletBalances> => {
  const walletLpBalance: UserLPWalletBalances = new Map();
  if (!user) return walletLpBalance;
  const entries = Array.from(vaultTvl.entries());
  const calls = entries.map(
    ([, { lpTokenAddress }]): ERC20Call<"balanceOf"> => ({
      abi: erc20Abi,
      address: lpTokenAddress,
      functionName: "balanceOf",
      args: [user],
    }),
  );

  const result = await rpcViemClient.multicall({
    contracts: calls,
  });

  entries.forEach(([vaultAddress, { decimals, lpPrice }], index) => {
    const balanceResult = result[index];

    if (!balanceResult || balanceResult?.status === "failure") {
      throw new Error(`Unable to get Lp balance: ${balanceResult?.error}`);
    }

    const balance = +formatUnits(balanceResult.result, decimals);
    const balanceUsd = balance * lpPrice;

    walletLpBalance.set(vaultAddress, {
      balance,
      balanceUsd,
    });
  });

  return walletLpBalance;
};

export const getTokenDetails = async (tokens: Address[]) => {
  const calls = tokens.map(
    (token): ERC20Call<"name" | "symbol" | "decimals">[] =>
      (["name", "symbol", "decimals"] as const).map((functionName) => ({
        abi: erc20Abi,
        address: token,
        functionName,
      })),
  );

  const result = await rpcViemClient.multicall({
    contracts: calls.flat(),
  });

  return tokens.map((tokenAddress, index) => {
    const startIndex = index * 3;
    const nameResult = result[startIndex];
    const symbolResult = result[startIndex + 1];
    const decimalsResult = result[startIndex + 2];

    if (
      !nameResult ||
      nameResult.status === "failure" ||
      !symbolResult ||
      symbolResult.status === "failure" ||
      !decimalsResult ||
      decimalsResult.status === "failure"
    ) {
      throw new Error(
        `Failed to get token details for ${tokenAddress}: ${
          nameResult?.status === "failure" ? nameResult.error : ""
        } ${symbolResult?.status === "failure" ? symbolResult.error : ""} ${
          decimalsResult?.status === "failure" ? decimalsResult.error : ""
        }`,
      );
    }

    return {
      address: tokenAddress,
      name: nameResult.result as string,
      symbol: symbolResult.result as string,
      decimals: decimalsResult.result as number,
      lpPrice: 0,
    };
  });
};

export const getStrategyInfo = async (strategyAddress: Address) => {
  const calls: StrategyCall<"lastHarvest" | "depositFee" | "withdrawFee">[] = [
    {
      abi: strategy_abi,
      address: strategyAddress,
      functionName: "lastHarvest",
    },
    {
      abi: strategy_abi,
      address: strategyAddress,
      functionName: "depositFee",
    },
    {
      abi: strategy_abi,
      address: strategyAddress,
      functionName: "withdrawFee",
    },
  ];

  const result = await rpcViemClient.multicall({
    contracts: calls,
  });

  return {
    lastHarvest:
      result[0]?.status === "success" ? (result[0].result as bigint) : null,
    depositFee:
      result[1]?.status === "success" ? (result[1].result as bigint) : null,
    withdrawFee:
      result[2]?.status === "success" ? (result[2].result as bigint) : null,
  };
};
