import React, { useCallback, useEffect, useState } from "react";
import { Button, type ButtonProps } from "./button";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { useSendCalls, useCallsStatus } from "wagmi";
import type { Address, Abi } from "viem";
import { encodeFunctionData } from "viem";
import { toast } from "sonner";

export interface WriteButtonProps extends Omit<ButtonProps, "onClick"> {
  // Contract details (for single transaction)
  address?: Address;
  abi?: Abi;
  functionName?: string;
  args?: readonly unknown[];

  // Batched contracts (for EIP-7702 batching)
  contracts?: readonly {
    address: Address;
    abi: Abi;
    functionName: string;
    args?: readonly unknown[];
  }[];

  // Disable conditions
  disableConditions?: {
    condition: boolean;
    message: string;
  }[];

  // Toast messages
  toastMessages?: {
    pending?: string;
    submitting?: string;
    mining?: string;
    success?: string;
    error?: string;
  };

  // Callbacks
  onRefresh?: () => void;
  onSuccess?: (hash: Address) => void;
  onTxError?: (error: Error) => void;

  // Button text
  children: React.ReactNode;
}

export const WriteButton = React.forwardRef<
  HTMLButtonElement,
  WriteButtonProps
>(
  (
    {
      address,
      abi,
      functionName,
      args = [],
      contracts,
      disableConditions = [],
      toastMessages = {},
      onRefresh,
      onSuccess,
      onTxError,
      children,
      disabled,
      ...buttonProps
    },
    ref,
  ) => {
    const { isConnected } = useAccount();
    const [txHash, setTxHash] = useState<Address | undefined>();
    const [callsId, setCallsId] = useState<string | undefined>();
    const [isMounted, setIsMounted] = useState(false);

    // Prevent hydration mismatch by tracking when component mounts
    useEffect(() => {
      setIsMounted(true);
    }, []);

    const isBatched = !!contracts;

    const {
      writeContract,
      isPending: isWritePending,
      error: writeError,
      reset,
    } = useWriteContract();

    const {
      sendCalls,
      isPending: isSendCallsPending,
      error: sendCallsError,
    } = useSendCalls();

    const { data: callsStatus } = useCallsStatus({
      id: callsId as `0x${string}`,
      query: {
        enabled: !!callsId,
        refetchInterval: (_query) =>
          _query.state.data?.status === "success" ? false : 1000,
      },
    });

    const isPending = isBatched ? isSendCallsPending : isWritePending;
    const txError = isBatched ? sendCallsError : writeError;

    const { isLoading: isTxPending, isSuccess: isTxSuccess } =
      useWaitForTransactionReceipt({
        hash: txHash,
      });

    const isBatchedCallConfirmed = callsStatus?.status === "success";
    const isBatchedCallPending = !!callsId && callsStatus?.status === "pending";

    const isLoading = isBatched
      ? isSendCallsPending || isBatchedCallPending
      : isTxPending;

    const disabledReason = React.useMemo(() => {
      if (!isConnected) {
        return "Connect wallet to continue";
      }

      for (const condition of disableConditions) {
        if (condition.condition) {
          return condition.message;
        }
      }

      return null;
    }, [isConnected, disableConditions]);

    const isDisabled = disabled ?? !!disabledReason ?? isPending ?? isLoading;

    const showSuccessToast = useCallback(() => {
      toast.dismiss("tx-mining");

      const successMsg = toastMessages.success ?? "Transaction successful!";
      if (successMsg.includes("|")) {
        const [title, description] = successMsg.split("|");
        toast.success(title, {
          description: description,
        });
      } else {
        toast.success(successMsg);
      }
    }, [toastMessages.success]);

    useEffect(() => {
      if (isTxSuccess && txHash) {
        showSuccessToast();

        // Call refresh action
        if (onRefresh) {
          onRefresh();
        }

        // Call success callback
        if (onSuccess) {
          onSuccess(txHash);
          reset();
        }

        // Reset tx hash
        setTxHash(undefined);
      }
    }, [isTxSuccess, txHash, showSuccessToast, onRefresh, onSuccess, reset]);

    // Handle batched call success
    useEffect(() => {
      if (isBatchedCallConfirmed && callsId) {
        showSuccessToast();

        // Call refresh action
        if (onRefresh) {
          onRefresh();
        }

        // Call success callback with callsId as hash
        if (onSuccess) {
          onSuccess(callsId as Address);
          reset();
        }

        // Reset calls id
        setCallsId(undefined);
      }
    }, [
      isBatchedCallConfirmed,
      callsId,
      showSuccessToast,
      onRefresh,
      onSuccess,
      reset,
    ]);

    // Handle write error
    useEffect(() => {
      if (txError) {
        toast.dismiss("tx-mining");
        const errorMessage =
          toastMessages.error ?? txError.message ?? "Transaction failed";

        toast.error(errorMessage);

        if (onTxError) {
          onTxError(txError);
        }
      }
    }, [txError, toastMessages.error, onTxError]);

    const handleClick = async () => {
      if (disabledReason) {
        toast.error(disabledReason);
        return;
      }

      try {
        // Show submitting toast
        toast.loading(
          toastMessages.submitting ?? "Please confirm transaction in wallet...",
          {
            id: "tx-submitting",
          },
        );

        // Write to contract(s)
        if (isBatched && contracts) {
          // Batched transaction using EIP-7702
          const calls = contracts.map((contract) => ({
            to: contract.address,
            data: encodeFunctionData({
              abi: contract.abi,
              functionName: contract.functionName,
              args: contract.args,
            }),
            value: BigInt(0),
          }));

          sendCalls(
            {
              calls,
            },
            {
              onSuccess: (data) => {
                // Dismiss submitting toast
                toast.dismiss("tx-submitting");

                // Show mining toast
                toast.loading(
                  toastMessages.mining ??
                    "Transaction submitted, waiting for confirmation...",
                  {
                    id: "tx-mining",
                    duration: Infinity,
                  },
                );

                setCallsId(data.id);
              },
              onError: () => {
                toast.dismiss("tx-submitting");
              },
            },
          );
        } else {
          // Single transaction
          writeContract(
            {
              address: address!,
              abi: abi!,
              functionName: functionName!,
              args,
            },
            {
              onSuccess: (hash) => {
                // Dismiss submitting toast
                toast.dismiss("tx-submitting");

                // Show mining toast
                toast.loading(
                  toastMessages.mining ??
                    "Transaction submitted, waiting for confirmation...",
                  {
                    id: "tx-mining",
                    duration: Infinity,
                  },
                );

                setTxHash(hash);
              },
              onError: () => {
                toast.dismiss("tx-submitting");
              },
            },
          );
        }
      } catch (error) {
        toast.dismiss("tx-submitting");
        toast.dismiss("tx-mining");

        // Error is handled by useEffect above
        console.error("Transaction error:", error);
      }
    };

    // Get button text based on state
    const getButtonText = useCallback(() => {
      if (!isMounted) {
        return children;
      }
      if (!isConnected) {
        return "Connect Wallet";
      }
      if (isPending) {
        return "Confirming...";
      }
      if (isLoading) {
        return "Processing...";
      }
      return children;
    }, [isConnected, isLoading, isMounted, isPending, children]);

    return (
      <Button
        ref={ref}
        disabled={isDisabled}
        onClick={handleClick}
        {...buttonProps}
        size={"sm"}
      >
        {getButtonText()}
      </Button>
    );
  },
);

WriteButton.displayName = "WriteButton";
