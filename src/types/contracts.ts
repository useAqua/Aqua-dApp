import type { Address } from "viem";

export interface VaultInfo {
  name: string;
  strategy: Address;
  isPaused: boolean;
  token0: Address;
  token1: Address;
  lpToken: Address;
  blockNumber: bigint;
  retired: boolean;
  gasOverhead: bigint;
  icon: string;
}

export interface CampaignInfo {
  creator: `0x${string}`;
  startTime: bigint;
  endTime: bigint;
  phaseDuration: bigint;
  protocolFeeBps: bigint;
  active: boolean;
  whitelistEnabled: boolean;
  name: string;
  id: number;
  vaults: CampaignVaults[];
}

export interface CampaignVaults {
  asset: `0x${string}`;
  aToken: `0x${string}`;
  vault: `0x${string}`;
  addedInPhase: bigint;
  enabled: boolean;
}

export type VaultConfigs = Map<Address, VaultInfo>;
export type CampaignConfigs = Map<number, CampaignInfo>;

export interface LPInfo {
  token0: Address;
  token1: Address;
  symbol0: string;
  symbol1: string;
  reserve0: bigint;
  reserve1: bigint;
  price0: bigint;
  price1: bigint;
  fairValue: bigint;
}

export interface VaultTVL {
  value: bigint;
  usdValue: string;
  lpPrice: string;
  decimals: number;
  lpTokenAddress: Address;
  lpInfo: LPInfo;
}

export type VaultTVLMap = Map<Address, VaultTVL>;
