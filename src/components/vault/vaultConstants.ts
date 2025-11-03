/**
 * Shared constants for vault deposit and withdraw operations
 */

export const PERCENTAGE_PRESETS = [0.25, 0.5, 0.75, 1] as const;
export const SLIPPAGE_TOLERANCE = BigInt(95);
export const SLIPPAGE_DENOMINATOR = BigInt(100);
export const PERCENTAGE_MULTIPLIER = BigInt(100);
