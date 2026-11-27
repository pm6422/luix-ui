import type * as React from "react";
import { useState } from "react";
import { type CrudTable, type CrudRow } from "@/lib/table-features";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/custom/confirm-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DataTable } from "@/components/custom/data-table/data-table";
import { CrudTableToolbar } from "./crud-table-toolbar";
import {
  CheckCircleBoldDuotone,
  CloseCircleBoldDuotone,
  MenuDotsBoldDuotone,
  RefreshLinear,
  TrashBin2BoldDuotone,
} from "solar-icon-set";

export interface CrudPageLayoutProps<TData> {
  title: string;
  description?: string;
  entityName?: string;
  table: CrudTable<TData>;
  loading: boolean;
  getRowId?: (row: TData) => string;
  totalCount?: number;

  pagination?: {
    pageNo?: number;
    pageSize?: number;
    totalPages?: number;
    totalElements: number;
    setPageNo?: (page: number) => void;
    setPageSize?: (size: number) => void;
  };

  filters: {
    search: string;
    setSearch: (value: string) => void;
    isFiltered: boolean;
    resetFilters: () => void;
    handleSearchSubmit: (value: string) => void;
  };

  onRefresh?: () => void;
  onRowClick?: (row: CrudRow<TData>) => void;
  onBatchDelete?: (selectedIds: string[]) => Promise<void>;
  onBatchUpdateStatus?: (
    selectedIds: string[],
    enabled: boolean,
  ) => Promise<void>;
  statusOptions?: {
    enableLabel?: string;
    disableLabel?: string;
  };
  customBatchActions?: (
    selectedIds: string[],
    clearSelection: () => void,
  ) => React.ReactNode;

  createDialog?: React.ReactNode;
  uploadDialog?: React.ReactNode;
  exportDialog?: React.ReactNode;
  moreActions?: React.ReactNode;
  filterPopover?:
    | React.ReactNode
    | ((table: CrudTable<TData>) => React.ReactNode);
  searchPlaceholder?: string;
  emptyText?: React.ReactNode;
  refreshLabel?: string;
  moreLabel?: string;
  resetLabel?: string;
  className?: string;
}

function defaultGetRowId(row: unknown): string {
  if (typeof row === "object" && row !== null) {
    const record = row as Record<string, unknown>;
    const candidate = record.id ?? record.username;
    if (candidate !== undefined && candidate !== null) {
      return String(candidate);
    }
  }
  return "";
}

