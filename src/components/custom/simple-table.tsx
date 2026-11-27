import { useMemo, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  AltArrowDownLinear,
  AltArrowLeftLinear,
  AltArrowRightLinear,
  AltArrowUpLinear,
  CloseCircleBold,
  MagniferLinear,
  RefreshLinear,
} from "solar-icon-set";

export interface SimpleColumn<T> {
  key: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  /** Optional sort extractor; clicking header cycles asc -> desc -> none */
  sortValue?: (row: T) => string | number | null | undefined;
  align?: "left" | "center" | "right";
  className?: string;
  headerClassName?: string;
}

export interface ServerPagination {
  pageIndex: number; // 0-based
  pageSize: number;
  totalCount: number;
  onPageChange: (pageIndex: number) => void;
}

export interface SimpleTableProps<T> {
  data: T[];
  columns: SimpleColumn<T>[];
  rowKey: (row: T) => string;
  loading?: boolean;
  /** Client-side search matcher; omit to hide search input unless controlled */
  searchMatcher?: (row: T, query: string) => boolean;
  searchPlaceholder?: string;
  /** Controlled search (for server-side search) */
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  /** Optional inline filter controls rendered next to search */
  filters?: ReactNode;
  /** Optional right-side toolbar content */
  toolbarExtra?: ReactNode;
  /** Optional refresh handler */
  onRefresh?: () => void;
  refreshing?: boolean;
  /** Client-side page size (defaults to 10; pagination auto-hides if <= 1 page) */
  pageSize?: number;
  /** Optional server-side pagination (overrides client-side pagination) */
  pagination?: ServerPagination;
  /** Optional mobile card renderer for < md screens */
  renderMobileCard?: (row: T) => ReactNode;
  emptyText?: string;
  emptyAction?: ReactNode;
  onRowClick?: (row: T) => void;
  className?: string;
}

type SortDir = "asc" | "desc";

