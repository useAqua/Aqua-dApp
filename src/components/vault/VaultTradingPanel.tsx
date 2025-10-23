import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Card } from "~/components/ui/card";
import type { EnrichedVaultInfo } from "~/types";
import { formatUnits } from "viem";
import { useMemo } from "react";
import { formatNumber } from "~/utils/numbers";
import VaultDepositTab from "./VaultDepositTab";
import VaultWithdrawTab from "./VaultWithdrawTab";

interface VaultTradingPanelProps {
  vault: EnrichedVaultInfo;
  lpTokenBalance: bigint | undefined;
  vaultBalance: bigint | undefined;
}

const VaultTradingPanel = ({
  vault,
  lpTokenBalance,
  vaultBalance,
}: VaultTradingPanelProps) => {
  const lpTokenBalanceReactNode = useMemo(() => {
    if (!lpTokenBalance) return "0";
    const formatted = Number(
      formatUnits(lpTokenBalance, vault.tokens.lpToken.decimals),
    );
    return formatNumber(formatted) as string;
  }, [lpTokenBalance, vault.tokens.lpToken.decimals]);

  const vaultBalanceReactNode = useMemo(() => {
    if (!vaultBalance) return "0";
    const formatted = Number(
      formatUnits(vaultBalance, vault.tokens.lpToken.decimals),
    );
    return formatNumber(formatted) as string;
  }, [vaultBalance, vault.tokens.lpToken.decimals]);

  return (
    <Card className={`sticky top-20 min-h-[500px] p-6 max-md:py-8`}>
      <Tabs defaultValue="deposit" className="w-full">
        <TabsList className="bg-secondary ring-border text-secondary-foreground mb-6 grid w-full grid-cols-2 ring">
          <TabsTrigger value="deposit">Deposit</TabsTrigger>
          <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
        </TabsList>

        <TabsContent value="deposit">
          <VaultDepositTab
            vault={vault}
            lpTokenBalance={lpTokenBalance}
            lpTokenBalanceReactNode={lpTokenBalanceReactNode}
          />
        </TabsContent>

        <TabsContent value="withdraw">
          <VaultWithdrawTab
            vault={vault}
            vaultBalance={vaultBalance}
            vaultBalanceReactNode={vaultBalanceReactNode}
          />
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default VaultTradingPanel;
