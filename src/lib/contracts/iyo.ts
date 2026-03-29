import { type Abi, getAddress, zeroAddress } from "viem";
import { env } from "~/env";

const contract = {
  address: getAddress(zeroAddress),
  abi: [
    {
      inputs: [
        { internalType: "address", name: "_aavePool", type: "address" },
        { internalType: "address", name: "_treasury", type: "address" },
        { internalType: "bool", name: "_permissioned", type: "bool" },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    { inputs: [], name: "CampaignNotActive", type: "error" },
    { inputs: [], name: "EnforcedPause", type: "error" },
    { inputs: [], name: "ExpectedPause", type: "error" },
    { inputs: [], name: "InvalidCampaign", type: "error" },
    { inputs: [], name: "InvalidCampaignPeriod", type: "error" },
    { inputs: [], name: "InvalidFeeBps", type: "error" },
    { inputs: [], name: "InvalidVault", type: "error" },
    { inputs: [], name: "NoPosition", type: "error" },
    { inputs: [], name: "NotWhitelisted", type: "error" },
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
    { inputs: [], name: "ReentrancyGuardReentrantCall", type: "error" },
    {
      inputs: [{ internalType: "address", name: "token", type: "address" }],
      name: "SafeERC20FailedOperation",
      type: "error",
    },
    { inputs: [], name: "Unauthorized", type: "error" },
    { inputs: [], name: "VaultNotAvailable", type: "error" },
    { inputs: [], name: "VaultNotEnabled", type: "error" },
    { inputs: [], name: "ZeroAddress", type: "error" },
    { inputs: [], name: "ZeroAmount", type: "error" },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "campaignId",
          type: "uint256",
        },
        {
          indexed: true,
          internalType: "address",
          name: "creator",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "startTime",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "endTime",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "protocolFeeBps",
          type: "uint256",
        },
      ],
      name: "CampaignCreated",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "campaignId",
          type: "uint256",
        },
      ],
      name: "CampaignDeactivated",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "campaignId",
          type: "uint256",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "vaultIndex",
          type: "uint256",
        },
        {
          indexed: true,
          internalType: "address",
          name: "user",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "shares",
          type: "uint256",
        },
      ],
      name: "Deposited",
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
          indexed: false,
          internalType: "address",
          name: "account",
          type: "address",
        },
      ],
      name: "Paused",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "campaignId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "newFeeBps",
          type: "uint256",
        },
      ],
      name: "ProtocolFeeBpsUpdated",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "oldTreasury",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "newTreasury",
          type: "address",
        },
      ],
      name: "TreasuryUpdated",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "account",
          type: "address",
        },
      ],
      name: "Unpaused",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "campaignId",
          type: "uint256",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "vaultIndex",
          type: "uint256",
        },
        {
          indexed: true,
          internalType: "address",
          name: "vault",
          type: "address",
        },
        {
          indexed: false,
          internalType: "address",
          name: "asset",
          type: "address",
        },
        {
          indexed: false,
          internalType: "address",
          name: "aToken",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "phase",
          type: "uint256",
        },
      ],
      name: "VaultAdded",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "campaignId",
          type: "uint256",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "vaultIndex",
          type: "uint256",
        },
        { indexed: false, internalType: "bool", name: "enabled", type: "bool" },
      ],
      name: "VaultToggled",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "campaignId",
          type: "uint256",
        },
        {
          indexed: true,
          internalType: "address",
          name: "nft",
          type: "address",
        },
        { indexed: false, internalType: "bool", name: "allowed", type: "bool" },
      ],
      name: "WhitelistNFTUpdated",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "campaignId",
          type: "uint256",
        },
        { indexed: false, internalType: "bool", name: "enabled", type: "bool" },
      ],
      name: "WhitelistToggled",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "campaignId",
          type: "uint256",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "vaultIndex",
          type: "uint256",
        },
        {
          indexed: true,
          internalType: "address",
          name: "user",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "principalReturned",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "bool",
          name: "earlyExit",
          type: "bool",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "yieldForfeited",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "principalPenalty",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "protocolYield",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "userYield",
          type: "uint256",
        },
      ],
      name: "Withdrawn",
      type: "event",
    },
    {
      inputs: [],
      name: "BPS",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "DEFAULT_CAMPAIGN_DURATION",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "DEFAULT_PHASE_DURATION",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "DEFAULT_PROTOCOL_FEE_BPS",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "EARLY_EXIT_PRINCIPAL_PENALTY_BPS",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "MAX_PROTOCOL_FEE_BPS",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "aavePool",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "uint256", name: "campaignId", type: "uint256" },
        { internalType: "address", name: "asset", type: "address" },
        { internalType: "address", name: "aToken", type: "address" },
      ],
      name: "addVault",
      outputs: [
        { internalType: "uint256", name: "vaultIndex", type: "uint256" },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "campaignCount",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "uint256", name: "_startTime", type: "uint256" },
        { internalType: "uint256", name: "_duration", type: "uint256" },
        { internalType: "uint256", name: "_phaseDuration", type: "uint256" },
        { internalType: "uint256", name: "_protocolFeeBps", type: "uint256" },
      ],
      name: "createCampaign",
      outputs: [
        { internalType: "uint256", name: "campaignId", type: "uint256" },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "uint256", name: "campaignId", type: "uint256" },
      ],
      name: "deactivateCampaign",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "uint256", name: "campaignId", type: "uint256" },
        { internalType: "uint256", name: "vaultIndex", type: "uint256" },
        { internalType: "uint256", name: "amount", type: "uint256" },
      ],
      name: "deposit",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "uint256", name: "campaignId", type: "uint256" },
        { internalType: "uint256", name: "vaultIndex", type: "uint256" },
        { internalType: "uint256", name: "sharesToWithdraw", type: "uint256" },
      ],
      name: "earlyExit",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "uint256", name: "campaignId", type: "uint256" },
        { internalType: "uint256", name: "vaultIndex", type: "uint256" },
        { internalType: "address", name: "user", type: "address" },
      ],
      name: "estimatedUserYield",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "uint256", name: "campaignId", type: "uint256" },
      ],
      name: "getCampaign",
      outputs: [
        {
          components: [
            { internalType: "address", name: "creator", type: "address" },
            { internalType: "uint256", name: "startTime", type: "uint256" },
            { internalType: "uint256", name: "endTime", type: "uint256" },
            { internalType: "uint256", name: "phaseDuration", type: "uint256" },
            {
              internalType: "uint256",
              name: "protocolFeeBps",
              type: "uint256",
            },
            { internalType: "bool", name: "active", type: "bool" },
            { internalType: "bool", name: "whitelistEnabled", type: "bool" },
          ],
          internalType: "struct IYO.Campaign",
          name: "",
          type: "tuple",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "uint256", name: "campaignId", type: "uint256" },
        { internalType: "uint256", name: "vaultIndex", type: "uint256" },
      ],
      name: "getCampaignVault",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "uint256", name: "campaignId", type: "uint256" },
      ],
      name: "getCurrentPhase",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "uint256", name: "campaignId", type: "uint256" },
        { internalType: "uint256", name: "vaultIndex", type: "uint256" },
        { internalType: "address", name: "user", type: "address" },
      ],
      name: "getPosition",
      outputs: [
        {
          components: [
            { internalType: "uint256", name: "shares", type: "uint256" },
            { internalType: "uint256", name: "principal", type: "uint256" },
          ],
          internalType: "struct IYO.UserPosition",
          name: "",
          type: "tuple",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "uint256", name: "campaignId", type: "uint256" },
        { internalType: "uint256", name: "vaultIndex", type: "uint256" },
      ],
      name: "getVault",
      outputs: [
        {
          components: [
            { internalType: "address", name: "asset", type: "address" },
            { internalType: "address", name: "aToken", type: "address" },
            {
              internalType: "contract CampaignVault",
              name: "vault",
              type: "address",
            },
            { internalType: "uint256", name: "addedInPhase", type: "uint256" },
            { internalType: "bool", name: "enabled", type: "bool" },
          ],
          internalType: "struct IYO.VaultInfo",
          name: "",
          type: "tuple",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "uint256", name: "campaignId", type: "uint256" },
      ],
      name: "getVaultCount",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "uint256", name: "campaignId", type: "uint256" },
      ],
      name: "getVaults",
      outputs: [
        {
          components: [
            { internalType: "address", name: "asset", type: "address" },
            { internalType: "address", name: "aToken", type: "address" },
            {
              internalType: "contract CampaignVault",
              name: "vault",
              type: "address",
            },
            { internalType: "uint256", name: "addedInPhase", type: "uint256" },
            { internalType: "bool", name: "enabled", type: "bool" },
          ],
          internalType: "struct IYO.VaultInfo[]",
          name: "",
          type: "tuple[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "uint256", name: "campaignId", type: "uint256" },
      ],
      name: "getWhitelistNFTs",
      outputs: [{ internalType: "address[]", name: "", type: "address[]" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "uint256", name: "campaignId", type: "uint256" },
      ],
      name: "isCampaignEnded",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "uint256", name: "campaignId", type: "uint256" },
        { internalType: "address", name: "user", type: "address" },
      ],
      name: "isWhitelisted",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
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
      inputs: [],
      name: "pause",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "paused",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "uint256", name: "campaignId", type: "uint256" },
        { internalType: "uint256", name: "vaultIndex", type: "uint256" },
        { internalType: "address", name: "user", type: "address" },
      ],
      name: "pendingYield",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "permissioned",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "uint256", name: "campaignId", type: "uint256" },
        { internalType: "uint256", name: "vaultIndex", type: "uint256" },
        { internalType: "address", name: "user", type: "address" },
      ],
      name: "positionValue",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "uint256", name: "", type: "uint256" },
        { internalType: "uint256", name: "", type: "uint256" },
        { internalType: "address", name: "", type: "address" },
      ],
      name: "positions",
      outputs: [
        { internalType: "uint256", name: "shares", type: "uint256" },
        { internalType: "uint256", name: "principal", type: "uint256" },
      ],
      stateMutability: "view",
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
      inputs: [{ internalType: "bool", name: "_permissioned", type: "bool" }],
      name: "setPermissioned",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "uint256", name: "campaignId", type: "uint256" },
        { internalType: "uint256", name: "newFeeBps", type: "uint256" },
      ],
      name: "setProtocolFeeBps",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "uint256", name: "campaignId", type: "uint256" },
        { internalType: "uint256", name: "vaultIndex", type: "uint256" },
        { internalType: "bool", name: "enabled", type: "bool" },
      ],
      name: "setVaultEnabled",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "uint256", name: "campaignId", type: "uint256" },
        { internalType: "bool", name: "enabled", type: "bool" },
      ],
      name: "setWhitelistEnabled",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "uint256", name: "campaignId", type: "uint256" },
        { internalType: "address", name: "nft", type: "address" },
        { internalType: "bool", name: "allowed", type: "bool" },
      ],
      name: "setWhitelistNFT",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "uint256", name: "campaignId", type: "uint256" },
        { internalType: "uint256", name: "vaultIndex", type: "uint256" },
      ],
      name: "totalVaultValue",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
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
      inputs: [],
      name: "treasury",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "unpause",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "_treasury", type: "address" }],
      name: "updateTreasury",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "uint256", name: "", type: "uint256" },
        { internalType: "address", name: "", type: "address" },
      ],
      name: "whitelistNFTs",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "uint256", name: "campaignId", type: "uint256" },
        { internalType: "uint256", name: "vaultIndex", type: "uint256" },
        { internalType: "uint256", name: "sharesToWithdraw", type: "uint256" },
      ],
      name: "withdraw",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ],
} as const satisfies { address: `0x${string}`; abi: Abi };

export const getIyoContractClient = () =>
  ({
    ...contract,
    address: getAddress(env.NEXT_PUBLIC_IYO_ADDRESS),
  }) as const;

export const getIyoContractServer = () =>
  ({
    ...contract,
    address: getAddress(env.IYO_ADDRESS),
  }) as const;
