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
import type { GetServerSideProps } from "next";
import type { VaultTableEntry } from "~/types";
import { fetchTRPCQuery } from "~/server/helpers/trpcFetch";

const portfolioTabs = [
  { id: "all", label: "All" },
  { id: "saved", label: "Saved" },
  { id: "positions", label: "My Positions" },
] as const;

interface HomeProps {
  vaultTable: VaultTableEntry[];
}

export default function Home({ vaultTable }: HomeProps) {
  const [activeTab, setActiveTab] = useState("all");
  const { address: connectedUser } = useAccount();

  const { data: userVaultData, isLoading: isLoadingUserVaultData } =
    api.vaults.getUserVaultData.useQuery(
      { user: connectedUser! },
      { enabled: !!connectedUser },
    );

  // Merge vault table with user vault data
  const vaultTableWithBalances = useMemo(() => {
    if (!userVaultData) return vaultTable;

    return vaultTable.map((vault) => ({
      ...vault,
      walletBalanceUsd: userVaultData[vault.address]?.balanceUsd ?? 0,
      userPoints: userVaultData[vault.address]?.points ?? 0,
    }));
  }, [vaultTable, userVaultData]);

  const filterFn = useMemo<
    ((vault: VaultTableEntry) => boolean) | undefined
  >(() => {
    if (activeTab === "all") return undefined;
    if (activeTab === "saved") return undefined;
    return (vault) => vault.userDepositUsd > 0;
  }, [activeTab]);

  const { searchQuery, setSearchQuery, filteredVaults } = useVaultSearch({
    vaultData: vaultTableWithBalances,
    filterFn,
  });

  const { totalDeposited, totalAPY, totalTVL, totalVaults, totalPoints } =
    useMemo(
      () =>
        (vaultTableWithBalances ?? []).reduce(
          (acc, vault) => {
            acc.totalDeposited += vault.userDepositUsd;
            acc.totalAPY += vault.apy;
            acc.totalTVL += vault.tvlUsd;
            acc.totalVaults += 1;
            acc.totalPoints += vault.userPoints;
            return acc;
          },
          {
            totalDeposited: 0,
            totalAPY: 0,
            totalTVL: 0,
            totalVaults: 0,
            totalPoints: 0,
          },
        ),
      [vaultTableWithBalances],
    );

  return (
    <PageLayout title="Vaults | Aqua" description="Manage your DeFi portfolio">
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
          />
          <MetricCard label="AVG. APY" value={<>{formatNumber(totalAPY)}%</>} />
          <MetricCard
            label="ACCRUED POINTS"
            value={<>{formatNumber(totalPoints)}</>}
          />
        </div>
        <PageHeader title="Platform" className="mt-8 !mb-0 md:hidden" />
        <div className="flex flex-wrap gap-8">
          <MetricCard
            label="TVL"
            value={<>${formatNumber(totalTVL)}</>}
            className="text-right"
          />
          <MetricCard
            label="Vaults"
            value={`${totalVaults}`}
            className="text-right"
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
          isLoadingDeposit={false} // TODO: Set to true after adding deposit fetching
          isLoadingPoints={isLoadingUserVaultData}
          customEmptyTableMessage={
            activeTab === "positions"
              ? "You don't have any deposits in vaults yet."
              : searchQuery
                ? "No vaults found matching your search."
                : "No vaults available at the moment."
          }
        />
      </Tabs>
    </PageLayout>
  );
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async (
  context,
) => {
  try {
    const vaultTable = await fetchTRPCQuery<void, VaultTableEntry[]>(
      context.req,
      "vaults.getVaultTable",
      undefined,
    );

    return {
      props: {
        vaultTable: vaultTable ?? [],
      },
    };
  } catch (error) {
    console.error("Error fetching vault table:", error);
    return {
      props: {
        vaultTable: [],
      },
    };
  }
};
