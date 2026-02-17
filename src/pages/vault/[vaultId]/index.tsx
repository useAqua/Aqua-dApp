import PageLayout from "~/components/layout/PageLayout";
import VaultHeader from "~/components/vault/VaultHeader";
import VaultMetrics from "~/components/vault/VaultMetrics";
import VaultLPBreakdown from "~/components/vault/VaultLPBreakdown";
import VaultTradingPanel from "~/components/vault/VaultTradingPanel";
import VaultStrategy from "~/components/vault/VaultStrategy";
import VaultActions from "~/components/vault/VaultActions";
import { TokenIcon } from "~/utils/tokenIcons";
import { enrichVaultWithMockData } from "~/utils/vaultHelpers";
import { useSavedVaults } from "~/hooks/use-saved-vaults";
import { useAccount, useReadContract } from "wagmi";
import { erc20Abi, formatEther } from "viem";
import { useMemo } from "react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";

const VaultDetail = () => {
  const router = useRouter();
  const vaultId = router.query.vaultId as string | undefined;

  const { isSaved, toggleSaveVault } = useSavedVaults();
  const { address: userAddress } = useAccount();

  const { data: vaultData, isLoading: isLoadingVault } =
    api.vaults.getSingleVaultInfo.useQuery(
      { id: vaultId! },
      { enabled: !!vaultId },
    );

  const { data: apyData, isLoading: isLoadingApy } =
    api.gte.getSingleMarketAPY.useQuery(
      vaultData?.tokens.lpToken.address ?? "",
      { enabled: !!vaultData?.tokens.lpToken.address },
    );

  // Enrich vault with APY data
  const vault = useMemo(() => {
    if (!vaultData) return null;
    return enrichVaultWithMockData(vaultData, apyData ?? { apy: 0, apr: 0 });
  }, [vaultData, apyData]);

  // Vault balance for withdrawals (user's shares in the vault)
  const { data: vaultBalance } = useReadContract({
    address: vault?.address,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!userAddress && !!vault,
    },
  });

  const depositedUsd = useMemo(() => {
    if (!vault || !vaultBalance) return 0;

    const vaultBalanceFormatted = +formatEther(vaultBalance);
    const sharePrice = parseFloat(vault.sharePrice);
    const lpTokenPrice = parseFloat(vault.tokens.lpToken.price);

    return vaultBalanceFormatted * sharePrice * lpTokenPrice;
  }, [vault, vaultBalance]);

  const isLoading = isLoadingVault || isLoadingApy;

  if (!isLoading && !vault) {
    return (
      <PageLayout title="Vault Not Found">
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <h1 className="text-foreground mb-4 text-2xl font-bold">
              Vault not found
            </h1>
            <p className="text-muted-foreground">
              The requested vault could not be found.
            </p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title={vault?.name ? `${vault.name} | Aqua` : "Vault | Aqua"}
      description={
        vault?.name
          ? `${vault.name} vault details and management`
          : "Vault details and management"
      }
    >
      <VaultHeader
        icon={
          vault ? (
            <div className="flex items-center -space-x-2">
              <TokenIcon symbol={vault.tokens.token0.symbol} size={48} />
              <TokenIcon symbol={vault.tokens.token1.symbol} size={48} />
            </div>
          ) : (
            <div />
          )
        }
        name={vault?.name ?? ""}
        platform={vault?.platformId ?? ""}
        actions={
          vault ? (
            <VaultActions
              vaultAddress={vault.address}
              vaultName={vault.name}
              isBookmarked={isSaved(vault.address)}
              onBookmarkToggle={toggleSaveVault}
            />
          ) : undefined
        }
        isLoading={isLoading}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:hidden">
          <VaultMetrics
            vault={vault ? { ...vault, deposit: depositedUsd } : null}
            isLoading={isLoading}
          />
        </div>
        <div className="space-y-6 max-lg:order-1 lg:col-span-2">
          <div className="max-lg:hidden">
            <VaultMetrics
              vault={vault ? { ...vault, deposit: depositedUsd } : null}
              isLoading={isLoading}
            />
          </div>
          <VaultLPBreakdown vault={vault} isLoading={isLoading} />
          <VaultStrategy vault={vault} isLoading={isLoading} />
        </div>

        <div className="lg:col-span-1">
          <VaultTradingPanel
            vault={vault}
            userAddress={userAddress}
            vaultBalance={vaultBalance}
            isLoading={isLoading}
          />
        </div>
      </div>
    </PageLayout>
  );
};

export default VaultDetail;
