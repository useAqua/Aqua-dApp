import type {
  VaultTableEntry,
  VaultDetailInfo,
  EnrichedVaultInfo,
} from "~/types";
import type { Address } from "viem";

// Mock addresses - using realistic hex patterns
const MOCK_ADDRESSES = {
  vault1: "0x1234567890123456789012345678901234567890" as Address,
  vault2: "0x2234567890123456789012345678901234567890" as Address,
  vault3: "0x3234567890123456789012345678901234567890" as Address,
  vault4: "0x4234567890123456789012345678901234567890" as Address,
  vault5: "0x5234567890123456789012345678901234567890" as Address,
  token0_1: "0xa234567890123456789012345678901234567890" as Address,
  token1_1: "0xb234567890123456789012345678901234567890" as Address,
  lpToken1: "0xc234567890123456789012345678901234567890" as Address,
  token0_2: "0xd234567890123456789012345678901234567890" as Address,
  token1_2: "0xe234567890123456789012345678901234567890" as Address,
  lpToken2: "0xf234567890123456789012345678901234567890" as Address,
  token0_3: "0x1a34567890123456789012345678901234567890" as Address,
  token1_3: "0x1b34567890123456789012345678901234567890" as Address,
  lpToken3: "0x1c34567890123456789012345678901234567890" as Address,
  token0_4: "0x1d34567890123456789012345678901234567890" as Address,
  token1_4: "0x1e34567890123456789012345678901234567890" as Address,
  lpToken4: "0x1f34567890123456789012345678901234567890" as Address,
  token0_5: "0x2a34567890123456789012345678901234567890" as Address,
  token1_5: "0x2b34567890123456789012345678901234567890" as Address,
  lpToken5: "0x2c34567890123456789012345678901234567890" as Address,
  strategy1: "0x3a34567890123456789012345678901234567890" as Address,
  strategy2: "0x3b34567890123456789012345678901234567890" as Address,
  strategy3: "0x3c34567890123456789012345678901234567890" as Address,
  strategy4: "0x3d34567890123456789012345678901234567890" as Address,
  strategy5: "0x3e34567890123456789012345678901234567890" as Address,
} as const;

// Mock vault table data
export const MOCK_VAULT_TABLE: VaultTableEntry[] = [
  {
    address: MOCK_ADDRESSES.vault1,
    name: "ETH/USD",
    platformId: "uniswap",
    tvlUsd: 2500000,
    walletBalanceUsd: 0,
    userDepositUsd: 0,
    userPoints: 0,
    apy: 8.5,
    id: "uniswap-eth-usd",
  },
  {
    address: MOCK_ADDRESSES.vault2,
    name: "USDC/USDT",
    platformId: "uniswap",
    tvlUsd: 1800000,
    walletBalanceUsd: 0,
    userDepositUsd: 0,
    userPoints: 0,
    apy: 5.2,
    id: "uniswap-usdc-usdt",
  },
  {
    address: MOCK_ADDRESSES.vault3,
    name: "GTE/ETH",
    platformId: "uniswap",
    tvlUsd: 3200000,
    walletBalanceUsd: 0,
    userDepositUsd: 0,
    userPoints: 0,
    apy: 12.3,
    id: "uniswap-gte-eth",
  },
  {
    address: MOCK_ADDRESSES.vault4,
    name: "DAI/USDC",
    platformId: "uniswap",
    tvlUsd: 1500000,
    walletBalanceUsd: 0,
    userDepositUsd: 0,
    userPoints: 0,
    apy: 4.8,
    id: "uniswap-dai-usdc",
  },
  {
    address: MOCK_ADDRESSES.vault5,
    name: "WBTC/USDC",
    platformId: "uniswap",
    tvlUsd: 2100000,
    walletBalanceUsd: 0,
    userDepositUsd: 0,
    userPoints: 0,
    apy: 9.7,
    id: "uniswap-wbtc-usdc",
  },
];

// Mock user vault data
export const MOCK_USER_VAULT_DATA: Record<
  string,
  {
    balance: string;
    balanceUsd: string;
    points: bigint;
    vaultBalance: string;
    vaultBalanceUsd: string;
  }
> = {
  [MOCK_ADDRESSES.vault1]: {
    balance: "5000000000000000000",
    balanceUsd: "12500",
    points: BigInt(450),
    vaultBalance: "10000000000000000000",
    vaultBalanceUsd: "25000",
  },
  [MOCK_ADDRESSES.vault2]: {
    balance: "2500000000000000000",
    balanceUsd: "2500",
    points: BigInt(200),
    vaultBalance: "5000000000000000000",
    vaultBalanceUsd: "5000",
  },
  [MOCK_ADDRESSES.vault3]: {
    balance: "8000000000000000000",
    balanceUsd: "32000",
    points: BigInt(780),
    vaultBalance: "15000000000000000000",
    vaultBalanceUsd: "60000",
  },
  [MOCK_ADDRESSES.vault4]: {
    balance: "3000000000000000000",
    balanceUsd: "3000",
    points: BigInt(150),
    vaultBalance: "6000000000000000000",
    vaultBalanceUsd: "6000",
  },
  [MOCK_ADDRESSES.vault5]: {
    balance: "4000000000000000000",
    balanceUsd: "8000",
    points: BigInt(320),
    vaultBalance: "8000000000000000000",
    vaultBalanceUsd: "16000",
  },
};

