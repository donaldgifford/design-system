import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@donaldgifford/design-system/components/table";
import { heatOpacity, shareText } from "@donaldgifford/design-system/lib/percent";
import { cn } from "@donaldgifford/design-system/lib/utils";
import { IconChevronRight } from "@tabler/icons-react";
import { createContext, Fragment, type ReactNode, useContext } from "react";

export type GridTone = "success" | "warning" | "destructive" | "info" | "muted";

export interface GridColumn {
  key: string;
  header: string;
  /** The color a measured cell is shaded in while the column is in `heat`. */
  tone?: GridTone;
  /** Right for numbers (the default), left for text cells. */
  align?: "left" | "right";
}

/** A count with the denominator its share and its shade divide by. */
export interface GridCount {
  n: number;
  /**
   * What `n` is a share of. Zero or null is "no data"; omitted, the cell
   * is a plain count with no share.
   */
  of?: number | null;
}

/** A count, a bare number, or anything else rendered as given. */
export type GridCell = GridCount | ReactNode;

export interface GridRow {
  key: string;
  label: ReactNode;
  /** The name the row's expand button reads; omitted, the key. */
  name?: string;
  /** A muted line under the label. */
  sub?: ReactNode;
  badge?: ReactNode;
  cells: Readonly<Record<string, GridCell>>;
}

const toneVar: Record<GridTone, string> = {
  success: "var(--success)",
  warning: "var(--warning)",
  destructive: "var(--destructive)",
  info: "var(--info)",
  muted: "var(--muted-foreground)",
};

/**
 * A heat cell's background: the column's tone at heatOpacity of the
 * cell's share, or nothing for a zero. The text keeps its own color, so
 * the number is always read.
 */
export function heatStyle(
  count: number,
  total: number,
  tone: GridTone,
): { background: string } | undefined {
  const opacity = heatOpacity(count, total);
  return opacity === 0
    ? undefined
    : {
        background: `color-mix(in srgb, ${toneVar[tone]} ${Math.round(opacity * 100)}%, transparent)`,
      };
}

const isCount = (cell: GridCell): cell is GridCount =>
  typeof cell === "object" && cell !== null && "n" in cell;

// The columns and the heat set reach GridChildRows through context, so a
// component that fetches on expand renders rows without the page passing
// them down again.
const GridContext = createContext<{ columns: readonly GridColumn[]; heat: readonly string[] }>({
  columns: [],
  heat: [],
});

const numeric = "text-right tabular-nums";

function Cell({ cell, column, heat }: { cell: GridCell; column: GridColumn; heat: boolean }) {
  if (column.align === "left") {
    return <TableCell>{isCount(cell) ? cell.n.toLocaleString("en-US") : cell}</TableCell>;
  }
  if (typeof cell === "number") {
    return <TableCell className={numeric}>{cell.toLocaleString("en-US")}</TableCell>;
  }
  if (!isCount(cell)) {
    return <TableCell className={numeric}>{cell}</TableCell>;
  }
  if (cell.of === undefined) {
    return <TableCell className={numeric}>{cell.n.toLocaleString("en-US")}</TableCell>;
  }
  if (cell.of === null || cell.of <= 0) {
    return (
      <TableCell data-measured="false" className={cn(numeric, "text-muted-foreground")}>
        no data
      </TableCell>
    );
  }
  const shade = heat ? Math.round(100 * heatOpacity(cell.n, cell.of)) : 0;
  return (
    <TableCell
      className={numeric}
      style={heat ? heatStyle(cell.n, cell.of, column.tone ?? "muted") : undefined}
      data-heat={heat ? column.key : undefined}
      data-shade={shade > 0 ? shade : undefined}
    >
      {/* The share leads: it is what compares down a column, so it is the
          bold figure in a fixed-width slot, with the count small beside it.
          Both keep the foreground on a shaded cell, where muted ink on the
          tint would fail contrast. */}
      <span className={cn("text-xs", shade > 0 ? "text-foreground" : "text-muted-foreground")}>
        {cell.n.toLocaleString("en-US")}
      </span>
      <span className="ml-2 inline-block min-w-13 font-semibold">{shareText(cell.n, cell.of)}</span>
    </TableCell>
  );
}

function Label({ row, parent }: { row: GridRow; parent: boolean }) {
  return (
    <span className="min-w-0">
      <span className={cn("flex items-center gap-2 font-mono", parent && "font-medium")}>
        {row.label}
        {row.badge}
      </span>
      {row.sub !== undefined ? (
        <span className="block text-muted-foreground text-xs">{row.sub}</span>
      ) : null}
    </span>
  );
}

