import { HelpCircle } from "lucide-react";
import { WriteButtonWithAllowance } from "~/components/ui/write-button-with-allowance";
import {
  type Address,
  type ContractFunctionParameters,
  formatUnits,
  getAddress,
  parseUnits,
  zeroAddress,
} from "viem";
import { useCallback, useMemo, useState } from "react";
import { enforceOnlyNumbers, formatNumber } from "~/utils/numbers";
import { useVaultRefresh } from "~/hooks/use-vault-refresh";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { api } from "~/utils/api";
import { useBalance } from "wagmi";
import type { CampaignInfo, CampaignVaults } from "~/types/contracts";
import { getIyoContractClient } from "~/lib/contracts/iyo";
import {
  PERCENTAGE_MULTIPLIER,
  PERCENTAGE_PRESETS,
} from "~/components/campaign/campaignConstants";

type DisableCondition = {
  condition: boolean;
  message: string;
  showLink?: boolean;
};

interface VaultDepositTabProps {
  campaign: CampaignInfo;
  selectedTokenBalance: bigint | undefined;
  selectedTokenBalanceReactNode: string;
  selectedVault: CampaignVaults | undefined;
  selectedTokenAddress: Address;
  userAddress: Address | undefined;
  selectedTokenDecimals: number;
  setSelectedVaultIndex: (value: number) => void;
  selectedVaultIndex: number;
}

const iyo = getIyoContractClient();

const selectedTokenSymbol = "TOKEN"; // TODO: Placeholder, replace with actual symbol from vault data

