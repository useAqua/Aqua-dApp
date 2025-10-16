import { createTRPCRouter, publicProcedure } from "~/server/trpc";
import type { Address } from "viem";
import type { VaultTableEntry } from "~/types";

/**
 * Example router showing how to use contract addresses from context
 */
export const vaultsRouter = createTRPCRouter({
  /**
   * Get all contract configs from the registry
   */
  getVaultTable: publicProcedure.query(({ ctx }): VaultTableEntry[] => {
    const vaultAddresses = Array.from(ctx.vaultConfigs.keys());

    const data: VaultTableEntry[] = [];

    vaultAddresses.forEach((address: Address) => {
      const config = ctx.vaultConfigs.get(address);
      if (config && !config.isPaused) {
        const [platformId, long, short] = config.name.split("-");
        data.push({
          address,
          name: `${long}/${short}`,
          tvlUsd: ctx.vaultTVL.get(address)?.usdValue ?? 0,
          walletBalanceUsd: 0,
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
