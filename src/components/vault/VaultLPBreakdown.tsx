import { Card } from "~/components/ui/card";
import LPChart from "~/components/charts/LPChart";
import TokenBreakdownList, {
  type TokenBreakdownItem,
} from "~/components/charts/TokenBreakdownList";
import type { EnrichedVaultInfo } from "~/types";
import { TokenIcon } from "~/utils/tokenIcons";
import VaultIcon from "~/components/vault/VaultIcon";

interface VaultLPBreakdownProps {
  vault: EnrichedVaultInfo;
}

const VaultLPBreakdown = ({ vault }: VaultLPBreakdownProps) => {
  const { lpBreakdown, tokens } = vault;

  // Prepare token data for the breakdown list
  const tokenData: TokenBreakdownItem[] | undefined = lpBreakdown
    ? [
        {
          icon: (
            <TokenIcon symbol={tokens.token0.symbol ?? "Token0"} size={40} />
          ),
          symbol: tokens.token0.symbol ?? "Token0",
          amount: lpBreakdown.token0Amount,
          usdValue: lpBreakdown.token0UsdValue,
        },
        {
          icon: (
            <TokenIcon symbol={tokens.token1.symbol ?? "Token1"} size={40} />
          ),
          symbol: tokens.token1.symbol ?? "Token1",
          amount: lpBreakdown.token1Amount,
          usdValue: lpBreakdown.token1UsdValue,
        },
        {
          icon: (
            <VaultIcon
              vaultName={tokens.token0.symbol + "/" + tokens.token1.symbol}
            />
          ),
          symbol: "LP",
          amount: lpBreakdown.lpAmount,
          usdValue: lpBreakdown.lpUsdValue,
        },
      ]
    : undefined;

  return (
    <Card className="p-6">
      <h2 className="text-card-foreground mb-6 text-xl font-bold">
        LP Breakdown
      </h2>

      <div className="mb-6 flex items-center gap-8 max-md:flex-wrap">
        <LPChart
          primaryPercentage={lpBreakdown?.token0Percentage}
          accentPercentage={lpBreakdown?.token1Percentage}
          primaryLabel={tokens?.token0?.symbol}
          accentLabel={tokens?.token1?.symbol}
          primaryIcon={
            <TokenIcon symbol={tokens?.token0?.symbol ?? "Token0"} size={24} />
          }
          accentIcon={
            <TokenIcon symbol={tokens?.token1?.symbol ?? "Token1"} size={24} />
          }
        />
        {tokenData && <TokenBreakdownList tokens={tokenData} />}
      </div>
    </Card>
  );
};

export default VaultLPBreakdown;
