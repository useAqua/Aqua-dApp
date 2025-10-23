import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { HelpCircle } from "lucide-react";
import { Card } from "~/components/ui/card";
import { SecondaryCard } from "~/components/common/SecondaryCard";
import type { EnrichedVaultInfo } from "~/types";
import { formatFeePercentage } from "~/utils/vaultHelpers";
import { WriteButtonWithAllowance } from "~/components/ui/write-button-with-allowance";
import vault_abi from "~/lib/contracts/vault_abi";
import { erc20Abi, formatUnits, parseUnits } from "viem";
import { useMemo, useState } from "react";
import { useAccount, useReadContract } from "wagmi";
import { formatNumber } from "~/utils/numbers";
import { enforceOnlyNumbers } from "~/utils/numbers";

interface VaultTradingPanelProps {
  vault: EnrichedVaultInfo;
}

const VaultTradingPanel = ({ vault }: VaultTradingPanelProps) => {
  const [amount, setAmount] = useState("");
  const { address: userAddress } = useAccount();

  const { data: lpTokenBalance, refetch: refetchLpTokenBalance } =
    useReadContract({
      address: vault.tokens.lpToken.address,
      abi: erc20Abi,
      functionName: "balanceOf",
      args: userAddress ? [userAddress] : undefined,
      query: {
        enabled: !!userAddress,
      },
    });

  const [formattedLpTokenBalance, lpTokenBalanceReactNode] = useMemo(() => {
    if (!lpTokenBalance) return [0, "0"];
    const formatted = Number(
      formatUnits(lpTokenBalance, vault.tokens.lpToken.decimals),
    );
    return [formatted, formatNumber(formatted)];
  }, [lpTokenBalance, vault.tokens.lpToken.decimals]);

  const depositFee = formatFeePercentage(vault.strategy.depositFee);
  const withdrawFee = formatFeePercentage(vault.strategy.withdrawFee);
  const lpTokenSymbol = `${vault.tokens.token0.symbol}/${vault.tokens.token1.symbol} LP`;

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

  console.log({
    formattedLpTokenBalance,
    strategyAddress: vault.strategy.address,
    token: vault.tokens.lpToken.address,
  });

  return (
    <Card className={`sticky top-20 min-h-[500px] p-6 max-md:py-8`}>
      <Tabs defaultValue="deposit" className="w-full">
        <TabsList className="bg-secondary ring-border text-secondary-foreground mb-6 grid w-full grid-cols-2 ring">
          <TabsTrigger value="deposit">Deposit</TabsTrigger>
          <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
        </TabsList>

        <TabsContent value="deposit" className="space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <p className="text-card-foreground/70 mb-2 text-sm">
                💰 Enter Amount
              </p>
              <p className="text-card-foreground/70 mb-2 text-sm">
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
              <span>{lpTokenSymbol}</span>
              {/*<span>▼</span>*/}
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              className="flex-1"
              onClick={() =>
                setAmount((formattedLpTokenBalance * 0.25).toString())
              }
            >
              25%
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="flex-1"
              onClick={() =>
                setAmount((formattedLpTokenBalance * 0.5).toString())
              }
            >
              50%
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="flex-1"
              onClick={() =>
                setAmount((formattedLpTokenBalance * 0.75).toString())
              }
            >
              75%
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="flex-1"
              onClick={() => setAmount(formattedLpTokenBalance.toString())}
            >
              100%
            </Button>
          </div>

          <SecondaryCard className="p-4">
            <p className="mb-2 text-sm">You deposit</p>
            <p className="mb-1 text-2xl font-bold">
              {amount.length > 1 ? amount : "0"}
            </p>
            <p className="text-secondary-foreground/80 text-xs">
              $
              {formatNumber(Number(amount) * vault.tokens.lpToken.price) ?? "0"}
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
            <div className="flex justify-between">
              <span className="text-card-foreground/70 flex items-center gap-1">
                WITHDRAWAL FEE <HelpCircle className="h-3 w-3" />
              </span>
              <span className="text-card-foreground">{withdrawFee}</span>
            </div>
          </div>

          <p className="text-card-foreground/70 text-xs">
            The displayed APY accounts for performance fee ⓘ that is deducted
            from the generated yield only
          </p>
        </TabsContent>

        <TabsContent value="withdraw">
          <p className="text-card-foreground/70 py-8 text-center">
            Connect wallet to withdraw
          </p>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default VaultTradingPanel;
