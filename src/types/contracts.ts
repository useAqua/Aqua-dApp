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
export type CampaignConfigs = Map<number, CampaignInfo>;
