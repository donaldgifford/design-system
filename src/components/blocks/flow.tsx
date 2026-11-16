import { Button } from "@donaldgifford/design-system/components/button";
import { cn } from "@donaldgifford/design-system/lib/utils";
import type { TablerIcon } from "@tabler/icons-react";
import type { ReactNode } from "react";
import { Dot, type DotTone } from "./list-row";

export type FlowStatus = "ok" | "warn" | "bad" | "dim";

/** A compact node: an icon in a chip with a title and a line under it. */
export interface FlowIconNode {
  kind: "icon";
  id: string;
  x: number;
  y: number;
  icon: TablerIcon;
  title: string;
  detail?: string | undefined;
  status?: Exclude<FlowStatus, "dim"> | undefined;
}

/** A node that asks for a decision. */
export interface FlowApproveNode {
  kind: "approve";
  id: string;
  x: number;
  y: number;
  icon: TablerIcon;
  title: string;
  detail?: string | undefined;
  actionLabel?: string | undefined;
  onAction?: (() => void) | undefined;
}

/** A card-shaped node with a footer line. */
export interface FlowCardNode {
  kind: "card";
  id: string;
  x: number;
  y: number;
  icon: TablerIcon;
  title: string;
  detail?: string | undefined;
  footer?: ReactNode | undefined;
  status?: Exclude<FlowStatus, "dim"> | undefined;
  width?: number | undefined;
}

export type FlowNode = FlowIconNode | FlowApproveNode | FlowCardNode;

export interface FlowEdge {
  from: string;
  to: string;
  status?: FlowStatus | undefined;
  label?: string | undefined;
  /** Horizontal (right to left anchors) or vertical (bottom to top); inferred from positions. */
  direction?: "h" | "v" | undefined;
  /** Where along the run the bend sits, 0 to 1. */
  at?: number | undefined;
}

interface FlowProps {
  width: number;
  height: number;
  nodes: readonly FlowNode[];
  edges: readonly FlowEdge[];
  /** A bar above the canvas: crumbs, counts, a status line. */
  bar?: ReactNode | undefined;
  className?: string | undefined;
}

const iconSize = { w: 100, h: 66 };
const approveSize = { w: 260, h: 48 };

function sizeOf(node: FlowNode): { w: number; h: number } {
  switch (node.kind) {
    case "icon":
      return iconSize;
    case "approve":
      return approveSize;
    case "card":
      return { w: node.width ?? 240, h: node.footer ? 78 : 48 };
  }
}

type Side = "l" | "r" | "t" | "b";

function anchor(node: FlowNode, side: Side): [number, number] {
  const { w, h } = sizeOf(node);
  if (node.kind === "icon") {
    // The icon chip is 40px wide and centred; edges attach to the chip.
    const cx = node.x + 50;
    const cy = node.y + 20;
    switch (side) {
      case "r":
        return [node.x + 70, cy];
      case "l":
        return [node.x + 30, cy];
      case "b":
        return [cx, node.y + 40];
      case "t":
        return [cx, node.y];
    }
  }
  const cx = node.x + w / 2;
  const cy = node.y + h / 2;
  switch (side) {
    case "r":
      return [node.x + w, cy];
    case "l":
      return [node.x, cy];
    case "b":
      return [cx, node.y + h];
    case "t":
      return [cx, node.y];
  }
}

interface RoutedEdge {
  edge: FlowEdge;
  d: string;
  start: [number, number];
  label: [number, number];
}

function route(edge: FlowEdge, from: FlowNode, to: FlowNode): RoutedEdge {
  const direction =
    edge.direction ?? (Math.abs(to.y - from.y) > Math.abs(to.x - from.x) ? "v" : "h");
  const at = edge.at ?? 0.5;
  if (direction === "h") {
    const [x1, y1] = anchor(from, "r");
    const [x2, y2] = anchor(to, "l");
    const bend = x1 + (x2 - x1) * at;
    const label: [number, number] =
      Math.abs(y1 - y2) < 1 ? [(x1 + x2) / 2, y1] : [bend, (y1 + y2) / 2];
    return { edge, d: `M${x1},${y1} H${bend} V${y2} H${x2}`, start: [x1, y1], label };
  }
  const [x1, y1] = anchor(from, "b");
  const [x2, y2] = anchor(to, "t");
  const bend = y1 + (y2 - y1) * at;
  const label: [number, number] =
    Math.abs(x1 - x2) < 1 ? [x1, (y1 + y2) / 2] : [x2, (bend + y2) / 2];
  return { edge, d: `M${x1},${y1} V${bend} H${x2} V${y2}`, start: [x1, y1], label };
}

const edgeClass: Record<FlowStatus, string> = {
  ok: "stroke-success/65",
  warn: "stroke-warning/85 [stroke-dasharray:4_4]",
  bad: "stroke-destructive/70",
  dim: "stroke-muted-foreground/30 [stroke-dasharray:3_4]",
};

const statusTone: Record<Exclude<FlowStatus, "dim">, DotTone> = {
  ok: "ok",
  warn: "warn",
  bad: "bad",
};

const statusMark: Record<Exclude<FlowStatus, "dim">, string> = { ok: "✓", warn: "!", bad: "✕" };

