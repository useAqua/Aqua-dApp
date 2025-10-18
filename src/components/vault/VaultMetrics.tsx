import MetricCard from "~/components/common/MetricCard";
import type { EnrichedVaultInfo } from "~/types";

interface VaultMetricsProps {
  vault: EnrichedVaultInfo;
}

const VaultMetrics = ({ vault }: VaultMetricsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      <MetricCard label="TVL" value={vault.tvl} helpIcon type="card" />

      <MetricCard
        label="APY"
        value={vault.apyValue}
        valueColor="accent"
        helpIcon
        type="card"
      />

      <MetricCard label="YOUR DEPOSIT" value={vault.deposit} type="card" />

      <MetricCard label="LAST HARVEST" value={vault.lastHarvest} type="card" />
    </div>
  );
};

export default VaultMetrics;
