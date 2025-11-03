import { api } from "~/utils/api";
import PageLayout from "~/components/layout/PageLayout";
import PageHeader from "~/components/layout/PageHeader";
import { Eye } from "lucide-react";
import MetricCard from "~/components/common/MetricCard";
import TabNavigation from "~/components/common/TabNavigation";
import SearchBar from "~/components/common/SearchBar";
import { useMemo, useState } from "react";
import { useVaultSearch } from "~/hooks/use-vault-search";
import VaultTable from "~/components/vault/VaultTable";
import { Tabs } from "@radix-ui/react-tabs";
import { formatNumber } from "~/utils/numbers";
import { useAccount } from "wagmi";
import type { VaultTableEntry } from "~/types";
import { useSavedVaults } from "~/hooks/use-saved-vaults";

const portfolioTabs = [
  { id: "all", label: "All" },
  { id: "saved", label: "Saved" },
  { id: "positions", label: "My Positions" },
] as const;

export default function Home() {
  const [activeTab, setActiveTab] = useState("all");
  const { address: connectedUser } = useAccount();
  const { savedVaults } = useSavedVaults();

  const { data: vaultTable, isLoading: isLoadingVaultTable } =
    api.vaults.getVaultTable.useQuery();

  const { data: apys, isLoading: isLoadingAPY } =
    api.gte.getMarketAPYs.useQuery();

  const { data: userVaultData, isLoading: isLoadingUserVaultData } =
    api.vaults.getUserVaultData.useQuery(
      { user: connectedUser! },
      { enabled: !!connectedUser },
    );

  // Merge vault table with user vault data
  const vaultTableWithBalances = useMemo(() => {
    if (!vaultTable) return [];

    return vaultTable.map((vault) => {
      const vaultData = userVaultData?.[vault.address] ?? {
        balanceUsd: "0",
        vaultBalanceUsd: "0",
        points: "0",
      };
      const apy = apys ? (apys[vault.address]?.apy ?? 0) : 0;
      return {
        ...vault,
        walletBalanceUsd: vaultData?.balanceUsd
          ? parseFloat(vaultData.balanceUsd)
          : 0,
        userDepositUsd: vaultData?.vaultBalanceUsd
          ? parseFloat(vaultData.vaultBalanceUsd)
          : 0,
        userPoints: vaultData?.points ? Number(vaultData.points) : 0,
        apy: apy * 100,
      };
    });
  }, [userVaultData, vaultTable, apys]);

  const filterFn = useMemo<
    ((vault: VaultTableEntry) => boolean) | undefined
  >(() => {
    if (activeTab === "all") return undefined;
    if (activeTab === "saved") {
      return (vault) => savedVaults.includes(vault.address);
    }
    return (vault) => vault.userDepositUsd > 0;
  }, [activeTab, savedVaults]);

  const { searchQuery, setSearchQuery, filteredVaults } = useVaultSearch({
    vaultData: vaultTableWithBalances,
    filterFn,
  });

  const { totalDeposited, avgApy, totalTVL, totalVaults, totalPoints } =
    useMemo(() => {
      const totals = (vaultTableWithBalances ?? []).reduce(
        (acc, vault) => {
          acc.totalDeposited += vault.userDepositUsd;
          acc.weightedApySum += vault.apy * vault.tvlUsd;
          acc.totalTVL += vault.tvlUsd;
          acc.totalVaults += 1;
          acc.totalPoints += vault.userPoints;
          return acc;
        },
        {
          totalDeposited: 0,
          weightedApySum: 0,
          totalTVL: 0,
          totalVaults: 0,
          totalPoints: 0,
        },
      );

      return {
        ...totals,
        avgApy:
          totals.totalTVL > 0 ? totals.weightedApySum / totals.totalTVL : 0,
      };
    }, [vaultTableWithBalances]);

  return (
    <PageLayout
      title="Vaults | Aqua"
      description="Aqua is the first real-time liquidity layer on MegaETH, unifying DEX and lending yields in automated vaults."
    >
      <div className="flex justify-between">
        <PageHeader
          icon={Eye}
          title="Portfolio"
          iconBeforeTitle
          className="!mb-0"
        />
        <PageHeader title="Platform" className="!mb-0 max-md:hidden" />
      </div>

      <div className="mb-8 flex flex-wrap gap-8 max-md:block md:justify-between">
        <div className="flex flex-wrap gap-8">
          <MetricCard
            label="DEPOSITED"
            value={<>${formatNumber(totalDeposited)}</>}
            isLoading={isLoadingVaultTable || isLoadingUserVaultData}
          />
          <MetricCard
            label="AVG. APY"
            value={<>{formatNumber(avgApy)}%</>}
            isLoading={isLoadingVaultTable || isLoadingAPY}
          />
          <MetricCard
            label="GENESIS POINTS"
            value={<>{formatNumber(totalPoints)}</>}
            isLoading={isLoadingVaultTable || isLoadingUserVaultData}
          />
        </div>
        <PageHeader title="Platform" className="mt-8 !mb-0 md:hidden" />
        <div className="flex flex-wrap gap-8">
          <MetricCard
            label="TVL"
            value={<>${formatNumber(totalTVL)}</>}
            className="md:text-right"
            isLoading={isLoadingVaultTable}
          />
          <MetricCard
            label="Vaults"
            value={`${totalVaults}`}
            className="md:text-right"
            isLoading={isLoadingVaultTable}
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

          <div className="flex-1 md:max-w-[500px]">
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </div>
        </div>

        <VaultTable
          data={filteredVaults}
          isLoadingWallet={isLoadingUserVaultData}
          isLoadingDeposit={isLoadingUserVaultData}
          isLoadingPoints={isLoadingUserVaultData}
          isLoadingAPY={isLoadingAPY || isLoadingVaultTable}
          customEmptyTableMessage={
            activeTab === "positions"
              ? "You don't have any deposits in vaults yet."
              : activeTab === "saved"
                ? searchQuery
                  ? "No saved vaults found matching your search."
                  : "You haven't saved any vaults yet. Click the bookmark icon on a vault to save it."
                : searchQuery
                  ? "No vaults found matching your search."
                  : "No vaults available at the moment."
          }
        />
      </Tabs>
    </PageLayout>
  );
}
