import { Button } from "@donaldgifford/design-system/components/button";
import { Input } from "@donaldgifford/design-system/components/input";
import { Skeleton } from "@donaldgifford/design-system/components/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@donaldgifford/design-system/components/table";
import {
  formatSort,
  type ListSearch,
  parseSort,
} from "@donaldgifford/design-system/lib/list-search";
import { cn } from "@donaldgifford/design-system/lib/utils";
import {
  IconArrowDown,
  IconArrowsSort,
  IconArrowUp,
  IconChevronLeft,
  IconChevronRight,
  IconSearch,
} from "@tabler/icons-react";
import {
  type CellData,
  type ColumnDef,
  columnFilteringFeature,
  createColumnHelper,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_includesString,
  flexRender,
  globalFilteringFeature,
  type Row,
  type RowData,
  rowPaginationFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  type TableFeatures,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";
import { type ReactNode, useMemo } from "react";

declare module "@tanstack/react-table" {
  interface ColumnMeta<
    TFeatures extends TableFeatures,
    TData extends RowData,
    TValue extends CellData,
  > {
    /** A numeric column: right-aligned, in tabular figures. */
    numeric?: boolean;
  }
}

/** The table features every DataTable carries: sorting, a text filter, pages. */
export const dataTableFeatures = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  rowSortingFeature,
  rowPaginationFeature,
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  filterFns: { includesString: filterFn_includesString },
  sortFns: { alphanumeric: sortFn_alphanumeric },
});
export type DataTableFeatures = typeof dataTableFeatures;

/** A column definition for a DataTable over TData. */
export type DataTableColumn<TData extends RowData> = ColumnDef<DataTableFeatures, TData, unknown>;

/** The typed column helper for a row type. */
export function dataTableColumns<TData extends RowData>() {
  return createColumnHelper<DataTableFeatures, TData>();
}

export interface DataTableProps<TData extends RowData> {
  columns: ReadonlyArray<DataTableColumn<TData>>;
  data: ReadonlyArray<TData>;
  /** The URL-bound search; the table reads sort, q, page, and size from it. */
  search: ListSearch;
  onSearchChange: (patch: Partial<ListSearch>) => void;
  /**
   * The total row count when the server already filtered, sorted, and
   * paged the data; omitted, the table does all three itself.
   */
  total?: number;
  getRowId?: (row: TData) => string;
  onRowClick?: (row: TData) => void;
  /** Placeholder for the filter input; omit it to hide the input. */
  filterPlaceholder?: string;
  isLoading?: boolean;
  /** Rendered when there are no rows after filtering. */
  empty?: ReactNode;
  className?: string;
}

const emptyRows: never[] = [];

/**
 * A table with sorting, a text filter, and pages, all bound to the list
 * page's URL search params. Columns come from `dataTableColumns<T>()`.
 */
