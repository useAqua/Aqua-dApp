import "server-only";
import { rpcViemClient } from "../viemClient";
import {
  type ContractFunctionParameters,
} from "viem";
import type {
  CampaignConfigs,
  CampaignInfo,
  CampaignVaults,
} from "~/types/contracts";
import { getIyoContractServer } from "~/lib/contracts/iyo";

const iyo = getIyoContractServer();

type GetCampaignInfoCall = ContractFunctionParameters<
  typeof iyo.abi,
  "view",
  "getCampaign"
>;

type GetVaultInfoCall = ContractFunctionParameters<
  typeof iyo.abi,
  "view",
  "getVaults"
>;

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
