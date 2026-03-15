import PageLayout from "~/components/layout/PageLayout";
import CampaignHeader from "~/components/campaign/CampaignHeader";
// import CampaignTradingPanel from "~/components/campaign/CampaignTradingPanel";
import { useAccount, useReadContract } from "wagmi";
import { erc20Abi, formatEther } from "viem";
import { useMemo, useState } from "react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { useSavedCampaigns } from "~/hooks/use-saved-campaigns";
import CampaignActions from "~/components/campaign/CampaignActions";
import CampaignTradingPanel from "~/components/campaign/CampaignTradingPanel";

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

  // Campaign balance for withdrawals (user's shares in the campaign)
  const { data: vaultBalance } = useReadContract({
    address: selectedVault?.vault,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!userAddress && !!selectedVault,
    },
  });

  const depositedUsd = useMemo(() => {
    if (!campaign || !vaultBalance) return 0;

    const campaignBalanceFormatted = +formatEther(vaultBalance);
    const sharePrice = /*parseFloat(campaign.sharePrice)*/ 1;
    const lpTokenPrice = /*parseFloat(campaign.tokens.lpToken.price)*/ 1;

    return campaignBalanceFormatted * sharePrice * lpTokenPrice;
  }, [campaign, vaultBalance]);

  const isLoading = isLoadingCampaign;

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
      <CampaignHeader
        icon={
          campaign ? (
            <div className="flex items-center -space-x-2">
              {/*<TokenIcon symbol={campaign.tokens.token0.symbol} size={48} />*/}
              {/*<TokenIcon symbol={campaign.tokens.token1.symbol} size={48} />*/}
            </div>
          ) : (
            <div />
          )
        }
        name={campaign?.name ?? ""}
        // platform={campaign?.platformId ?? ""}
        platform={"Unknown Platform"}
        actions={
          campaign ? (
            <CampaignActions
              campaignId={campaign.id}
              campaignName={campaign.name}
              isBookmarked={isSaved(campaign.id)}
              onBookmarkToggle={toggleSaveCampaign}
            />
          ) : undefined
        }
        isLoading={isLoading}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/*<div className="lg:hidden">*/}
        {/*  <CampaignMetrics*/}
        {/*    campaign={campaign ? { ...campaign, deposit: depositedUsd } : null}*/}
        {/*    isLoading={isLoading}*/}
        {/*  />*/}
        {/*</div>*/}
        {/*<div className="space-y-6 max-lg:order-1 lg:col-span-2">*/}
        {/*  <div className="max-lg:hidden">*/}
        {/*    <CampaignMetrics*/}
        {/*      campaign={campaign ? { ...campaign, deposit: depositedUsd } : null}*/}
        {/*      isLoading={isLoading}*/}
        {/*    />*/}
        {/*  </div>*/}
        {/*  <CampaignLPBreakdown campaign={campaign} isLoading={isLoading} />*/}
        {/*  <CampaignStrategy campaign={campaign} isLoading={isLoading} />*/}
        {/*</div>*/}

        <div className="lg:col-span-1">
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
