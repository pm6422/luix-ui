import type { ColumnSort } from "@tanstack/react-table";
import { type CrudTable } from "@/lib/table-features";
import {
  MenuDotsBoldDuotone,
  SortFromTopToBottomBoldDuotone,
  TrashBin2BoldDuotone,
} from "solar-icon-set";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

interface DataTableSortListProps<TData> {
  table: CrudTable<TData>;
}

export function DataTableSortList<TData>({
  table,
}: DataTableSortListProps<TData>) {
  const [open, setOpen] = React.useState(false);
  const sorting = table.state.sorting;
  const setSorting = table.setSorting;

  // 找出所有可排序的列
  const sortableColumns = React.useMemo(() => {
    return table.getAllColumns().filter((col) => col.getCanSort());
  }, [table]);

  const onAddSort = () => {
    const activeSortIds = new Set(sorting.map((s) => s.id));
    const firstUnused = sortableColumns.find((col) => !activeSortIds.has(col.id));
    if (!firstUnused) return;

    setSorting((prev) => [...prev, { id: firstUnused.id, desc: false }]);
  };

  const onUpdateSort = (id: string, updates: Partial<ColumnSort>) => {
    setSorting((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  };

  const onRemoveSort = (id: string) => {
    setSorting((prev) => prev.filter((s) => s.id !== id));
  };

  const getColumnLabel = (id: string) => {
    const col = table.getColumn(id);
    if (!col) return id;
    const metaLabel = col.columnDef.meta?.label;
    if (typeof metaLabel === "string") return metaLabel;
    const header = col.columnDef.header;
    if (typeof header === "string") return header;
    if (typeof header === "function") {
      return id.charAt(0).toUpperCase() + id.slice(1);
    }
    return id;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className={
            sorting.length > 0
              ? "h-8 px-2.5 gap-1.5 text-xs font-medium rounded-lg bg-muted/65 text-foreground hover:bg-muted/80 active:scale-95 transition-all cursor-pointer"
              : "h-8 px-2.5 gap-1.5 text-xs font-medium rounded-lg bg-muted/40 text-muted-foreground hover:bg-muted/70 hover:text-foreground active:scale-95 transition-all cursor-pointer"
          }
        >
          <SortFromTopToBottomBoldDuotone size={16} className="text-muted-foreground" />
          <span>Sort</span>
          {sorting.length > 0 && (
            <>
              <Separator orientation="vertical" className="mx-1 h-4" />
              <Badge variant="secondary" className="rounded-sm px-1 font-normal text-[10px]">
                {sorting.length}
              </Badge>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[340px] p-3" align="start">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground">Sort by</span>
          </div>
          
          {sorting.length > 0 && (
            <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
              {sorting.map((sort) => {
                const activeSortIds = new Set(sorting.map((s) => s.id));
                const availableColsForThis = sortableColumns.filter(
                  (col) => !activeSortIds.has(col.id) || col.id === sort.id
                );

                return (
                  <div key={sort.id} className="flex items-center gap-1.5">
                    <Select
                      value={sort.id}
                      onValueChange={(val) => onUpdateSort(sort.id, { id: val })}
                    >
                      <SelectTrigger className="h-8 text-[11px] flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {availableColsForThis.map((col) => (
                          <SelectItem key={col.id} value={col.id} className="text-[11px]">
                            {getColumnLabel(col.id)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={sort.desc ? "desc" : "asc"}
                      onValueChange={(val) => onUpdateSort(sort.id, { desc: val === "desc" })}
                    >
                      <SelectTrigger className="h-8 text-[11px] w-[80px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="asc" className="text-[11px]">Asc</SelectItem>
                        <SelectItem value="desc" className="text-[11px]">Desc</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onRemoveSort(sort.id)}
                      className="h-8 w-8 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 shrink-0 cursor-pointer"
                    >
                      <TrashBin2BoldDuotone size={15} />
                    </Button>

                    <div className="h-8 w-8 flex items-center justify-center border border-border/40 rounded-md text-muted-foreground/60 shrink-0 bg-muted/20">
                      <MenuDotsBoldDuotone size={14} className="cursor-grab" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex items-center gap-2">
            {sorting.length < sortableColumns.length && (
              <Button
                variant="secondary"
                size="sm"
                onClick={onAddSort}
                className="h-8 text-xs font-medium px-3 bg-secondary text-secondary-foreground hover:bg-secondary/80"
              >
                Add sort
              </Button>
            )}
            
            {sorting.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSorting([])}
                className="h-8 text-xs font-medium px-3"
              >
                Reset sorting
              </Button>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