const CampaignDepositTab = ({
  campaign,
  selectedTokenBalance,
  selectedTokenBalanceReactNode,
  selectedTokenDecimals,
  selectedTokenAddress,
  selectedVault,
  selectedVaultIndex,
  userAddress,
  setSelectedVaultIndex,
}: VaultDepositTabProps) => {
  const [amount, setAmount] = useState("");

  const { refetch: refetchBalance } = useBalance({
    address: userAddress,
  });

  const { refreshVaultData } = useVaultRefresh();

  const formattedLpTokenBalance = useMemo(() => {
    if (!selectedTokenBalance) return 0;
    return Number(formatUnits(selectedTokenBalance, selectedTokenDecimals));
  }, [selectedTokenBalance, selectedTokenDecimals]);

  const { data: estimatedSwapAmountOut } = api.zap.previewDeposit.useQuery(
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

  const contractArgs: ContractFunctionParameters<
    typeof iyo.abi,
    "nonpayable",
    "deposit"
  > = useMemo(
    () =>
      ({
        ...iyo,
        functionName: "deposit",
        args: [
          BigInt(campaign.id),
          BigInt(selectedVaultIndex),
          parseUnits(amount || "0", selectedTokenDecimals),
        ],
      }) as const,
    [amount, campaign.id, selectedTokenDecimals, selectedVaultIndex],
  );

  const calculateAmountByPercentage = useCallback(
    (percentage: number) => {
      const percentageBigInt = BigInt(Math.round(percentage * 100));

      if (!selectedTokenBalance) return "0";
      return formatUnits(
        (selectedTokenBalance * percentageBigInt) / PERCENTAGE_MULTIPLIER,
        selectedTokenDecimals,
      );
    },
    [selectedTokenBalance, selectedTokenDecimals],
  );

  const disableConditions = useMemo((): DisableCondition[] => {
    const amountValue = parseFloat(amount);

    if (!amount || amountValue === 0) {
      return [
        {
          condition: true,
          message: "Enter an amount to deposit",
        },
      ];
    }

    if (amountValue > formattedLpTokenBalance) {
      return [
        {
          condition: true,
          message: `Insufficient ${selectedTokenSymbol} balance`,
          showLink: true,
        },
      ];
    }

    return [];
  }, [amount, formattedLpTokenBalance]);

  const handleDeposited = useCallback(async () => {
    setAmount("");
    await Promise.all([refetchBalance(), refreshVaultData()]);
  }, [refetchBalance, refreshVaultData]);

  const depositedAmount = useMemo(() => {
    const value = Number(amount || 0);
    if (value === 0) return "0";
    if (value < 0.001) return value.toExponential(2);
    if (value < 1) return value.toFixed(4);
    if (value < 1000) return value.toFixed(3);
    return value.toLocaleString("en-US", { maximumFractionDigits: 2 });
  }, [amount]);

  const depositValueUsd = useMemo(() => {
    const amountValue = Number(amount || 0);
    if (amountValue === 0) return 0;
    const lpTokenPrice = parseFloat(/*vault.tokens.lpToken.price*/ "1");
    return amountValue * lpTokenPrice;
  }, [amount]);

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
                        Vault #{index} · MegaETH
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
                  Vault #{selectedVaultIndex} · MegaETH
                </p>
              </div>
            </div>
            <span className="font-redaction text-[15px] font-bold text-teal-500">
              ~8% APY
            </span>
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
            Balance: {selectedTokenBalanceReactNode} {selectedTokenSymbol}
          </p>
        </div>
        <div className="border-border flex items-center gap-2.5 rounded-lg border-[1.5px] bg-white px-3.5 py-2.5 transition-colors focus-within:border-teal-500">
          <input
            type="number"
            placeholder="0"
            className="font-bricolage text-foreground placeholder:text-muted-foreground/50 min-w-0 flex-1 border-none bg-transparent text-xl font-bold outline-none"
            value={amount}
            onChange={(e) => setAmount(enforceOnlyNumbers(e.target.value))}
          />
          <span className="flex items-center gap-1.5 rounded-md bg-blue-600/10 px-2 py-1 text-xs font-bold text-blue-600">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <circle cx="6" cy="6" r="6" fill="#2775CA" />
              <text
                x="6"
                y="9"
                textAnchor="middle"
                fontSize="6"
                fill="white"
                fontWeight="700"
              >
                $
              </text>
            </svg>
            {selectedTokenSymbol}
          </span>
        </div>
      </div>

      {/* ── Percentage Presets ── */}
      <div className="grid grid-cols-4 gap-1.5">
        {PERCENTAGE_PRESETS.map((percentage, idx) => (
          <button
            key={percentage}
            className="hover:bg-primary hover:text-primary-foreground hover:border-primary border-border text-muted-foreground cursor-pointer rounded-md border bg-transparent px-2 py-1.5 text-xs font-medium transition-colors"
            onClick={() => setAmount(calculateAmountByPercentage(percentage))}
          >
            {idx === PERCENTAGE_PRESETS.length - 1
              ? "Max"
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
          {formatNumber(
            +formatUnits(
              BigInt(estimatedSwapAmountOut ?? "0"),
              selectedTokenDecimals,
            ),
          )}
        </p>
        <p className="text-muted-foreground mt-0.5 text-xs">
          ${formatNumber(depositValueUsd) ?? "0"}
        </p>
        <span className="mt-1.5 inline-block rounded border border-teal-500/25 bg-teal-500/10 px-2 py-0.5 text-[11px] font-semibold text-teal-600">
          a{selectedTokenSymbol} shares · redeemable at launch
        </span>
      </div>

      {/* ── Fee Row ── */}
      <div className="text-muted-foreground flex items-center justify-between text-xs">
        <span className="flex items-center gap-1">
          Deposit Fee
          <HelpCircle className="h-2.5 w-2.5" />
        </span>
        <span className="text-foreground font-semibold">0%</span>
      </div>

      {/* ── Fee Note ── */}
      <p className="text-muted-foreground text-[11px] leading-relaxed">
        Displayed APY already accounts for the performance fee on generated
        yield — no hidden deductions.
      </p>

      {/* ── Errors ── */}
      <div className="relative h-4">
        <div className="text-[11px] text-red-500">
          {disableConditions.map((cond, index) => {
            if (!cond.condition) return null;
            if (cond.showLink) {
              return (
                <span key={index}>
                  {cond.message}.{" "}
                  <a
                    href="https://testnet.gte.xyz/earn"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-red-600"
                  >
                    Get more here
                  </a>
                </span>
              );
            }
            return <span key={index}>{cond.message} </span>;
          })}
        </div>
      </div>

      {/* ── Deposit Button ── */}
      <WriteButtonWithAllowance
        {...contractArgs}
        tokenAddress={selectedTokenAddress}
        tokenDecimals={selectedTokenDecimals}
        tokenSymbol={selectedTokenSymbol}
        disableConditions={disableConditions}
        spenderAddress={getAddress(iyo.address)}
        requiredAmount={amount || "0"}
        toastMessages={{
          submitting: `Depositing ${selectedTokenSymbol}...`,
          success: `Deposit Completed|Deposited ${depositedAmount} ${selectedTokenSymbol}.`,
          error: `Failed to deposit ${selectedTokenSymbol}.`,
          mining: `Depositing ${selectedTokenSymbol}...`,
        }}
        className="w-full rounded-xl py-5 text-[15px] font-bold tracking-wide"
        onSuccess={handleDeposited}
      >
        Deposit {selectedTokenSymbol}
      </WriteButtonWithAllowance>
    </div>
  );
};

export default CampaignDepositTab;
