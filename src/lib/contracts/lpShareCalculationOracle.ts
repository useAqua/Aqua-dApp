import { type Abi, getAddress } from "viem";
import { env } from "~/env";

const contract = {
  address: getAddress(env.LP_SHARE_CALCULATION_ORACLE),
  abi: [
    { inputs: [], stateMutability: "nonpayable", type: "constructor" },
    {
      inputs: [{ internalType: "address", name: "token", type: "address" }],
      name: "CannotDerivePrice",
      type: "error",
    },
    {
      inputs: [{ internalType: "address", name: "token", type: "address" }],
      name: "InvalidPrice",
      type: "error",
    },
    {
      inputs: [{ internalType: "address", name: "lpToken", type: "address" }],
      name: "NoReferenceToken",
      type: "error",
    },
    {
      inputs: [{ internalType: "address", name: "owner", type: "address" }],
      name: "OwnableInvalidOwner",
      type: "error",
    },
    {
      inputs: [{ internalType: "address", name: "account", type: "address" }],
      name: "OwnableUnauthorizedAccount",
      type: "error",
    },
    {
      inputs: [{ internalType: "address", name: "token", type: "address" }],
      name: "PriceFeedNotSet",
      type: "error",
    },
    {
      inputs: [
        { internalType: "address", name: "token", type: "address" },
        { internalType: "uint256", name: "age", type: "uint256" },
      ],
      name: "StalePrice",
      type: "error",
    },
    {
      inputs: [{ internalType: "address", name: "token", type: "address" }],
      name: "TokenAlreadyWhitelisted",
      type: "error",
    },
    {
      inputs: [{ internalType: "address", name: "token", type: "address" }],
      name: "TokenNotWhitelisted",
      type: "error",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "lpToken",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "fairValue",
          type: "uint256",
        },
      ],
      name: "LPValueCalculated",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "token",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "price",
          type: "uint256",
        },
      ],
      name: "ManualPriceSet",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "newMaxAge",
          type: "uint256",
        },
      ],
      name: "MaxPriceAgeUpdated",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "previousOwner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "OwnershipTransferred",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "token",
          type: "address",
        },
        {
          indexed: false,
          internalType: "address",
          name: "priceFeed",
          type: "address",
        },
      ],
      name: "PriceFeedUpdated",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "token",
          type: "address",
        },
        {
          indexed: false,
          internalType: "address",
          name: "priceFeed",
          type: "address",
        },
      ],
      name: "ReferenceTokenAdded",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "token",
          type: "address",
        },
      ],
      name: "ReferenceTokenRemoved",
      type: "event",
    },
    {
      inputs: [
        { internalType: "address", name: "token", type: "address" },
        { internalType: "address", name: "priceFeed", type: "address" },
      ],
      name: "addReferenceToken",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address[]", name: "tokens", type: "address[]" },
        { internalType: "address[]", name: "priceFeeds", type: "address[]" },
      ],
      name: "batchAddReferenceTokens",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address[]", name: "lpTokens", type: "address[]" },
      ],
      name: "batchCalculateFairValues",
      outputs: [
        { internalType: "uint256[]", name: "values", type: "uint256[]" },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "lpToken", type: "address" }],
      name: "calculateLPValue",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "lpToken", type: "address" }],
      name: "getLPInfo",
      outputs: [
        { internalType: "address", name: "token0", type: "address" },
        { internalType: "address", name: "token1", type: "address" },
        { internalType: "string", name: "symbol0", type: "string" },
        { internalType: "string", name: "symbol1", type: "string" },
        { internalType: "uint256", name: "reserve0", type: "uint256" },
        { internalType: "uint256", name: "reserve1", type: "uint256" },
        { internalType: "uint256", name: "price0", type: "uint256" },
        { internalType: "uint256", name: "price1", type: "uint256" },
        { internalType: "uint256", name: "fairValue", type: "uint256" },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "token", type: "address" }],
      name: "getOraclePrice",
      outputs: [{ internalType: "uint256", name: "price", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getReferenceTokenCount",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getReferenceTokens",
      outputs: [{ internalType: "address[]", name: "", type: "address[]" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "token", type: "address" },
        { internalType: "address", name: "pairedToken", type: "address" },
        { internalType: "uint256", name: "tokenReserve", type: "uint256" },
        { internalType: "uint256", name: "pairedReserve", type: "uint256" },
      ],
      name: "getTokenPrice",
      outputs: [{ internalType: "uint256", name: "price", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "", type: "address" }],
      name: "isReferenceToken",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "", type: "address" }],
      name: "manualPrices",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "maxPriceAge",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "owner",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      name: "referenceTokens",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "token", type: "address" }],
      name: "removeReferenceToken",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "renounceOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "_maxAge", type: "uint256" }],
      name: "setMaxPriceAge",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "", type: "address" }],
      name: "tokenPriceFeeds",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
      name: "transferOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "token", type: "address" },
        { internalType: "address", name: "priceFeed", type: "address" },
      ],
      name: "updatePriceFeed",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "", type: "address" }],
      name: "useManualPrice",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "view",
      type: "function",
    },
  ],
} as const satisfies { address: `0x${string}`; abi: Abi };

export default contract;
