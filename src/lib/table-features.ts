import {
  columnFilteringFeature,
  columnVisibilityFeature,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  tableFeatures,
  type Column,
  type ColumnDef,
  type ReactTable,
  type Row,
  type RowData,
} from "@tanstack/react-table";

export const crudTableFeatures = tableFeatures({
  columnFilteringFeature,
  columnVisibilityFeature,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  columnMeta: {} as { label?: string },
});

type CrudTableFeatures = typeof crudTableFeatures;

/** v9 `RowData` is `Record<string, any> | any[]`; intersect so interfaces still type-check. */
type TableRow<TData> = TData & RowData;

export type CrudTable<TData> = ReactTable<CrudTableFeatures, TableRow<TData>>;
export type CrudColumnDef<TData, TValue = unknown> = ColumnDef<
  CrudTableFeatures,
  TableRow<TData>,
  TValue
>;
export type CrudColumn<TData, TValue = unknown> = Column<
  CrudTableFeatures,
  TableRow<TData>,
  TValue
>;
export type CrudRow<TData> = Row<CrudTableFeatures, TableRow<TData>>;
