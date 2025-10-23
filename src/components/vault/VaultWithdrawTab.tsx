import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { HelpCircle } from "lucide-react";
import { SecondaryCard } from "~/components/common/SecondaryCard";
import type { EnrichedVaultInfo } from "~/types";
import { formatFeePercentage } from "~/utils/vaultHelpers";
import { WriteButton } from "~/components/ui/write-button";
import vault_abi from "~/lib/contracts/vault_abi";
import { formatUnits, parseUnits } from "viem";
import { useMemo, useState } from "react";
import { useAccount } from "wagmi";
import { formatNumber } from "~/utils/numbers";
import { enforceOnlyNumbers } from "~/utils/numbers";
import { useVaultRefresh } from "~/hooks/use-vault-refresh";

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
  const { address: userAddress } = useAccount();
  const { refreshVaultData } = useVaultRefresh();

  const formattedVaultBalance = useMemo(() => {
    if (!vaultBalance) return 0;
    return Number(formatUnits(vaultBalance, vault.tokens.lpToken.decimals));
  }, [vaultBalance, vault.tokens.lpToken.decimals]);

  const withdrawFee = formatFeePercentage(vault.strategy.withdrawFee);
  const lpTokenSymbol = `${vault.tokens.token0.symbol}/${vault.tokens.token1.symbol}`;

  const disableConditions = useMemo(() => {
    const conditions = [];
    if (!userAddress) {
      conditions.push({
        condition: true,
        message: "Connect wallet to withdraw",
      });
    } else if (!amount || parseFloat(amount) === 0) {
      conditions.push({
        condition: true,
        message: "Enter an amount to withdraw",
      });
    } else if (parseFloat(amount) > formattedVaultBalance) {
      conditions.push({
        condition: true,
        message: `Insufficient vault balance`,
      });
    }

    return conditions;
  }, [amount, formattedVaultBalance, userAddress]);

  const calculateAmountByPercentage = (percentage: number) => {
    if (!vaultBalance) return "0";
    return formatUnits(
      (vaultBalance * BigInt(percentage * 100)) / BigInt(100),
      vault.tokens.lpToken.decimals,
    );
  };

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
        <Button
          variant="secondary"
          size="sm"
          className="pointer-events-none w-full justify-between"
        >
          <span>a{lpTokenSymbol}</span>
        </Button>
      </div>

      <div>
        <p className="text-card-foreground/70 mb-2 text-sm sm:hidden">
          Share Balance: {vaultBalanceReactNode} a{lpTokenSymbol}
        </p>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="flex-1"
            onClick={() => setAmount(calculateAmountByPercentage(0.25))}
            disabled={!userAddress}
          >
            25%
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="flex-1"
            onClick={() => setAmount(calculateAmountByPercentage(0.5))}
            disabled={!userAddress}
          >
            50%
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="flex-1"
            onClick={() => setAmount(calculateAmountByPercentage(0.75))}
            disabled={!userAddress}
          >
            75%
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="flex-1"
            onClick={() => setAmount(calculateAmountByPercentage(1))}
            disabled={!userAddress}
          >
            100%
          </Button>
        </div>
      </div>
      <SecondaryCard className="p-4">
        <p className="mb-2 text-sm">You receive</p>
        <p className="mb-1 text-2xl font-bold">
          {formatNumber(Number(amount || 0) * vault.sharePrice)}
        </p>
        <p className="text-secondary-foreground/80 mt-1 text-xs">
          $
          {formatNumber(
            Number(amount || 0) * vault.sharePrice * vault.tokens.lpToken.price,
          ) ?? "0"}
        </p>
        <div className="border-secondary-foreground/20 mt-3 border-t pt-3">
          <p className="text-secondary-foreground/80 text-xs">
            {lpTokenSymbol}
          </p>
        </div>
      </SecondaryCard>

      <div className="relative pt-5">
        <p className="absolute top-0 left-0 text-xs text-red-500">
          {disableConditions.map(
            (cond) => cond.condition && cond.message + " ",
          )}
        </p>

        <WriteButton
          address={vault.address}
          abi={vault_abi}
          functionName="withdraw"
          args={[parseUnits(amount ?? "0", vault.tokens.lpToken.decimals)]}
          disableConditions={disableConditions}
          toastMessages={{
            submitting: `Withdrawing ${lpTokenSymbol} from ${vault.name}...`,
            success: `Successfully withdrawn ${lpTokenSymbol} from ${vault.name}!`,
            error: `Failed to withdraw ${lpTokenSymbol} from ${vault.name}.`,
            mining: `Withdrawing ${lpTokenSymbol} from ${vault.name}...`,
          }}
          className="w-full"
          onSuccess={refreshVaultData}
        >
          Withdraw
        </WriteButton>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-card-foreground/70 flex items-center gap-1">
            WITHDRAWAL FEE <HelpCircle className="h-3 w-3" />
          </span>
          <span className="text-card-foreground">{withdrawFee}</span>
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
