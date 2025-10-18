import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import { useState } from "react";
import type { VaultTableEntry } from "~/types";
import { createVaultTableColumns } from "./VaultTableColumns";
import VaultDesktopTable from "./VaultDesktopTable";
import VaultMobileList from "./VaultMobileList";

interface VaultTableProps {
  data: VaultTableEntry[];
  isLoadingWallet?: boolean;
  isLoadingDeposit?: boolean;
  isLoadingPoints?: boolean;
}

const VaultTable = ({
  data,
  isLoadingWallet = false,
  isLoadingDeposit = false,
  isLoadingPoints = false,
}: VaultTableProps) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const columns = createVaultTableColumns(
    isLoadingWallet,
    isLoadingDeposit,
    isLoadingPoints,
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="space-y-4">
      <VaultDesktopTable table={table} />
      <VaultMobileList
        table={table}
        isLoadingWallet={isLoadingWallet}
        isLoadingDeposit={isLoadingDeposit}
        isLoadingPoints={isLoadingPoints}
      />
    </div>
  );
};

export default VaultTable;
