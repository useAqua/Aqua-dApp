import { createTRPCRouter, publicProcedure } from "~/server/trpc";
import { z } from "zod";
import type { CampaignInfo } from "~/types/contracts";
import { invalidateUnifiedCache } from "~/lib/trpcContext/unifiedCache";

export const campaignRouter = createTRPCRouter({
  getCampaignTable: publicProcedure.query(async ({ ctx }) =>
    Array.from(ctx.campaignConfig.values()),
  ),

  getSingleCampaign: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({ ctx, input }): Promise<CampaignInfo | undefined> => {
      return ctx.campaignConfig.get(input.id);
    }),

  getTotalCampaigns: publicProcedure.query(({ ctx }) => {
    return ctx.campaignConfig.size;
  }),

  invalidateCache: publicProcedure.mutation(() => {
    invalidateUnifiedCache();
    return { success: true };
  }),
});
