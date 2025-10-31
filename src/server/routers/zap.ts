import { createTRPCRouter, publicProcedure } from "~/server/trpc";
import { z } from "zod";
import { addressSchema } from "~/env";
import { rpcViemClient } from "~/lib/viemClient";
import gteZap from "~/lib/contracts/gteZap";
import { getAddress } from "viem";

// function estimateSwap(address aquaVault, address tokenIn, uint256 fullInvestmentIn)  public  view  returns (uint256 swapAmountIn, uint256 swapAmountOut, address swapTokenOut)

export const zapRouter = createTRPCRouter({
  estimateSwap: publicProcedure
    .input(
      z.object({
        vaultAddress: addressSchema,
        tokenInAddress: addressSchema,
        amountIn: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const [, swapAmountOut] = await rpcViemClient.readContract({
        ...gteZap,
        functionName: "estimateSwap",
        args: [
          getAddress(input.vaultAddress),
          getAddress(input.tokenInAddress),
          BigInt(input.amountIn),
        ],
      });

      return swapAmountOut.toString();
    }),
});
