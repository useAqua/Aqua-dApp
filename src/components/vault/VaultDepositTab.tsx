import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { HelpCircle } from "lucide-react";
import { SecondaryCard } from "~/components/common/SecondaryCard";
import type { EnrichedVaultInfo } from "~/types";
import { formatFeePercentage } from "~/utils/vaultHelpers";
import { WriteButtonWithAllowance } from "~/components/ui/write-button-with-allowance";
import vault_abi from "~/lib/contracts/vault_abi";
import { formatUnits, parseUnits } from "viem";
import { useMemo, useState } from "react";
import { formatNumber } from "~/utils/numbers";
import { enforceOnlyNumbers } from "~/utils/numbers";
import { useVaultRefresh } from "~/hooks/use-vault-refresh";
import VaultIcon from "~/components/vault/VaultIcon";

interface VaultDepositTabProps {
  vault: EnrichedVaultInfo;
  lpTokenBalance: bigint | undefined;
  lpTokenBalanceReactNode: string;
}

const VaultDepositTab = ({
  vault,
  lpTokenBalance,
  lpTokenBalanceReactNode,
}: VaultDepositTabProps) => {
  const [amount, setAmount] = useState("");
  const { refreshVaultData } = useVaultRefresh();

  const formattedLpTokenBalance = useMemo(() => {
    if (!lpTokenBalance) return 0;
    return Number(formatUnits(lpTokenBalance, vault.tokens.lpToken.decimals));
  }, [lpTokenBalance, vault.tokens.lpToken.decimals]);

  const depositFee = formatFeePercentage(vault.strategy.depositFee);
  const lpTokenSymbol = `${vault.tokens.token0.symbol}/${vault.tokens.token1.symbol}`;

  const calculateAmountByPercentage = (percentage: number) => {
    if (!lpTokenBalance) return "0";
    return formatUnits(
      (lpTokenBalance * BigInt(percentage * 100)) / BigInt(100),
      vault.tokens.lpToken.decimals,
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
        message: `Insufficient ${lpTokenSymbol} balance`,
      });
    }

    return conditions;
  }, [amount, formattedLpTokenBalance, lpTokenSymbol]);

  const handleDeposited = async () => {
    setAmount("");
    await refreshVaultData();
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex flex-wrap items-center justify-between">
          <p className="text-card-foreground/70 mb-2 text-sm">
            💰 Enter Amount
          </p>
          <p className="text-card-foreground/70 mb-2 text-sm max-sm:hidden">
            Balance: {lpTokenBalanceReactNode} {lpTokenSymbol}
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
        <Button
          variant="secondary"
          size="sm"
          className="pointer-events-none w-full justify-between"
        >
          <div className="flex items-center gap-2">
            <VaultIcon
              vaultName={`${vault.tokens.token0.symbol}/${vault.tokens.token1.symbol}`}
              size="sm"
            />
            <span>{lpTokenSymbol}</span>
          </div>
        </Button>
      </div>
      <div>
        <p className="text-card-foreground/70 mb-2 text-sm sm:hidden">
          Balance: {lpTokenBalanceReactNode} {lpTokenSymbol}
        </p>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="flex-1"
            onClick={() => setAmount(calculateAmountByPercentage(0.25))}
          >
            25%
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="flex-1"
            onClick={() => setAmount(calculateAmountByPercentage(0.5))}
          >
            50%
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="flex-1"
            onClick={() => setAmount(calculateAmountByPercentage(0.75))}
          >
            75%
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="flex-1"
            onClick={() => setAmount(calculateAmountByPercentage(1))}
          >
            100%
          </Button>
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
            a{lpTokenSymbol}
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
          address={vault.address}
          abi={vault_abi}
          functionName="deposit"
          args={[parseUnits(amount ?? "0", vault.tokens.lpToken.decimals)]}
          tokenAddress={vault.tokens.lpToken.address}
          tokenDecimals={vault.tokens.lpToken.decimals}
          tokenSymbol={lpTokenSymbol}
          disableConditions={disableConditions}
          spenderAddress={vault.address}
          requiredAmount={amount ?? "0"}
          toastMessages={{
            submitting: `Depositing ${lpTokenSymbol} into ${vault.name}...`,
            success: `Successfully deposited ${lpTokenSymbol} into ${vault.name}!`,
            error: `Failed to deposit ${lpTokenSymbol} into ${vault.name}.`,
            mining: `Depositing ${lpTokenSymbol} into ${vault.name}...`,
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
          <span className="text-card-foreground">{depositFee}</span>
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
