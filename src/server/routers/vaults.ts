import { createTRPCRouter, publicProcedure } from "~/server/trpc";
import type { VaultTableEntry, VaultDetailInfo } from "~/types";
import { z } from "zod";
import { addressSchema } from "~/env";
import { invalidateUnifiedCache } from "~/lib/trpcContext/unifiedCache";
import {
  MOCK_VAULT_TABLE,
  MOCK_USER_VAULT_DATA,
  MOCK_VAULT_DETAIL,
} from "~/lib/mockData";

export const vaultsRouter = createTRPCRouter({
  getVaultTable: publicProcedure.query(async (): Promise<VaultTableEntry[]> => {
    // Return mock vault table data
    return MOCK_VAULT_TABLE;
  }),

  getTotalVaults: publicProcedure.query(() => {
    return MOCK_VAULT_TABLE.length;
  }),

  getUserVaultData: publicProcedure
    .input(
      z.object({
        user: addressSchema,
      }),
    )
    .query(async () => {
      // Return mock user vault data
      return MOCK_USER_VAULT_DATA as Record<
        string,
        {
          balance: string;
          balanceUsd: string;
          points: bigint;
          vaultBalance: string;
          vaultBalanceUsd: string;
        }
      >;
    }),

  getSingleVaultInfo: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ input }): Promise<VaultDetailInfo | undefined> => {
      // Find vault by id in mock data
      for (const vault of Object.values(MOCK_VAULT_DETAIL)) {
        if (vault.id === input.id) {
          return vault;
        }
      }
      return undefined;
    }),

  invalidateCache: publicProcedure.mutation(() => {
    invalidateUnifiedCache();
    return { success: true };
  }),
});
