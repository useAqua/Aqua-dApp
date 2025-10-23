import {
  type Address,
  type ContractFunctionParameters,
  erc20Abi,
  formatUnits,
} from "viem";
import { rpcViemClient } from "~/lib/viemClient";
import strategy_abi from "~/lib/contracts/strategy_gte_points";
import { type createTRPCContext } from "~/server/trpc";
import vault_abi from "~/lib/contracts/vault_abi";

type ERC20Call<
  T extends
    | "symbol"
    | "name"
    | "allowance"
    | "balanceOf"
    | "decimals"
    | "totalSupply",
> = ContractFunctionParameters<typeof erc20Abi, "view", T>;

type StrategyCall<
  T extends "lastHarvest" | "depositFee" | "withdrawFee" | "getUserPoints",
> = ContractFunctionParameters<typeof strategy_abi, "view", T>;

type VaultCall<T extends "getPricePerFullShare" | "balanceOf"> =
  ContractFunctionParameters<typeof vault_abi, "view", T>;

type UserVaultData = Map<
  Address,
  {
    balance: number;
    balanceUsd: number;
    points: number;
    vaultBalance: number;
    vaultBalanceUsd: number;
  }
>;

export const getUserVaultData = async (
  ctx: Awaited<ReturnType<typeof createTRPCContext>>,
  user?: Address,
): Promise<UserVaultData> => {
  const userVaultData: UserVaultData = new Map();
  if (!user) return userVaultData;

  const entries = Array.from(ctx.vaultTVL.entries());
  const vaultConfigs = Array.from(ctx.vaultConfigs.entries());

  // Create all calls in a single array for one multicall
  const calls = [
    // First add all balance calls
    ...entries.map(
      ([, { lpTokenAddress }]): ERC20Call<"balanceOf"> => ({
        abi: erc20Abi,
        address: lpTokenAddress,
        functionName: "balanceOf",
        args: [user],
      }),
    ),
    // Then add all points calls
    ...vaultConfigs.map(
      ([, config]): StrategyCall<"getUserPoints"> => ({
        abi: strategy_abi,
        address: config.strategy,
        functionName: "getUserPoints",
        args: [user],
      }),
    ),
    // Add vault balance calls
    ...vaultConfigs.map(
      ([address]): VaultCall<"balanceOf"> => ({
        abi: vault_abi,
        address,
        functionName: "balanceOf",
        args: [user],
      }),
    ),
    // Add share price calls
    ...vaultConfigs.map(
      ([address]): VaultCall<"getPricePerFullShare"> => ({
        abi: vault_abi,
        address,
        functionName: "getPricePerFullShare",
      }),
    ),
  ];

  // Execute single multicall
  const results = await rpcViemClient.multicall({ contracts: calls });

  // Extract results: LP balances, points, vault balances, share prices
  const balanceResults = results.slice(0, entries.length);
  const pointsResults = results.slice(entries.length, entries.length * 2);
  const vaultBalanceResults = results.slice(
    entries.length * 2,
    entries.length * 3,
  );
  const sharePriceResults = results.slice(entries.length * 3);

  entries.forEach(([vaultAddress, { decimals, lpPrice }], index) => {
    const balanceResult = balanceResults[index];
    const pointsResult = pointsResults[index];
    const vaultBalanceResult = vaultBalanceResults[index];
    const sharePriceResult = sharePriceResults[index];

    if (!balanceResult || balanceResult?.status === "failure") {
      throw new Error(`Unable to get LP balance: ${balanceResult?.error}`);
    }

    const balance = +formatUnits(balanceResult.result as bigint, decimals);
    const balanceUsd = balance * lpPrice;
    const points =
      pointsResult?.status === "success" ? Number(pointsResult.result) : 0;
    const vaultBalance =
      vaultBalanceResult?.status === "success"
        ? +formatUnits(vaultBalanceResult.result as bigint, decimals)
        : 0;

    // Calculate vaultBalanceUsd using sharePrice
    const sharePrice =
      sharePriceResult?.status === "success"
        ? +formatUnits(sharePriceResult.result as bigint, decimals)
        : 0;
    const vaultBalanceUsd = vaultBalance * sharePrice * lpPrice;

    userVaultData.set(vaultAddress, {
      balance,
      balanceUsd,
      points,
      vaultBalance,
      vaultBalanceUsd,
    });
  });

  return userVaultData;
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

export const getStrategyInfoAndVaultSharePrice = async (
  strategyAddress: Address,
  vaultAddress: Address,
) => {
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

  const vaultSharePriceCall: VaultCall<"getPricePerFullShare"> = {
    abi: vault_abi,
    address: vaultAddress,
    functionName: "getPricePerFullShare",
  };

  const result = await rpcViemClient.multicall({
    contracts: [...calls, vaultSharePriceCall],
  });

  return {
    strategyInfo: {
      lastHarvest:
        result[0]?.status === "success" ? (result[0].result as bigint) : null,
      depositFee:
        result[1]?.status === "success" ? (result[1].result as bigint) : null,
      withdrawFee:
        result[2]?.status === "success" ? (result[2].result as bigint) : null,
    },
    sharePrice:
      result[3]?.status === "success" ? (result[3].result as bigint) : null,
  };
};
