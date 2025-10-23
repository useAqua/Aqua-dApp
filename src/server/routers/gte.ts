import { createTRPCRouter, publicProcedure } from "~/server/trpc";
import { type Address, getAddress } from "viem";
import { addressSchema, env } from "~/env";
import type { GTEMarket } from "~/types/gte";

const GTE_API_URL = env.GTE_API;

const getMarketData = async (address: Address): Promise<GTEMarket> => {
  const markets = await fetch(`${GTE_API_URL}/markets/${address}`);
  if (!markets.ok) {
    throw new Error(
      `Failed to fetch GTE markets: ${markets.status} ${markets.statusText}`,
    );
  }

  return (await markets.json()) as GTEMarket;
};

export const gteRouter = createTRPCRouter({
  getMarketAPYs: publicProcedure.query(async ({ ctx }) => {
    const lpToVaultMap = new Map<Address, Address>();
    const vaultToApyMap: Record<
      Address,
      {
        apy: number;
        apr: number;
      }
    > = {};
    ctx.vaultConfigs.forEach((config, vaultAddress) => {
      lpToVaultMap.set(getAddress(config.lpToken), vaultAddress);
    });

    const marketData = await Promise.all(
      Array.from(lpToVaultMap.keys()).map(getMarketData),
    );

    marketData.forEach((market) => {
      const vaultAddress = lpToVaultMap.get(getAddress(market.address));
      if (vaultAddress) {
        const { volume24HrUsd, tvlUsd } = market;
        const apr = tvlUsd ? (volume24HrUsd * 365 * 0.003) / tvlUsd : 0; // Uni-V2: 0.3% fee
        vaultToApyMap[vaultAddress] = {
          apy: (1 + apr / 365) ** 365 - 1,
          apr,
        };
      }
    });

    return vaultToApyMap;
  }),

  getSingleMarketAPY: publicProcedure
    .input(addressSchema)
    .query(async ({ input }) => {
      const market = await getMarketData(getAddress(input));
      const { volume24HrUsd, tvlUsd } = market;
      const apr = tvlUsd ? (volume24HrUsd * 365 * 0.003) / tvlUsd : 0; // Uni-V2: 0.3% fee
      const apy = (1 + apr / 365) ** 365 - 1;
      return { apy, apr };
    }),
});
