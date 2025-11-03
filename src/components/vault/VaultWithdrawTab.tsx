import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { HelpCircle } from "lucide-react";
import { SecondaryCard } from "~/components/common/SecondaryCard";
import type { EnrichedVaultInfo, TokenType } from "~/types";
import { formatFeePercentage } from "~/utils/vaultHelpers";
import vault_abi from "~/lib/contracts/vault_abi";
import { formatUnits, parseUnits } from "viem";
import { useCallback, useMemo, useState } from "react";
import { useAccount } from "wagmi";
import { formatNumber, enforceOnlyNumbers } from "~/utils/numbers";
import { useVaultRefresh } from "~/hooks/use-vault-refresh";
import VaultIcon from "~/components/vault/VaultIcon";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { TokenIcon } from "~/utils/tokenIcons";
import gteZap from "~/lib/contracts/gteZap";
import { WriteButtonWithAllowance } from "~/components/ui/write-button-with-allowance";

const PERCENTAGE_PRESETS = [0.25, 0.5, 0.75, 1] as const;
const PERCENTAGE_MULTIPLIER = BigInt(100);
const SLIPPAGE_TOLERANCE = BigInt(98);
const SLIPPAGE_DENOMINATOR = BigInt(100);

type DisableCondition = {
  condition: boolean;
  message: string;
};

interface VaultWithdrawTabProps {
  vault: EnrichedVaultInfo;
  vaultBalance: bigint | undefined;
  vaultBalanceReactNode: string;
}

