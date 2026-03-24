import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Card } from "~/components/ui/card";
import { type Address, erc20Abi, formatUnits } from "viem";
import { useMemo } from "react";
import { formatNumber } from "~/utils/numbers";
import CampaignDepositTab from "./CampaignDepositTab";
import CampaignWithdrawTab from "./CampaignWithdrawTab";
import { useReadContract } from "wagmi";
import { Skeleton } from "~/components/ui/skeleton";
import type { CampaignInfo, CampaignVaults } from "~/types/contracts";

interface CampaignTradingPanelProps {
  campaign: CampaignInfo | undefined;
  userAddress: Address | undefined;
  vaultBalance: bigint | undefined;
  isLoading?: boolean;
  selectedVault: CampaignVaults | undefined;
  selectedVaultIndex: number;
  setSelectedVaultIndex: (value: number) => void;
}

const CampaignTradingPanel = ({
  campaign,
  userAddress,
  vaultBalance,
  setSelectedVaultIndex,
  selectedVaultIndex,
  selectedVault,
  isLoading = false,
}: CampaignTradingPanelProps) => {
  const [selectedTokenAddress, selectedTokenDecimals] = useMemo<
    [Address, number]
  >(() => {
    if (!selectedVault) return ["0x0" as Address, 18];
    return [
      selectedVault.asset,
      18 /*TODO: Assuming aTokens have 18 decimals, adjust if different */,
    ];
  }, [selectedVault]);

  // LP token balance for deposits
  const { data: selectedTokenBalance } = useReadContract({
    address: selectedTokenAddress,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!userAddress && !!campaign,
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
    if (!vaultBalance || !campaign) return "0";
    const formatted = Number(
      formatUnits(
        vaultBalance,
        18 /*TODO: Assuming campaign shares have 18 decimals, adjust if different */,
      ),
    );
    return formatNumber(formatted) as string;
  }, [vaultBalance, campaign]);

  if (isLoading || !campaign) {
    return (
      <Card className="sticky top-20 flex flex-col overflow-hidden">
        {/* Skeleton tab bar */}
        <div className="border-border grid shrink-0 grid-cols-2 border-b">
          <Skeleton isLoading className="h-12 rounded-none" />
          <Skeleton isLoading className="h-12 rounded-none" />
        </div>
        <div className="flex-1 space-y-3.5 overflow-y-auto p-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Skeleton isLoading className="h-20 w-full rounded-xl" />
          <div>
            <Skeleton isLoading className="mb-1.5 h-3 w-20" />
            <Skeleton isLoading className="h-12 w-full rounded-lg" />
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} isLoading className="h-8 rounded-md" />
            ))}
          </div>
          <Skeleton isLoading className="h-28 w-full rounded-xl" />
          <Skeleton isLoading className="h-12 w-full rounded-xl" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="sticky top-20 flex flex-col overflow-hidden">
      <Tabs
        defaultValue="deposit"
        className="flex min-h-0 w-full flex-1 flex-col"
      >
        <TabsList className="border-border grid h-auto w-full shrink-0 grid-cols-2 rounded-none border-b bg-transparent p-0 shadow-none ring-0">
          <TabsTrigger
            value="deposit"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:text-muted-foreground rounded-none border-0 py-3 text-sm font-semibold transition-colors data-[state=active]:shadow-none"
          >
            Deposit
          </TabsTrigger>
          <TabsTrigger
            value="withdraw"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:text-muted-foreground rounded-none border-0 py-3 text-sm font-semibold transition-colors data-[state=active]:shadow-none"
          >
            Withdraw
          </TabsTrigger>
        </TabsList>

        <div className="min-h-0 flex-1 overflow-y-auto p-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <TabsContent value="deposit" className="mt-0" forceMount>
            <CampaignDepositTab
              campaign={campaign}
              selectedTokenBalance={selectedTokenBalance}
              selectedTokenBalanceReactNode={selectedTokenBalanceReactNode}
              selectedVaultIndex={selectedVaultIndex}
              selectedVault={selectedVault}
              selectedTokenDecimals={selectedTokenDecimals}
              selectedTokenAddress={selectedTokenAddress}
              setSelectedVaultIndex={setSelectedVaultIndex}
              userAddress={userAddress}
            />
          </TabsContent>

          <TabsContent value="withdraw" className="mt-0" forceMount>
            <CampaignWithdrawTab
              campaign={campaign}
              vaultBalance={vaultBalance}
              vaultBalanceReactNode={vaultBalanceReactNode}
              setSelectedVaultIndex={setSelectedVaultIndex}
              selectedVaultIndex={selectedVaultIndex}
              selectedTokenDecimals={selectedTokenDecimals}
              selectedTokenAddress={selectedTokenAddress}
              selectedVault={selectedVault}
            />
          </TabsContent>
        </div>
      </Tabs>
    </Card>
  );
};

export default CampaignTradingPanel;
