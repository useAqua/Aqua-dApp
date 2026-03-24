import PageLayout from "~/components/layout/PageLayout";
import { useAccount, useReadContract } from "wagmi";
import { erc20Abi, formatEther } from "viem";
import { useMemo, useState } from "react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { useSavedCampaigns } from "~/hooks/use-saved-campaigns";
import CampaignActions from "~/components/campaign/CampaignActions";
import CampaignTradingPanel from "~/components/campaign/CampaignTradingPanel";
import CampaignStatCard from "~/components/campaign/CampaignStatCard";
import YieldSplitCard from "~/components/campaign/YieldSplitCard";
import TimelineCard from "~/components/campaign/TimelineCard";
import EarlyExitCard from "~/components/campaign/EarlyExitCard";
import { Skeleton } from "~/components/ui/skeleton";
import { formatNumber } from "~/utils/numbers";
import Countdown from "react-countdown";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getCurrentPhase } from "~/components/campaign/campaignUtils";

/* ========== MAIN PAGE ========== */
const CampaignDetail = () => {
  const router = useRouter();
  const campaignId = Number(router.query.campaignId);
  const [selectedVaultIndex, setSelectedVaultIndex] = useState<number>(0);

  const { isSaved, toggleSaveCampaign } = useSavedCampaigns();
  const { address: userAddress } = useAccount();

  const { data: campaign, isLoading: isLoadingCampaign } =
    api.campaign.getSingleCampaign.useQuery(
      { id: campaignId },
      { enabled: !isNaN(campaignId) },
    );

  const selectedVault = useMemo(
    () => (campaign?.vaults ?? [])[selectedVaultIndex],
    [campaign, selectedVaultIndex],
  );

  // User's vault shares (for withdraw)
  const { data: vaultBalance } = useReadContract({
    address: selectedVault?.vault,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: userAddress ? [userAddress] : undefined,
    query: { enabled: !!userAddress && !!selectedVault },
  });

  const depositedUsd = useMemo(() => {
    if (!campaign || !vaultBalance) return 0;
    return +formatEther(vaultBalance);
  }, [campaign, vaultBalance]);

  const currentPhase = campaign ? getCurrentPhase(campaign) : 0;
  const isLoading = isLoadingCampaign;

  /* ---------- not found ---------- */
  if (!isLoading && !campaign) {
    return (
      <PageLayout title="Campaign Not Found">
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <h1 className="text-foreground mb-4 text-2xl font-bold">
              Campaign not found
            </h1>
            <p className="text-muted-foreground">
              The requested campaign could not be found.
            </p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title={campaign?.name ? `${campaign.name} | Aqua` : "Campaign | Aqua"}
      description={
        campaign?.name
          ? `${campaign.name} campaign details and management`
          : "Campaign details and management"
      }
    >
      {/* ---- breadcrumb ---- */}
      <Link
        href="/"
        className="text-muted-foreground hover:text-foreground mb-5 inline-flex items-center gap-1 text-sm transition-colors"
      >
        <ChevronLeft className="h-4 w-4" /> Campaigns
      </Link>

      {/* ---- page header ---- */}
      {isLoading ? (
        <div className="mb-6">
          <Skeleton isLoading className="mb-2 h-5 w-28" />
          <Skeleton isLoading className="mb-1 h-8 w-72" />
        </div>
      ) : (
        <div className="mb-7 flex flex-wrap items-start justify-between gap-3">
          <div>
            <span className="bg-teal-500/10 text-teal-600 border-teal-500/25 mb-1.5 inline-block rounded-md border px-2 py-0.5 text-[11px] font-semibold tracking-wider uppercase">
              Chain: MegaETH
            </span>
            <div className="flex flex-wrap items-baseline gap-2.5">
              <h1 className="text-2xl font-bold md:text-[26px]">
                {campaign?.name}
              </h1>
              {campaign && (
                <span className="bg-teal-500/10 text-teal-600 border-teal-500/25 rounded-full border px-2.5 py-0.5 text-[13px] font-semibold">
                  Phase {currentPhase}
                </span>
              )}
            </div>
          </div>

          {campaign && (
            <CampaignActions
              campaignId={campaign.id}
              campaignName={campaign.name}
              isBookmarked={isSaved(campaign.id)}
              onBookmarkToggle={toggleSaveCampaign}
            />
          )}
        </div>
      )}

      {/* ---- stats row (full width) ---- */}
      <div className="mb-3.5 grid grid-cols-2 gap-2.5 md:grid-cols-4">
        <CampaignStatCard
          label="Total Deposited"
          value="$0"
          sub="Target: $30–50M"
          isLoading={isLoading}
        />
        <CampaignStatCard
          label="Your Deposit"
          value={userAddress ? <>${formatNumber(depositedUsd)}</> : "$0"}
          sub={
            vaultBalance
              ? <>{formatNumber(+formatEther(vaultBalance))} aTOKEN</>
              : "—"
          }
          isLoading={isLoading}
        />
        <CampaignStatCard
          label="Est. APY"
          value="~8%"
          sub="via Aave"
          valueClassName="text-teal-500"
          helpIcon
          isLoading={isLoading}
        />
        <CampaignStatCard
          label="Time Remaining"
          value={
            campaign ? (
              <Countdown
                date={Number(campaign.endTime) * 1000}
                renderer={({ days, hours, minutes, seconds, completed }) =>
                  completed ? (
                    "Ended"
                  ) : (
                    <span className="tabular-nums">
                      {days}d {hours}h {minutes}m {seconds}s
                    </span>
                  )
                }
              />
            ) : (
              "—"
            )
          }
          sub={campaign ? `Until Phase ${currentPhase} ends` : undefined}
          isLoading={isLoading}
        />
      </div>

      {/* ---- bento grid ---- */}
      <div className="grid items-start gap-3.5 lg:grid-cols-[1.15fr_1fr]">
        {/* left column */}
        <div className="max-lg:order-1">
          <div className="flex flex-col gap-3.5">
            <YieldSplitCard />
            {campaign && <TimelineCard campaign={campaign} />}
            <EarlyExitCard />
          </div>
        </div>

        {/* right column: trading panel */}
        <div className="max-lg:order-0">
          <CampaignTradingPanel
            campaign={campaign}
            userAddress={userAddress}
            vaultBalance={vaultBalance}
            selectedVaultIndex={selectedVaultIndex}
            setSelectedVaultIndex={setSelectedVaultIndex}
            selectedVault={selectedVault}
            isLoading={isLoading}
          />
        </div>
      </div>
    </PageLayout>
  );
};

export default CampaignDetail;
