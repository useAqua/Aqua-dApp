import Link from "next/link";
import { Badge } from "~/components/ui/badge";
import VaultIcon from "./VaultIcon";
import type { Vault } from "~/types";

interface VaultMobileCardProps {
  vault: Vault;
}

const VaultMobileCard = ({ vault }: VaultMobileCardProps) => {
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
            {vault.protocol}
          </Badge>
        </div>
      </div>

      {/* Vault Data Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-muted-foreground mb-1 text-xs uppercase">
            WALLET
          </div>
          <div className="font-semibold">{vault.wallet}</div>
        </div>
        <div>
          <div className="text-muted-foreground mb-1 text-xs uppercase">
            DEPOSIT
          </div>
          <div className="font-medium">{vault.deposit}</div>
        </div>
        <div>
          <div className="text-muted-foreground mb-1 text-xs uppercase">
            APY
          </div>
          <div className="font-semibold">{vault.apy}</div>
        </div>
        <div>
          <div className="text-muted-foreground mb-1 text-xs uppercase">
            TVL
          </div>
          <div className="font-semibold">{vault.tvl}</div>
        </div>
      </div>
    </Link>
  );
};

export default VaultMobileCard;
