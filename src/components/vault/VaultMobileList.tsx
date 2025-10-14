import { type Table as TableType } from "@tanstack/react-table";
import VaultMobileCard from "./VaultMobileCard";
import type { Vault } from "~/types";
import { Card } from "~/components/ui/card";

interface VaultMobileListProps {
  table: TableType<Vault>;
}

const VaultMobileList = ({ table }: VaultMobileListProps) => {
  return (
    <Card className="md:hidden">
      {table.getRowModel().rows.map((row) => (
        <VaultMobileCard key={row.id} vault={row.original} />
      ))}
    </Card>
  );
};

export default VaultMobileList;