interface GroupGridProps {
  /** Heads the first column: "Org / repository". */
  heading: string;
  columns: readonly GridColumn[];
  rows: readonly GridRow[];
  /** The keys of the columns currently shaded. */
  heat?: readonly string[];
  /** The keys of the expanded rows. The state is the page's, so it can live in the URL. */
  open: readonly string[];
  onToggle: (key: string) => void;
  /**
   * Renders an expanded row's body: a GridChildRows, or a component that
   * fetches and then renders one.
   */
  children: (row: GridRow) => ReactNode;
  /** The closing row: a label and a cell per column key. */
  footer?: { label: ReactNode; cells: Readonly<Record<string, GridCell>> };
  /** The accessible name: what the grid lists. */
  label: string;
  className?: string;
}

/**
 * A grid of groups that expand in place: parent rows with a chevron,
 * their children in the same table body so the columns line up,
 * heat-shaded share columns, and a totals row.
 */
export function GroupGrid({
  heading,
  columns,
  rows,
  heat = [],
  open,
  onToggle,
  children,
  footer,
  label,
  className,
}: GroupGridProps) {
  return (
    <div data-slot="group-grid" className={className}>
      <Table aria-label={label}>
        <TableHeader>
          <TableRow>
            <TableHead scope="col">{heading}</TableHead>
            {columns.map((column) => (
              <TableHead
                key={column.key}
                scope="col"
                className={cn(column.align !== "left" && "text-right")}
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <GridContext.Provider value={{ columns, heat }}>
            {rows.map((row) => {
              const expanded = open.includes(row.key);
              return (
                <Fragment key={row.key}>
                  <TableRow data-row={row.key}>
                    <TableCell>
                      {/* The toggle is the chevron alone: the label may be a
                          link, and a control inside a control is unreachable
                          to assistive tech. */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          aria-expanded={expanded}
                          aria-label={`${expanded ? "Collapse" : "Expand"} ${row.name ?? row.key}`}
                          onClick={() => onToggle(row.key)}
                          className="flex size-5 flex-none items-center justify-center rounded-sm text-muted-foreground outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
                        >
                          <IconChevronRight
                            aria-hidden="true"
                            className={cn("size-3.5 transition-transform", expanded && "rotate-90")}
                          />
                        </button>
                        <Label row={row} parent />
                      </div>
                    </TableCell>
                    {columns.map((column) => (
                      <Cell
                        key={column.key}
                        cell={row.cells[column.key]}
                        column={column}
                        heat={heat.includes(column.key)}
                      />
                    ))}
                  </TableRow>
                  {expanded ? children(row) : null}
                </Fragment>
              );
            })}
          </GridContext.Provider>
          {footer ? (
            <TableRow data-row="footer" className="font-semibold hover:bg-transparent">
              <TableCell>{footer.label}</TableCell>
              {columns.map((column) => (
                <Cell
                  key={column.key}
                  cell={footer.cells[column.key]}
                  column={column}
                  heat={false}
                />
              ))}
            </TableRow>
          ) : null}
        </TableBody>
      </Table>
    </div>
  );
}

interface GridChildRowsProps {
  /** The key of the row these sit under. */
  parent: string;
  rows: readonly GridRow[];
  loading?: boolean;
  /** Rendered when the group has no children. */
  empty?: ReactNode;
  /** A closing line: "showing 20 of 134", a load-more control. */
  footer?: ReactNode;
}

/**
 * An expanded group's body: a note while loading or empty, else one
 * indented row per child and the footer line. It renders table rows, so it
 * must sit inside a GroupGrid.
 */
export function GridChildRows({
  parent,
  rows,
  loading = false,
  empty = "Nothing here.",
  footer,
}: GridChildRowsProps) {
  const { columns, heat } = useContext(GridContext);
  const note = (text: ReactNode) => (
    <TableRow data-children={parent} className="bg-background hover:bg-background">
      <TableCell colSpan={columns.length + 1} className="py-2 pl-9 text-muted-foreground text-xs">
        {text}
      </TableCell>
    </TableRow>
  );
  if (loading) return note("Loading…");
  if (rows.length === 0) return note(empty);
  return (
    <>
      {rows.map((row) => (
        <TableRow
          key={row.key}
          data-children={parent}
          data-child={row.key}
          className="bg-background"
        >
          <TableCell className="py-2 pl-9">
            <Label row={row} parent={false} />
          </TableCell>
          {columns.map((column) => (
            <Cell
              key={column.key}
              cell={row.cells[column.key]}
              column={column}
              heat={heat.includes(column.key)}
            />
          ))}
        </TableRow>
      ))}
      {footer === undefined ? null : note(footer)}
    </>
  );
}
