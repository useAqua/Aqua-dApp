import Link from "next/link";
import { Badge } from "~/components/ui/badge";
import VaultIcon from "./VaultIcon";
import type { VaultTableEntry } from "~/types";

interface VaultNameCellProps {
  vault: VaultTableEntry;
}

const VaultNameCell = ({ vault }: VaultNameCellProps) => {
  return (
    <Link
      href={`/vault/${vault.id}`}
      className="flex items-center gap-3 transition-opacity hover:opacity-80"
    >
      <VaultIcon vaultName={vault.name} size="md" />
      <div className="min-w-0">
        <div className="mb-0.5 font-semibold">{vault.name}</div>
        <Badge variant="secondary" className="text-xs">
          {vault.platformId}
        </Badge>
      </div>
    </Link>
  );
};

export default VaultNameCell;
