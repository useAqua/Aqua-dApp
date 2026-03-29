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
import { useMemo, useState } from "react";
import type { CampaignInfo } from "~/types/contracts";
import { createCampaignTableColumns } from "./CampaignTableColumns";
import CampaignDesktopTable from "./CampaignDesktopTable";
import CampaignMobileList from "./CampaignMobileList";
import { ChevronLeft, ChevronRight, PlusIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { Skeleton } from "~/components/ui/skeleton";

interface CampaignTableProps {
  data: CampaignInfo[];
  customEmptyTableMessage?: string;
  isDashboard?: boolean;
  isLoading?: boolean;
}

const CampaignTable = ({
  data,
  customEmptyTableMessage = "No campaigns available at the moment.",
  isDashboard = false,
  isLoading = false,
}: CampaignTableProps) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  const columns = useMemo(() => createCampaignTableColumns(), []);

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
    <div>
      {isLoading ? (
        <div className="space-y-2 p-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} isLoading className="h-14 w-full rounded-lg" />
          ))}
        </div>
      ) : data.length === 0 ? (
        <div className="flex flex-col items-center justify-center border border-dashed border-border/50 rounded-lg mx-4 mb-4 py-14 text-center">
          <span className="bg-secondary mb-4 grid h-14 w-14 place-content-center rounded-md">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect
                x="3"
                y="6"
                width="18"
                height="13"
                rx="3"
                stroke="#3472e8"
                strokeWidth="1.8"
              />
              <path d="M3 10h18" stroke="#3472e8" strokeWidth="1.8" />
              <path
                d="M7 14h4"
                stroke="#3472e8"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <h3 className="text-lg font-semibold">No Campaigns</h3>
          <p className="text-muted-foreground max-w-70 text-sm">
            {customEmptyTableMessage}
          </p>

          {isDashboard && (
            <Button className="mt-6 rounded-md px-6" asChild>
              <Link href="/">
                <PlusIcon />
                View All Campaigns
              </Link>
            </Button>
          )}
        </div>
      ) : (
        <>
          <CampaignDesktopTable table={table} />
          <CampaignMobileList table={table} />

          {table.getPageCount() > 1 && (
            <div className="flex items-center justify-between px-5 py-3">
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
                of {table.getFilteredRowModel().rows.length} campaigns
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

export default CampaignTable;
