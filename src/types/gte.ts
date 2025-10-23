type TMarketType = "amm";

interface Token {
  address: `0x${string}`;
  decimals: number;
  name: string;
  symbol: string;
  totalSupply: number;
  logoUri: string;
  priceUsd: number;
  volume1HrUsd: number;
  volume24HrUsd: number;
  marketCapUsd: number;
  marketType: TMarketType;
}

export interface GTEMarket {
  marketType: TMarketType;
  address: `0x${string}`;
  baseToken: Token;
  quoteToken: Token;
  price: number;
  priceUsd: number;
  volume24HrUsd: number;
  priceChange24Hr: number;
  priceChange1Hr: number;
  volume1HrUsd: number;
  marketCapUsd: number;
  createdAt: number;
  tvlUsd: number;
  liquidityUsd: number;
  bondingPercentage: number;
}
