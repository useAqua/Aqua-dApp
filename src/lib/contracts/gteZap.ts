import type { Abi } from "viem";

const contract = {
  address: "0x88F7fa216A9bE4685cEC8adfd9CaD01C2db42e92",
  abi: [
    {
      inputs: [
        { internalType: "address", name: "_router", type: "address" },
        { internalType: "address", name: "_WETH", type: "address" },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      inputs: [{ internalType: "address", name: "token", type: "address" }],
      name: "SafeERC20FailedOperation",
      type: "error",
    },
    {
      inputs: [],
      name: "WETH",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "aquaVault", type: "address" },
        { internalType: "uint256", name: "tokenAmountOutMin", type: "uint256" },
        { internalType: "address", name: "tokenIn", type: "address" },
        { internalType: "uint256", name: "tokenInAmount", type: "uint256" },
      ],
      name: "aquaIn",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "aquaVault", type: "address" },
        { internalType: "uint256", name: "tokenAmountOutMin", type: "uint256" },
      ],
      name: "aquaInETH",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "aquaVault", type: "address" },
        { internalType: "uint256", name: "withdrawAmount", type: "uint256" },
      ],
      name: "aquaOut",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "aquaVault", type: "address" },
        { internalType: "uint256", name: "withdrawAmount", type: "uint256" },
        { internalType: "address", name: "desiredToken", type: "address" },
        {
          internalType: "uint256",
          name: "desiredTokenOutMin",
          type: "uint256",
        },
      ],
      name: "aquaOutAndSwap",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "aquaVault", type: "address" },
        { internalType: "address", name: "tokenIn", type: "address" },
        { internalType: "uint256", name: "fullInvestmentIn", type: "uint256" },
      ],
      name: "estimateSwap",
      outputs: [
        { internalType: "uint256", name: "swapAmountIn", type: "uint256" },
        { internalType: "uint256", name: "swapAmountOut", type: "uint256" },
        { internalType: "address", name: "swapTokenOut", type: "address" },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "minimumAmount",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "router",
      outputs: [
        {
          internalType: "contract IUniswapV2Router02",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    { stateMutability: "payable", type: "receive" },
  ],
} as const satisfies { address: `0x${string}`; abi: Abi };

export default contract;
