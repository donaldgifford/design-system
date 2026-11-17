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
import { type KeyboardEvent, type MouseEvent, type ReactNode, useMemo, useState } from "react";

declare module "@tanstack/react-table" {
  interface ColumnMeta<
    TFeatures extends TableFeatures,
    TData extends RowData,
    TValue extends CellData,
  > {
    /** A numeric column: right-aligned, in tabular figures. */
    numeric?: boolean | undefined;
    /**
     * Drops the column below a viewport breakpoint, or, as "compact",
     * whenever the table is told it shares its row with something else.
     */
    hideBelow?: "md" | "lg" | "xl" | "compact" | undefined;
    /** Classes for the column's header and cells: a width, an alignment. */
    className?: string | undefined;
  }
}

const hideClass = {
  md: "hidden md:table-cell",
  lg: "hidden lg:table-cell",
  xl: "hidden xl:table-cell",
  compact: "",
} as const;

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
  /**
   * The URL-bound search; the table reads sort, q, page, and size from it.
   * Omitted, the table is a plain one: it shows every row, keeps its own
   * sort, and has no filter or pager.
   */
  search?: ListSearch | undefined;
  onSearchChange?: ((patch: Partial<ListSearch>) => void) | undefined;
  /**
   * The total row count when the server already filtered, sorted, and
   * paged the data; omitted, the table does all three itself.
   */
  total?: number | undefined;
  /**
   * The server filters and sorts, and the table shows `data` as given.
   * Implied by `total`. Set it without a total for a cursor-paged list:
   * the pager goes, and the page adds its own "load more" control.
   * Headers sort only when `onSearchChange` is there to hear the request.
   */
  manual?: boolean | undefined;
  /** The accessible name: what the table lists. */
  label?: string | undefined;
  /** Drop the border and the scroll container, for a table inside a card. */
  bare?: boolean | undefined;
  getRowId?: ((row: TData) => string) | undefined;
  onRowClick?: ((row: TData) => void) | undefined;
  /** The id (as `getRowId` gives it) of the row to mark selected: the one a detail panel shows. */
  selectedId?: string | undefined;
  /** Placeholder for the filter input; omit it to hide the input. */
  filterPlaceholder?: string | undefined;
  isLoading?: boolean | undefined;
  /**
   * The table shares its row (a detail panel is open beside it): columns
   * marked `hideBelow: "compact"` are dropped whatever the viewport.
   */
  compact?: boolean | undefined;
  /** Rendered when there are no rows after filtering. */
  empty?: ReactNode | undefined;
  className?: string | undefined;
}

const emptyRows: never[] = [];

/**
 * A table with sorting, a text filter, and pages, all bound to the list
 * page's URL search params. Columns come from `dataTableColumns<T>()`.
 */
export function DataTable<TData extends RowData>({
  columns,
  data,
  search: searchProp,
  onSearchChange: onSearchChangeProp,
  total,
  manual: manualProp,
  label,
  bare = false,
  getRowId,
  onRowClick,
  selectedId,
  filterPlaceholder,
  isLoading = false,
  compact = false,
  empty,
  className,
}: DataTableProps<TData>) {
  const shown = useMemo(
    () =>
      (compact
        ? columns.filter((column) => column.meta?.hideBelow !== "compact")
        : columns) as DataTableColumn<TData>[],
    [columns, compact],
  );
  const manual = manualProp ?? total !== undefined;
  // Without a search the table holds its own sort and shows every row.
  const [own, setOwn] = useState<Partial<ListSearch>>({});
  const bound = searchProp !== undefined;
  const search: ListSearch = searchProp ?? {
    page: 1,
    size: Math.max(1, data.length),
    ...own,
  };
  const onSearchChange =
    onSearchChangeProp ??
    ((patch: Partial<ListSearch>) => setOwn((now) => ({ ...now, sort: patch.sort })));
  // A pager needs page numbers: a bound search, and a row count to divide.
  const paged = bound && !(manual && total === undefined);
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
    columns: shown,
    data: (data.length === 0 ? emptyRows : data) as TData[],
    ...(getRowId ? { getRowId: (row: TData) => getRowId(row) } : {}),
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
    // The server owns the order; with nobody to ask for another one, a
    // header must not offer a sort it cannot perform.
    enableSorting: !(manual && onSearchChangeProp === undefined),
    manualFiltering: manual,
    manualPagination: manual,
    ...(total !== undefined ? { rowCount: total } : {}),
    enableSortingRemoval: true,
  });

  const rows = table.getRowModel().rows;
  const pageCount = table.getPageCount();
  const rowCount = manual ? total : table.getPrePaginatedRowModel().rows.length;

  return (
    <div data-slot="data-table" className={cn("space-y-3", className)}>
      {filterPlaceholder && bound ? (
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
      <div className={cn(!bare && "rounded-md border")}>
        <Table
          aria-label={label}
          containerClassName={bare ? undefined : "max-h-(--table-max-h) overflow-y-auto"}
        >
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
                      className={cn(
                        header.column.columnDef.meta?.numeric && "text-right",
                        hiddenBelow(header.column.columnDef.meta?.hideBelow),
                        header.column.columnDef.meta?.className,
                      )}
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
              <LoadingRows columns={shown} />
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={shown.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  {empty ?? "No results."}
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <DataRow
                  key={row.id}
                  row={row}
                  onRowClick={onRowClick}
                  selected={selectedId !== undefined && row.id === selectedId}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {paged ? (
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
      ) : null}
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
  selected,
}: {
  row: Row<DataTableFeatures, TData>;
  onRowClick?: ((row: TData) => void) | undefined;
  selected: boolean;
}) {
  const clickable = onRowClick !== undefined;
  return (
    <TableRow
      data-row-id={row.id}
      data-state={selected ? "selected" : undefined}
      aria-selected={selected ? true : undefined}
      className={cn("h-table-row", clickable && "cursor-pointer")}
      onClick={
        clickable
          ? (event: MouseEvent<HTMLTableRowElement>) => {
              // A link or a button in the row keeps its own click.
              if (fromControl(event.target, event.currentTarget)) return;
              onRowClick(row.original);
            }
          : undefined
      }
      onKeyDown={
        clickable
          ? (event: KeyboardEvent<HTMLTableRowElement>) => {
              // Only keys on the row itself, not on something inside it.
              if (event.target !== event.currentTarget) return;
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
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
          className={cn(
            cell.column.columnDef.meta?.numeric && "text-right tabular-nums",
            hiddenBelow(cell.column.columnDef.meta?.hideBelow),
            cell.column.columnDef.meta?.className,
          )}
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}

const controls = "a, button, input, select, textarea, label, [role=menuitem], [role=checkbox]";

/** Whether an event came from an interactive element inside the row. */
function fromControl(target: EventTarget, row: HTMLElement): boolean {
  const control = target instanceof Element ? target.closest(controls) : null;
  return control !== null && control !== row && row.contains(control);
}

function hiddenBelow(hideBelow: keyof typeof hideClass | undefined): string | undefined {
  return hideBelow ? hideClass[hideBelow] : undefined;
}

function LoadingRows<TData extends RowData>({
  columns,
}: {
  columns: ReadonlyArray<DataTableColumn<TData>>;
}) {
  return (
    <>
      {[0, 1, 2].map((i) => (
        <TableRow key={i} aria-busy="true">
          {columns.map((column, j) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: placeholder cells have no identity
            <TableCell key={j} className={hiddenBelow(column.meta?.hideBelow)}>
              <Skeleton className="h-4 w-3/4" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}
