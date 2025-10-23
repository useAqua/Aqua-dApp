import { SecondaryCard } from "~/components/common/SecondaryCard";
import { formatNumber } from "~/utils/numbers";

interface TokenBreakdownItem {
  icon: string;
  symbol: string;
  amount: number;
  usdValue: number;
}

interface TokenBreakdownListProps {
  tokens?: TokenBreakdownItem[];
}

const TokenBreakdownList = ({ tokens }: TokenBreakdownListProps) => {
  if (tokens)
    return (
      <div className="flex-1">
        <div className="space-y-3">
          {tokens.map((token) => (
            <SecondaryCard
              key={token.symbol}
              className="flex items-center justify-between p-3"
            >
              <div className="flex items-center gap-3">
                <div className="bg-primary/20 flex h-8 w-8 items-center justify-center rounded-full">
                  {token.icon}
                </div>
                <span className="font-medium">{token.symbol}</span>
              </div>
              <div className="text-right">
                <p className="font-semibold">{formatNumber(token.amount)}</p>
                <p className="text-xs">${formatNumber(token.usdValue)}</p>
              </div>
            </SecondaryCard>
          ))}
        </div>
      </div>
    );
  return null;
};

export default TokenBreakdownList;
