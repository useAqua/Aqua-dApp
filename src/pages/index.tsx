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

const portfolioTabs = [
  { id: "all", label: "All" },
  { id: "saved", label: "Saved" },
  { id: "positions", label: "My Positions" },
] as const;

export default function Home() {
  const [, setActiveTab] = useState("all");
  const { address: connectedUser } = useAccount();
  const { data: vaultTable } = api.vaults.getVaultTable.useQuery({
    user: connectedUser,
  });
  const { searchQuery, setSearchQuery, filteredVaults } = useVaultSearch({
    vaultData: vaultTable,
  });

  const { totalDeposited, totalAPY, totalTVL, totalVaults } = useMemo(
    () =>
      (vaultTable ?? []).reduce(
        (acc, vault) => {
          acc.totalDeposited += vault.userDepositUsd;
          acc.totalAPY += vault.apy;
          acc.totalTVL += vault.tvlUsd;
          acc.totalVaults += 1;
          return acc;
        },
        {
          totalDeposited: 0,
          totalAPY: 0,
          totalTVL: 0,
          totalVaults: 0,
        },
      ),
    [vaultTable],
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
            value={`$${formatNumber(totalDeposited)}`}
          />
          <MetricCard label="AVG. APY" value={`${formatNumber(totalAPY)}`} />
          <MetricCard label="ACCRUED POINTS" value="0" />
        </div>
        <PageHeader title="Platform" className="mt-8 !mb-0 md:hidden" />
        <div className="flex flex-wrap gap-8">
          <MetricCard
            label="TVL"
            value={`$${formatNumber(totalTVL)}`}
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

        <VaultTable data={filteredVaults} />
      </Tabs>
    </PageLayout>
  );
}
