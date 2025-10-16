import { type Abi, getAddress } from "viem";
import { env } from "~/env";

const contract = {
  address: getAddress(env.AQUA_REGISTRY_ADDRESS),
  abi: [
    { inputs: [], name: "InvalidInitialization", type: "error" },
    { inputs: [], name: "NotInitializing", type: "error" },
    {
      inputs: [{ internalType: "address", name: "token", type: "address" }],
      name: "SafeERC20FailedOperation",
      type: "error",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint64",
          name: "version",
          type: "uint64",
        },
      ],
      name: "Initialized",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address[]",
          name: "users_",
          type: "address[]",
        },
        {
          indexed: false,
          internalType: "address",
          name: "status_",
          type: "address",
        },
      ],
      name: "ManagersUpdated",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "vaultAddress_",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "gasOverhead_",
          type: "uint256",
        },
      ],
      name: "VaultHarvestFunctionGasOverheadUpdated",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address[]",
          name: "vaults_",
          type: "address[]",
        },
      ],
      name: "VaultsRegistered",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address[]",
          name: "vaults_",
          type: "address[]",
        },
        { indexed: false, internalType: "bool", name: "status_", type: "bool" },
      ],
      name: "VaultsRetireStatusUpdated",
      type: "event",
    },
    {
      inputs: [
        {
          internalType: "address[]",
          name: "_vaultAddresses",
          type: "address[]",
        },
      ],
      name: "addVaults",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "allVaultAddresses",
      outputs: [{ internalType: "address[]", name: "", type: "address[]" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "_address", type: "address" }],
      name: "getStakedVaultsForAddress",
      outputs: [
        {
          components: [
            { internalType: "address[]", name: "tokens", type: "address[]" },
            { internalType: "bool", name: "retired", type: "bool" },
            { internalType: "uint256", name: "blockNumber", type: "uint256" },
            { internalType: "uint256", name: "index", type: "uint256" },
          ],
          internalType: "struct AquaRegistry.VaultInfo[]",
          name: "stakedVaults",
          type: "tuple[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getVaultCount",
      outputs: [{ internalType: "uint256", name: "count", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "_vaultAddress", type: "address" },
      ],
      name: "getVaultInfo",
      outputs: [
        { internalType: "string", name: "name_", type: "string" },
        {
          internalType: "contract IStrategy",
          name: "strategy_",
          type: "address",
        },
        { internalType: "bool", name: "isPaused_", type: "bool" },
        { internalType: "address[]", name: "tokens_", type: "address[]" },
        { internalType: "uint256", name: "blockNumber_", type: "uint256" },
        { internalType: "bool", name: "retired_", type: "bool" },
        { internalType: "uint256", name: "gasOverhead_", type: "uint256" },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "_block", type: "uint256" }],
      name: "getVaultsAfterBlock",
      outputs: [
        {
          components: [
            { internalType: "address[]", name: "tokens", type: "address[]" },
            { internalType: "bool", name: "retired", type: "bool" },
            { internalType: "uint256", name: "blockNumber", type: "uint256" },
            { internalType: "uint256", name: "index", type: "uint256" },
          ],
          internalType: "struct AquaRegistry.VaultInfo[]",
          name: "vaultResults",
          type: "tuple[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "_token", type: "address" }],
      name: "getVaultsForToken",
      outputs: [
        {
          components: [
            { internalType: "address[]", name: "tokens", type: "address[]" },
            { internalType: "bool", name: "retired", type: "bool" },
            { internalType: "uint256", name: "blockNumber", type: "uint256" },
            { internalType: "uint256", name: "index", type: "uint256" },
          ],
          internalType: "struct AquaRegistry.VaultInfo[]",
          name: "vaultResults",
          type: "tuple[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "token_", type: "address" }],
      name: "inCaseTokensGetStuck",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "initialize",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "vaultAddress_", type: "address" },
        { internalType: "uint256", name: "gasOverhead_", type: "uint256" },
      ],
      name: "setHarvestFunctionGasOverhead",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address[]", name: "managers_", type: "address[]" },
        { internalType: "bool", name: "status_", type: "bool" },
      ],
      name: "setManagers",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address[]",
          name: "_vaultAddresses",
          type: "address[]",
        },
        { internalType: "bool", name: "_status", type: "bool" },
      ],
      name: "setRetireStatuses",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "_vault", type: "address" },
        { internalType: "address[]", name: "_tokens", type: "address[]" },
      ],
      name: "setVaultTokens",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ],
} as const satisfies { address: `0x${string}`; abi: Abi };

export default contract;
