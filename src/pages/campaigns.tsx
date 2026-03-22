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
import { Card, CardContent, CardHeader } from "~/components/ui/card";

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
    <PageLayout
      title="Campaigns | Aqua"
      description="Aqua campaigns overview"
      className="space-y-8"
    >
      <div className="flex justify-between">
        <PageHeader
          icon={Eye}
          title="Campaigns"
          iconBeforeTitle
          className="-mb-4!"
        />
      </div>

      <div className="grid w-full grid-cols-2 gap-2 md:grid-cols-3 md:gap-4">
        <MetricCard
          label="TOTAL CAMPAIGNS"
          value={<>{formatNumber(totalCampaigns)}</>}
          isLoading={isLoadingCampaignTable}
          type="card"
        />
        <MetricCard
          label="ACTIVE CAMPAIGNS"
          value={<>{formatNumber(activeCampaigns)}</>}
          isLoading={isLoadingCampaignTable}
          type="card"
        />
        <MetricCard
          label="TOTAL VAULTS"
          value={<>{formatNumber(totalVaults)}</>}
          isLoading={isLoadingCampaignTable}
          type="card"
        />
      </div>

      <Tabs
        defaultValue={portfolioTabs[0].id}
        className="bg-card border-border/50 w-full rounded-lg border"
        onValueChange={(tab) => setActiveTab(tab)}
      >
        <div className="flex justify-between gap-4 p-4 max-md:flex-col md:gap-6 md:p-5">
          <TabNavigation tabs={portfolioTabs} />

          <div className="flex-1 md:max-w-56">
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

      <div className={"grid gap-8 md:grid-cols-2 md:gap-4"}>
        <Card className={"bg-foreground text-background"}>
          <CardHeader className={"pb-2 font-bold"}>
            WHAT IS A PRE-DEPOSIT CAMPAIGN?
          </CardHeader>
          <CardContent className={"md:mr-16"}>
            Deposit stablecoins and earn yield —{" "}
            <span className="font-bold text-teal-400">80%</span> funds protocol
            development, <span className="font-bold text-teal-400">20%</span>{" "}
            goes back to you. Your principal is always returned at launch.
          </CardContent>
        </Card>
        <Card>
          <CardHeader className={"pb-2 font-bold"}>HOW IT WORKS</CardHeader>
          <CardContent className={"grid gap-2"}>
            {[
              "Deposit USDC into the campaign vault",
              "Funds auto-route to Aave, earning yield",
              "At launch: principal + tokens returned",
            ].map((content, index) => (
              <div className={"flex items-center gap-3"} key={index}>
                <span className="text-background flex h-6 w-6 items-center justify-center rounded-full bg-teal-500 text-sm font-bold">
                  {index + 1}
                </span>
                <p>{content}</p>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader className={"pb-2 font-bold"}>
            CAPITAL EFFICIENCY
          </CardHeader>
          <CardContent>
            Unlike ICOs where you risk 100% of principal, IYOs only cost you the
            opportunity cost of yield. Exit early at any time — forfeit accrued
            yield + 1% principal fee. Zero token lockups, zero vesting cliffs.
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