// Mock APY data
export const MOCK_APY_DATA: Record<
  string,
  {
    apy: number;
    apr: number;
  }
> = {
  [MOCK_ADDRESSES.vault1]: {
    apy: 0.085,
    apr: 0.082,
  },
  [MOCK_ADDRESSES.vault2]: {
    apy: 0.052,
    apr: 0.051,
  },
  [MOCK_ADDRESSES.vault3]: {
    apy: 0.123,
    apr: 0.119,
  },
  [MOCK_ADDRESSES.vault4]: {
    apy: 0.048,
    apr: 0.047,
  },
  [MOCK_ADDRESSES.vault5]: {
    apy: 0.097,
    apr: 0.094,
  },
};

// Mock vault detail info
export const MOCK_VAULT_DETAIL: Record<string, VaultDetailInfo> = {
  [MOCK_ADDRESSES.vault1]: {
    name: "ETH/USD",
    id: "uniswap-eth-usd",
    platformId: "uniswap",
    address: MOCK_ADDRESSES.vault1,
    tvlUsd: "2500000",
    sharePrice: "1.25",
    strategy: {
      address: MOCK_ADDRESSES.strategy1,
      lastHarvest: BigInt(Math.floor(Date.now() / 1000) - 3600),
      depositFee: BigInt(0),
      withdrawFee: BigInt(0),
    },
    tokens: {
      token0: {
        address: MOCK_ADDRESSES.token0_1,
        name: "Ethereum",
        symbol: "ETH",
        decimals: 18,
        price: "2500",
        reserve: "1000000000000000000000",
      },
      token1: {
        address: MOCK_ADDRESSES.token1_1,
        name: "USD Coin",
        symbol: "USDC",
        decimals: 6,
        price: "1",
        reserve: "2500000000000",
      },
      lpToken: {
        address: MOCK_ADDRESSES.lpToken1,
        name: "Uniswap V2 ETH/USDC",
        symbol: "UNI-V2",
        decimals: 18,
        price: "2500",
        reserve: "2000000000000000000000",
      },
    },
  },
  [MOCK_ADDRESSES.vault2]: {
    name: "USDC/USDT",
    id: "uniswap-usdc-usdt",
    platformId: "uniswap",
    address: MOCK_ADDRESSES.vault2,
    tvlUsd: "1800000",
    sharePrice: "1.01",
    strategy: {
      address: MOCK_ADDRESSES.strategy2,
      lastHarvest: BigInt(Math.floor(Date.now() / 1000) - 7200),
      depositFee: BigInt(0),
      withdrawFee: BigInt(0),
    },
    tokens: {
      token0: {
        address: MOCK_ADDRESSES.token0_2,
        name: "USD Coin",
        symbol: "USDC",
        decimals: 6,
        price: "1",
        reserve: "1000000000000",
      },
      token1: {
        address: MOCK_ADDRESSES.token1_2,
        name: "Tether",
        symbol: "USDT",
        decimals: 6,
        price: "1",
        reserve: "1000000000000",
      },
      lpToken: {
        address: MOCK_ADDRESSES.lpToken2,
        name: "Uniswap V2 USDC/USDT",
        symbol: "UNI-V2",
        decimals: 18,
        price: "1.01",
        reserve: "1800000000000000000000",
      },
    },
  },
  [MOCK_ADDRESSES.vault3]: {
    name: "GTE/ETH",
    id: "uniswap-gte-eth",
    platformId: "uniswap",
    address: MOCK_ADDRESSES.vault3,
    tvlUsd: "3200000",
    sharePrice: "1.45",
    strategy: {
      address: MOCK_ADDRESSES.strategy3,
      lastHarvest: BigInt(Math.floor(Date.now() / 1000) - 1800),
      depositFee: BigInt(0),
      withdrawFee: BigInt(0),
    },
    tokens: {
      token0: {
        address: MOCK_ADDRESSES.token0_3,
        name: "Genesis Token",
        symbol: "GTE",
        decimals: 18,
        price: "0.95",
        reserve: "3500000000000000000000",
      },
      token1: {
        address: MOCK_ADDRESSES.token1_3,
        name: "Ethereum",
        symbol: "ETH",
        decimals: 18,
        price: "2500",
        reserve: "1500000000000000000",
      },
      lpToken: {
        address: MOCK_ADDRESSES.lpToken3,
        name: "Uniswap V2 GTE/ETH",
        symbol: "UNI-V2",
        decimals: 18,
        price: "1.45",
        reserve: "2200000000000000000000",
      },
    },
  },
  [MOCK_ADDRESSES.vault4]: {
    name: "DAI/USDC",
    id: "uniswap-dai-usdc",
    platformId: "uniswap",
    address: MOCK_ADDRESSES.vault4,
    tvlUsd: "1500000",
    sharePrice: "1.00",
    strategy: {
      address: MOCK_ADDRESSES.strategy4,
      lastHarvest: BigInt(Math.floor(Date.now() / 1000) - 5400),
      depositFee: BigInt(0),
      withdrawFee: BigInt(0),
    },
    tokens: {
      token0: {
        address: MOCK_ADDRESSES.token0_4,
        name: "Dai",
        symbol: "DAI",
        decimals: 18,
        price: "1",
        reserve: "750000000000000000000",
      },
      token1: {
        address: MOCK_ADDRESSES.token1_4,
        name: "USD Coin",
        symbol: "USDC",
        decimals: 6,
        price: "1",
        reserve: "750000000000",
      },
      lpToken: {
        address: MOCK_ADDRESSES.lpToken4,
        name: "Uniswap V2 DAI/USDC",
        symbol: "UNI-V2",
        decimals: 18,
        price: "1.00",
        reserve: "1500000000000000000000",
      },
    },
  },
  [MOCK_ADDRESSES.vault5]: {
    name: "WBTC/USDC",
    id: "uniswap-wbtc-usdc",
    platformId: "uniswap",
    address: MOCK_ADDRESSES.vault5,
    tvlUsd: "2100000",
    sharePrice: "2.10",
    strategy: {
      address: MOCK_ADDRESSES.strategy5,
      lastHarvest: BigInt(Math.floor(Date.now() / 1000) - 2700),
      depositFee: BigInt(0),
      withdrawFee: BigInt(0),
    },
    tokens: {
      token0: {
        address: MOCK_ADDRESSES.token0_5,
        name: "Wrapped Bitcoin",
        symbol: "WBTC",
        decimals: 8,
        price: "52000",
        reserve: "40000000",
      },
      token1: {
        address: MOCK_ADDRESSES.token1_5,
        name: "USD Coin",
        symbol: "USDC",
        decimals: 6,
        price: "1",
        reserve: "2080000000000",
      },
      lpToken: {
        address: MOCK_ADDRESSES.lpToken5,
        name: "Uniswap V2 WBTC/USDC",
        symbol: "UNI-V2",
        decimals: 18,
        price: "2.10",
        reserve: "1000000000000000000000",
      },
    },
  },
};

