import { Button } from "@donaldgifford/design-system/components/button";
import {
  type CsvColumns,
  type CsvValue,
  csvTable,
  downloadCsv,
  exportFilename,
} from "@donaldgifford/design-system/lib/csv";
import { cn } from "@donaldgifford/design-system/lib/utils";
import { IconDownload } from "@tabler/icons-react";
import { useState } from "react";

export interface ExportFetch<T> {
  /** Pages the whole result set; `truncated` says the cap cut it short. */
  fetch: () => Promise<{ rows: readonly T[]; truncated: boolean }>;
  /** The most rows `fetch` returns. */
  cap: number;
}

interface ExportButtonProps<T> {
  /** Names the file and the button: "findings" saves `findings-<date>.csv`. */
  name: string;
  /** The filters in force; each set one joins the filename. */
  filter?: Record<string, CsvValue> | undefined;
  columns: CsvColumns<T>;
  /** The rows the page holds; undefined while they load. */
  rows: readonly T[] | undefined;
  /** Export the whole set, not only the loaded rows. */
  all?: ExportFetch<T> | undefined;
  /** The file sink; a test replaces it. */
  download?: ((name: string, text: string) => void) | undefined;
  className?: string | undefined;
}

/**
 * Downloads a table's rows as CSV. It is disabled until the rows have
 * loaded and when there are none. With `all`, a click fetches the whole
 * set first, and says so when the cap cut it short.
 */
export function ExportButton<T>({
  name,
  filter,
  columns,
  rows,
  all,
  download = downloadCsv,
  className,
}: ExportButtonProps<T>) {
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | undefined>(undefined);
  const ready = rows !== undefined && rows.length > 0;
  const save = (items: readonly T[]) =>
    download(exportFilename(name, filter), csvTable(columns, items));
  const onClick = async () => {
    if (!rows) return;
    if (!all) {
      save(rows);
      return;
    }
    setBusy(true);
    setNotice(undefined);
    try {
      const { rows: items, truncated } = await all.fetch();
      save(items);
      if (truncated) {
        setNotice(
          `Export cut short at ${all.cap.toLocaleString("en-US")} rows; narrow the filters for the rest.`,
        );
      }
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Export failed.");
    } finally {
      setBusy(false);
    }
  };
  return (
    <span data-slot="export-button" className={cn("inline-flex items-center gap-2", className)}>
      <span role="status" className="text-warning text-xs empty:hidden">
        {notice}
      </span>
      <Button
        variant="ghost"
        size="sm"
        aria-label={`Export ${name} as CSV`}
        disabled={!ready || busy}
        onClick={() => void onClick()}
      >
        <IconDownload aria-hidden="true" />
        {busy ? "Exporting…" : "Export"}
      </Button>
    </span>
  );
}
