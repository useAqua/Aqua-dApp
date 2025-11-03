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
import { CustomConnectButton } from "~/components/common/CustomConnectButton";

const Dashboard = () => {
  const { address: connectedUser } = useAccount();

  const { data: vaultTable, isLoading: isLoadingVaultTable } =
    api.vaults.getVaultTable.useQuery();

  const { data: userVaultData, isLoading: isLoadingUserVaultData } =
    api.vaults.getUserVaultData.useQuery(
      { user: connectedUser! },
      { enabled: !!connectedUser },
    );

  const { data: apys, isLoading: isLoadingAPY } =
    api.gte.getMarketAPYs.useQuery();

  // Merge vault table with user vault data and filter only vaults with deposits
  const vaultTableWithBalances = useMemo(() => {
    if (!vaultTable || !userVaultData) return [];

    return vaultTable
      .map((vault) => {
        const vaultData = userVaultData[vault.address];
        return {
          ...vault,
          walletBalanceUsd: vaultData?.balanceUsd
            ? parseFloat(vaultData.balanceUsd)
            : 0,
          userDepositUsd: vaultData?.vaultBalanceUsd
            ? parseFloat(vaultData.vaultBalanceUsd)
            : 0,
          userPoints: vaultData?.points ? Number(vaultData.points) : 0,
          apy: apys ? (apys[vault.address]?.apy ?? 0) * 100 : 0,
        };
      })
      .filter((vault) => vault.userDepositUsd > 0);
  }, [userVaultData, vaultTable, apys]);

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
          <div className="absolute inset-0 z-10 mt-8 flex items-center justify-center backdrop-blur-sm max-md:h-max">
            <div className="py-8 text-center sm:px-8">
              <Wallet className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
              <h3 className="mb-2 text-xl font-bold sm:text-2xl">
                Connect Your Wallet
              </h3>
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
              isLoading={isLoadingVaultTable || isLoadingUserVaultData}
            />

            <MetricCard
              icon={Database}
              label="VAULTS"
              value={`${totalVaults}`}
              type="card"
              isLoading={isLoadingVaultTable}
            />

            <MetricCard
              icon={Award}
              label="GENESIS POINTS"
              value={<>{formatNumber(totalPoints)}</>}
              type="card"
              isLoading={isLoadingVaultTable || isLoadingUserVaultData}
            />

            <MetricCard
              icon={TrendingUp}
              label="EST. DAILY YIELD"
              value={<>${formatNumber(totalDailyYield)}</>}
              type="card"
              isLoading={
                isLoadingVaultTable || isLoadingAPY || isLoadingUserVaultData
              }
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
              isLoadingDeposit={isLoadingUserVaultData}
              isLoadingAPY={isLoadingAPY || isLoadingVaultTable}
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
