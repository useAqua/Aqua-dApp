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
