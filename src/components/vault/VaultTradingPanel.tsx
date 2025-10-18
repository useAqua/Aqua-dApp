import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { HelpCircle } from "lucide-react";
import { Card } from "~/components/ui/card";
import { SecondaryCard } from "~/components/common/SecondaryCard";
import ContractActionButton from "~/components/common/ContractActionButton";
import type { EnrichedVaultInfo } from "~/types";
import { formatFeePercentage } from "~/utils/vaultHelpers";

interface VaultTradingPanelProps {
  vault: EnrichedVaultInfo;
}

const VaultTradingPanel = ({ vault }: VaultTradingPanelProps) => {
  const depositFee = formatFeePercentage(vault.strategy.depositFee);
  const withdrawFee = formatFeePercentage(vault.strategy.withdrawFee);
  const lpTokenSymbol = vault.tokens.lpToken.symbol ?? "LP Token";

  return (
    <Card className={`sticky top-20 min-h-[500px] p-6 max-md:py-8`}>
      <Tabs defaultValue="deposit" className="w-full">
        <TabsList className="bg-secondary ring-border text-secondary-foreground mb-6 grid w-full grid-cols-2 ring">
          <TabsTrigger value="deposit">Deposit</TabsTrigger>
          <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
        </TabsList>

        <TabsContent value="deposit" className="space-y-6">
          <div>
            <p className="text-card-foreground/70 mb-2 text-sm">
              💰 Select token
            </p>
            <Input
              type="number"
              placeholder="0"
              className="mb-2 text-lg"
              variant="secondary"
            />
            <Button
              variant="secondary"
              size="sm"
              className="w-full justify-between"
            >
              <span>{lpTokenSymbol}</span>
              <span>▼</span>
            </Button>
          </div>

          <div className="flex gap-2">
            <Button variant="secondary" size="sm" className="flex-1">
              25%
            </Button>
            <Button variant="secondary" size="sm" className="flex-1">
              50%
            </Button>
            <Button variant="secondary" size="sm" className="flex-1">
              75%
            </Button>
            <Button variant="secondary" size="sm" className="flex-1">
              100%
            </Button>
          </div>

          <SecondaryCard className="p-4">
            <p className="mb-2 text-sm">You deposit</p>
            <p className="mb-1 text-2xl font-bold">0</p>
            <p className="text-secondary-foreground/80 text-xs">$0</p>
            <div className="border-secondary-foreground/20 mt-3 border-t pt-3">
              <p className="text-secondary-foreground/80 text-xs">
                {vault.name}
              </p>
            </div>
          </SecondaryCard>

          <ContractActionButton className="h-10 w-full" size="sm">
            Deposit
          </ContractActionButton>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-card-foreground/70 flex items-center gap-1">
                DEPOSIT FEE <HelpCircle className="h-3 w-3" />
              </span>
              <span className="text-card-foreground">{depositFee}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-card-foreground/70 flex items-center gap-1">
                WITHDRAWAL FEE <HelpCircle className="h-3 w-3" />
              </span>
              <span className="text-card-foreground">{withdrawFee}</span>
            </div>
          </div>

          <p className="text-card-foreground/70 text-xs">
            The displayed APY accounts for performance fee ⓘ that is deducted
            from the generated yield only
          </p>
        </TabsContent>

        <TabsContent value="withdraw">
          <p className="text-card-foreground/70 py-8 text-center">
            Connect wallet to withdraw
          </p>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default VaultTradingPanel;
