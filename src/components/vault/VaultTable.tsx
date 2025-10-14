import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import { useState } from "react";
import type { Vault } from "~/types";
import { vaultTableColumns } from "./VaultTableColumns";
import VaultDesktopTable from "./VaultDesktopTable";
import VaultMobileList from "./VaultMobileList";

interface VaultTableProps {
  data: Vault[];
}

const VaultTable = ({ data }: VaultTableProps) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data,
    columns: vaultTableColumns,
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
      <VaultMobileList table={table} />
    </div>
  );
};

export default VaultTable;
