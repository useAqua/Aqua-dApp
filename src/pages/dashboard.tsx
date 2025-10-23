import PageLayout from "~/components/layout/PageLayout";
import PageHeader from "~/components/layout/PageHeader";
import MetricCard from "~/components/common/MetricCard";
import SearchBar from "~/components/common/SearchBar";
import { useVaultSearch } from "~/hooks/use-vault-search";
import { Wallet, Database, Award, TrendingUp } from "lucide-react";
import VaultTable from "~/components/vault/VaultTable";
import { api } from "~/utils/api";
import { useAccount } from "wagmi";
import { useMemo } from "react";
import { formatNumber } from "~/utils/numbers";
import type { GetServerSideProps } from "next";
import type { VaultTableEntry } from "~/types";
import { fetchTRPCQuery } from "~/server/helpers/trpcFetch";
import { CustomConnectButton } from "~/components/common/CustomConnectButton";

interface DashboardProps {
  vaultTable: VaultTableEntry[];
}

const Dashboard = ({ vaultTable }: DashboardProps) => {
  const { address: connectedUser } = useAccount();

  const { data: userVaultData, isLoading: isLoadingUserVaultData } =
    api.vaults.getUserVaultData.useQuery(
      { user: connectedUser! },
      { enabled: !!connectedUser },
    );

  // Merge vault table with user vault data and filter only vaults with deposits
  const vaultTableWithBalances = useMemo(() => {
    if (!userVaultData) return [];

    return vaultTable
      .map((vault) => ({
        ...vault,
        walletBalanceUsd: userVaultData[vault.address]?.balanceUsd ?? 0,
        userDepositUsd: userVaultData[vault.address]?.vaultBalanceUsd ?? 0,
        userPoints: userVaultData[vault.address]?.points ?? 0,
      }))
      .filter((vault) => vault.userDepositUsd > 0);
  }, [vaultTable, userVaultData]);

  const { searchQuery, setSearchQuery, filteredVaults } = useVaultSearch({
    vaultData: vaultTableWithBalances,
  });

  const { totalDeposited, totalVaults, totalPoints, totalDailyYield } = useMemo(
    () =>
      (vaultTableWithBalances ?? []).reduce(
        (acc, vault) => {
          acc.totalDeposited += vault.userDepositUsd;
          acc.totalVaults += 1;
          acc.totalPoints += vault.userPoints;
          // Calculate daily yield as (deposit * APY) / 365
          acc.totalDailyYield += (vault.userDepositUsd * vault.apy) / 36500;
          return acc;
        },
        {
          totalDeposited: 0,
          totalVaults: 0,
          totalPoints: 0,
          totalDailyYield: 0,
        },
      ),
    [vaultTableWithBalances],
  );

  return (
    <PageLayout
      title="Dashboard | Aqua"
      description="Track your positions & performance"
    >
      <PageHeader
        title="Dashboard"
        subtitle={
          connectedUser
            ? `(${connectedUser.slice(0, 4)}...${connectedUser.slice(-4)})`
            : ""
        }
      />

      <div className="relative">
        {/* Blur overlay when not connected */}
        {!connectedUser && (
          <div className="absolute inset-0 z-50 mt-8 flex items-center justify-center backdrop-blur-sm">
            <div className="p-8 text-center">
              <Wallet className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
              <h3 className="mb-2 text-2xl font-bold">Connect Your Wallet</h3>
              <p className="text-muted-foreground mb-6 max-w-sm">
                Please connect your wallet to view your dashboard and manage
                your vault positions.
              </p>
              <CustomConnectButton />
            </div>
          </div>
        )}

        {/* Main content - blurred when not connected */}
        <div className={!connectedUser ? "pointer-events-none blur-md" : ""}>
          <div className="mb-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              icon={Wallet}
              label="YOUR DEPOSITS"
              value={<>${formatNumber(totalDeposited)}</>}
              type="card"
            />

            <MetricCard
              icon={Database}
              label="VAULTS"
              value={`${totalVaults}`}
              type="card"
            />

            <MetricCard
              icon={Award}
              label="YOUR POINTS"
              value={<>{formatNumber(totalPoints)}</>}
              type="card"
            />

            <MetricCard
              icon={TrendingUp}
              label="EST. DAILY YIELD"
              value={<>${formatNumber(totalDailyYield)}</>}
              type="card"
            />
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="mb-2 text-2xl font-bold">Your Vaults</h2>
              <p className="text-muted-foreground mb-6">
                Select a vault to view more details and manage your positions.
              </p>
            </div>

            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              className="max-w-md"
            />

            <VaultTable
              data={filteredVaults}
              isLoadingWallet={isLoadingUserVaultData}
              isLoadingDeposit={false}
              isLoadingPoints={isLoadingUserVaultData}
              customEmptyTableMessage={
                searchQuery
                  ? "No vaults found matching your search."
                  : "You don't have any deposits in vaults yet."
              }
            />
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Dashboard;

export const getServerSideProps: GetServerSideProps<DashboardProps> = async (
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
