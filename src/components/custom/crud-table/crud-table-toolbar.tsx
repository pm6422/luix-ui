import type * as React from "react";
import { type CrudTable } from "@/lib/table-features";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CloseCircleBoldDuotone,
  MinimalisticMagniferBoldDuotone,
} from "solar-icon-set";
import { DataTableSortList } from "@/components/custom/data-table/data-table-sort-list";
import { DataTableViewOptions } from "@/components/custom/data-table/data-table-view-options";

export interface CrudTableToolbarProps<TData> {
  table: CrudTable<TData>;
  searchPlaceholder?: string;
  resetLabel?: string;
  search: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: (value: string) => void;
  isFiltered: boolean;
  onResetFilters: () => void;
  filterPopover?: React.ReactNode | ((table: CrudTable<TData>) => React.ReactNode);
  rightActions?: React.ReactNode;
}

export function CrudTableToolbar<TData>({
  table,
  searchPlaceholder = "Search...",
  resetLabel = "Reset",
  search,
  onSearchChange,
  onSearchSubmit,
  isFiltered,
  onResetFilters,
  filterPopover,
  rightActions,
}: CrudTableToolbarProps<TData>) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-2">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-1 w-full">
        <div className="relative w-full sm:w-[180px] lg:w-[260px] shrink-0">
          <MinimalisticMagniferBoldDuotone
            size={16}
            className="absolute left-2.5 top-2.5 text-muted-foreground pointer-events-none"
          />
          <Input
            placeholder={searchPlaceholder}
            className="pl-9 h-9 text-xs w-full rounded-xl bg-background/50 border-muted-foreground/20 focus-within:border-primary/40 transition-all shadow-inner"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onSearchSubmit(search);
              }
            }}
          />
          {search && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => {
                onSearchChange("");
                onSearchSubmit("");
              }}
              className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <CloseCircleBoldDuotone size={16} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
          {typeof filterPopover === "function"
            ? filterPopover(table)
            : filterPopover}
          {table && <DataTableSortList table={table} />}
          {table && <DataTableViewOptions columns={table.getAllColumns()} />}
          {rightActions}

          {isFiltered && (
            <Button
              type="button"
              variant="ghost"
              onClick={onResetFilters}
              className="h-8 px-2 lg:px-3 text-xs gap-1.5 font-medium text-muted-foreground hover:text-foreground transition-colors shrink-0 cursor-pointer"
            >
              {resetLabel}
              <CloseCircleBoldDuotone size={15} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
