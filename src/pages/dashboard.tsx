import PageLayout from "~/components/layout/PageLayout";
import PageHeader from "~/components/layout/PageHeader";
import MetricCard from "~/components/common/MetricCard";
import { MoveRight, Wallet } from "lucide-react";
import CampaignTable from "~/components/campaign/CampaignTable";
import { api } from "~/utils/api";
import { useAccount, useReadContracts } from "wagmi";
import { useMemo } from "react";
import { formatNumber } from "~/utils/numbers";
import { CustomConnectButton } from "~/components/common/CustomConnectButton";
import { cn } from "~/lib/utils";
import Link from "next/link";
import { erc20Abi, formatUnits } from "viem";
import type { CampaignInfo } from "~/types/contracts";

const iconClass = "grid w-full h-full place-content-center rounded-sm";

const PointIcon = () => (
  <div className={cn(iconClass, "bg-yellow-400/15 text-yellow-700")}>
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M9 2l1.7 4.2H15l-3.5 2.7 1.3 4.3L9 10.5 5.2 13.2l1.3-4.3L3 6.2h4.3L9 2z"
        fill="currentColor"
      />
    </svg>
  </div>
);

const TrendingUp = () => (
  <div className={cn(iconClass, "bg-teal-500/15 text-teal-500")}>
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M3 13l3.5-4L9 11.5l3-5L15 9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

const Dashboard = () => {
  const { address: connectedUser } = useAccount();

  const { data: campaignData, isLoading: isLoadingCampaigns } =
    api.campaign.getCampaignTable.useQuery();

  // Flatten all enabled vault addresses across every campaign for balance reads
  const vaultContracts = useMemo(() => {
    if (!campaignData || !connectedUser) return [];
    return campaignData.flatMap((campaign) =>
      campaign.vaults
        .filter((v) => v.enabled)
        .map((v) => ({
          address: v.vault,
          abi: erc20Abi,
          functionName: "balanceOf" as const,
          args: [connectedUser] as const,
        })),
    );
  }, [campaignData, connectedUser]);

  const { data: vaultBalances, isLoading: isLoadingBalances } =
    useReadContracts({
      contracts: vaultContracts,
      query: { enabled: !!connectedUser && vaultContracts.length > 0 },
    });

  // Map each campaign to whether the user has any non-zero share balance
  const campaignsWithPositions = useMemo((): CampaignInfo[] => {
    if (!campaignData || !vaultBalances) return [];

    let balanceIndex = 0;
    return campaignData.filter((campaign) => {
      const enabledVaults = campaign.vaults.filter((v) => v.enabled);
      const hasPosition = enabledVaults.some((_, i) => {
        const result = vaultBalances[balanceIndex + i];
        const bal = result?.status === "success" ? result.result : BigInt(0);
        return bal > BigInt(0);
      });
      balanceIndex += enabledVaults.length;
      return hasPosition;
    });
  }, [campaignData, vaultBalances]);

  // Aggregate metrics across the user's positions
  const { totalDeposited, campaignsJoined } = useMemo(() => {
    if (!campaignData || !vaultBalances) {
      return { totalDeposited: 0, campaignsJoined: 0 };
    }

    let balanceIndex = 0;
    let totalDeposited = 0;
    let campaignsJoined = 0;

    campaignData.forEach((campaign) => {
      const enabledVaults = campaign.vaults.filter((v) => v.enabled);
      let hasPosition = false;

      enabledVaults.forEach((_, i) => {
        const result = vaultBalances[balanceIndex + i];
        if (result?.status === "success") {
          const bal = result.result;
          if (bal > BigInt(0)) {
            hasPosition = true;
            // Use shares as a proxy for deposited amount (1:1 until pricing is available)
            totalDeposited += parseFloat(formatUnits(bal, 18));
          }
        }
      });

      if (hasPosition) campaignsJoined += 1;
      balanceIndex += enabledVaults.length;
    });

    return { totalDeposited, campaignsJoined };
  }, [campaignData, vaultBalances]);

  const isLoading = isLoadingCampaigns || isLoadingBalances;

  return (
    <PageLayout
      title="Dashboard | Aqua"
      description="Track your campaign positions"
    >
      <PageHeader
        title="Dashboard"
        subtitle="Your campaign positions at a glance"
      />

      <div className="relative">
        {/* Blur overlay when not connected */}
        {!connectedUser && (
          <div className="absolute inset-0 z-10 mt-8 flex items-center justify-center backdrop-blur-sm max-md:h-max">
            <div className="py-8 text-center sm:px-8">
              <Wallet className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
              <h3 className="mb-2 text-xl font-bold sm:text-2xl">
                Connect Your Wallet
              </h3>
              <p className="text-muted-foreground mb-6 max-w-sm">
                Please connect your wallet to view your dashboard and manage
                your campaign positions.
              </p>
              <CustomConnectButton />
            </div>
          </div>
        )}

        {/* Main content — blurred when not connected */}
        <div className={!connectedUser ? "pointer-events-none blur-md" : ""}>
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Hero deposit card */}
            <div className="bg-foreground border-border/30 relative space-y-6 overflow-clip rounded-2xl border px-4 py-6 text-white shadow-(--shadow-card) md:col-span-2 md:p-6">
              <span className="bg-secondary/15 pointer-events-none absolute -top-8 -right-8 h-28 w-28 rounded-full md:-top-12 md:-right-12 md:h-36 md:w-36" />
              <div>
                <p className="pb-2 text-[10px] font-semibold tracking-wider text-white/70 uppercase">
                  TOTAL DEPOSITED
                </p>
                <p className="text-3xl font-bold">
                  ${formatNumber(totalDeposited)}  {/*TODO: Change*/}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Campaigns Joined", value: campaignsJoined },
                  {
                    label: "Active Positions",
                    value: campaignsWithPositions.filter((c) => c.active)
                      .length,
                  },
                ].map((metric) => (
                  <MetricCard
                    key={metric.label}
                    label={metric.label}
                    value={<>{formatNumber(metric.value)}</>}
                    type="incard"
                    valueColor="white"
                  />
                ))}
              </div>
            </div>

            <MetricCard
              Icon={PointIcon}
              label="CAMPAIGNS WITH POSITIONS"
              value={<>{formatNumber(campaignsJoined)}</>}
              subValue="Campaigns you have deposited into"
              type="card"
              isLoading={isLoading}
            />

            <MetricCard
              Icon={TrendingUp}
              label="ACTIVE POSITIONS"
              value={
                <>
                  {formatNumber(
                    campaignsWithPositions.filter((c) => c.active).length,
                  )}
                </>
              }
              subValue="Currently earning yield"
              type="card"
              isLoading={isLoading}
            />
          </div>

          {/* Positions table */}
          <div className="bg-card border-border/50 rounded-lg border">
            <div className="border-border/50 flex items-center justify-between border-b p-4 md:p-5">
              <h2 className="text-sm font-semibold">Your Campaigns</h2>
              <Link
                href="/"
                className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm font-medium transition-colors"
              >
                View All <MoveRight size={16} />
              </Link>
            </div>

            <CampaignTable
              data={campaignsWithPositions}
              isLoading={isLoading}
              isDashboard
              customEmptyTableMessage={
                connectedUser
                  ? "You have no campaign positions yet. Deposit into a campaign to start earning yield."
                  : "Connect your wallet to see your campaign positions."
              }
            />
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Dashboard;
