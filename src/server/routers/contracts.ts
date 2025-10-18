import { createTRPCRouter, publicProcedure } from "~/server/trpc";

export const contractsRouter = createTRPCRouter({
  getConfigs: publicProcedure.query(({ ctx }) => {
    return ctx.vaultConfigs;
  }),

  getTvls: publicProcedure.query(({ ctx }) => {
    return ctx.vaultTVL;
  }),
});
