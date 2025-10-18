import type { EnrichedVaultInfo, VaultDetailInfo } from "~/types/vault";
import { formatUnits } from "viem";

export function enrichVaultWithMockData(
  vault: VaultDetailInfo,
): EnrichedVaultInfo {
  const lastHarvestTime = vault.strategy.lastHarvest
    ? formatLastHarvest(vault.strategy.lastHarvest)
    : "Never";

  const mockTvl = "$780,180";
  const mockApy = "2,680%";
  const mockDeposit = "$0";

  const lpBreakdown = {
    token0Percentage: 49.82,
    token1Percentage: 50.18,
    token0Amount: "1,734,349.9",
    token1Amount: "102.37056",
    token0UsdValue: "$388,731",
    token1UsdValue: "$391,449",
    lpAmount: "13,323.777",
    lpUsdValue: mockTvl,
  };

  const apyBreakdown = {
    totalApy: mockApy,
    vaultApr: "330.28%",
    boostApr: "68.15%",
  };

  return {
    ...vault,
    tvl: mockTvl,
    apyValue: mockApy,
    deposit: mockDeposit,
    lastHarvest: lastHarvestTime,
    lpBreakdown,
    apyBreakdown,
  };
}

function formatLastHarvest(timestamp: bigint): string {
  try {
    const date = new Date(Number(timestamp) * 1000);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays}d ago`;
    } else if (diffHours > 0) {
      return `${diffHours}h ago`;
    } else {
      return "Recently";
    }
  } catch {
    return "Unknown";
  }
}

export function formatFeePercentage(fee: bigint | null): string {
  if (fee === null) return "0%";

  try {
    const feeNumber = Number(formatUnits(fee, 2));
    return `${feeNumber}%`;
  } catch {
    return "0%";
  }
}
