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
import { Database } from "lucide-react";

interface VaultTableProps {
  data: VaultTableEntry[];
  isLoadingWallet?: boolean;
  isLoadingDeposit?: boolean;
  isLoadingPoints?: boolean;
  customEmptyTableMessage?: string;
}

const VaultTable = ({
  data,
  isLoadingWallet = false,
  isLoadingDeposit = false,
  isLoadingPoints = false,
  customEmptyTableMessage = "You don't have any deposits in vaults yet.",
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
      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
          <Database className="text-muted-foreground mb-4 h-12 w-12" />
          <h3 className="mb-2 text-lg font-semibold">No Vaults</h3>
          <p className="text-muted-foreground text-sm">
            {customEmptyTableMessage}
          </p>
        </div>
      ) : (
        <>
          <VaultDesktopTable table={table} />
          <VaultMobileList
            table={table}
            isLoadingWallet={isLoadingWallet}
            isLoadingDeposit={isLoadingDeposit}
            isLoadingPoints={isLoadingPoints}
          />
        </>
      )}
    </div>
  );
};

export default VaultTable;
