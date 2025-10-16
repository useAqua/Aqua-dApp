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
}

export type VaultConfigs = Map<Address, VaultInfo>;
