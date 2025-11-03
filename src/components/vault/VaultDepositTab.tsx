import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Switch } from "~/components/ui/switch";
import { HelpCircle } from "lucide-react";
import { SecondaryCard } from "~/components/common/SecondaryCard";
import type { EnrichedVaultInfo, TokenType } from "~/types";
import { formatFeePercentage } from "~/utils/vaultHelpers";
import { WriteButtonWithAllowance } from "~/components/ui/write-button-with-allowance";
import vault_abi from "~/lib/contracts/vault_abi";
import { type Address, formatEther, formatUnits, parseUnits } from "viem";
import { useCallback, useEffect, useMemo, useState } from "react";
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
import { api } from "~/utils/api";
import gteZap from "~/lib/contracts/gteZap";
import { useBalance } from "wagmi";

const PERCENTAGE_PRESETS = [0.25, 0.5, 0.75, 1] as const;
const SLIPPAGE_TOLERANCE = BigInt(98);
const SLIPPAGE_DENOMINATOR = BigInt(100);
const PERCENTAGE_MULTIPLIER = BigInt(100);

type DisableCondition = {
  condition: boolean;
  message: string;
  showLink?: boolean;
};

interface VaultDepositTabProps {
  vault: EnrichedVaultInfo;
  selectedTokenBalance: bigint | undefined;
  selectedTokenBalanceReactNode: string;
  selectedTokenAddress: Address;
  userAddress: Address | undefined;
  selectedTokenDecimals: number;
  setSelectedToken: (value: TokenType) => void;
  selectedToken: TokenType;
}

