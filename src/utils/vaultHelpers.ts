import type { EnrichedVaultInfo, VaultDetailInfo } from "~/types/vault";
import { formatUnits } from "viem";

export function enrichVaultWithMockData(
  vault: VaultDetailInfo,
): EnrichedVaultInfo {
  console.log({
    lastHarvestTime: vault.strategy.lastHarvest,
  });
  const lastHarvestTime =
    vault.strategy.lastHarvest && vault.strategy.lastHarvest > BigInt(0)
      ? formatLastHarvest(vault.strategy.lastHarvest)
      : "Never";

  const tvl = `$${vault.tvlUsd.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
  const mockApy = "2,680%";
  const mockDeposit = "$0";

  // Use actual token reserves and prices from TokenInfo
  let token0Reserve = vault.tokens.token0.reserve;
  let token1Reserve = vault.tokens.token1.reserve;
  let lpReserve = vault.tokens.lpToken.reserve;

  let token0UsdValue = token0Reserve * vault.tokens.token0.price;
  let token1UsdValue = token1Reserve * vault.tokens.token1.price;

  // Calculate lpUsdValue and projected lpReserve
  let lpUsdValue: number;

  if (lpReserve === 0) {
    // If lpReserve is zero, calculate from token0 and token1 USD values
    lpUsdValue = token0UsdValue + token1UsdValue;
    // Calculate projected lpReserve based on LP token price
    lpReserve =
      vault.tokens.lpToken.price > 0
        ? lpUsdValue / vault.tokens.lpToken.price
        : 0;
  } else {
    // Determine the actual values from the tvl worth of the LP token
    lpUsdValue = lpReserve * vault.tokens.lpToken.price;
    const totalTokenValue = token0UsdValue + token1UsdValue;
    token0UsdValue = lpUsdValue * (token0UsdValue / totalTokenValue);
    token1UsdValue = lpUsdValue * (token1UsdValue / totalTokenValue);

    token0Reserve = token0UsdValue / vault.tokens.token0.price;
    token1Reserve = token1UsdValue / vault.tokens.token1.price;
  }

  // Calculate percentages based on token values
  const totalTokenValue = token0UsdValue + token1UsdValue;
  const token0Percentage =
    totalTokenValue > 0 ? (token0UsdValue / totalTokenValue) * 100 : 50;
  const token1Percentage =
    totalTokenValue > 0 ? (token1UsdValue / totalTokenValue) * 100 : 50;

  const lpBreakdown = {
    token0Percentage: parseFloat(token0Percentage.toFixed(2)),
    token1Percentage: parseFloat(token1Percentage.toFixed(2)),
    token0Amount: token0Reserve.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }),
    token1Amount: token1Reserve.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 5,
    }),
    token0UsdValue: `$${token0UsdValue.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`,
    token1UsdValue: `$${token1UsdValue.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`,
    lpAmount: lpReserve.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 3,
    }),
    lpUsdValue: `$${lpUsdValue.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`,
  };

  const apyBreakdown = {
    totalApy: mockApy,
    vaultApr: "330.28%",
    boostApr: "68.15%",
  };

  return {
    ...vault,
    tvl,
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