const VaultWithdrawTab = ({
  vault,
  vaultBalance,
  vaultBalanceReactNode,
}: VaultWithdrawTabProps) => {
  const [amount, setAmount] = useState("");
  const [selectedToken, setSelectedToken] = useState<TokenType>("lp");
  const { address: userAddress } = useAccount();
  const { refreshVaultData } = useVaultRefresh();

  const formattedVaultBalance = useMemo(() => {
    if (!vaultBalance) return 0;
    return Number(formatUnits(vaultBalance, vault.tokens.lpToken.decimals));
  }, [vaultBalance, vault.tokens.lpToken.decimals]);

  const lpTokenSymbol = useMemo(
    () => `${vault.tokens.token0.symbol}/${vault.tokens.token1.symbol}`,
    [vault.tokens.token0.symbol, vault.tokens.token1.symbol],
  );

  const { withdrawTokenSymbol, withdrawTokenAddress } = useMemo(() => {
    if (selectedToken === "token0") {
      return {
        withdrawTokenSymbol: vault.tokens.token0.symbol,
        withdrawTokenAddress: vault.tokens.token0.address,
      };
    }
    if (selectedToken === "token1") {
      return {
        withdrawTokenSymbol: vault.tokens.token1.symbol,
        withdrawTokenAddress: vault.tokens.token1.address,
      };
    }
    if (selectedToken === "both") {
      return {
        withdrawTokenSymbol: `${vault.tokens.token0.symbol} and ${vault.tokens.token1.symbol}`,
        withdrawTokenAddress: vault.tokens.lpToken.address, // Use LP address for "both"
      };
    }
    return {
      withdrawTokenSymbol: lpTokenSymbol,
      withdrawTokenAddress: vault.tokens.lpToken.address,
    };
  }, [selectedToken, vault.tokens, lpTokenSymbol]);

  const disableConditions = useMemo((): DisableCondition[] => {
    if (!userAddress) {
      return [
        {
          condition: true,
          message: "Connect wallet to withdraw",
        },
      ];
    }

    const amountValue = parseFloat(amount);
    if (!amount || amountValue === 0) {
      return [
        {
          condition: true,
          message: "Enter an amount to withdraw",
        },
      ];
    }

    if (amountValue > formattedVaultBalance) {
      return [
        {
          condition: true,
          message: `Insufficient vault balance`,
        },
      ];
    }

    return [];
  }, [amount, formattedVaultBalance, userAddress]);

  const calculateAmountByPercentage = useCallback(
    (percentage: number) => {
      if (!vaultBalance) return "0";
      const percentageBigInt = BigInt(Math.round(percentage * 100));
      return formatUnits(
        (vaultBalance * percentageBigInt) / PERCENTAGE_MULTIPLIER,
        vault.tokens.lpToken.decimals,
      );
    },
    [vaultBalance, vault.tokens.lpToken.decimals],
  );

  const contractArgs = useMemo(() => {
    const withdrawAmountBigInt = parseUnits(
      amount || "0",
      vault.tokens.lpToken.decimals,
    );

    if (selectedToken === "lp") {
      // Direct vault withdrawal - returns LP tokens
      return {
        address: vault.address,
        abi: vault_abi,
        functionName: "withdraw",
        args: [withdrawAmountBigInt],
      } as const;
    }

    // Zap withdrawal based on selected token
    if (selectedToken === "token0" || selectedToken === "token1") {
      const sharePrice = parseUnits(vault.sharePrice, 18);
      const lpTokenPrice = parseUnits(vault.tokens.lpToken.price, 18);
      const targetTokenPrice = parseUnits(
        selectedToken === "token0"
          ? vault.tokens.token0.price
          : vault.tokens.token1.price,
        18,
      );
      const targetTokenDecimals =
        selectedToken === "token0"
          ? vault.tokens.token0.decimals
          : vault.tokens.token1.decimals;

      const lpTokenAmount =
        (withdrawAmountBigInt * sharePrice) /
        BigInt(10 ** vault.tokens.lpToken.decimals);

      const lpValueUsd = (lpTokenAmount * lpTokenPrice) / BigInt(10 ** 18);

      const targetTokenAmount =
        (lpValueUsd * BigInt(10 ** targetTokenDecimals)) / targetTokenPrice;

      const minAmountOut =
        (targetTokenAmount * SLIPPAGE_TOLERANCE) / SLIPPAGE_DENOMINATOR;

      return {
        ...gteZap,
        functionName: "aquaOutAndSwap",
        args: [
          vault.address,
          withdrawAmountBigInt,
          withdrawTokenAddress,
          minAmountOut,
        ],
      } as const;
    }

    return {
      ...gteZap,
      functionName: "aquaOut",
      args: [vault.address, withdrawAmountBigInt],
    } as const;
  }, [amount, selectedToken, vault, withdrawTokenAddress]);

  const handleWithdrawal = useCallback(async () => {
    setAmount("");
    await refreshVaultData();
  }, [refreshVaultData]);

  const calculatedWithdrawAmount = useMemo(() => {
    const amountValue = Number(amount || 0);

    if (amountValue === 0) return 0;

    const sharePrice = parseFloat(vault.sharePrice);
    const lpTokenPrice = parseFloat(vault.tokens.lpToken.price);
    const token0Price = parseFloat(vault.tokens.token0.price);
    const token1Price = parseFloat(vault.tokens.token1.price);

    const lpTokenAmount = amountValue * sharePrice;

    if (selectedToken === "lp") {
      return lpTokenAmount;
    } else if (selectedToken === "token0") {
      const lpValueUsd = lpTokenAmount * lpTokenPrice;
      return lpValueUsd / token0Price;
    } else if (selectedToken === "token1") {
      const lpValueUsd = lpTokenAmount * lpTokenPrice;
      return lpValueUsd / token1Price;
    } else if (selectedToken === "both") {
      return lpTokenAmount;
    }

    return lpTokenAmount;
  }, [
    amount,
    selectedToken,
    vault.sharePrice,
    vault.tokens.token0.price,
    vault.tokens.token1.price,
    vault.tokens.lpToken.price,
  ]);

  const token0WithdrawAmount = useMemo(() => {
    if (selectedToken !== "both") return 0;

    const amountValue = Number(amount || 0);
    if (amountValue === 0) return 0;

    const sharePrice = parseFloat(vault.sharePrice);
    const lpTokenPrice = parseFloat(vault.tokens.lpToken.price);
    const token0Price = parseFloat(vault.tokens.token0.price);

    const lpTokenAmount = amountValue * sharePrice;
    const lpValueUsd = lpTokenAmount * lpTokenPrice;

    const halfValueUsd = lpValueUsd / 2;
    return halfValueUsd / token0Price;
  }, [
    amount,
    selectedToken,
    vault.sharePrice,
    vault.tokens.lpToken.price,
    vault.tokens.token0.price,
  ]);

  const token1WithdrawAmount = useMemo(() => {
    if (selectedToken !== "both") return 0;

    const amountValue = Number(amount || 0);
    if (amountValue === 0) return 0;

    const sharePrice = parseFloat(vault.sharePrice);
    const lpTokenPrice = parseFloat(vault.tokens.lpToken.price);
    const token1Price = parseFloat(vault.tokens.token1.price);

    const lpTokenAmount = amountValue * sharePrice;
    const lpValueUsd = lpTokenAmount * lpTokenPrice;

    const halfValueUsd = lpValueUsd / 2;
    return halfValueUsd / token1Price;
  }, [
    amount,
    selectedToken,
    vault.sharePrice,
    vault.tokens.lpToken.price,
    vault.tokens.token1.price,
  ]);

  const withdrawValueUsd = useMemo(() => {
    const amountValue = Number(amount || 0);

    if (amountValue === 0) return 0;

    const sharePrice = parseFloat(vault.sharePrice);
    const lpTokenPrice = parseFloat(vault.tokens.lpToken.price);

    const lpTokenAmount = amountValue * sharePrice;

    return lpTokenAmount * lpTokenPrice;
  }, [amount, vault.sharePrice, vault.tokens.lpToken.price]);

  const formatWithdrawAmount = useCallback((value: number) => {
    if (value === 0) return "0";
    if (value < 0.001) return value.toExponential(2);
    if (value < 1) return value.toFixed(4);
    if (value < 1000) return value.toFixed(3);
    return value.toLocaleString("en-US", {
      maximumFractionDigits: 2,
    });
  }, []);

  const withdrawnAmount = useMemo(() => {
    return formatWithdrawAmount(calculatedWithdrawAmount);
  }, [calculatedWithdrawAmount, formatWithdrawAmount]);

  const formattedToken0Amount = useMemo(() => {
    return formatWithdrawAmount(token0WithdrawAmount);
  }, [token0WithdrawAmount, formatWithdrawAmount]);

  const formattedToken1Amount = useMemo(() => {
    return formatWithdrawAmount(token1WithdrawAmount);
  }, [token1WithdrawAmount, formatWithdrawAmount]);

  const successMessage = useMemo(() => {
    if (selectedToken === "both") {
      return `Withdraw Completed|Withdrawn ${formattedToken0Amount} ${vault.tokens.token0.symbol} and ${formattedToken1Amount} ${vault.tokens.token1.symbol}.`;
    }
    return `Withdraw Completed|Withdrawn ${withdrawnAmount} ${withdrawTokenSymbol}.`;
  }, [
    selectedToken,
    formattedToken0Amount,
    formattedToken1Amount,
    vault.tokens.token0.symbol,
    vault.tokens.token1.symbol,
    withdrawnAmount,
    withdrawTokenSymbol,
  ]);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex flex-wrap items-center justify-between">
          <p className="text-card-foreground/70 mb-2 text-sm">
            💰 Enter Amount
          </p>
          <p className="text-card-foreground/70 mb-2 text-sm max-sm:hidden">
            Share Balance: {vaultBalanceReactNode} a{lpTokenSymbol}
          </p>
        </div>

        <Input
          type="number"
          placeholder="0"
          className="mb-2 text-lg"
          variant="secondary"
          value={amount}
          onChange={(e) => setAmount(enforceOnlyNumbers(e.target.value))}
          disabled={!userAddress}
        />
        <Select
          value={selectedToken}
          onValueChange={(value) => setSelectedToken(value as TokenType)}
          disabled={!userAddress}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="lp">
              <div className="flex items-center gap-2">
                <VaultIcon vaultName={vault.name} size="sm" />
                <span>
                  {vault.tokens.token0.symbol}/{vault.tokens.token1.symbol} LP
                </span>
              </div>
            </SelectItem>
            <SelectItem value="token0">
              <div className="flex items-center gap-2">
                <TokenIcon
                  symbol={vault.tokens.token0.symbol ?? "Token0"}
                  size={24}
                />
                <span>{vault.tokens.token0.symbol}</span>
              </div>
            </SelectItem>
            <SelectItem value="token1">
              <div className="flex items-center gap-2">
                <TokenIcon
                  symbol={vault.tokens.token1.symbol ?? "Token1"}
                  size={24}
                />
                <span>{vault.tokens.token1.symbol}</span>
              </div>
            </SelectItem>
            <SelectItem value={"both"}>
              <div className="flex items-center gap-2">
                <TokenIcon
                  symbol={vault.tokens.token0.symbol ?? "Token0"}
                  size={24}
                />
                <span>{vault.tokens.token0.symbol}</span>
                <span>and</span>
                <TokenIcon
                  symbol={vault.tokens.token1.symbol ?? "Token1"}
                  size={24}
                />
                <span>{vault.tokens.token1.symbol}</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <p className="text-card-foreground/70 mb-2 text-sm sm:hidden">
          Share Balance: {vaultBalanceReactNode} a{lpTokenSymbol}
        </p>
        <div className="flex gap-2">
          {PERCENTAGE_PRESETS.map((percentage) => (
            <Button
              key={percentage}
              variant="secondary"
              size="sm"
              className="flex-1"
              onClick={() => setAmount(calculateAmountByPercentage(percentage))}
              disabled={!userAddress}
            >
              {percentage * 100}%
            </Button>
          ))}
        </div>
      </div>
      <SecondaryCard className="p-4">
        <p className="mb-2 text-sm">You receive</p>
        {selectedToken === "both" ? (
          <>
            <div className="mb-2">
              <p className="text-lg font-bold">
                {formatNumber(token0WithdrawAmount)}{" "}
                {vault.tokens.token0.symbol}
              </p>
              <p className="text-lg font-bold">
                {formatNumber(token1WithdrawAmount)}{" "}
                {vault.tokens.token1.symbol}
              </p>
            </div>
          </>
        ) : (
          <p className="mb-1 text-2xl font-bold">
            {formatNumber(calculatedWithdrawAmount)}
          </p>
        )}
        <p className="text-secondary-foreground/80 mt-1 text-xs">
          ${formatNumber(withdrawValueUsd) ?? "0"}
        </p>
        <div className="border-secondary-foreground/20 mt-3 border-t pt-3">
          <p className="text-secondary-foreground/80 text-xs">
            {withdrawTokenSymbol}
          </p>
        </div>
      </SecondaryCard>

      <div className="relative pt-5">
        <p className="absolute top-0 left-0 text-xs text-red-500">
          {disableConditions.map(
            (cond) => cond.condition && cond.message + " ",
          )}
        </p>

        <WriteButtonWithAllowance
          {...contractArgs}
          tokenAddress={vault.address}
          tokenDecimals={vault.tokens.lpToken.decimals}
          tokenSymbol={vault.tokens.lpToken.symbol}
          spenderAddress={
            contractArgs.address === gteZap.address
              ? gteZap.address
              : vault.address
          }
          requiredAmount={selectedToken === "lp" ? "0" : amount || "0"}
          disableConditions={disableConditions}
          toastMessages={{
            submitting: `Withdrawing ${withdrawTokenSymbol}...`,
            success: successMessage,
            error: `Failed to withdraw ${withdrawTokenSymbol}.`,
            mining: `Withdrawing ${withdrawTokenSymbol}...`,
          }}
          className="w-full"
          onSuccess={handleWithdrawal}
        >
          Withdraw
        </WriteButtonWithAllowance>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-card-foreground/70 flex items-center gap-1">
            WITHDRAWAL FEE <HelpCircle className="h-3 w-3" />
          </span>
          <span className="text-card-foreground">
            {formatFeePercentage(vault.strategy.withdrawFee)}
          </span>
        </div>
      </div>

      <p className="text-card-foreground/70 text-xs">
        The displayed APY accounts for performance fee ⓘ that is deducted from
        the generated yield only
      </p>
    </div>
  );
};

export default VaultWithdrawTab;
