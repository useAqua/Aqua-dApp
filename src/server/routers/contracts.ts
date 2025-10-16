import { createTRPCRouter, publicProcedure } from "~/server/trpc";

/**
 * Example router showing how to use contract addresses from context
 */
export const contractsRouter = createTRPCRouter({
  /**
   * Get all contract configs from the registry
   */
  getConfigs: publicProcedure.query(({ ctx }) => {
    return ctx.vaultConfigs;
  }),
});
