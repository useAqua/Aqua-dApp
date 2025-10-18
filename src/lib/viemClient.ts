import "server-only";
// Don't let client use viem client
// Make all rpc calls on backend
import { createPublicClient, http } from "viem";
import chainToUse from "~/lib/chainToUse";

const viemClient = createPublicClient({
  chain: chainToUse,
  transport: http(),
});

export const rpcViemClient = {
  simulateContract: viemClient.simulateContract,
  readContract: viemClient.readContract,
  multicall: viemClient.multicall,
  getBalance: viemClient.getBalance,
  getBlock: viemClient.getBlock,
};
