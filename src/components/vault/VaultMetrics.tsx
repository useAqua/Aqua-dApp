import MetricCard from "~/components/common/MetricCard";
import type { EnrichedVaultInfo } from "~/types";
import { formatNumber } from "~/utils/numbers";
import { Skeleton } from "~/components/ui/skeleton";

interface VaultMetricsProps {
  vault: EnrichedVaultInfo | null;
  isLoading?: boolean;
}

const VaultMetrics = ({ vault, isLoading = false }: VaultMetricsProps) => {
  if (isLoading || !vault) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-card rounded-lg border p-4">
            <Skeleton isLoading className="mb-2 h-4 w-24" />
            <Skeleton isLoading className="h-8 w-32" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      <MetricCard
        label="TVL"
        value={<>${formatNumber(vault.tvl)}</>}
        helpIcon
        type="card"
      />

      <MetricCard
        label="APY"
        value={<>{formatNumber(vault.apyValue * 100)}%</>}
        helpIcon
        type="card"
      />

      <MetricCard
        label="YOUR DEPOSIT"
        value={<>${formatNumber(vault.deposit)}</>}
        type="card"
      />

      <MetricCard label="LAST HARVEST" value={vault.lastHarvest} type="card" />
    </div>
  );
};

export default VaultMetrics;
