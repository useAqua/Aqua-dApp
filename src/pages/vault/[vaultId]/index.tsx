import { useRouter } from "next/router";
import PageLayout from "~/components/layout/PageLayout";
import VaultHeader from "~/components/vault/VaultHeader";
import VaultActions from "~/components/vault/VaultActions";
import VaultMetrics from "~/components/vault/VaultMetrics";
import VaultLPBreakdown from "~/components/vault/VaultLPBreakdown";
import VaultStrategy from "~/components/vault/VaultStrategy";
import VaultTradingPanel from "~/components/vault/VaultTradingPanel";
import { mockVaults } from "~/lib/mockData";

const VaultDetail = () => {
  const router = useRouter();
  const { vaultId } = router.query;
  const vault = mockVaults.find((v) => v.id === vaultId);

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
      title={`${vault.name} - AQUA DeFi`}
      description={`${vault.name} vault details and management`}
    >
      <VaultHeader
        icon={vault.icon}
        name={vault.name}
        platform={vault.protocol}
        actions={<VaultActions />}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:hidden">
          <VaultMetrics vault={vault} />
        </div>
        <div className="space-y-6 max-lg:order-1 lg:col-span-2">
          <div className="max-lg:hidden">
            <VaultMetrics vault={vault} />
          </div>{" "}
          <VaultLPBreakdown />
          <VaultStrategy />
        </div>

        <div className="lg:col-span-1">
          <VaultTradingPanel />
        </div>
      </div>
    </PageLayout>
  );
};

export default VaultDetail;
