import PageLayout from "~/components/layout/PageLayout";
import VaultHeader from "~/components/vault/VaultHeader";
import VaultActions from "~/components/vault/VaultActions";
import VaultMetrics from "~/components/vault/VaultMetrics";
import VaultLPBreakdown from "~/components/vault/VaultLPBreakdown";
import VaultStrategy from "~/components/vault/VaultStrategy";
import VaultTradingPanel from "~/components/vault/VaultTradingPanel";
import { enrichVaultWithMockData } from "~/utils/vaultHelpers";
import type { GetServerSideProps } from "next";
import type { EnrichedVaultInfo, VaultDetailInfo } from "~/types";
import { fetchTRPCQuery } from "~/server/helpers/trpcFetch";
import { useSavedVaults } from "~/hooks/use-saved-vaults";
import { useAccount, useReadContract } from "wagmi";
import { erc20Abi, formatEther } from "viem";
import { useMemo } from "react";

interface VaultDetailProps {
  vault: EnrichedVaultInfo | null;
}

const VaultDetail = ({ vault }: VaultDetailProps) => {
  const { isSaved, toggleSaveVault } = useSavedVaults();
  const { address: userAddress } = useAccount();

  // LP token balance for deposits
  const { data: lpTokenBalance } = useReadContract({
    address: vault?.tokens.lpToken.address,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!userAddress && !!vault,
    },
  });

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

    return (
      +formatEther(vaultBalance) * vault.sharePrice * vault.tokens.lpToken.price
    );
  }, [vault, vaultBalance]);

  if (!vault) {
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
      title={`${vault.name} | Aqua`}
      description={`${vault.name} vault details and management`}
    >
      <VaultHeader
        icon={<></>} // TODO: Add Icon for Vaults
        name={vault.name}
        platform={vault.platformId}
        actions={
          <VaultActions
            vaultAddress={vault.address}
            vaultName={vault.name}
            isBookmarked={isSaved(vault.address)}
            onBookmarkToggle={toggleSaveVault}
          />
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:hidden">
          <VaultMetrics vault={{ ...vault, deposit: depositedUsd }} />
        </div>
        <div className="space-y-6 max-lg:order-1 lg:col-span-2">
          <div className="max-lg:hidden">
            <VaultMetrics vault={{ ...vault, deposit: depositedUsd }} />
          </div>
          <VaultLPBreakdown vault={vault} />
          <VaultStrategy vault={vault} />
        </div>

        <div className="lg:col-span-1">
          <VaultTradingPanel
            vault={vault}
            lpTokenBalance={lpTokenBalance}
            vaultBalance={vaultBalance}
          />
        </div>
      </div>
    </PageLayout>
  );
};

export const getServerSideProps: GetServerSideProps<VaultDetailProps> = async (
  context,
) => {
  const vaultId = context.params?.vaultId as string | undefined;

  if (!vaultId) {
    return {
      props: {
        vault: null,
      },
    };
  }

  try {
    const vaultData = await fetchTRPCQuery<{ id: string }, VaultDetailInfo>(
      context.req,
      "vaults.getSingleVaultInfo",
      { id: vaultId },
    );

    if (!vaultData) {
      return {
        props: {
          vault: null,
        },
      };
    }

    const enrichedVault = enrichVaultWithMockData(vaultData);

    return {
      props: {
        vault: enrichedVault,
      },
    };
  } catch (error) {
    console.error("Error fetching vault data:", error);
    return {
      props: {
        vault: null,
      },
    };
  }
};

export default VaultDetail;
