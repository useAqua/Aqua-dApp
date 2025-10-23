import { useMemo } from "react";
import { useAccount, useCapabilities } from "wagmi";
import { type Address, type Abi, erc20Abi } from "viem";

interface UseEIP7702BatchParams {
  needsApproval: boolean;
  tokenAddress: Address;
  spenderAddress: Address;
  approvalAmount: bigint;
  mainContract: {
    address: Address;
    abi: Abi;
    functionName: string;
    args: readonly unknown[];
  };
}

export const useEIP7702Batch = ({
  needsApproval,
  tokenAddress,
  spenderAddress,
  approvalAmount,
  mainContract,
}: UseEIP7702BatchParams) => {
  const { address: userAddress, chainId } = useAccount();

  // Check if wallet supports batching
  const { data: capabilities } = useCapabilities({
    account: userAddress,
  });

  const supportsBatching = useMemo(() => {
    if (!capabilities || !chainId) return false;
    return capabilities[chainId]?.atomic?.status === "supported";
  }, [capabilities, chainId]);

  // Prepare batched contracts if approval is needed and batching is supported
  const batchedContracts = useMemo(() => {
    if (!needsApproval || !supportsBatching) return undefined;

    return [
      {
        address: tokenAddress,
        abi: erc20Abi,
        functionName: "approve",
        args: [spenderAddress, approvalAmount],
      },
      {
        address: mainContract.address,
        abi: mainContract.abi,
        functionName: mainContract.functionName,
        args: mainContract.args,
      },
    ] as const;
  }, [
    needsApproval,
    supportsBatching,
    tokenAddress,
    spenderAddress,
    approvalAmount,
    mainContract.address,
    mainContract.abi,
    mainContract.functionName,
    mainContract.args,
  ]);

  const shouldBatch = needsApproval && supportsBatching && !!batchedContracts;

  return {
    supportsBatching,
    shouldBatch,
    batchedContracts,
  };
};