// Helper function to get enriched vault info with mock data
export const getEnrichedMockVaultInfo = (
  vaultId: string,
): EnrichedVaultInfo | null => {
  // Find the vault by ID
  const vaultKey = Object.entries(MOCK_VAULT_DETAIL).find(
    ([, vault]) => vault.id === vaultId,
  )?.[0];

  if (!vaultKey) return null;

  const vaultDetail = MOCK_VAULT_DETAIL[vaultKey];
  if (!vaultDetail) return null;

  const apyData = MOCK_APY_DATA[vaultKey] ?? { apy: 0, apr: 0 };

  const tvl = parseFloat(vaultDetail.tvlUsd);
  const lpTokenPrice = parseFloat(vaultDetail.tokens.lpToken.price);
  const token0Price = parseFloat(vaultDetail.tokens.token0.price);
  const token1Price = parseFloat(vaultDetail.tokens.token1.price);
  const token0Reserve = parseFloat(vaultDetail.tokens.token0.reserve);
  const token1Reserve = parseFloat(vaultDetail.tokens.token1.reserve);

  // Calculate LP breakdown
  const token0Decimals = vaultDetail.tokens.token0.decimals;
  const token1Decimals = vaultDetail.tokens.token1.decimals;

  const token0Amount = token0Reserve / Math.pow(10, token0Decimals);
  const token1Amount = token1Reserve / Math.pow(10, token1Decimals);

  const token0UsdValue = token0Amount * token0Price;
  const token1UsdValue = token1Amount * token1Price;
  const totalUsdValue = token0UsdValue + token1UsdValue;

  const token0Percentage =
    totalUsdValue > 0 ? (token0UsdValue / totalUsdValue) * 100 : 0;
  const token1Percentage =
    totalUsdValue > 0 ? (token1UsdValue / totalUsdValue) * 100 : 0;

  return {
    ...vaultDetail,
    tvl,
    apyValue: apyData.apy * 100,
    deposit: 0, // Will be filled with real user data when available
    lastHarvest: vaultDetail.strategy.lastHarvest
      ? new Date(Number(vaultDetail.strategy.lastHarvest) * 1000).toISOString()
      : "Never",
    lpBreakdown: {
      token0Percentage,
      token1Percentage,
      token0Amount,
      token1Amount,
      token0UsdValue,
      token1UsdValue,
      lpAmount: 1000, // Mock value
      lpUsdValue: 1000 * lpTokenPrice,
    },
    apyBreakdown: {
      totalApy: apyData.apy * 100,
      vaultApr: apyData.apr * 100,
    },
  };
};
