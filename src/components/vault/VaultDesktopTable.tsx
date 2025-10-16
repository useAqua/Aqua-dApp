import { flexRender, type Table as TableType } from "@tanstack/react-table";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { VaultTableEntry } from "~/types";

interface VaultDesktopTableProps {
  table: TableType<VaultTableEntry>;
}

const VaultDesktopTable = ({ table }: VaultDesktopTableProps) => {
  return (
    <div className="bg-card border-secondary hidden overflow-hidden rounded-lg border md:block">
      <table className="w-full">
        <thead className="bg-primary/5">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="border-border/50 border-b">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="text-muted-foreground hover:text-foreground hover:bg-primary/10 cursor-pointer px-4 py-3 text-left text-xs font-medium tracking-wider uppercase transition-colors"
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <div className="flex items-center gap-2">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                    <span className="text-primary h-3 w-3">
                      {header.column.getIsSorted() &&
                        (header.column.getIsSorted() === "asc" ? (
                          <ChevronUp className="h-3 w-3" />
                        ) : (
                          <ChevronDown className="h-3 w-3" />
                        ))}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="border-border/30 hover:bg-primary/10 border-b transition-colors"
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-4">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VaultDesktopTable;
