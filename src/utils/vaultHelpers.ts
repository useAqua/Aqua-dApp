import type { EnrichedVaultInfo, VaultDetailInfo } from "~/types/vault";
import { formatUnits } from "viem";

export function generateVaultDescription(
  token0Symbol: string,
  token1Symbol: string,
): string {
  return `<strong>${token0Symbol}/${token1Symbol} LP</strong> tokens are deposited into GTE's AMM, earning trading fees, incentives, and points. Earned GTE is converted into equal parts <strong>${token0Symbol}</strong> and <strong>${token1Symbol}</strong> to mint more LP tokens. The strategy reinvests these tokens back into the pool, automating the compounding process while socializing gas costs across the vault.`;
}

export function enrichVaultWithMockData(
  vault: VaultDetailInfo,
  apyData: {
    apy: number;
    apr: number;
  },
): EnrichedVaultInfo {
  const lastHarvestTime =
    vault.strategy.lastHarvest && vault.strategy.lastHarvest > BigInt(0)
      ? formatLastHarvest(vault.strategy.lastHarvest)
      : "Never";

  const tvl = vault.tvlUsd;

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
    token0Amount: token0Reserve,
    token1Amount: token1Reserve,
    token0UsdValue: token0UsdValue,
    token1UsdValue: token1UsdValue,
    lpAmount: lpReserve,
    lpUsdValue: lpUsdValue,
  };

  const apyBreakdown = {
    totalApy: apyData.apy,
    vaultApr: apyData.apr,
  };

  return {
    ...vault,
    tvl,
    deposit: 0,
    apyValue: apyData.apy,
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