export function CrudPageLayout<TData>({
  title,
  description,
  entityName = "Item",
  table,
  loading,
  getRowId,
  totalCount,
  pagination,
  filters,
  onRefresh,
  onRowClick,
  onBatchDelete,
  onBatchUpdateStatus,
  statusOptions,
  customBatchActions,
  createDialog,
  uploadDialog,
  exportDialog,
  moreActions,
  filterPopover,
  searchPlaceholder,
  emptyText,
  refreshLabel = "Refresh",
  moreLabel = "More",
  resetLabel,
  className,
}: CrudPageLayoutProps<TData>) {
  const [isBatchDeleting, setIsBatchDeleting] = useState(false);
  const [isBatchUpdatingStatus, setIsBatchUpdatingStatus] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deletingIds, setDeletingIds] = useState<string[]>([]);

  const resolvedTotalCount = totalCount ?? pagination?.totalElements ?? 0;

  const selectedRows = table.getSelectedRowModel().rows;
  const selectedIds = selectedRows
    .map((r) => (getRowId ? getRowId(r.original) : defaultGetRowId(r.original)))
    .filter(Boolean);

  const handleConfirmBatchDelete = async () => {
    const ids = deletingIds.length > 0 ? deletingIds : selectedIds;
    if (!onBatchDelete || ids.length === 0) return;
    setIsBatchDeleting(true);
    try {
      await onBatchDelete(ids);
      table.resetRowSelection();
      setDeletingIds([]);
    } finally {
      setIsBatchDeleting(false);
    }
  };

  const handleOpenDeleteConfirm = () => {
    if (selectedIds.length === 0) return;
    setDeletingIds(selectedIds);
    setConfirmDeleteOpen(true);
  };

  const handleBatchStatus = async (enabled: boolean) => {
    if (!onBatchUpdateStatus || selectedIds.length === 0) return;
    setIsBatchUpdatingStatus(true);
    try {
      await onBatchUpdateStatus(selectedIds, enabled);
      table.resetRowSelection();
    } finally {
      setIsBatchUpdatingStatus(false);
    }
  };

  const hasSecondaryActions = Boolean(
    uploadDialog || exportDialog || moreActions,
  );

  return (
    <div className={cn("flex-1 overflow-hidden px-0 py-4 space-y-4", className)}>
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black tracking-tight text-foreground">
              {title}
            </h2>
            {resolvedTotalCount > 0 && (
              <Badge
                variant="outline"
                className="text-xs font-bold tabular-nums"
              >
                {resolvedTotalCount}
              </Badge>
            )}
          </div>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Selected Batch Actions Group */}
          {selectedIds.length > 0 && (
            <TooltipProvider>
              <div className="flex items-center gap-1.5 animate-in fade-in-0 zoom-in-95 duration-150 mr-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => table.resetRowSelection()}
                  className="h-8 px-2 text-xs gap-1.5 font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  title="Clear selection"
                >
                  <span className="tabular-nums">
                    <strong className="text-foreground font-bold">
                      {selectedIds.length}
                    </strong>{" "}
                    selected
                  </span>
                  <CloseCircleBoldDuotone size={15} />
                </Button>

                {onBatchUpdateStatus && (
                  <Tooltip>
                    <DropdownMenu>
                      <TooltipTrigger asChild>
                        <DropdownMenuTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            disabled={isBatchUpdatingStatus}
                            className="h-8 w-8 rounded-lg cursor-pointer"
                          >
                            <CheckCircleBoldDuotone
                              size={16}
                              className="text-primary"
                            />
                          </Button>
                        </DropdownMenuTrigger>
                      </TooltipTrigger>
                      <DropdownMenuContent align="end" className="w-32">
                        <DropdownMenuItem
                          onClick={() => handleBatchStatus(true)}
                          className="text-xs flex items-center gap-2 cursor-pointer"
                        >
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          {statusOptions?.enableLabel || "Enable"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleBatchStatus(false)}
                          className="text-xs flex items-center gap-2 cursor-pointer"
                        >
                          <span className="w-2 h-2 rounded-full bg-rose-500" />
                          {statusOptions?.disableLabel || "Disable"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <TooltipContent side="bottom">
                      Update Status ({selectedIds.length})
                    </TooltipContent>
                  </Tooltip>
                )}

                {onBatchDelete && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        disabled={isBatchDeleting}
                        onClick={handleOpenDeleteConfirm}
                        className="h-8 px-2.5 text-xs font-semibold gap-1.5 rounded-lg cursor-pointer"
                      >
                        <TrashBin2BoldDuotone size={15} />
                        <span className="tabular-nums">
                          Delete ({selectedIds.length})
                        </span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      Delete ({selectedIds.length})
                    </TooltipContent>
                  </Tooltip>
                )}

                {customBatchActions?.(selectedIds, () =>
                  table.resetRowSelection(),
                )}

                <div className="h-4 w-[1px] bg-border/80 mx-1.5 shrink-0" />
              </div>
            </TooltipProvider>
          )}

          {onRefresh && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onRefresh}
              className="group h-8 px-2.5 gap-1.5 text-xs font-medium rounded-lg bg-muted/40 text-muted-foreground hover:bg-muted/70 hover:text-foreground active:scale-95 transition-all cursor-pointer"
            >
              <RefreshLinear
                size={14}
                className={cn(
                  "shrink-0",
                  loading
                    ? "animate-spin"
                    : "transition-transform duration-300 group-hover:rotate-45",
                )}
              />
              {refreshLabel}
            </Button>
          )}

          {createDialog}

          {hasSecondaryActions && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs font-medium gap-1.5 cursor-pointer"
                >
                  <MenuDotsBoldDuotone size={16} />
                  {moreLabel}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-max min-w-48">
                {uploadDialog && (
                  <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()}
                    className="p-0"
                  >
                    {uploadDialog}
                  </DropdownMenuItem>
                )}
                {exportDialog && (
                  <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()}
                    className="p-0"
                  >
                    {exportDialog}
                  </DropdownMenuItem>
                )}
                {moreActions}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Main Table Area */}
      <div className="space-y-4">
        <CrudTableToolbar
          table={table}
          searchPlaceholder={
            searchPlaceholder || `Search ${entityName.toLowerCase()}s...`
          }
          resetLabel={resetLabel}
          search={filters.search}
          onSearchChange={filters.setSearch}
          onSearchSubmit={filters.handleSearchSubmit}
          isFiltered={filters.isFiltered}
          onResetFilters={filters.resetFilters}
          filterPopover={filterPopover}
        />

        <div className="rounded-xl border border-border/40 overflow-hidden bg-card/40 backdrop-blur-sm p-1">
          <DataTable
            table={table}
            totalCount={resolvedTotalCount}
            loading={loading}
            emptyText={emptyText}
            onRowClick={onRowClick}
          />
        </div>
      </div>

      {/* Global Batch Delete Confirmation Dialog */}
      {onBatchDelete && (
        <ConfirmDialog
          title="Delete Selected Items"
          message={`Are you sure you want to delete ${deletingIds.length || selectedIds.length} selected ${entityName.toLowerCase()}(s)? This action cannot be undone.`}
          onClickYes={handleConfirmBatchDelete}
          open={confirmDeleteOpen}
          onOpenChange={(open) => {
            setConfirmDeleteOpen(open);
            if (!open) setDeletingIds([]);
          }}
          variant="destructive"
          confirmText="Delete"
        >
          <span className="hidden" />
        </ConfirmDialog>
      )}
    </div>
  );
}
