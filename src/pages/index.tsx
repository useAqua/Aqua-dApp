import { useAccount } from "wagmi";

import { api } from "~/utils/api";
import PageLayout from "~/components/layout/PageLayout";
import PageHeader from "~/components/layout/PageHeader";
import { Eye } from "lucide-react";
import MetricCard from "~/components/common/MetricCard";
import TabNavigation from "~/components/common/TabNavigation";
import SearchBar from "~/components/common/SearchBar";
import { useState } from "react";
import { useVaultSearch } from "~/hooks/use-vault-search";
import VaultTable from "~/components/vault/VaultTable";

const portfolioTabs = [
  { id: "all", label: "All" },
  { id: "saved", label: "Saved" },
  { id: "positions", label: "My Positions" },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState("all");
  const { searchQuery, setSearchQuery, filteredVaults } = useVaultSearch();
  const { address } = useAccount();

  const balance = api.w3test.balance.useQuery(address ?? "", {
    enabled: !!address, // Only run the query if address is available
  });

  console.log({
    filteredVaults,
    balance,
  });

  return (
    <PageLayout
      title="AQUA - Portfolio"
      description="Manage your DeFi portfolio"
    >
      <div className="flex justify-between">
        <PageHeader
          icon={Eye}
          title="Portfolio"
          iconBeforeTitle
          className="!mb-0"
        />
        <PageHeader title="Platform" className="!mb-0" />
      </div>

      <div className="mb-8 flex justify-between">
        <div className="flex gap-8">
          <MetricCard label="DEPOSITED" value="$0" />
          <MetricCard label="AVG. APY" value="0%" />
          <MetricCard label="ACCRUED POINTS" value="200" />
        </div>
        <div className="flex gap-8">
          <MetricCard label="TVL" value="$0" className="text-right" />
          <MetricCard label="Vaults" value="1" className="text-right" />
        </div>
      </div>

      <div className="space-y-6">
        <TabNavigation
          tabs={portfolioTabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <div className="max-w-[500px]">
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </div>

        <VaultTable data={filteredVaults} />
      </div>
    </PageLayout>
  );
}
