import { ArrowRight, X } from "lucide-react";
import { cn } from "~/lib/utils";
import {
  type Address,
  type ContractFunctionParameters,
  formatUnits,
  getAddress,
  parseUnits,
  zeroAddress,
} from "viem";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAccount } from "wagmi";
import { formatNumber, enforceOnlyNumbers } from "~/utils/numbers";
import { useVaultRefresh } from "~/hooks/use-vault-refresh";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { WriteButtonWithAllowance } from "~/components/ui/write-button-with-allowance";
import {
  PERCENTAGE_PRESETS,
  PERCENTAGE_MULTIPLIER,
} from "~/components/campaign/campaignConstants";
import type { CampaignInfo, CampaignVaults } from "~/types/contracts";
import { getIyoContractClient } from "~/lib/contracts/iyo";
import { api } from "~/utils/api";
import Countdown from "react-countdown";
import { AlertTriangle } from "lucide-react";

type DisableCondition = {
  condition: boolean;
  message: string;
};

interface VaultWithdrawTabProps {
  campaign: CampaignInfo;
  vaultBalance: bigint | undefined;
  selectedVault: CampaignVaults | undefined;
  vaultBalanceReactNode: string;
  selectedVaultIndex: number;
  setSelectedVaultIndex: (value: number) => void;
  selectedTokenAddress: Address;
  selectedTokenDecimals: number;
}
const iyo = getIyoContractClient();

const selectedTokenSymbol = "TOKEN"; // TODO: Placeholder, replace with actual symbol from vault data

const formatWithdrawAmount = (value: number) => {
  if (value === 0) return "0";
  if (value < 0.001) return value.toExponential(2);
  if (value < 1) return value.toFixed(4);
  if (value < 1000) return value.toFixed(3);
  return value.toLocaleString("en-US", {
    maximumFractionDigits: 2,
  });
};

