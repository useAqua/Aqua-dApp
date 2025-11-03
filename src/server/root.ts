import { contractsRouter } from "~/server/routers/contracts";
import { createCallerFactory, createTRPCRouter } from "~/server/trpc";
import { vaultsRouter } from "~/server/routers/vaults";
import { gteRouter } from "~/server/routers/gte";
import { zapRouter } from "~/server/routers/zap";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  contracts: contractsRouter,
  vaults: vaultsRouter,
  gte: gteRouter,
  zap: zapRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
