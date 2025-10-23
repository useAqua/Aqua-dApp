import React, {
  useState,
  useEffect,
  useMemo,
  useImperativeHandle,
} from "react";
import { WriteButton, type WriteButtonProps } from "./write-button";
import { useAccount, useReadContract } from "wagmi";
import { type Address, erc20Abi, parseUnits } from "viem";
import { useEIP7702Batch } from "~/hooks/useEIP7702Batch";

export interface WriteButtonWithAllowanceProps extends WriteButtonProps {
  tokenAddress: Address;
  tokenDecimals: number;
  tokenSymbol: string;
  spenderAddress: Address;
  requiredAmount: string;
}

export const WriteButtonWithAllowance = React.forwardRef<
  HTMLButtonElement,
  WriteButtonWithAllowanceProps
>(
  (
    {
      tokenAddress,
      tokenDecimals,
      tokenSymbol,
      spenderAddress,
      requiredAmount,
      disableConditions = [],
      children,
      onRefresh,
      address,
      abi,
      args,
      functionName,
      ...writeButtonProps
    },
    ref,
  ) => {
    const { address: userAddress } = useAccount();
    const [needsApproval, setNeedsApproval] = useState(false);
    const [approvalJustCompleted, setApprovalJustCompleted] = useState(false);
    const buttonRef = React.useRef<HTMLButtonElement>(null);

    // Forward ref to parent
    useImperativeHandle(ref, () => buttonRef.current!);

    const { data: allowance, refetch: refetchAllowance } = useReadContract({
      address: tokenAddress,
      abi: erc20Abi,
      functionName: "allowance",
      args:
        userAddress && spenderAddress
          ? [userAddress, spenderAddress]
          : undefined,
      query: {
        enabled: !!userAddress,
      },
    });

    useEffect(() => {
      if (!requiredAmount || !userAddress) {
        setNeedsApproval(false);
        return;
      }

      try {
        const requiredAmountBigInt = parseUnits(requiredAmount, tokenDecimals);
        const currentAllowance = allowance ?? BigInt(0);
        setNeedsApproval(currentAllowance < requiredAmountBigInt);
      } catch (error) {
        console.error("Error checking allowance:", error);
        setNeedsApproval(false);
      }
    }, [allowance, requiredAmount, tokenDecimals, userAddress]);

    const approvalAmount = useMemo(() => {
      if (!requiredAmount) return BigInt(0);
      try {
        return parseUnits(requiredAmount, tokenDecimals);
      } catch {
        return BigInt(0);
      }
    }, [requiredAmount, tokenDecimals]);

    // Use EIP-7702 batching hook
    const { shouldBatch, batchedContracts } = useEIP7702Batch({
      needsApproval,
      tokenAddress,
      spenderAddress,
      approvalAmount,
      mainContract: {
        address: address!,
        abi: abi!,
        functionName: functionName!,
        args: args!,
      },
    });

    // When approval completes, automatically trigger main action
    useEffect(() => {
      if (approvalJustCompleted && !needsApproval) {
        setApprovalJustCompleted(false);

        setTimeout(() => {
          if (buttonRef.current) {
            buttonRef.current.click();
          }
        }, 100);
      }
    }, [approvalJustCompleted, needsApproval]);

    const props = useMemo(() => {
      // If batching is supported, use batched contracts
      if (shouldBatch && batchedContracts) {
        return {
          ...writeButtonProps,
          contracts: batchedContracts,
          disableConditions,
          toastMessages: {
            submitting: `Confirm ${tokenSymbol} approval & transaction in wallet...`,
            mining: `Processing batched transaction...`,
            success: `Transaction completed successfully!`,
            error: `Transaction failed`,
          },
          onRefresh: () => {
            void refetchAllowance();
            onRefresh?.();
          },
          onSuccess: (hash: Address) => {
            void refetchAllowance();
            onRefresh?.();
            writeButtonProps.onSuccess?.(hash);
          },
        };
      }

      // Fallback flow: approval or main action
      return {
        ...writeButtonProps,
        abi: needsApproval ? erc20Abi : abi,
        address: needsApproval ? tokenAddress : address,
        functionName: needsApproval ? "approve" : functionName,
        args: needsApproval ? [spenderAddress, approvalAmount] : args,
        disableConditions,
        toastMessages: needsApproval
          ? {
              submitting: `Confirm ${tokenSymbol} approval in wallet...`,
              mining: `Approving ${tokenSymbol}...`,
              success: `${tokenSymbol} approved successfully!`,
              error: `Failed to approve ${tokenSymbol}`,
            }
          : writeButtonProps.toastMessages,
        onRefresh: () => {
          if (needsApproval) {
            void refetchAllowance();
          } else {
            onRefresh?.();
          }
        },
        onSuccess: (hash: Address) => {
          if (needsApproval) {
            void refetchAllowance();
            setApprovalJustCompleted(true);
          } else {
            writeButtonProps.onSuccess?.(hash);
          }
        },
      };
    }, [
      shouldBatch,
      batchedContracts,
      abi,
      address,
      approvalAmount,
      args,
      disableConditions,
      functionName,
      needsApproval,
      onRefresh,
      refetchAllowance,
      spenderAddress,
      tokenAddress,
      tokenSymbol,
      writeButtonProps,
    ]);

    return (
      <WriteButton ref={buttonRef} {...props}>
        {shouldBatch ? (
          <>
            Approve {tokenSymbol} & {children} (Batched)
          </>
        ) : needsApproval ? (
          <>
            Approve {tokenSymbol} & {children}
          </>
        ) : (
          children
        )}
      </WriteButton>
    );
  },
);

WriteButtonWithAllowance.displayName = "WriteButtonWithAllowance";
