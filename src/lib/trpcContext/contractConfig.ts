import "server-only";
import { rpcViemClient } from "../viemClient";
import type aquaRegistry from "~/lib/contracts/aquaRegistry";
import {
  type Address,
  type ContractFunctionParameters,
  type ReadContractReturnType,
} from "viem";
import type {
  CampaignConfigs,
  CampaignInfo,
  CampaignVaults,
  VaultConfigs,
} from "~/types/contracts";
import { getIyoContractServer } from "~/lib/contracts/iyo";

const iyo = getIyoContractServer();

type VaultInfoTuple = ReadContractReturnType<
  typeof aquaRegistry.abi,
  "getVaultInfo"
>;

type GetVaultInfoCall = ContractFunctionParameters<
  typeof aquaRegistry.abi,
  "view",
  "getVaultInfo"
>;

type GetCampaignInfoCall = ContractFunctionParameters<
  typeof iyo.abi,
  "view",
  "getCampaign"
>;

// TODO: DEPRECATED FOR IYO
export async function getContractConfigs(): Promise<{
  vaultConfigs: VaultConfigs;
  vaultNameToAddress: Map<string, Address>;
}> {
  const vaultConfigs: VaultConfigs = new Map();
  const vaultNameToAddress = new Map<string, Address>();

  return { vaultConfigs, vaultNameToAddress };
  // try {
  //   const allVaultAddresses = await rpcViemClient.readContract({
  //     ...aquaRegistry,
  //     functionName: "allVaultAddresses",
  //   });
  //
  //   const vaultInfoCalls = allVaultAddresses.map(
  //     (address: Address): GetVaultInfoCall => ({
  //       ...aquaRegistry,
  //       functionName: "getVaultInfo",
  //       args: [address],
  //     }),
  //   );
  //
  //   const results = await rpcViemClient.multicall({
  //     contracts: vaultInfoCalls,
  //   });
  //
  //   for (let i = 0; i < results.length; i++) {
  //     const { status, result, error } = results[i]!;
  //
  //     if (status === "failure") {
  //       throw new Error(`Contract call failed: ${error}`);
  //     }
  //
  //     const [
  //       name,
  //       strategy,
  //       isPaused,
  //       tokens,
  //       blockNumber,
  //       retired,
  //       gasOverhead,
  //     ] = result as VaultInfoTuple;
  //
  //     if (isPaused) continue;
  //
  //     const [lpToken, token0, token1] = tokens;
  //     const vaultAddress = allVaultAddresses[i]!;
  //
  //     if (!lpToken || !token0 || !token1) {
  //       throw new Error(
  //         `Invalid token data for vault at address: ${vaultAddress}`,
  //       );
  //     }
  //
  //     vaultConfigs.set(vaultAddress, {
  //       name,
  //       strategy,
  //       isPaused,
  //       token0,
  //       token1,
  //       lpToken,
  //       blockNumber,
  //       retired,
  //       gasOverhead,
  //       icon: "⟠",
  //     });
  //     vaultNameToAddress.set(name.toLowerCase(), vaultAddress);
  //   }
  //
  //   return { vaultConfigs, vaultNameToAddress };
  // } catch (error) {
  //   console.error("Failed to fetch contract configs:", error);
  //   throw error;
  // }
}

export async function getNewContractConfigs(): Promise<CampaignConfigs> {
  const campaignConfigs: CampaignConfigs = new Map();
  const campaignCount = await rpcViemClient.readContract({
    ...iyo,
    functionName: "campaignCount",
  });

  const multicallQuery = Array.from({
    length: Number(campaignCount),
  }).flatMap((_, i): (GetCampaignInfoCall | GetVaultInfoCall)[] => [
    {
      ...iyo,
      functionName: "getCampaign",
      args: [BigInt(i)],
    },
    {
      ...iyo,
      functionName: "getVaults",
      args: [BigInt(i)],
    },
  ]);

  const multicallResult = await rpcViemClient.multicall({
    contracts: multicallQuery,
  });

  for (let i = 0; i < Number(campaignCount); i++) {
    const campaignId = i;
    const baseIndex = i * 2;

    const {
      status: cStatus,
      result: cResult,
      error: cError,
    } = multicallResult[baseIndex]!;
    const {
      status: vStatus,
      result: vResult,
      error: vError,
    } = multicallResult[baseIndex + 1]!;

    if (cStatus === "failure") {
      throw new Error(`Contract call failed: ${cError}`);
    }
    if (vStatus === "failure") {
      throw new Error(`Contract call failed: ${vError}`);
    }

    campaignConfigs.set(campaignId, {
      ...(cResult as CampaignInfo),
      id: campaignId,
      name: (cResult as CampaignInfo).name || `Campaign #${campaignId}`,
      vaults: vResult as CampaignVaults[],
    });
  }

  return campaignConfigs;
}
