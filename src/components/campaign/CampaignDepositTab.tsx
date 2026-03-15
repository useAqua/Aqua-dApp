import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { HelpCircle } from "lucide-react";
import { SecondaryCard } from "~/components/common/SecondaryCard";
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
} from "~/components/vault/vaultConstants";

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

  const { data: balanceData, refetch: refetchBalance } = useBalance({
    address: userAddress,
  });

  const { refreshVaultData } = useVaultRefresh();

  const formattedLpTokenBalance = useMemo(() => {
    if (!selectedTokenBalance) return 0;
    return Number(formatUnits(selectedTokenBalance, selectedTokenDecimals));
  }, [selectedTokenBalance, selectedTokenDecimals]);

  // TODO: Add Later
  // const { selectedTokenSymbol, isWeth } = useMemo(() => {
  //   let symbol: string;
  //   if (selectedToken === "token0") {
  //     symbol = vault.tokens.token0.symbol;
  //   } else if (selectedToken === "token1") {
  //     symbol = vault.tokens.token1.symbol;
  //   } else {
  //     symbol = `${vault.tokens.token0.symbol}/${vault.tokens.token1.symbol}`;
  //   }
  //
  //   const isWethToken = symbol.toUpperCase() === "WETH";
  //   const finalSymbol = isWethToken && useEth ? "ETH" : symbol;
  //
  //   return { selectedTokenSymbol: finalSymbol, isWeth: isWethToken };
  // }, [
  //   selectedToken,
  //   vault.tokens.token0.symbol,
  //   vault.tokens.token1.symbol,
  //   useEth,
  // ]);

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
    // Simple formatting for toast messages
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
    <div className="space-y-6">
      <div>
        <div className="flex flex-wrap items-center justify-between">
          <p className="text-card-foreground/70 mb-2 text-sm">
            💰 Enter Amount
          </p>
          <p className="text-card-foreground/70 mb-2 text-sm max-sm:hidden">
            Balance: {selectedTokenBalanceReactNode} {selectedTokenSymbol}
          </p>
        </div>

        <Input
          type="number"
          placeholder="0"
          className="mb-2 text-lg"
          variant="secondary"
          value={amount}
          onChange={(e) => setAmount(enforceOnlyNumbers(e.target.value))}
        />
        <div className="relative">
          <Select
            value={selectedVaultIndex.toString()}
            onValueChange={(value) => setSelectedVaultIndex(Number(value))}
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
              {/*      {vault.tokens.token0.symbol}/{vault.tokens.token1.symbol}*/}
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
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <p className="text-card-foreground/70 mb-2 text-sm sm:hidden">
          Balance: {selectedTokenBalanceReactNode} {selectedTokenSymbol}
        </p>
        <div className="flex gap-2">
          {PERCENTAGE_PRESETS.map((percentage) => (
            <Button
              key={percentage}
              variant="secondary"
              size="sm"
              className="flex-1"
              onClick={() => setAmount(calculateAmountByPercentage(percentage))}
            >
              {percentage * 100}%
            </Button>
          ))}
        </div>
      </div>
      <SecondaryCard className="p-4">
        <p className="mb-2 text-sm">You receive</p>
        <p className="mb-1 text-2xl font-bold">
          {formatNumber(
            +formatUnits(
              BigInt(estimatedSwapAmountOut ?? "0"),
              selectedTokenDecimals,
            ),
          )}{" "}
        </p>
        <p className="text-secondary-foreground/80 mt-1 text-xs">
          ${formatNumber(depositValueUsd) ?? "0"}
        </p>
        <div className="border-secondary-foreground/20 mt-3 border-t pt-3">
          <p className="text-secondary-foreground/80 text-xs">
            {selectedTokenSymbol} shares
          </p>
        </div>
      </SecondaryCard>

      <div className="relative pt-5">
        <div className="absolute top-0 left-0 text-xs text-red-500">
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
          className="w-full"
          onSuccess={handleDeposited}
        >
          Deposit
        </WriteButtonWithAllowance>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-card-foreground/70 flex items-center gap-1">
            DEPOSIT FEE <HelpCircle className="h-3 w-3" />
          </span>
          <span className="text-card-foreground">
            {/*TODO: Ask if depositFee exists*/}
            {/*{formatFeePercentage(vault.strategy.depositFee)}*/}
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

export default CampaignDepositTab;
