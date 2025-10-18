import Link from "next/link";
import { Badge } from "~/components/ui/badge";
import VaultIcon from "./VaultIcon";
import type { VaultTableEntry } from "~/types";
import { formatNumber } from "~/utils/numbers";
import { Skeleton } from "~/components/ui/skeleton";

interface VaultMobileCardProps {
  vault: VaultTableEntry;
  isLoadingWallet?: boolean;
  isLoadingDeposit?: boolean;
  isLoadingPoints?: boolean;
}

const VaultMobileCard = ({
  vault,
  isLoadingWallet = false,
  isLoadingDeposit = false,
  isLoadingPoints = false,
}: VaultMobileCardProps) => {
  return (
    <Link
      href={`/vault/${vault.id}`}
      className="bg-card hover:bg-primary/10 border-border/50 block border-b px-6 py-8 transition-colors first:rounded-t-lg last:rounded-b-lg"
    >
      {/* Vault Header */}
      <div className="mb-4 flex items-center gap-3 pb-4">
        <VaultIcon icon={vault.icon} size="lg" />
        <div className="min-w-0 flex-1">
          <div className="mb-1 font-semibold">{vault.name}</div>
          <Badge variant="secondary" className="text-xs">
            {vault.platformId}
          </Badge>
        </div>
      </div>

      {/* Vault Data Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-muted-foreground mb-1 text-xs uppercase">
            WALLET
          </div>
          <Skeleton isLoading={isLoadingWallet} className="h-5 w-full">
            <div className="font-semibold">
              ${formatNumber(vault.walletBalanceUsd)}
            </div>
          </Skeleton>
        </div>
        <div>
          <div className="text-muted-foreground mb-1 text-xs uppercase">
            DEPOSIT
          </div>
          <Skeleton isLoading={isLoadingDeposit} className="h-5 w-full">
            <div className="font-medium">
              ${formatNumber(vault.userDepositUsd)}
            </div>
          </Skeleton>
        </div>
        <div>
          <div className="text-muted-foreground mb-1 text-xs uppercase">
            POINTS
          </div>
          <Skeleton isLoading={isLoadingPoints} className="h-5 w-full">
            <div className="font-medium">{formatNumber(vault.userPoints)}</div>
          </Skeleton>
        </div>
        <div>
          <div className="text-muted-foreground mb-1 text-xs uppercase">
            APY
          </div>
          <div className="font-semibold">{vault.apy}%</div>
        </div>
        <div>
          <div className="text-muted-foreground mb-1 text-xs uppercase">
            TVL
          </div>
          <div className="font-semibold">${formatNumber(vault.tvlUsd)}</div>
        </div>
      </div>
    </Link>
  );
};

export default VaultMobileCard;
