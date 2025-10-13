import "server-only";
// import { env } from "~/env";
// Don't let client use viem client
// Make all rpc calls on backend
import { createPublicClient, http } from "viem";
import { arbitrum } from "viem/chains";

const viemClient = createPublicClient({
  chain: arbitrum,
  transport: http(),
});

export const rpcViemClient = {
  simulateContract: viemClient.simulateContract,
  readContract: viemClient.readContract,
  multicall: viemClient.multicall,
  getBalance: viemClient.getBalance,
  getBlock: viemClient.getBlock,
};
