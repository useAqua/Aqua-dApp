import MetricCard from "~/components/common/MetricCard";
import type { Vault } from "~/types";

interface VaultMetricsProps {
  vault: Vault;
}

const VaultMetrics = ({ vault }: VaultMetricsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      <MetricCard
        label="TVL"
        value={vault.tvl}
        subValue="$782,899"
        helpIcon
        type="card"
      />

      <MetricCard
        label="APY"
        value={vault.apyValue}
        subValue="2,612%"
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