export function SimpleTable<T>({
  data,
  columns,
  rowKey,
  loading = false,
  searchMatcher,
  searchPlaceholder = "Search...",
  searchValue,
  onSearchChange,
  filters,
  toolbarExtra,
  onRefresh,
  refreshing = false,
  pageSize = 10,
  pagination,
  renderMobileCard,
  emptyText = "No records found.",
  emptyAction,
  onRowClick,
  className,
}: SimpleTableProps<T>) {
  const [internalSearch, setInternalSearch] = useState("");
  const [sort, setSort] = useState<{ key: string; dir: SortDir } | null>(null);
  const [clientPage, setClientPage] = useState(0);

  const isControlledSearch = searchValue !== undefined && !!onSearchChange;
  const query = isControlledSearch ? searchValue : internalSearch;
  const setQuery = (v: string) => {
    if (isControlledSearch) {
      onSearchChange(v);
    } else {
      setInternalSearch(v);
      setClientPage(0);
    }
  };

  const showSearch = Boolean(searchMatcher || isControlledSearch);
  const showToolbar = Boolean(
    showSearch || filters || toolbarExtra || onRefresh,
  );

  // 1. Filter (client-side)
  const filtered = useMemo(() => {
    if (!searchMatcher || !query.trim()) return data;
    const term = query.trim().toLowerCase();
    return data.filter((row) => searchMatcher(row, term));
  }, [data, searchMatcher, query]);

  // 2. Sort (client-side)
  const sorted = useMemo(() => {
    if (!sort) return filtered;
    const col = columns.find((c) => c.key === sort.key);
    if (!col?.sortValue) return filtered;
    const extract = col.sortValue;
    const dir = sort.dir === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => {
      const av = extract(a);
      const bv = extract(b);
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      if (typeof av === "number" && typeof bv === "number") {
        return (av - bv) * dir;
      }
      return String(av).localeCompare(String(bv)) * dir;
    });
  }, [filtered, sort, columns]);

  // 3. Paginate
  const totalCount = pagination ? pagination.totalCount : sorted.length;
  const activePageSize = pagination ? pagination.pageSize : pageSize;
  const totalPages = Math.max(1, Math.ceil(totalCount / activePageSize));
  const activePage = pagination
    ? pagination.pageIndex
    : Math.min(clientPage, totalPages - 1);

  const pageRows = useMemo(() => {
    if (pagination) return sorted;
    const start = activePage * activePageSize;
    return sorted.slice(start, start + activePageSize);
  }, [sorted, pagination, activePage, activePageSize]);

  const setPage = (next: number) => {
    const clamped = Math.max(0, Math.min(next, totalPages - 1));
    if (pagination) {
      pagination.onPageChange(clamped);
    } else {
      setClientPage(clamped);
    }
  };

  const toggleSort = (col: SimpleColumn<T>) => {
    if (!col.sortValue) return;
    setSort((prev) => {
      if (!prev || prev.key !== col.key) return { key: col.key, dir: "asc" };
      if (prev.dir === "asc") return { key: col.key, dir: "desc" };
      return null;
    });
  };

  const alignClass = (align?: "left" | "center" | "right") =>
    align === "right"
      ? "text-right"
      : align === "center"
        ? "text-center"
        : "text-left";

  const startItem = totalCount === 0 ? 0 : activePage * activePageSize + 1;
  const endItem = Math.min((activePage + 1) * activePageSize, totalCount);

  return (
    <div className={cn("space-y-3", className)}>
      {/* Compact Toolbar */}
      {showToolbar && (
        <div className="flex flex-wrap items-center gap-2">
          {showSearch && (
            <div className="relative w-full sm:w-64">
              <MagniferLinear
                size={15}
                className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="h-8 pl-8 pr-7 text-xs rounded-lg"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <CloseCircleBold size={14} />
                </button>
              )}
            </div>
          )}

          {filters}

          {(toolbarExtra || onRefresh) && (
            <div className="flex items-center gap-2 ml-auto shrink-0">
              {toolbarExtra}
              {onRefresh && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={onRefresh}
                  aria-label="Refresh"
                  className="group h-8 w-8 p-0 rounded-lg bg-muted/35 text-muted-foreground hover:bg-muted/65 hover:text-foreground active:scale-95 transition-all"
                >
                  <RefreshLinear
                    size={15}
                    className={
                      refreshing
                        ? "animate-spin"
                        : "transition-transform duration-300 group-hover:rotate-45"
                    }
                  />
                </Button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Mobile Cards (optional, < md) */}
      {renderMobileCard && (
        <div className="md:hidden space-y-2.5">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl border border-border/50 bg-card/40 p-3.5 space-y-2"
              >
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            ))
          ) : pageRows.length === 0 ? (
            <div className="rounded-xl border border-border/50 bg-card/40 py-10 px-4 text-center space-y-2">
              <p className="text-xs text-muted-foreground">{emptyText}</p>
              {emptyAction}
            </div>
          ) : (
            pageRows.map((row) => (
              <div
                key={rowKey(row)}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={cn(
                  "rounded-xl border border-border/50 bg-card/40 p-3.5",
                  onRowClick &&
                    "cursor-pointer hover:bg-muted/30 transition-colors",
                )}
              >
                {renderMobileCard(row)}
              </div>
            ))
          )}
        </div>
      )}

      {/* Desktop Table (or all screens when renderMobileCard is not provided) */}
      <div
        className={cn(
          "rounded-xl border border-border/50 bg-card/40 overflow-hidden",
          renderMobileCard && "hidden md:block",
        )}
      >
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-border/50 bg-muted/25">
                {columns.map((col) => {
                  const sortable = Boolean(col.sortValue);
                  const isSorted = sort?.key === col.key;
                  return (
                    <th
                      key={col.key}
                      className={cn(
                        "px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground select-none whitespace-nowrap",
                        alignClass(col.align),
                        sortable &&
                          "cursor-pointer hover:text-foreground transition-colors",
                        col.headerClassName,
                      )}
                      onClick={sortable ? () => toggleSort(col) : undefined}
                    >
                      <span
                        className={cn(
                          "inline-flex items-center gap-1",
                          col.align === "right" && "justify-end",
                          col.align === "center" && "justify-center",
                        )}
                      >
                        {col.header}
                        {isSorted &&
                          (sort.dir === "asc" ? (
                            <AltArrowUpLinear
                              size={12}
                              className="text-foreground"
                            />
                          ) : (
                            <AltArrowDownLinear
                              size={12}
                              className="text-foreground"
                            />
                          ))}
                      </span>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {loading ? (
                Array.from({ length: 4 }).map((_, rIdx) => (
                  <tr key={rIdx}>
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={cn("px-4 py-3", col.className)}
                      >
                        <Skeleton className="h-4 w-24" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : pageRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-12 text-center"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-xs text-muted-foreground">
                        {emptyText}
                      </p>
                      {emptyAction}
                    </div>
                  </td>
                </tr>
              ) : (
                pageRows.map((row) => (
                  <tr
                    key={rowKey(row)}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                    className={cn(
                      "hover:bg-muted/25 transition-colors",
                      onRowClick && "cursor-pointer",
                    )}
                  >
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={cn(
                          "px-4 py-3 align-middle",
                          alignClass(col.align),
                          col.className,
                        )}
                      >
                        {col.cell(row)}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Minimal Footer Pagination (auto-hidden when <= 1 page) */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground pt-0.5">
          <span className="tabular-nums">
            {startItem}–{endItem} of {totalCount}
          </span>
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="xs"
              disabled={activePage <= 0}
              onClick={() => setPage(activePage - 1)}
              className="h-7 w-7 p-0 rounded-lg bg-muted/35 text-muted-foreground hover:bg-muted/65 hover:text-foreground active:scale-95 transition-all disabled:opacity-35"
              aria-label="Previous page"
            >
              <AltArrowLeftLinear size={14} />
            </Button>
            <span className="px-2 tabular-nums text-foreground font-medium">
              {activePage + 1} / {totalPages}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="xs"
              disabled={activePage >= totalPages - 1}
              onClick={() => setPage(activePage + 1)}
              className="h-7 w-7 p-0 rounded-lg bg-muted/35 text-muted-foreground hover:bg-muted/65 hover:text-foreground active:scale-95 transition-all disabled:opacity-35"
              aria-label="Next page"
            >
              <AltArrowRightLinear size={14} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
