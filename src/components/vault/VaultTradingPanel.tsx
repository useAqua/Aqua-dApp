import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Card } from "~/components/ui/card";
import type { EnrichedVaultInfo } from "~/types";
import type { TokenType } from "~/types/vault";
import { type Address, erc20Abi, formatUnits } from "viem";
import { useMemo, useState } from "react";
import { formatNumber } from "~/utils/numbers";
import VaultDepositTab from "./VaultDepositTab";
import VaultWithdrawTab from "./VaultWithdrawTab";
import { useReadContract } from "wagmi";
import { Skeleton } from "~/components/ui/skeleton";

interface VaultTradingPanelProps {
  vault: EnrichedVaultInfo | null;
  userAddress: Address | undefined;
  vaultBalance: bigint | undefined;
  isLoading?: boolean;
}

const VaultTradingPanel = ({
  vault,
  userAddress,
  vaultBalance,
  isLoading = false,
}: VaultTradingPanelProps) => {
  const [selectedToken, setSelectedToken] = useState<TokenType>("lp");

  const [selectedTokenAddress, selectedTokenDecimals] = useMemo<
    [Address, number]
  >(() => {
    if (!vault) return ["0x0" as Address, 18];
    if (selectedToken === "token0")
      return [vault.tokens.token0.address, vault.tokens.token0.decimals];
    if (selectedToken === "token1")
      return [vault.tokens.token1.address, vault.tokens.token1.decimals];
    return [vault.tokens.lpToken.address, vault.tokens.lpToken.decimals];
  }, [vault, selectedToken]);

  // LP token balance for deposits
  const { data: selectedTokenBalance } = useReadContract({
    address: selectedTokenAddress,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!userAddress && !!vault,
    },
  });

  const selectedTokenBalanceReactNode = useMemo(() => {
    if (!selectedTokenBalance) return "0";
    const formatted = Number(
      formatUnits(selectedTokenBalance, selectedTokenDecimals),
    );
    return formatNumber(formatted) as string;
  }, [selectedTokenBalance, selectedTokenDecimals]);

  const vaultBalanceReactNode = useMemo(() => {
    if (!vaultBalance || !vault) return "0";
    const formatted = Number(
      formatUnits(vaultBalance, vault.tokens.lpToken.decimals),
    );
    return formatNumber(formatted) as string;
  }, [vaultBalance, vault]);

  if (isLoading || !vault) {
    return (
      <Card className={`sticky top-20 min-h-[500px] p-6 max-md:py-8`}>
        <Skeleton isLoading className="mb-6 h-10 w-full rounded-lg" />
        <div className="space-y-4">
          <div>
            <Skeleton isLoading className="mb-2 h-4 w-24" />
            <Skeleton isLoading className="h-12 w-full" />
          </div>
          <div>
            <Skeleton isLoading className="mb-2 h-4 w-32" />
            <Skeleton isLoading className="h-12 w-full" />
          </div>
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} isLoading className="h-8 flex-1" />
            ))}
          </div>
          <Skeleton isLoading className="mt-6 h-12 w-full" />
        </div>
      </Card>
    );
  }

  return (
    <Card className={`sticky top-20 min-h-[500px] p-6 max-md:py-8`}>
      <Tabs defaultValue="deposit" className="w-full">
        <TabsList className="bg-secondary ring-border text-secondary-foreground mb-6 grid w-full grid-cols-2 ring">
          <TabsTrigger value="deposit">Deposit</TabsTrigger>
          <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
        </TabsList>

        <TabsContent value="deposit" forceMount>
          <VaultDepositTab
            vault={vault}
            selectedTokenBalance={selectedTokenBalance}
            selectedTokenBalanceReactNode={selectedTokenBalanceReactNode}
            selectedToken={selectedToken}
            selectedTokenDecimals={selectedTokenDecimals}
            selectedTokenAddress={selectedTokenAddress}
            setSelectedToken={setSelectedToken}
            userAddress={userAddress}
          />
        </TabsContent>

        <TabsContent value="withdraw" forceMount>
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