const CampaignWithdrawTab = ({
  campaign,
  vaultBalance,
  selectedVault,
  vaultBalanceReactNode,
  selectedVaultIndex,
  setSelectedVaultIndex,
  selectedTokenDecimals,
  selectedTokenAddress,
}: VaultWithdrawTabProps) => {
  const [amount, setAmount] = useState("");
  const [hasCampaignEnded, setHasCampaignEnded] = useState(false);
  const [exitEarly, setExitEarly] = useState(false);
  const { address: userAddress } = useAccount();
  const { refreshVaultData } = useVaultRefresh();

  const formattedVaultBalance = useMemo(() => {
    if (!vaultBalance) return 0;
    return Number(formatUnits(vaultBalance, 18 /*Todo: To change*/));
  }, [vaultBalance]);

  const disableConditions = useMemo((): DisableCondition[] => {
    if (!hasCampaignEnded && !exitEarly) {
      return [
        {
          condition: true,
          message: "Campaign is still active. You can only exit early.",
        },
      ];
    }

    if (!userAddress) {
      return [
        {
          condition: true,
          message: "Connect wallet to withdraw",
        },
      ];
    }

    const amountValue = parseFloat(amount);
    if (!amount || amountValue === 0) {
      return [
        {
          condition: true,
          message: "Enter an amount to withdraw",
        },
      ];
    }

    if (amountValue > formattedVaultBalance) {
      return [
        {
          condition: true,
          message: `Insufficient vault balance`,
        },
      ];
    }

    return [];
  }, [amount, exitEarly, formattedVaultBalance, hasCampaignEnded, userAddress]);

  const calculateAmountByPercentage = useCallback(
    (percentage: number) => {
      if (!vaultBalance) return "0";
      const percentageBigInt = BigInt(Math.round(percentage * 100));
      return formatUnits(
        (vaultBalance * percentageBigInt) / PERCENTAGE_MULTIPLIER,
        18 /*Todo: To change*/,
      );
    },
    [vaultBalance],
  );

  const contractArgs: ContractFunctionParameters<
    typeof iyo.abi,
    "nonpayable",
    "withdraw" | "earlyExit"
  > = useMemo(() => {
    return {
      ...iyo,
      functionName: exitEarly ? "earlyExit" : "withdraw",
      args: [
        BigInt(campaign.id),
        BigInt(selectedVaultIndex),
        parseUnits(amount || "0", 18 /*Todo: To change*/),
      ],
    } as const;
  }, [amount, campaign.id, exitEarly, selectedVaultIndex]);

  const handleWithdrawal = useCallback(async () => {
    setAmount("");
    await refreshVaultData();
  }, [refreshVaultData]);

  const { data: estimatedSwapAmountOut } = api.zap.previewWithdraw.useQuery(
    {
      vaultAddress: selectedVault?.vault ?? getAddress(zeroAddress),
      amountIn: (
        parseUnits(amount || "0", selectedTokenDecimals) / BigInt(2)
      ).toString(),
    },
    {
      enabled: !!selectedVault?.vault && amount !== "0" && amount !== "",
    },
  );

  const withdrawValueUsd = useMemo(() => {
    const amountValue = +formatUnits(
      BigInt(estimatedSwapAmountOut ?? "0"),
      selectedTokenDecimals,
    );

    if (amountValue === 0) return 0;

    const lpTokenPrice = parseFloat(/*vault.tokens.lpToken.price*/ "1");

    return amountValue * lpTokenPrice;
  }, [estimatedSwapAmountOut, selectedTokenDecimals]);

  const withdrawnAmount = useMemo(() => {
    return formatWithdrawAmount(
      +formatUnits(
        BigInt(estimatedSwapAmountOut ?? "0"),
        selectedTokenDecimals,
      ),
    );
  }, [estimatedSwapAmountOut, selectedTokenDecimals]);

  const successMessage = useMemo(() => {
    return `Withdraw Completed|Withdrawn ${withdrawnAmount} ${selectedTokenSymbol}.`;
  }, [withdrawnAmount]);

  useEffect(() => {
    setHasCampaignEnded(Date.now() > Number(campaign.endTime) * 1000);
  }, [campaign.endTime]);

  return (
    <div className="flex flex-col gap-3.5">
      {/* ── Vault Selector ── */}
      <div>
        <p className="text-muted-foreground mb-1.5 text-[11px] font-semibold tracking-wider uppercase">
          Vault
        </p>

        {campaign.vaults.length > 1 ? (
          <Select
            value={selectedVaultIndex.toString()}
            onValueChange={(value) => setSelectedVaultIndex(Number(value))}
            disabled={!userAddress}
          >
            <SelectTrigger className="h-auto rounded-xl border-2 border-teal-500 bg-teal-500/10 px-3.5 py-3">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {campaign.vaults.map(({}, index) => (
                <SelectItem value={index.toString()} key={index}>
                  <div className="flex items-center gap-2.5">
                    <div className="flex items-center -space-x-2">
                      <span className="flex h-6.5 w-6.5 items-center justify-center rounded-full border-2 border-white bg-blue-600 text-[10px] font-bold text-white">
                        $
                      </span>
                      <span className="flex h-6.5 w-6.5 items-center justify-center rounded-full border-2 border-white bg-purple-500 text-[10px] font-bold text-white">
                        A
                      </span>
                    </div>
                    <div>
                      <p className="font-bricolage text-sm font-bold">
                        {selectedTokenSymbol} → Aave
                      </p>
                      <p className="text-muted-foreground text-[11px]">
                        Balance: {vaultBalanceReactNode} a{selectedTokenSymbol}
                      </p>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <div className="flex items-center justify-between rounded-xl border-2 border-teal-500 bg-teal-500/10 px-3.5 py-3">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center -space-x-2">
                <span className="flex h-6.5 w-6.5 items-center justify-center rounded-full border-2 border-white bg-blue-600 text-[10px] font-bold text-white">
                  $
                </span>
                <span className="flex h-6.5 w-6.5 items-center justify-center rounded-full border-2 border-white bg-purple-500 text-[10px] font-bold text-white">
                  A
                </span>
              </div>
              <div>
                <p className="font-bricolage text-sm font-bold">
                  {selectedTokenSymbol} → Aave
                </p>
                <p className="text-muted-foreground text-[11px]">
                  Balance: {vaultBalanceReactNode} a{selectedTokenSymbol}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Amount Input ── */}
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <p className="text-muted-foreground text-[11px] font-semibold tracking-wider uppercase">
            Amount
          </p>
          <p className="text-muted-foreground text-[11px]">
            Share Balance: {vaultBalanceReactNode}
          </p>
        </div>
        <div className="border-border flex items-center gap-2.5 rounded-lg border-[1.5px] bg-white px-3.5 py-2.5 transition-colors focus-within:border-teal-500">
          <input
            type="number"
            placeholder="0"
            className="font-bricolage text-foreground placeholder:text-muted-foreground/50 min-w-0 flex-1 border-none bg-transparent text-xl font-bold outline-none"
            value={amount}
            onChange={(e) => setAmount(enforceOnlyNumbers(e.target.value))}
            disabled={!userAddress}
          />
          <span className="bg-foreground/8 text-foreground flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-bold">
            a{selectedTokenSymbol}
          </span>
        </div>
      </div>

      {/* ── Percentage Presets ── */}
      <div className="grid grid-cols-4 gap-1.5">
        {PERCENTAGE_PRESETS.map((percentage, idx) => (
          <button
            key={percentage}
            className="hover:bg-primary hover:text-primary-foreground hover:border-primary border-border text-muted-foreground cursor-pointer rounded-md border bg-transparent px-2 py-1.5 text-xs font-medium transition-colors disabled:pointer-events-none disabled:opacity-50"
            onClick={() => setAmount(calculateAmountByPercentage(percentage))}
            disabled={!userAddress}
          >
            {idx === PERCENTAGE_PRESETS.length - 1
              ? "100%"
              : `${percentage * 100}%`}
          </button>
        ))}
      </div>

      {/* ── You Receive ── */}
      <div className="border-border bg-foreground/4 rounded-xl border p-3.5">
        <p className="text-muted-foreground mb-1 text-[11px] font-semibold tracking-wider uppercase">
          You receive
        </p>
        <p className="font-redaction text-foreground text-[22px] leading-tight font-bold">
          {formatNumber(withdrawnAmount)}
        </p>
        <p className="text-muted-foreground mt-0.5 text-xs">
          ${formatNumber(withdrawValueUsd) ?? "0"}
        </p>
        <span className="mt-1.5 inline-block rounded border border-teal-500/25 bg-teal-500/10 px-2 py-0.5 text-[11px] font-semibold text-teal-600">
          {selectedTokenSymbol}
        </span>
      </div>

      {/* ── Timer + Exit Early ── */}
      {!hasCampaignEnded && (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-xs">
              Time until campaign ends
            </p>
            <Countdown
              date={Number(campaign.endTime) * 1000}
              onComplete={() => {
                setHasCampaignEnded(true);
                setExitEarly(false);
              }}
              renderer={({ days, hours, minutes, seconds, completed }) => {
                if (completed) {
                  return (
                    <span className="font-redaction text-foreground text-base font-bold tabular-nums">
                      Campaign Ended
                    </span>
                  );
                }
                return (
                  <span className="font-redaction text-foreground text-base font-bold tabular-nums">
                    {days}d {hours}h {minutes}m {seconds}s
                  </span>
                );
              }}
            />
          </div>
          <button
            className={cn(
              "flex cursor-pointer items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors",
              exitEarly
                ? "border-orange-400/50 bg-orange-500/10 text-orange-600 hover:bg-orange-500/20"
                : "border-border text-muted-foreground hover:bg-foreground/5 bg-transparent",
            )}
            onClick={() => setExitEarly(!exitEarly)}
          >
            {exitEarly ? (
              <X className="h-3 w-3" />
            ) : (
              <ArrowRight className="h-3 w-3" />
            )}
            {exitEarly ? "Cancel Early Exit" : "Exit Early"}
          </button>
        </div>
      )}

      {/* ── Warning Box ── */}
      {!hasCampaignEnded && (
        <div className="flex items-start gap-2 rounded-lg border border-orange-300/20 bg-orange-500/8 px-3 py-2.5 text-xs leading-relaxed text-orange-900">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-orange-500" />
          Campaign is still active. Early withdrawal forfeits 100% of accrued
          yield and a 1% principal fee.
        </div>
      )}

      {/* ── Fee Row ── */}
      <div className="text-muted-foreground flex items-center justify-between text-xs">
        <span className="flex items-center gap-1">Withdrawal Fee</span>
        <span className="text-foreground font-semibold">
          {exitEarly ? "1% principal + yield" : "0%"}
        </span>
      </div>

      {/* ── Errors ── */}
      <div className="relative h-4">
        <p className="text-[11px] text-red-500">
          {disableConditions.map(
            (cond) => cond.condition && cond.message + " ",
          )}
        </p>
      </div>

      {/* ── Withdraw Button ── */}
      <WriteButtonWithAllowance
        {...contractArgs}
        tokenAddress={selectedTokenAddress}
        tokenDecimals={selectedTokenDecimals}
        tokenSymbol={selectedTokenSymbol}
        spenderAddress={contractArgs.address}
        requiredAmount={amount || "0"}
        disableConditions={disableConditions}
        toastMessages={{
          submitting: `Withdrawing ${selectedTokenSymbol}...`,
          success: successMessage,
          error: `Failed to withdraw ${selectedTokenSymbol}.`,
          mining: `Withdrawing ${selectedTokenSymbol}...`,
        }}
        className="border-primary text-primary hover:bg-primary/5 w-full rounded-xl border-2 bg-transparent py-5 text-[15px] font-bold tracking-wide"
        onSuccess={handleWithdrawal}
      >
        Withdraw {exitEarly ? "(Early Exit)" : ""}
      </WriteButtonWithAllowance>
    </div>
  );
};

export default CampaignWithdrawTab;
