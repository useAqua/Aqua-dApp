import "server-only";
import { rpcViemClient } from "../viemClient";
import aquaRegistry from "~/lib/contracts/aquaRegistry";
import {
  type Address,
  type ContractFunctionParameters,
  type ReadContractReturnType,
} from "viem";
import type { VaultConfigs } from "~/types/contracts";

type VaultInfoTuple = ReadContractReturnType<
  typeof aquaRegistry.abi,
  "getVaultInfo"
>;

type GetVaultInfoCall = ContractFunctionParameters<
  typeof aquaRegistry.abi,
  "view",
  "getVaultInfo"
>;

export async function getContractConfigs(): Promise<{
  vaultConfigs: VaultConfigs;
  vaultNameToAddress: Map<string, Address>;
}> {
  const vaultConfigs: VaultConfigs = new Map();
  const vaultNameToAddress = new Map<string, Address>();
  try {
    const allVaultAddresses = await rpcViemClient.readContract({
      ...aquaRegistry,
      functionName: "allVaultAddresses",
    });

    const vaultInfoCalls = allVaultAddresses.map(
      (address: Address): GetVaultInfoCall => ({
        ...aquaRegistry,
        functionName: "getVaultInfo",
        args: [address],
      }),
    );

    const results = await rpcViemClient.multicall({
      contracts: vaultInfoCalls,
    });

    for (let i = 0; i < results.length; i++) {
      const { status, result, error } = results[i]!;

      if (status === "failure") {
        throw new Error(`Contract call failed: ${error}`);
      }

      const [
        name,
        strategy,
        isPaused,
        tokens,
        blockNumber,
        retired,
        gasOverhead,
      ] = result as VaultInfoTuple;

      if (isPaused) continue;

      const [lpToken, token0, token1] = tokens;
      const vaultAddress = allVaultAddresses[i]!;

      if (!lpToken || !token0 || !token1) {
        throw new Error(
          `Invalid token data for vault at address: ${vaultAddress}`,
        );
      }

      vaultConfigs.set(vaultAddress, {
        name,
        strategy,
        isPaused,
        token0,
        token1,
        lpToken,
        blockNumber,
        retired,
        gasOverhead,
        icon: "⟠",
      });
      vaultNameToAddress.set(name.toLowerCase(), vaultAddress);
    }

    return { vaultConfigs, vaultNameToAddress };
  } catch (error) {
    console.error("Failed to fetch contract configs:", error);
    throw error;
  }
}
