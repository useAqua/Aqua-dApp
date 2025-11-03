import { Card } from "~/components/ui/card";
import APYBreakdownGrid from "~/components/charts/APYBreakdownGrid";
import type { EnrichedVaultInfo } from "~/types";
import { formatNumber } from "~/utils/numbers";
import { generateVaultDescription } from "~/utils/vaultHelpers";
import { Skeleton } from "~/components/ui/skeleton";

interface VaultStrategyProps {
  vault: EnrichedVaultInfo | null;
  description?: string;
  isLoading?: boolean;
}

const VaultStrategy = ({
  vault,
  description,
  isLoading = false,
}: VaultStrategyProps) => {
  if (isLoading || !vault) {
    return (
      <Card className="p-6">
        <Skeleton isLoading className="mb-6 h-7 w-32" />
        <div className="space-y-3">
          <Skeleton isLoading className="h-4 w-full" />
          <Skeleton isLoading className="h-4 w-full" />
          <Skeleton isLoading className="h-4 w-3/4" />
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i}>
              <Skeleton isLoading className="mb-2 h-4 w-20" />
              <Skeleton isLoading className="h-6 w-24" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

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
