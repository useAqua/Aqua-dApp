import { type Table as TableType } from "@tanstack/react-table";
import VaultMobileCard from "./VaultMobileCard";
import type { Vault } from "~/types";

interface VaultMobileListProps {
  table: TableType<Vault>;
}

const VaultMobileList = ({ table }: VaultMobileListProps) => {
  return (
    <div className="bg-card rounded-lg shadow-[var(--shadow-card)] md:hidden">
      {table.getRowModel().rows.map((row) => (
        <VaultMobileCard key={row.id} vault={row.original} />
      ))}
    </div>
  );
};

export default VaultMobileList;
