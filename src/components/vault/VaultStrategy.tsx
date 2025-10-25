import { Card } from "~/components/ui/card";
import APYBreakdownGrid from "~/components/charts/APYBreakdownGrid";
import type { EnrichedVaultInfo } from "~/types";
import { formatNumber } from "~/utils/numbers";
import { generateVaultDescription } from "~/utils/vaultHelpers";

interface VaultStrategyProps {
  vault: EnrichedVaultInfo;
  description?: string;
}

const VaultStrategy = ({ vault, description }: VaultStrategyProps) => {
  const vaultDescription =
    description ??
    generateVaultDescription(
      vault.tokens.token0.symbol,
      vault.tokens.token1.symbol,
    );

  const apyItems = vault.apyBreakdown
    ? [
        {
          label: "TOTAL APY",
          value: <>{formatNumber(vault.apyBreakdown.totalApy * 100)}%</>,
        },
        {
          label: "VAULT APR",
          value: <>{formatNumber(vault.apyBreakdown.vaultApr * 100)}%</>,
        },
      ]
    : undefined;

  return (
    <Card className="p-6">
      <h2 className="text-card-foreground mb-6 text-xl font-bold">Strategy</h2>
      <p
        className="text-card-foreground/80 mb-4 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: vaultDescription }}
      />

      <APYBreakdownGrid items={apyItems} />
    </Card>
  );
};

export default VaultStrategy;
