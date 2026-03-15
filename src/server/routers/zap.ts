import { createTRPCRouter, publicProcedure } from "~/server/trpc";
import { z } from "zod";
import { addressSchema } from "~/env";
import { rpcViemClient } from "~/lib/viemClient";
import gteZap from "~/lib/contracts/gteZap";
import { erc4626Abi, getAddress } from "viem";

// function estimateSwap(address aquaVault, address tokenIn, uint256 fullInvestmentIn)  public  view  returns (uint256 swapAmountIn, uint256 swapAmountOut, address swapTokenOut)

export const zapRouter = createTRPCRouter({
  // TODO: DEPRECATED FOR IYO
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

  previewDeposit: publicProcedure
    .input(
      z.object({
        vaultAddress: addressSchema,
        amountIn: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const amountOut = await rpcViemClient.readContract({
        address: getAddress(input.vaultAddress),
        abi: erc4626Abi,
        functionName: "previewDeposit",
        args: [BigInt(input.amountIn)],
      });

      return amountOut.toString();
    }),

  previewWithdraw: publicProcedure
    .input(
      z.object({
        vaultAddress: addressSchema,
        amountIn: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const amountOut = await rpcViemClient.readContract({
        address: getAddress(input.vaultAddress),
        abi: erc4626Abi,
        functionName: "previewWithdraw",
        args: [BigInt(input.amountIn)],
      });

      return amountOut.toString();
    }),
});
