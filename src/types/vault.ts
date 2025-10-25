import type { Address } from "viem";

export type Protocol = string;

export interface Vault {
  id: string;
  name: string;
  protocol: Protocol;
  icon: string;
  boost: boolean;
  atDeposit: string;
  atDepositUsd: string;
  now: string;
  nowUsd: string;
  yield: string;
  yieldUsd: string;
  wallet: string;
  pnlPercent: string;
  apy: string;
  apyPercent: string;
  dailyYield: string;
  tvl: string;
  apyValue: string;
  deposit: string;
  lastHarvest: string;
}

export interface VaultTableEntry {
  address: Address;
  name: string;
  platformId: string;
  tvlUsd: number;
  walletBalanceUsd: number;
  userDepositUsd: number;
  userPoints: number;
  apy: number;
  id: string;
}

export interface TokenInfo {
  address: Address;
  name: string;
  symbol: string;
  decimals: number;
  price: number;
  reserve: number;
}

export interface StrategyInfo {
  address: Address;
  lastHarvest: bigint | null;
  depositFee: bigint | null;
  withdrawFee: bigint | null;
}

export interface VaultDetailInfo {
  name: string;
  id: string;
  platformId: string;
  strategy: StrategyInfo;
  address: Address;
  tvlUsd: number;
  sharePrice: number;
  tokens: {
    token0: TokenInfo;
    token1: TokenInfo;
    lpToken: TokenInfo;
  };
}

/**
 * Enriched vault data with computed/mock fields for UI display
 * This extends VaultDetailInfo with additional display-ready fields
 * All enriched fields are required (not optional)
 */
export interface EnrichedVaultInfo extends VaultDetailInfo {
  tvl: number;
  apyValue: number;
  deposit: number;
  lastHarvest: string;
  lpBreakdown: {
    token0Percentage: number;
    token1Percentage: number;
    token0Amount: number;
    token1Amount: number;
    token0UsdValue: number;
    token1UsdValue: number;
    lpAmount: number;
    lpUsdValue: number;
  };
  apyBreakdown: {
    totalApy: number;
    vaultApr: number;
  };
}

export type Vaults = Vault[];

export interface VaultStats {
  totalTvl: string;
  totalDeposits: string;
  totalYield: string;
  averageApy: string;
  activeVaults: number;
  boostedVaults: number;
}

export interface VaultFilters {
  protocol?: Protocol[];
  boost?: boolean;
  minApy?: number;
  maxApy?: number;
  hasDeposits?: boolean;
}

export type VaultSortBy =
  | "name"
  | "protocol"
  | "apy"
  | "tvl"
  | "pnl"
  | "yield"
  | "lastHarvest";

export type VaultSortOrder = "asc" | "desc";

export interface VaultSortConfig {
  sortBy: VaultSortBy;
  order: VaultSortOrder;
}
