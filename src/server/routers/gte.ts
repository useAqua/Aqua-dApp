import { createTRPCRouter, publicProcedure } from "~/server/trpc";
import { getAddress } from "viem";
import { addressSchema } from "~/env";
import { MOCK_APY_DATA, MOCK_VAULT_DETAIL } from "~/lib/mockData";

export const gteRouter = createTRPCRouter({
  getMarketAPYs: publicProcedure.query(async () => {
    // Build a map from vault address to APY data
    const vaultToApyMap: Record<string, { apy: number; apr: number }> = {};

    // Map apy data for all vaults in mock data

    const vaultDetailsEntries = Object.entries(MOCK_VAULT_DETAIL);

    for (const [, vaultDetail] of vaultDetailsEntries) {
      const address = (vaultDetail as { address: string }).address;

      const apyData = MOCK_APY_DATA[address];
      if (apyData) {
        vaultToApyMap[address] = apyData;
      }
    }

    return vaultToApyMap;
  }),

  getSingleMarketAPY: publicProcedure
    .input(addressSchema)
    .query(async ({ input }) => {
      const vaultAddress = getAddress(input);

      const apyData = MOCK_APY_DATA[vaultAddress as keyof typeof MOCK_APY_DATA];

      if (apyData) {
        return apyData;
      }

      return { apy: 0, apr: 0 };
    }),
});
