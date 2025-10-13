import PageLayout from "~/components/PageLayout";
import PageHeader from "~/components/PageHeader";
import MetricCard from "~/components/MetricCard";
import SearchBar from "~/components/SearchBar";
import { useVaultSearch } from "~/hooks/use-vault-search";
import { Wallet, Database, Award, TrendingUp } from "lucide-react";
import VaultTable from "~/components/VaultTable";

const Dashboard = () => {
  const { searchQuery, setSearchQuery, filteredVaults } = useVaultSearch();

  return (
    <PageLayout title="AQUA DeFi - Dashboard" description="Your DeFi dashboard">
      <PageHeader title="Dashboard" subtitle="(0x5b...b73b)" />

      <div className="mb-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          icon={Wallet}
          label="YOUR DEPOSITS"
          value="$2,917"
          type="card"
        />

        <MetricCard icon={Database} label="VAULTS" value="3" type="card" />

        <MetricCard icon={Award} label="YOUR POINTS" value="200" type="card" />

        <MetricCard
          icon={TrendingUp}
          label="EST. DAILY YIELD"
          value="$0.18"
          type="card"
        />
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="mb-2 text-2xl font-bold">Your Vaults</h2>
          <p className="text-muted-foreground mb-6">
            Select a vault to view more details and manage your positions
          </p>
        </div>

        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          className="max-w-md"
        />

        <VaultTable data={filteredVaults} />
      </div>
    </PageLayout>
  );
};

export default Dashboard;