export function DataTable<TData extends RowData>({
  columns,
  data,
  search,
  onSearchChange,
  total,
  getRowId,
  onRowClick,
  filterPlaceholder,
  isLoading = false,
  empty,
  className,
}: DataTableProps<TData>) {
  const manual = total !== undefined;
  const sorting = useMemo(() => {
    const sort = parseSort(search.sort);
    return sort ? [sort] : [];
  }, [search.sort]);
  const pagination = useMemo(
    () => ({ pageIndex: search.page - 1, pageSize: search.size }),
    [search.page, search.size],
  );
  const table = useTable({
    features: dataTableFeatures,
    columns: columns as DataTableColumn<TData>[],
    data: (data.length === 0 ? emptyRows : data) as TData[],
    getRowId: getRowId ? (row) => getRowId(row) : undefined,
    state: { sorting, pagination, globalFilter: search.q ?? "" },
    onSortingChange: (updater) => {
      const next = typeof updater === "function" ? updater(sorting) : updater;
      const first = next[0];
      onSearchChange({ sort: first ? formatSort(first.id, first.desc) : undefined });
    },
    onPaginationChange: (updater) => {
      const next = typeof updater === "function" ? updater(pagination) : updater;
      onSearchChange({ page: next.pageIndex + 1, size: next.pageSize });
    },
    onGlobalFilterChange: (updater) => {
      const next = typeof updater === "function" ? updater(search.q ?? "") : updater;
      onSearchChange({ q: typeof next === "string" && next !== "" ? next : undefined });
    },
    globalFilterFn: "includesString",
    manualSorting: manual,
    manualFiltering: manual,
    manualPagination: manual,
    rowCount: total,
    enableSortingRemoval: true,
  });

  const rows = table.getRowModel().rows;
  const pageCount = table.getPageCount();
  const rowCount = manual ? total : table.getPrePaginatedRowModel().rows.length;

  return (
    <div data-slot="data-table" className={cn("space-y-3", className)}>
      {filterPlaceholder ? (
        <div className="relative max-w-sm">
          <IconSearch
            aria-hidden="true"
            className="absolute top-2.5 left-2.5 size-4 text-muted-foreground"
          />
          <Input
            aria-label="Filter"
            className="pl-8"
            placeholder={filterPlaceholder}
            value={search.q ?? ""}
            onChange={(event) => table.setGlobalFilter(event.target.value)}
          />
        </div>
      ) : null}
      <div className="rounded-md border">
        <Table containerClassName="max-h-(--table-max-h) overflow-y-auto">
          <TableHeader data-sticky="">
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id}>
                {group.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const sorted = header.column.getIsSorted();
                  return (
                    <TableHead
                      key={header.id}
                      aria-sort={ariaSort(sorted)}
                      className={cn(header.column.columnDef.meta?.numeric && "text-right")}
                    >
                      {header.isPlaceholder ? null : canSort ? (
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 hover:text-foreground"
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {sorted === "asc" ? (
                            <IconArrowUp aria-hidden="true" className="size-3.5" />
                          ) : sorted === "desc" ? (
                            <IconArrowDown aria-hidden="true" className="size-3.5" />
                          ) : (
                            <IconArrowsSort aria-hidden="true" className="size-3.5 opacity-50" />
                          )}
                        </button>
                      ) : (
                        flexRender(header.column.columnDef.header, header.getContext())
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <LoadingRows columns={columns.length} />
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  {empty ?? "No results."}
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => <DataRow key={row.id} row={row} onRowClick={onRowClick} />)
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between text-muted-foreground text-sm">
        <span data-testid="row-count">
          {rowCount} {rowCount === 1 ? "row" : "rows"}
        </span>
        <div className="flex items-center gap-2">
          <span data-testid="page-label">
            Page {pageCount === 0 ? 0 : search.page} of {pageCount}
          </span>
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="Previous page"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
          >
            <IconChevronLeft aria-hidden="true" />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="Next page"
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
          >
            <IconChevronRight aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function ariaSort(sorted: false | "asc" | "desc"): "ascending" | "descending" | undefined {
  if (sorted === "asc") {
    return "ascending";
  }
  if (sorted === "desc") {
    return "descending";
  }
  return undefined;
}

function DataRow<TData extends RowData>({
  row,
  onRowClick,
}: {
  row: Row<DataTableFeatures, TData>;
  onRowClick?: (row: TData) => void;
}) {
  const clickable = onRowClick !== undefined;
  return (
    <TableRow
      data-row-id={row.id}
      className={cn("h-table-row", clickable && "cursor-pointer")}
      onClick={clickable ? () => onRowClick(row.original) : undefined}
      onKeyDown={
        clickable
          ? (event) => {
              if (event.key === "Enter") {
                onRowClick(row.original);
              }
            }
          : undefined
      }
      tabIndex={clickable ? 0 : undefined}
    >
      {row.getAllCells().map((cell) => (
        <TableCell
          key={cell.id}
          className={cn(cell.column.columnDef.meta?.numeric && "text-right tabular-nums")}
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}

function LoadingRows({ columns }: { columns: number }) {
  return (
    <>
      {[0, 1, 2].map((i) => (
        <TableRow key={i} aria-busy="true">
          {Array.from({ length: columns }, (_, j) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: placeholder cells have no identity
            <TableCell key={j}>
              <Skeleton className="h-4 w-3/4" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}
