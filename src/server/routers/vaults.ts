import { createTRPCRouter, publicProcedure } from "~/server/trpc";
import { type Address, getAddress } from "viem";
import type { VaultTableEntry, VaultDetailInfo } from "~/types";
import { z } from "zod";
import { addressSchema } from "~/env";
import {
  getUserLPWalletBalances,
  getTokenDetails,
  getStrategyInfo,
} from "~/server/helpers/vaults";

export const vaultsRouter = createTRPCRouter({
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
            id: config.name.toLowerCase(),
            icon: config.icon,
          });
        }
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

      const [tokenDetails, strategyInfo] = await Promise.all([
        getTokenDetails([
          vaultConfig.token0,
          vaultConfig.token1,
          vaultConfig.lpToken,
        ]),
        getStrategyInfo(vaultConfig.strategy),
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
        tokens: {
          token0,
          token1,
          lpToken: {
            ...lpToken,
            lpPrice: tvlData.lpPrice,
          },
        },
      };
    }),
});
