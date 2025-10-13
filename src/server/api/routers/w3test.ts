import { getAddress } from "viem";
import z from "zod";
import { rpcViemClient } from "~/lib/viemClient";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const addressSchema = z.string().startsWith("0x").length(42);

export const w3testRouter = createTRPCRouter({
  balance: publicProcedure.input(addressSchema).query(async ({ input }) => {
    const balance = await rpcViemClient.getBalance({
      address: getAddress(input),
    });
    return balance;
  }),
});
