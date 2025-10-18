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

export interface VaultTVL {
  value: bigint;
  usdValue: number;
  lpPrice: number;
  decimals: number;
  lpTokenAddress: Address;
}

export type VaultTVLMap = Map<Address, VaultTVL>;
