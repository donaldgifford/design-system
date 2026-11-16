/** Percent arithmetic shared by the meter and the group grid. */

/**
 * num / den as a percentage floored to one decimal, null on an empty
 * denominator. Floored, not rounded, so 99.96% never reads as 100%.
 */
export function floorPercent(num: number, den: number): number | null {
  return den <= 0 ? null : Math.floor((num * 1000) / den) / 10;
}

/** Renders a percentage to one decimal; a null is "no data", never 0%. */
export function formatPercent(percent: number | null | undefined): string {
  return percent === null || percent === undefined ? "no data" : `${percent.toFixed(1)}%`;
}

/** A share as a cell prints it: floored to one decimal, a whole number bare. */
export function shareText(n: number, of: number): string {
  const p = floorPercent(n, of) ?? 0;
  return Number.isInteger(p) ? `${p}%` : `${p.toFixed(1)}%`;
}

/**
 * The opacity a heat cell takes for its share of a total: nothing for
 * zero, then 8% to 50%, so a column reads as a heat map without drowning
 * the number.
 */
export function heatOpacity(count: number, total: number): number {
  if (count <= 0 || total <= 0) return 0;
  return Math.round(8 + 42 * Math.min(1, count / total)) / 100;
}
