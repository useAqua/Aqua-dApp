import { createTRPCRouter, publicProcedure } from "~/server/trpc";
import { z } from "zod";
import { rpcViemClient } from "~/lib/viemClient";
import { erc20Abi, getAddress, zeroAddress } from "viem";

export const contractsRouter = createTRPCRouter({
  getConfigs: publicProcedure.query(({ ctx }) => {
    return ctx.vaultConfigs;
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
});
