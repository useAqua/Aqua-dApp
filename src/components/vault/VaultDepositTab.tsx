import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { HelpCircle } from "lucide-react";
import { SecondaryCard } from "~/components/common/SecondaryCard";
import type { EnrichedVaultInfo, TokenType } from "~/types";
import { formatFeePercentage } from "~/utils/vaultHelpers";
import { WriteButtonWithAllowance } from "~/components/ui/write-button-with-allowance";
import vault_abi from "~/lib/contracts/vault_abi";
import { type Address, formatUnits, parseUnits } from "viem";
import { useMemo, useState } from "react";
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

const PERCENTAGE_PRESETS = [0.25, 0.5, 0.75, 1] as const;

interface VaultDepositTabProps {
  vault: EnrichedVaultInfo;
  selectedTokenBalance: bigint | undefined;
  selectedTokenBalanceReactNode: string;
  selectedTokenAddress: Address;
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
  selectedToken,
}: VaultDepositTabProps) => {
  const [amount, setAmount] = useState("");

  const { refreshVaultData } = useVaultRefresh();

  const formattedLpTokenBalance = useMemo(() => {
    if (!selectedTokenBalance) return 0;
    return Number(formatUnits(selectedTokenBalance, selectedTokenDecimals));
  }, [selectedTokenBalance, selectedTokenDecimals]);

  const selectedTokenSymbol = useMemo(() => {
    if (selectedToken === "token0") return vault.tokens.token0.symbol;
    if (selectedToken === "token1") return vault.tokens.token1.symbol;
    return `${vault.tokens.token0.symbol}/${vault.tokens.token1.symbol}`;
  }, [selectedToken, vault.tokens.token0.symbol, vault.tokens.token1.symbol]);

  const calculateAmountByPercentage = (percentage: number) => {
    if (!selectedTokenBalance) return "0";
    return formatUnits(
      (selectedTokenBalance * BigInt(Math.round(percentage * 100))) /
        BigInt(100),
      selectedTokenDecimals,
    );
  };

  const disableConditions = useMemo(() => {
    const conditions = [];
    if (!amount || parseFloat(amount) === 0) {
      conditions.push({
        condition: true,
        message: "Enter an amount to deposit",
      });
    } else if (parseFloat(amount) > formattedLpTokenBalance) {
      conditions.push({
        condition: true,
        message: `Insufficient ${selectedTokenSymbol} balance`,
        showLink: true,
      });
    }

    return conditions;
  }, [amount, formattedLpTokenBalance, selectedTokenSymbol]);

  const handleDeposited = async () => {
    setAmount("");
    await refreshVaultData();
  };

  const depositedAmount = useMemo(() => {
    const value = Number(amount || 0);
    // Simple formatting for toast messages
    if (value === 0) return "0";
    if (value < 0.001) return value.toExponential(2);
    if (value < 1) return value.toFixed(4);
    if (value < 1000) return value.toFixed(3);
    return value.toLocaleString("en-US", { maximumFractionDigits: 2 });
  }, [amount]);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex flex-wrap items-center justify-between">
          <p className="text-card-foreground/70 mb-2 text-sm">
            💰 Enter Amount
          </p>
          <p className="text-card-foreground/70 mb-2 text-sm max-sm:hidden">
            Balance: {selectedTokenBalanceReactNode} {selectedTokenSymbol}
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
        <Select
          value={selectedToken}
          onValueChange={(value) =>
            setSelectedToken(value as "lp" | "token0" | "token1")
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
          {formatNumber(Number(amount || 0) / vault.sharePrice)}
        </p>
        <p className="text-secondary-foreground/80 mt-1 text-xs">
          ${formatNumber(Number(amount) * vault.tokens.lpToken.price) ?? "0"}
        </p>
        <div className="border-secondary-foreground/20 mt-3 border-t pt-3">
          <p className="text-secondary-foreground/80 text-xs">
            {selectedTokenSymbol}
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
          address={vault.address}
          abi={vault_abi}
          functionName="deposit"
          args={[parseUnits(amount || "0", selectedTokenDecimals)]}
          tokenAddress={selectedTokenAddress}
          tokenDecimals={selectedTokenDecimals}
          tokenSymbol={selectedTokenSymbol}
          disableConditions={disableConditions}
          spenderAddress={vault.address}
          requiredAmount={amount || "0"}
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
