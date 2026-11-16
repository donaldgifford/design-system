import { cn } from "@donaldgifford/design-system/lib/utils";

interface SparklineProps {
  /** The series, oldest first; a null is an unmeasured point and leaves a gap. */
  values: readonly (number | null)[];
  width?: number | undefined;
  height?: number | undefined;
  /** A CSS color; the chart tokens as `var(--chart-1)` are the usual choice. */
  color?: string | undefined;
  className?: string | undefined;
}

/**
 * A bare line over the last points of a series, with a dot on the newest:
 * no axes, no labels. It is hidden from assistive tech, so the number it
 * sits beside carries the meaning. Fewer than two measured points draw a
 * dash.
 */
export function Sparkline({
  values,
  width = 84,
  height = 22,
  color = "var(--chart-1)",
  className,
}: SparklineProps) {
  const measured = values.filter((v): v is number => v !== null);
  if (measured.length < 2) {
    return (
      <span
        data-slot="sparkline"
        aria-hidden="true"
        className={cn("text-muted-foreground", className)}
      >
        —
      </span>
    );
  }
  const min = Math.min(...measured);
  const max = Math.max(...measured);
  // The inset keeps the end dot inside the box.
  const x = (i: number) => 3 + (i * (width - 6)) / (values.length - 1);
  const y = (v: number) =>
    max === min ? height / 2 : 3 + ((max - v) * (height - 6)) / (max - min);
  // A point after a gap starts a new stroke, so a null is never drawn as a line.
  let path = "";
  let pen = false;
  values.forEach((v, i) => {
    if (v === null) {
      pen = false;
      return;
    }
    path += `${pen ? "L" : "M"}${x(i).toFixed(1)} ${y(v).toFixed(1)} `;
    pen = true;
  });
  const lastIndex = values.length - 1;
  const last = values[lastIndex];
  return (
    <svg
      data-slot="sparkline"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden="true"
      className={cn("inline-block align-middle", className)}
    >
      <path
        d={path.trim()}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {last !== null && last !== undefined ? (
        <circle cx={x(lastIndex)} cy={y(last)} r={2.5} fill={color} />
      ) : null}
    </svg>
  );
}
