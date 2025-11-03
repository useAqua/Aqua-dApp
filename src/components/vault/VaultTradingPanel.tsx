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

interface VaultTradingPanelProps {
  vault: EnrichedVaultInfo;
  userAddress: Address | undefined;
  vaultBalance: bigint | undefined;
}

const VaultTradingPanel = ({
  vault,
  userAddress,
  vaultBalance,
}: VaultTradingPanelProps) => {
  const [selectedToken, setSelectedToken] = useState<TokenType>("lp");

  const [selectedTokenAddress, selectedTokenDecimals] = useMemo<
    [Address, number]
  >(() => {
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
