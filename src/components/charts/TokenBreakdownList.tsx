import { SecondaryCard } from "~/components/common/SecondaryCard";

interface TokenBreakdownItem {
  icon: string;
  symbol: string;
  amount: string;
  usdValue: string;
}

interface TokenBreakdownListProps {
  tokens?: TokenBreakdownItem[];
}

const defaultTokens: TokenBreakdownItem[] = [
  {
    icon: "🔷",
    symbol: "SYND",
    amount: "1,734,349.9",
    usdValue: "$388,731",
  },
  {
    icon: "⟠",
    symbol: "WETH",
    amount: "102.37056",
    usdValue: "$391,449",
  },
  {
    icon: "🔄",
    symbol: "LP",
    amount: "13,323.777",
    usdValue: "$780,180",
  },
];

const TokenBreakdownList = ({
  tokens = defaultTokens,
}: TokenBreakdownListProps) => {
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
              <p className="font-semibold">{token.amount}</p>
              <p className="text-xs">{token.usdValue}</p>
            </div>
          </SecondaryCard>
        ))}
      </div>
    </div>
  );
};

export default TokenBreakdownList;
