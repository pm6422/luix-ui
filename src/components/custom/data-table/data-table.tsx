import { flexRender } from "@tanstack/react-table";
import type * as React from "react";

import { DataTablePagination } from "./data-table-pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { type CrudTable, type CrudRow } from "@/lib/table-features";

export interface DataTableProps<TData> extends React.ComponentProps<"div"> {
  table: CrudTable<TData>;
  totalCount?: number;
  loading?: boolean;
  emptyText?: React.ReactNode;
  onRowClick?: (row: CrudRow<TData>) => void;
  actionBar?: React.ReactNode;
  children?: React.ReactNode;
}

export function DataTable<TData>({
  table,
  totalCount,
  loading = false,
  emptyText = "No results.",
  onRowClick,
  actionBar,
  children,
  className,
  ...props
}: DataTableProps<TData>) {
  return (
    <div
      className={cn("flex w-full flex-col gap-2.5 overflow-auto", className)}
      {...props}
    >
      {children}
      <div className="relative overflow-hidden rounded-md border border-border/60 animate-in fade-in-0 duration-200">
        {loading && (
          <div className="absolute inset-0 z-10 bg-background/40 backdrop-blur-[1px] pointer-events-none transition-opacity" />
        )}
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={cn(
                    "data-[state=selected]:bg-muted/60 data-[state=selected]:hover:bg-muted/80",
                    onRowClick && "cursor-pointer",
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className="h-24 text-center text-muted-foreground/60 font-bold"
                >
                  {emptyText}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col gap-2.5">
        <DataTablePagination
          table={table}
          totalCount={totalCount ?? table.getFilteredRowModel().rows.length}
        />
        {actionBar &&
          table.getFilteredSelectedRowModel().rows.length > 0 &&
          actionBar}
      </div>
    </div>
  );
}
