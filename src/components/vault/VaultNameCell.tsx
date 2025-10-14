import Link from "next/link";
import { Badge } from "~/components/ui/badge";
import VaultIcon from "./VaultIcon";
import type { Vault } from "~/types";

interface VaultNameCellProps {
  vault: Vault;
}

const VaultNameCell = ({ vault }: VaultNameCellProps) => {
  return (
    <Link
      href={`/vault/${vault.id}`}
      className="flex items-center gap-3 transition-opacity hover:opacity-80"
    >
      <VaultIcon icon={vault.icon} size="md" />
      <div className="min-w-0">
        <div className="mb-0.5 font-semibold">{vault.name}</div>
        <Badge variant="secondary" className="text-xs">
          {vault.protocol}
        </Badge>
      </div>
    </Link>
  );
};

export default VaultNameCell;