const VaultDepositTab = ({
  vault,
  selectedTokenBalance,
  selectedTokenBalanceReactNode,
  selectedTokenDecimals,
  selectedTokenAddress,
  setSelectedToken,
  userAddress,
  selectedToken,
}: VaultDepositTabProps) => {
  const [amount, setAmount] = useState("");
  const [useEth, setUseEth] = useState(false);

  const { data: balanceData, refetch: refetchBalance } = useBalance({
    address: userAddress,
  });

  const { refreshVaultData } = useVaultRefresh();

  const formattedLpTokenBalance = useMemo(() => {
    if (!selectedTokenBalance) return 0;
    return Number(formatUnits(selectedTokenBalance, selectedTokenDecimals));
  }, [selectedTokenBalance, selectedTokenDecimals]);

  const { selectedTokenSymbol, isWeth } = useMemo(() => {
    let symbol: string;
    if (selectedToken === "token0") {
      symbol = vault.tokens.token0.symbol;
    } else if (selectedToken === "token1") {
      symbol = vault.tokens.token1.symbol;
    } else {
      symbol = `${vault.tokens.token0.symbol}/${vault.tokens.token1.symbol}`;
    }

    const isWethToken = symbol.toUpperCase() === "WETH";
    const finalSymbol = isWethToken && useEth ? "ETH" : symbol;

    return { selectedTokenSymbol: finalSymbol, isWeth: isWethToken };
  }, [
    selectedToken,
    vault.tokens.token0.symbol,
    vault.tokens.token1.symbol,
    useEth,
  ]);

  const { data: estimatedSwapAmountOut } = api.zap.estimateSwap.useQuery(
    {
      vaultAddress: vault.address,
      tokenInAddress: selectedTokenAddress,
      amountIn: (
        parseUnits(amount || "0", selectedTokenDecimals) / BigInt(2)
      ).toString(),
    },
    {
      enabled: selectedToken !== "lp" && amount !== "0" && amount !== "",
    },
  );

  const contractArgs = useMemo(() => {
    if (selectedToken === "lp") {
      return {
        address: vault.address,
        abi: vault_abi,
        functionName: "deposit",
        args: [parseUnits(amount || "0", selectedTokenDecimals)],
      } as const;
    }

    const minAmountOut =
      (BigInt(estimatedSwapAmountOut ?? 0) * SLIPPAGE_TOLERANCE) /
      SLIPPAGE_DENOMINATOR;

    return {
      ...gteZap,
      functionName: useEth ? "aquaInETH" : "aquaIn",
      args: useEth
        ? [vault.address, minAmountOut]
        : [
            vault.address,
            minAmountOut,
            selectedTokenAddress,
            parseUnits(amount || "0", selectedTokenDecimals),
          ],
      ethValue: useEth
        ? parseUnits(amount || "0", selectedTokenDecimals)
        : undefined,
    } as const;
  }, [
    amount,
    estimatedSwapAmountOut,
    selectedToken,
    selectedTokenAddress,
    selectedTokenDecimals,
    useEth,
    vault.address,
  ]);

  const calculateAmountByPercentage = useCallback(
    (percentage: number) => {
      const percentageBigInt = BigInt(Math.round(percentage * 100));

      if (isWeth && useEth) {
        if (!balanceData?.value) return "0";
        return formatEther(
          (balanceData.value * percentageBigInt) / PERCENTAGE_MULTIPLIER,
        );
      }
      if (!selectedTokenBalance) return "0";
      return formatUnits(
        (selectedTokenBalance * percentageBigInt) / PERCENTAGE_MULTIPLIER,
        selectedTokenDecimals,
      );
    },
    [
      balanceData?.value,
      isWeth,
      selectedTokenBalance,
      selectedTokenDecimals,
      useEth,
    ],
  );

  const disableConditions = useMemo((): DisableCondition[] => {
    const amountValue = parseFloat(amount);

    if (!amount || amountValue === 0) {
      return [
        {
          condition: true,
          message: "Enter an amount to deposit",
        },
      ];
    }

    const currentBalance = useEth
      ? Number(balanceData?.formatted ?? 0)
      : formattedLpTokenBalance;

    if (amountValue > currentBalance) {
      return [
        {
          condition: true,
          message: `Insufficient ${selectedTokenSymbol} balance`,
          showLink: true,
        },
      ];
    }

    return [];
  }, [
    amount,
    balanceData?.formatted,
    formattedLpTokenBalance,
    selectedTokenSymbol,
    useEth,
  ]);

  const handleDeposited = useCallback(async () => {
    setAmount("");
    await Promise.all([refetchBalance(), refreshVaultData()]);
  }, [refetchBalance, refreshVaultData]);

  const depositedAmount = useMemo(() => {
    const value = Number(amount || 0);
    // Simple formatting for toast messages
    if (value === 0) return "0";
    if (value < 0.001) return value.toExponential(2);
    if (value < 1) return value.toFixed(4);
    if (value < 1000) return value.toFixed(3);
    return value.toLocaleString("en-US", { maximumFractionDigits: 2 });
  }, [amount]);

  useEffect(() => {
    if (!isWeth && useEth) {
      setUseEth(false);
    }
  }, [isWeth, useEth]);

  const calculatedSharesToReceive = useMemo(() => {
    const amountValue = Number(amount || 0);

    if (amountValue === 0) return 0;

    let depositValueUsd: number;

    if (selectedToken === "lp") {
      depositValueUsd = amountValue * vault.tokens.lpToken.price;
    } else if (selectedToken === "token0") {
      depositValueUsd = amountValue * vault.tokens.token0.price;
    } else if (selectedToken === "token1") {
      depositValueUsd = amountValue * vault.tokens.token1.price;
    } else {
      depositValueUsd = amountValue * vault.tokens.lpToken.price;
    }

    // Calculate the equivalent LP token worth
    const lpTokenWorth = depositValueUsd / vault.tokens.lpToken.price;

    // Divide by share price to get the shares
    return lpTokenWorth / vault.sharePrice;
  }, [
    amount,
    selectedToken,
    vault.tokens.token0.price,
    vault.tokens.token1.price,
    vault.tokens.lpToken.price,
    vault.sharePrice,
  ]);

  const depositValueUsd = useMemo(() => {
    const amountValue = Number(amount || 0);

    if (amountValue === 0) return 0;

    if (selectedToken === "lp") {
      return amountValue * vault.tokens.lpToken.price;
    } else if (selectedToken === "token0") {
      return amountValue * vault.tokens.token0.price;
    } else if (selectedToken === "token1") {
      return amountValue * vault.tokens.token1.price;
    } else {
      return amountValue * vault.tokens.lpToken.price;
    }
  }, [
    amount,
    selectedToken,
    vault.tokens.token0.price,
    vault.tokens.token1.price,
    vault.tokens.lpToken.price,
  ]);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex flex-wrap items-center justify-between">
          <p className="text-card-foreground/70 mb-2 text-sm">
            💰 Enter Amount
          </p>
          <p className="text-card-foreground/70 mb-2 text-sm max-sm:hidden">
            Balance:{" "}
            {useEth
              ? formatNumber(balanceData?.formatted ?? "0")
              : selectedTokenBalanceReactNode}{" "}
            {selectedTokenSymbol}
          </p>
        </div>

        <Input
          type="number"
          placeholder="0"
          className="mb-2 text-lg"
          variant="secondary"
          value={amount}
          onChange={(e) => setAmount(enforceOnlyNumbers(e.target.value))}
        />
        <div className="relative">
          <Select
            value={selectedToken}
            onValueChange={(value) =>
              setSelectedToken(value as Exclude<TokenType, "both">)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lp">
                <div className="flex items-center gap-2">
                  <VaultIcon vaultName={vault.name} size="sm" />
                  <span>
                    {vault.tokens.token0.symbol}/{vault.tokens.token1.symbol}
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
            </SelectContent>
          </Select>
          {isWeth && (
            <div
              className="pointer-events-auto absolute top-1/2 right-10 flex -translate-y-1/2 items-center gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="text-card-foreground/70 text-xs">ETH</span>
              <Switch checked={useEth} onCheckedChange={setUseEth} />
            </div>
          )}
        </div>
      </div>
      <div>
        <p className="text-card-foreground/70 mb-2 text-sm sm:hidden">
          Balance: {selectedTokenBalanceReactNode} {selectedTokenSymbol}
        </p>
        <div className="flex gap-2">
          {PERCENTAGE_PRESETS.map((percentage) => (
            <Button
              key={percentage}
              variant="secondary"
              size="sm"
              className="flex-1"
              onClick={() => setAmount(calculateAmountByPercentage(percentage))}
            >
              {percentage * 100}%
            </Button>
          ))}
        </div>
      </div>
      <SecondaryCard className="p-4">
        <p className="mb-2 text-sm">You receive</p>
        <p className="mb-1 text-2xl font-bold">
          ~{formatNumber(calculatedSharesToReceive)}
        </p>
        <p className="text-secondary-foreground/80 mt-1 text-xs">
          ~${formatNumber(depositValueUsd) ?? "0"}
        </p>
        <div className="border-secondary-foreground/20 mt-3 border-t pt-3">
          <p className="text-secondary-foreground/80 text-xs">
            {vault.tokens.token0.symbol}/{vault.tokens.token1.symbol} shares
          </p>
        </div>
      </SecondaryCard>

      <div className="relative pt-5">
        <div className="absolute top-0 left-0 text-xs text-red-500">
          {disableConditions.map((cond, index) => {
            if (!cond.condition) return null;
            if (cond.showLink) {
              return (
                <span key={index}>
                  {cond.message}.{" "}
                  <a
                    href="https://testnet.gte.xyz/earn"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-red-600"
                  >
                    Get more here
                  </a>
                </span>
              );
            }
            return <span key={index}>{cond.message} </span>;
          })}
        </div>

        <WriteButtonWithAllowance
          {...contractArgs}
          tokenAddress={selectedTokenAddress}
          tokenDecimals={selectedTokenDecimals}
          tokenSymbol={selectedTokenSymbol}
          disableConditions={disableConditions}
          spenderAddress={
            selectedToken === "lp" ? vault.address : gteZap.address
          }
          requiredAmount={useEth ? "0" : amount || "0"}
          toastMessages={{
            submitting: `Depositing ${selectedTokenSymbol}...`,
            success: `Deposit Completed|Deposited ${depositedAmount} ${selectedTokenSymbol}.`,
            error: `Failed to deposit ${selectedTokenSymbol}.`,
            mining: `Depositing ${selectedTokenSymbol}...`,
          }}
          className="w-full"
          onSuccess={handleDeposited}
        >
          Deposit
        </WriteButtonWithAllowance>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-card-foreground/70 flex items-center gap-1">
            DEPOSIT FEE <HelpCircle className="h-3 w-3" />
          </span>
          <span className="text-card-foreground">
            {formatFeePercentage(vault.strategy.depositFee)}
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

export default VaultDepositTab;
