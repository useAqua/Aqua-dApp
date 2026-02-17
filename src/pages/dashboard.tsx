import PageLayout from "~/components/layout/PageLayout";
import PageHeader from "~/components/layout/PageHeader";
import MetricCard from "~/components/common/MetricCard";
import { useVaultSearch } from "~/hooks/use-vault-search";
import { MoveRight, Wallet } from "lucide-react";
import VaultTable from "~/components/vault/VaultTable";
import { api } from "~/utils/api";
import { useAccount } from "wagmi";
import { useMemo } from "react";
import { formatNumber } from "~/utils/numbers";
import { CustomConnectButton } from "~/components/common/CustomConnectButton";
import { cn } from "~/lib/utils";
import Link from "next/link";

const iconClass = "grid w-full h-full place-content-center rounded-sm ";

const PointIcon = () => (
  <div className={cn(iconClass, "bg-yellow-400/15 text-yellow-700")}>
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M9 2l1.7 4.2H15l-3.5 2.7 1.3 4.3L9 10.5 5.2 13.2l1.3-4.3L3 6.2h4.3L9 2z"
        fill="currentColor"
      ></path>
    </svg>
  </div>
);

const TrendingUp = () => (
  <div className={cn(iconClass, "bg-green-500/15 text-green-500")}>
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M3 13l3.5-4L9 11.5l3-5L15 9"
        stroke="currentColor"
        stroke-width="1.8"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></path>
    </svg>
  </div>
);

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
    if (!vaultTable) return [];

    return vaultTable
      .map((vault) => {
        const vaultData = userVaultData?.[vault.address] ?? {
          balanceUsd: "0",
          vaultBalanceUsd: "0",
          points: "0",
        };
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

  const { searchQuery, filteredVaults } = useVaultSearch({
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
      <PageHeader title="Dashboard" subtitle={"Your portfolio at a glance"} />

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
          <div className="mb-12 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div
              className={
                "bg-foreground border-border/30 relative space-y-12 overflow-clip rounded-2xl border px-4 py-6 text-white shadow-[var(--shadow-card)] md:col-span-2 md:space-y-6 md:p-6"
              }
            >
              <span
                className={
                  "bg-secondary/15 pointer-events-none absolute -top-8 -right-8 h-28 w-28 rounded-full md:-top-12 md:-right-12 md:h-36 md:w-36"
                }
              />
              <div>
                <p className="pb-2 text-xs font-semibold">TOTAL DEPOSITS</p>
                <p className="text-3xl font-bold md:text-4xl">
                  ${formatNumber(totalDeposited)}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    label: "Vaults",
                    value: totalVaults,
                  },
                  {
                    label: "Est. Daily Yield",
                    value: <>${formatNumber(totalDailyYield)}</>,
                  },
                ].map((metric) => (
                  <MetricCard
                    label={metric.label}
                    value={metric.value}
                    key={metric.label}
                    type="incard"
                    valueColor="white"
                  />
                ))}
              </div>
            </div>

            <MetricCard
              Icon={PointIcon}
              label="GENESIS POINTS"
              value={<>{formatNumber(totalPoints)}</>}
              subValue={"Earn by depositing early"}
              type="card"
              isLoading={isLoadingVaultTable || isLoadingUserVaultData}
            />

            <MetricCard
              Icon={TrendingUp}
              label="LIFETIME YIELD"
              value={<>${formatNumber(totalDailyYield)}</>}
              subValue={"Across all vaults"}
              type="card"
              isLoading={
                isLoadingVaultTable || isLoadingAPY || isLoadingUserVaultData
              }
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Your Vaults</h2>
              <Link
                href="/"
                className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm font-medium transition-colors"
              >
                View All <MoveRight size={16} />
              </Link>
            </div>

            <VaultTable
              data={filteredVaults}
              isLoadingWallet={isLoadingUserVaultData}
              isLoadingDeposit={isLoadingUserVaultData}
              isLoadingAPY={isLoadingAPY || isLoadingVaultTable}
              isLoadingPoints={isLoadingUserVaultData}
              isDashboard
              customEmptyTableMessage={
                searchQuery
                  ? "No vaults found matching your search."
                  : "Deposit stablecoins into a vault to start earning yield and Genesis Points"
              }
            />
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Dashboard;
