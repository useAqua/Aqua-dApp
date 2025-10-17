import { createTRPCRouter, publicProcedure } from "~/server/trpc";
import {
  type Address,
  type ContractFunctionParameters,
  erc20Abi,
  formatUnits,
  getAddress,
} from "viem";
import type { VaultTableEntry } from "~/types";
import type { VaultTvls } from "~/types/contracts";
import { rpcViemClient } from "~/lib/viemClient";
import { z } from "zod";
import { addressSchema } from "~/env";

type BalanceCall = ContractFunctionParameters<
  typeof erc20Abi,
  "view",
  "balanceOf"
>;

type UserLPWalletBalances = Map<
  Address,
  {
    balance: number;
    balanceUsd: number;
  }
>;

const getUserLPWalletBalances = async (
  vaultTvl: VaultTvls,
  user?: Address,
): Promise<UserLPWalletBalances> => {
  const walletLpBalance: UserLPWalletBalances = new Map();
  if (!user) return walletLpBalance;
  const entries = Array.from(vaultTvl.entries());
  const calls = entries.map(
    ([, { lpTokenAddress }]): BalanceCall => ({
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

    console.log({
      balanceUsd,
      balance,
    });

    walletLpBalance.set(vaultAddress, {
      balance,
      balanceUsd,
    });
  });

  return walletLpBalance;
};

/**
 * Example router showing how to use contract addresses from context
 */
export const vaultsRouter = createTRPCRouter({
  /**
   * Get all contract configs from the registry
   */
  getVaultTable: publicProcedure
    .input(
      z.object({
        user: addressSchema.optional(),
      }),
    )
    .query(async ({ ctx, input }): Promise<VaultTableEntry[]> => {
      const vaultAddresses = Array.from(ctx.vaultConfigs.keys());
      const userLpWalletBalances = await getUserLPWalletBalances(
        ctx.vaultTVL,
        input.user ? getAddress(input.user) : undefined,
      );

      const data: VaultTableEntry[] = [];

      vaultAddresses.forEach((address: Address) => {
        const config = ctx.vaultConfigs.get(address);
        if (config) {
          const [platformId, long, short] = config.name.split("-");
          data.push({
            address,
            name: `${long}/${short}`,
            tvlUsd: ctx.vaultTVL.get(address)?.usdValue ?? 0,
            walletBalanceUsd:
              userLpWalletBalances.get(address)?.balanceUsd ?? 0,
            userDepositUsd: 0,
            apy: 0,
            platformId: platformId ?? "Unknown",
            id: config.name,
            icon: config.icon,
          });
        }
      });

      return data;
    }),
});
