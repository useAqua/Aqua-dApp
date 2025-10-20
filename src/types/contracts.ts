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

export type VaultConfigs = Map<Address, VaultInfo>;

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
  usdValue: number;
  lpPrice: number;
  decimals: number;
  lpTokenAddress: Address;
  lpInfo: LPInfo;
}

export type VaultTVLMap = Map<Address, VaultTVL>;