const statusChipClass: Record<Exclude<FlowStatus, "dim">, string> = {
  ok: "bg-success text-white",
  warn: "bg-warning text-black",
  bad: "bg-destructive text-white",
};

/**
 * A pipeline or dependency graph: nodes placed by coordinate over an SVG
 * layer of orthogonal edges, on a dotted canvas. Scrolls when wider than
 * its container.
 */
export function Flow({ width, height, nodes, edges, bar, className }: FlowProps) {
  const byId = new Map(nodes.map((node) => [node.id, node]));
  const routed = edges.flatMap((edge) => {
    const from = byId.get(edge.from);
    const to = byId.get(edge.to);
    return from && to ? [route(edge, from, to)] : [];
  });
  return (
    <div
      data-slot="flow"
      className={cn(
        "relative overflow-auto rounded-md border bg-background bg-[radial-gradient(in_srgb,color-mix(in_oklch,var(--foreground)_13%,transparent)_1px,transparent_1px)] bg-[size:18px_18px]",
        className,
      )}
    >
      {bar ? (
        <div className="sticky top-0 left-0 flex items-center gap-2 border-b bg-background/90 px-3 py-1.5 text-xs backdrop-blur">
          {bar}
        </div>
      ) : null}
      <div className="relative" style={{ width, height }}>
        <svg
          aria-hidden="true"
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 size-full overflow-visible"
        >
          {routed.map((r) => (
            <path
              key={`${r.edge.from}-${r.edge.to}`}
              d={r.d}
              fill="none"
              strokeWidth="1.5"
              className={edgeClass[r.edge.status ?? "dim"]}
            />
          ))}
          {routed.map((r) => (
            <circle
              key={`${r.edge.from}-${r.edge.to}-start`}
              cx={r.start[0]}
              cy={r.start[1]}
              r="2.5"
              className="fill-muted-foreground/70"
            />
          ))}
        </svg>
        {nodes.map((node) => (
          <FlowNodeView key={node.id} node={node} />
        ))}
        {routed
          .filter((r) => r.edge.label)
          .map((r) => (
            <span
              key={`${r.edge.from}-${r.edge.to}-label`}
              className="-translate-x-1/2 -translate-y-1/2 absolute rounded-sm border bg-background px-1.5 font-mono text-label-sm text-muted-foreground"
              style={{ left: r.label[0], top: r.label[1] }}
            >
              {r.edge.label}
            </span>
          ))}
      </div>
    </div>
  );
}

function FlowNodeView({ node }: { node: FlowNode }) {
  const Icon = node.icon;
  const style = { left: node.x, top: node.y };
  if (node.kind === "icon") {
    return (
      <div
        data-slot="flow-node"
        data-kind="icon"
        className="absolute flex w-[100px] flex-col items-center text-center"
        style={style}
      >
        <span className="relative inline-flex size-10 items-center justify-center rounded-lg border bg-card">
          <Icon aria-hidden="true" className="size-[18px]" />
          {node.status ? (
            <span
              role="img"
              aria-label={node.status}
              className={cn(
                "-right-1.5 -top-1.5 absolute inline-flex size-4 items-center justify-center rounded-pill text-label-xs leading-none",
                statusChipClass[node.status],
              )}
            >
              {statusMark[node.status]}
            </span>
          ) : null}
        </span>
        <b className="mt-1.5 truncate font-semibold text-xs leading-tight">{node.title}</b>
        {node.detail ? (
          <span className="w-full truncate text-label text-muted-foreground">{node.detail}</span>
        ) : null}
      </div>
    );
  }
  if (node.kind === "approve") {
    return (
      <div
        data-slot="flow-node"
        data-kind="approve"
        className="absolute flex h-12 w-[260px] items-center gap-2.5 rounded-lg border border-warning/60 bg-card px-3 shadow-sm"
        style={style}
      >
        <Icon aria-hidden="true" className="size-4 shrink-0 text-warning" />
        <div className="min-w-0 flex-1 leading-tight">
          <b className="block truncate font-semibold text-xs">{node.title}</b>
          {node.detail ? (
            <span className="block truncate text-label text-muted-foreground">{node.detail}</span>
          ) : null}
        </div>
        <Button size="xs" onClick={node.onAction}>
          {node.actionLabel ?? "Approve"}
        </Button>
      </div>
    );
  }
  return (
    <div
      data-slot="flow-node"
      data-kind="card"
      className="absolute rounded-lg border bg-card shadow-sm"
      style={{ ...style, width: node.width ?? 240 }}
    >
      <div className="flex h-12 items-center gap-2.5 px-3">
        <Icon aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
        <div className="min-w-0 flex-1 leading-tight">
          <b className="block truncate font-semibold text-xs">{node.title}</b>
          {node.detail ? (
            <span className="block truncate text-label text-muted-foreground">{node.detail}</span>
          ) : null}
        </div>
      </div>
      {node.footer ? (
        <div className="flex h-[30px] items-center gap-2 border-t px-3 text-label text-muted-foreground">
          {node.status ? <Dot tone={statusTone[node.status]} /> : null}
          {node.footer}
        </div>
      ) : null}
    </div>
  );
}
