import { type Table as TableType } from "@tanstack/react-table";
import VaultMobileCard from "./VaultMobileCard";
import type { VaultTableEntry } from "~/types";
import { Card } from "~/components/ui/card";

interface VaultMobileListProps {
  table: TableType<VaultTableEntry>;
  isLoadingWallet?: boolean;
  isLoadingDeposit?: boolean;
  isLoadingPoints?: boolean;
  isLoadingAPY?: boolean;
}

const VaultMobileList = ({
  table,
  isLoadingWallet = false,
  isLoadingDeposit = false,
  isLoadingPoints = false,
  isLoadingAPY = false,
}: VaultMobileListProps) => {
  return (
    <Card className="md:hidden">
      {table.getRowModel().rows.map((row) => (
        <VaultMobileCard
          key={row.id}
          vault={row.original}
          isLoadingWallet={isLoadingWallet}
          isLoadingDeposit={isLoadingDeposit}
          isLoadingPoints={isLoadingPoints}
          isLoadingAPY={isLoadingAPY}
        />
      ))}
    </Card>
  );
};

export default VaultMobileList;
