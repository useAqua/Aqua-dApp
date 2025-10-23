import { createTRPCRouter, publicProcedure } from "~/server/trpc";
import { type Address, formatEther, formatUnits, getAddress } from "viem";
import type { VaultTableEntry, VaultDetailInfo } from "~/types";
import { z } from "zod";
import { addressSchema } from "~/env";
import {
  getUserVaultData,
  getTokenDetails,
  getStrategyInfoAndVaultSharePrice,
} from "~/server/helpers/vaults";
import { invalidateUnifiedCache } from "~/lib/trpcContext/unifiedCache";

export const vaultsRouter = createTRPCRouter({
  getVaultTable: publicProcedure.query(
    async ({ ctx }): Promise<VaultTableEntry[]> => {
      const vaultAddresses = Array.from(ctx.vaultConfigs.keys());

      const data: VaultTableEntry[] = [];

      vaultAddresses.forEach((address: Address) => {
        const config = ctx.vaultConfigs.get(address);
        if (config) {
          const [platformId, long, short] = config.name.split("-");
          data.push({
            address,
            name: `${long}/${short}`,
            tvlUsd: ctx.vaultTVL.get(address)?.usdValue ?? 0,
            walletBalanceUsd: 0,
            userDepositUsd: 0,
            userPoints: 0,
            apy: 0,
            platformId: platformId ?? "Unknown",
            id: config.name.toLowerCase(),
            icon: config.icon,
          });
        }
      });

      return data;
    },
  ),

  getUserVaultData: publicProcedure
    .input(
      z.object({
        user: addressSchema,
      }),
    )
    .query(async ({ ctx, input }) => {
      const userVaultData = await getUserVaultData(ctx, getAddress(input.user));

      // Convert Map to Record for easier client-side usage
      const data: Record<
        string,
        {
          balance: number;
          balanceUsd: number;
          points: number;
          vaultBalance: number;
          vaultBalanceUsd: number;
        }
      > = {};

      userVaultData.forEach((value, key) => {
        data[key] = value;
      });

      return data;
    }),

  getSingleVaultInfo: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }): Promise<VaultDetailInfo | undefined> => {
      const vaultAddress = ctx.vaultNameToAddress.get(input.id);

      if (!vaultAddress) return undefined;

      const vaultConfig = ctx.vaultConfigs.get(vaultAddress);
      const tvlData = ctx.vaultTVL.get(vaultAddress);

      if (!tvlData || !vaultConfig) return undefined;

      const [platformId, long, short] = vaultConfig.name.split("-");

      const [tokenDetails, { strategyInfo, sharePrice }] = await Promise.all([
        getTokenDetails([
          vaultConfig.token0,
          vaultConfig.token1,
          vaultConfig.lpToken,
        ]),
        getStrategyInfoAndVaultSharePrice(vaultConfig.strategy, vaultAddress),
      ]);

      if (tokenDetails.length !== 3) {
        throw new Error(
          `Expected 3 tokens but got ${tokenDetails.length} for vault ${input.id}`,
        );
      }

      const token0 = tokenDetails[0];
      const token1 = tokenDetails[1];
      const lpToken = tokenDetails[2];

      if (!token0 || !token1 || !lpToken) {
        throw new Error(`Missing token details for vault ${input.id}`);
      }

      return {
        name: `${long}/${short}`,
        id: vaultConfig.name.toLowerCase(),
        platformId: platformId ?? "Unknown",
        strategy: {
          ...strategyInfo,
          address: vaultConfig.strategy,
        },
        address: vaultAddress,
        tvlUsd: tvlData.usdValue,
        sharePrice: +formatEther(sharePrice ?? BigInt(0)),
        tokens: {
          token0: {
            ...token0,
            reserve: +formatUnits(tvlData.lpInfo.reserve0, token0.decimals),
            price: +formatEther(tvlData.lpInfo.price0),
          },
          token1: {
            ...token1,
            reserve: +formatUnits(tvlData.lpInfo.reserve1, token1.decimals),
            price: +formatEther(tvlData.lpInfo.price1),
          },
          lpToken: {
            ...lpToken,
            reserve: +formatUnits(tvlData.value, lpToken.decimals),
            price: +formatEther(tvlData.lpInfo.fairValue),
          },
        },
      };
    }),

  invalidateCache: publicProcedure.mutation(() => {
    invalidateUnifiedCache();
    return { success: true };
  }),
});
