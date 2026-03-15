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

  console.log({
    selectedTokenAddress,
  });

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
      <Card className={`sticky top-20 min-h-125 p-6 max-md:py-8`}>
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
    <Card className={`sticky top-20 min-h-125 p-6 max-md:py-8`}>
      <Tabs defaultValue="deposit" className="w-full">
        <TabsList className="bg-secondary ring-border text-secondary-foreground mb-6 grid w-full grid-cols-2 ring">
          <TabsTrigger value="deposit">Deposit</TabsTrigger>
          <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
        </TabsList>

        <TabsContent value="deposit" forceMount>
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

        <TabsContent value="withdraw" forceMount>
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
      </Tabs>
    </Card>
  );
};

export default CampaignTradingPanel;
