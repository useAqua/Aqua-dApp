import { createTRPCRouter, publicProcedure } from "~/server/trpc";
import { z } from "zod";
import { rpcViemClient } from "~/lib/viemClient";
import { erc20Abi, getAddress, zeroAddress } from "viem";
import { getIyoContractServer } from "~/lib/contracts/iyo";

const iyo = getIyoContractServer();
export const contractsRouter = createTRPCRouter({
  // TODO: DEPRECATED FOR IYO
  getConfigs: publicProcedure.query(({ ctx }) => {
    return ctx.vaultConfigs;
  }),

  getNewConfigs: publicProcedure.query(({ ctx }) => {
    return ctx.campaignConfig;
  }),

  getTvls: publicProcedure.query(({ ctx }) => {
    return ctx.vaultTVL;
  }),

  getAllowance: publicProcedure
    .input(
      z.object({
        tokenAddress: z.string(),
        ownerAddress: z.string().optional(),
        spenderAddress: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      const { tokenAddress, ownerAddress, spenderAddress } = input;
      return rpcViemClient.readContract({
        address: getAddress(tokenAddress),
        abi: erc20Abi,
        functionName: "allowance",
        args:
          ownerAddress && spenderAddress
            ? [getAddress(ownerAddress), getAddress(spenderAddress)]
            : [zeroAddress, zeroAddress],
      });
    }),

  getIyo: publicProcedure.query(() => iyo),
});
