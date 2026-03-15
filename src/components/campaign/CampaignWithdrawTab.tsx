import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { HelpCircle } from "lucide-react";
import { SecondaryCard } from "~/components/common/SecondaryCard";
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
} from "~/components/vault/vaultConstants";
import type { CampaignInfo, CampaignVaults } from "~/types/contracts";
import { getIyoContractClient } from "~/lib/contracts/iyo";
import { api } from "~/utils/api";
import Countdown from "react-countdown";
import { Switch } from "~/components/ui/switch";

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
    <div className="space-y-6">
      <div>
        <div className="flex flex-wrap items-center justify-between">
          <p className="text-card-foreground/70 mb-2 text-sm">
            💰 Enter Amount
          </p>
          <p className="text-card-foreground/70 mb-2 text-sm max-sm:hidden">
            Share Balance: {vaultBalanceReactNode} a{selectedTokenSymbol}
          </p>
        </div>

        <Input
          type="number"
          placeholder="0"
          className="mb-2 text-lg"
          variant="secondary"
          value={amount}
          onChange={(e) => setAmount(enforceOnlyNumbers(e.target.value))}
          disabled={!userAddress}
        />
        <Select
          value={selectedVaultIndex.toString()}
          onValueChange={(value) => setSelectedVaultIndex(Number(value))}
          disabled={!userAddress}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {campaign.vaults.map(({}, index) => (
              <SelectItem value={index.toString()} key={index}>
                <span>Vault #{index}</span>
              </SelectItem>
            ))}
            {/*<SelectItem value="lp">*/}
            {/*  <div className="flex items-center gap-2">*/}
            {/*    <VaultIcon vaultName={vault.name} size="sm" />*/}
            {/*    <span>*/}
            {/*      {vault.tokens.token0.symbol}/{vault.tokens.token1.symbol} LP*/}
            {/*    </span>*/}
            {/*  </div>*/}
            {/*</SelectItem>*/}
            {/*<SelectItem value="token0">*/}
            {/*  <div className="flex items-center gap-2">*/}
            {/*    <TokenIcon*/}
            {/*      symbol={vault.tokens.token0.symbol ?? "Token0"}*/}
            {/*      size={24}*/}
            {/*    />*/}
            {/*    <span>{vault.tokens.token0.symbol}</span>*/}
            {/*  </div>*/}
            {/*</SelectItem>*/}
            {/*<SelectItem value="token1">*/}
            {/*  <div className="flex items-center gap-2">*/}
            {/*    <TokenIcon*/}
            {/*      symbol={vault.tokens.token1.symbol ?? "Token1"}*/}
            {/*      size={24}*/}
            {/*    />*/}
            {/*    <span>{vault.tokens.token1.symbol}</span>*/}
            {/*  </div>*/}
            {/*</SelectItem>*/}
            {/*<SelectItem value={"both"}>*/}
            {/*  <div className="flex items-center gap-2">*/}
            {/*    <TokenIcon*/}
            {/*      symbol={vault.tokens.token0.symbol ?? "Token0"}*/}
            {/*      size={24}*/}
            {/*    />*/}
            {/*    <span>{vault.tokens.token0.symbol}</span>*/}
            {/*    <span>and</span>*/}
            {/*    <TokenIcon*/}
            {/*      symbol={vault.tokens.token1.symbol ?? "Token1"}*/}
            {/*      size={24}*/}
            {/*    />*/}
            {/*    <span>{vault.tokens.token1.symbol}</span>*/}
            {/*  </div>*/}
            {/*</SelectItem>*/}
          </SelectContent>
        </Select>
      </div>

      <div>
        <p className="text-card-foreground/70 mb-2 text-sm sm:hidden">
          Share Balance: {vaultBalanceReactNode} a{selectedTokenSymbol}
        </p>
        <div className="flex gap-2">
          {PERCENTAGE_PRESETS.map((percentage) => (
            <Button
              key={percentage}
              variant="secondary"
              size="sm"
              className="flex-1"
              onClick={() => setAmount(calculateAmountByPercentage(percentage))}
              disabled={!userAddress}
            >
              {percentage * 100}%
            </Button>
          ))}
        </div>
      </div>
      <SecondaryCard className="p-4">
        <p className="mb-2 text-sm">You receive</p>

        <p className="mb-1 text-2xl font-bold">
          {formatNumber(withdrawnAmount)}
        </p>

        <p className="text-secondary-foreground/80 mt-1 text-xs">
          ${formatNumber(withdrawValueUsd) ?? "0"}
        </p>
        <div className="border-secondary-foreground/20 mt-3 border-t pt-3">
          <p className="text-secondary-foreground/80 text-xs">
            {selectedTokenSymbol}
          </p>
        </div>
      </SecondaryCard>

      {!hasCampaignEnded && (
        <div className="relative">
          <p>Time till Campaign ends</p>
          <Countdown
            date={Number(campaign.endTime) * 1000}
            className={"text-foreground"}
            onComplete={() => {
              setHasCampaignEnded(true);
              setExitEarly(false);
            }}
            renderer={({ days, hours, minutes, seconds, completed }) => {
              if (completed) {
                return <span>Campaign Ended</span>;
              } else {
                return (
                  <span>
                    {days}d {hours}h {minutes}m {seconds}s
                  </span>
                );
              }
            }}
          />
          <div className="pointer-events-auto absolute top-1/2 right-8 flex -translate-y-1/2 items-center gap-2">
            <span className="text-card-foreground text-xs">Exit Early</span>
            <Switch checked={exitEarly} onCheckedChange={setExitEarly} />
          </div>
        </div>
      )}

      <div className="relative pt-5">
        <p className="absolute top-0 left-0 text-xs text-red-500">
          {disableConditions.map(
            (cond) => cond.condition && cond.message + " ",
          )}
        </p>

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
          className="w-full"
          onSuccess={handleWithdrawal}
        >
          Withdraw {exitEarly ? "(Early Exit)" : ""}
        </WriteButtonWithAllowance>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-card-foreground/70 flex items-center gap-1">
            WITHDRAWAL FEE <HelpCircle className="h-3 w-3" />
          </span>
          <span className="text-card-foreground">
            {" "}
            {/*TODO: Ask if withdrawFee exists*/}
            {/*{formatFeePercentage(vault.strategy.withdrawFee)}*/}
          </span>
        </div>
      </div>

      <p className="text-card-foreground/70 text-xs">
        The displayed APY accounts for performance fee ⓘ that is deducted from
        the generated yield only
      </p>
    </div>
  );
};

export default CampaignWithdrawTab;
