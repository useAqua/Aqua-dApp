import { Card } from "~/components/ui/card";
import APYBreakdownGrid from "~/components/charts/APYBreakdownGrid";
import type { EnrichedVaultInfo } from "~/types";

interface VaultStrategyProps {
  vault: EnrichedVaultInfo;
  description?: string;
}

const defaultDescription =
  "The vault deposits the user's vAMM-SYND/WETH in a Aerodrome farm, earning the platform's governance token. Earned token is swapped for SYND and WETH in order to acquire more of the same LP token. To complete the compounding cycle, the new vAMM-SYND/WETH is added to the farm, ready to go for the next earning event. The transaction cost required to do all this is socialized among the vault's users.";

const VaultStrategy = ({
  vault,
  description = defaultDescription,
}: VaultStrategyProps) => {
  const apyItems = vault.apyBreakdown
    ? [
        { label: "TOTAL APY", value: vault.apyBreakdown.totalApy },
        { label: "VAULT APR", value: vault.apyBreakdown.vaultApr },
        { label: "BOOST APR", value: vault.apyBreakdown.boostApr },
      ]
    : undefined;

  return (
    <Card className="p-6">
      <h2 className="text-card-foreground mb-6 text-xl font-bold">Strategy</h2>
      <p className="text-card-foreground/80 mb-4 leading-relaxed">
        {description}
      </p>

      <APYBreakdownGrid items={apyItems} />
    </Card>
  );
};

export default VaultStrategy;
