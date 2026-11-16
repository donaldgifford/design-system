/** CSV export, client-side: the rows are whatever the page already holds. */

export type CsvValue = string | number | boolean | undefined | null;

/**
 * Quotes a value for RFC 4180 and defuses spreadsheet formulas: a cell
 * starting with = + - @ (or a tab or CR) is prefixed with a quote, because
 * exported values are often user-controlled.
 */
export function csvCell(value: CsvValue): string {
  let s = value === undefined || value === null ? "" : String(value);
  if (/^[=+\-@\t\r]/.test(s)) {
    s = `'${s}`;
  }
  return /[",\r\n]/.test(s) ? `"${s.replaceAll('"', '""')}"` : s;
}

/** Renders a head and rows as CSV text. */
export function tableCsv(head: readonly string[], rows: readonly (readonly CsvValue[])[]): string {
  const lines = [head.map(csvCell).join(","), ...rows.map((r) => r.map(csvCell).join(","))];
  return `${lines.join("\r\n")}\r\n`;
}

/**
 * A table's export: the header row and how one item becomes cells. A
 * page declares one beside its table columns, so the export never reads
 * rendered markup.
 */
export interface CsvColumns<T> {
  head: readonly string[];
  row: (item: T) => readonly CsvValue[];
}

export function csvTable<T>(columns: CsvColumns<T>, items: readonly T[]): string {
  return tableCsv(
    columns.head,
    items.map((item) => columns.row(item)),
  );
}

/**
 * `<name>[-<key>-<value>…]-<date>.csv`: the name, every set filter, and
 * the day, each lowercased and reduced to [a-z0-9._-] so a
 * user-controlled value never names a path.
 */
export function exportFilename(
  name: string,
  filter: Record<string, CsvValue> = {},
  now: Date = new Date(),
): string {
  const parts = [name];
  for (const [key, value] of Object.entries(filter)) {
    if (value === undefined || value === null || value === "") continue;
    parts.push(key, String(value));
  }
  parts.push(now.toISOString().slice(0, 10));
  const safe = parts.map((p) => p.toLowerCase().replaceAll(/[^a-z0-9._-]+/g, "_"));
  return `${safe.join("-")}.csv`;
}

/** Saves text as a CSV file from the browser. */
export function downloadCsv(name: string, text: string): void {
  const url = URL.createObjectURL(new Blob([text], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}
