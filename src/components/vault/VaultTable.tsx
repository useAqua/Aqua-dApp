import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  type SortingState,
  type ColumnFiltersState,
  type PaginationState,
} from "@tanstack/react-table";
import { useState } from "react";
import type { VaultTableEntry } from "~/types";
import { createVaultTableColumns } from "./VaultTableColumns";
import VaultDesktopTable from "./VaultDesktopTable";
import VaultMobileList from "./VaultMobileList";
import { Database, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "~/components/ui/button";

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
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

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
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
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

          {table.getPageCount() > 1 && (
            <div className="flex items-center justify-between px-2">
              <div className="text-muted-foreground text-sm tracking-wide">
                Showing{" "}
                {table.getState().pagination.pageIndex *
                  table.getState().pagination.pageSize +
                  1}
                -
                {Math.min(
                  (table.getState().pagination.pageIndex + 1) *
                    table.getState().pagination.pageSize,
                  table.getFilteredRowModel().rows.length,
                )}{" "}
                of {table.getFilteredRowModel().rows.length} vaults
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <div className="text-sm">
                  Page {table.getState().pagination.pageIndex + 1} of{" "}
                  {table.getPageCount()}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default VaultTable;
