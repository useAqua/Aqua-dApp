import { api } from "~/utils/api";
import PageLayout from "~/components/layout/PageLayout";
import PageHeader from "~/components/layout/PageHeader";
import { Eye } from "lucide-react";
import MetricCard from "~/components/common/MetricCard";
import { useMemo, useState } from "react";
import { formatNumber } from "~/utils/numbers";
import CampaignTable from "~/components/campaign/CampaignTable";
import { Tabs } from "@radix-ui/react-tabs";
import { useSavedCampaigns } from "~/hooks/use-saved-campaigns";
import type { CampaignInfo } from "~/types/contracts";
import { useCampaignSearch } from "~/hooks/use-campaign-search";
import TabNavigation from "~/components/common/TabNavigation";
import SearchBar from "~/components/common/SearchBar";

const portfolioTabs = [
  { id: "all", label: "All" },
  { id: "saved", label: "Saved" },
  { id: "positions", label: "My Positions" },
] as const;

export default function Campaigns() {
  const [activeTab, setActiveTab] = useState("all");
  const { savedCampaigns } = useSavedCampaigns();

  const { data: campaignData, isLoading: isLoadingCampaignTable } =
    api.campaign.getCampaignTable.useQuery();

  const campaigns = useMemo(() => {
    if (!campaignData) return [];
    return campaignData;
  }, [campaignData]);

  const filterFn = useMemo<
    ((campaign: CampaignInfo) => boolean) | undefined
  >(() => {
    if (activeTab === "all") return undefined;
    if (activeTab === "saved") {
      return (campaign) => savedCampaigns.includes(campaign.id);
    }
    // return (vault) => vault.userDepositUsd > 0;
  }, [activeTab, savedCampaigns]);

  const { searchQuery, setSearchQuery, filteredCampaigns } = useCampaignSearch({
    campaignData,
    filterFn,
  });

  const { totalCampaigns, activeCampaigns, totalVaults } = useMemo(() => {
    return campaigns.reduce(
      (acc, campaign) => {
        acc.totalCampaigns += 1;
        if (campaign.active) {
          acc.activeCampaigns += 1;
        }
        acc.totalVaults += campaign.vaults.length;
        return acc;
      },
      {
        totalCampaigns: 0,
        activeCampaigns: 0,
        totalVaults: 0,
      },
    );
  }, [campaigns]);

  return (
    <PageLayout title="Campaigns | Aqua" description="Aqua campaigns overview">
      <div className="flex justify-between">
        <PageHeader
          icon={Eye}
          title="Campaigns"
          iconBeforeTitle
          className="mb-0!"
        />
      </div>

      <div className="mb-8 flex flex-wrap gap-8 max-md:block md:justify-between">
        <div className="flex flex-wrap gap-8">
          <MetricCard
            label="TOTAL CAMPAIGNS"
            value={<>{formatNumber(totalCampaigns)}</>}
            isLoading={isLoadingCampaignTable}
          />
          <MetricCard
            label="ACTIVE CAMPAIGNS"
            value={<>{formatNumber(activeCampaigns)}</>}
            isLoading={isLoadingCampaignTable}
          />
          <MetricCard
            label="TOTAL VAULTS"
            value={<>{formatNumber(totalVaults)}</>}
            isLoading={isLoadingCampaignTable}
          />
        </div>
      </div>

      <Tabs
        defaultValue={portfolioTabs[0].id}
        className="w-full space-y-4"
        onValueChange={(tab) => setActiveTab(tab)}
      >
        <div className="flex justify-between gap-6 max-md:flex-col">
          <TabNavigation tabs={portfolioTabs} />

          <div className="flex-1 md:max-w-125">
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </div>
        </div>

        <CampaignTable
          data={filteredCampaigns}
          customEmptyTableMessage={
            searchQuery
              ? "No campaigns found matching your search."
              : "No campaigns available at the moment."
          }
        />
      </Tabs>
    </PageLayout>
  );
}
