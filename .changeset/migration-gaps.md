---
"@donaldgifford/design-system": minor
---

Component gaps found by the first consumer's migration (#11).

- `DataTable`: `search` and `onSearchChange` are optional, and without them the table is a plain one that shows every row and keeps its own sort; `manual` for a server-driven list without a `total` (no pager); `label`; `bare`; `meta.className` on a column. A click or a key on a link, button, or field inside a row no longer activates the row, and Space activates a row as Enter does.
- `DetailPanel`: `label` names the dialog in place of its title; `subject` returns focus to an inline panel when it is pointed at something else.
- `DetailsGrid`: `layout="list"`, one pair per row with values that wrap.
- `ChartCard`: a `strip` slot that stays in the table view; the title is a heading (`headingLevel`, default 3).
- `Card` and `CardTitle` take `render`.
- `CommandDialog` takes `commandProps` for its inner `Command`.
- `DistBar`: `label`, `size`, and `legend`; an empty segment is skipped; segments have a `title`; counts are grouped (`1,200`).
- `StatStrip`: a `sub` line under a value.
- `ExportButton`: `filename`, when the file's name differs from the button's.
- `PageHeader`: actions wrap instead of squeezing the title.
- `problemRequestId`, and `ApiError.from` reads `request_id` as well as `requestId`.
- `globals.css` cuts every animation and transition under `prefers-reduced-motion: reduce`.

Changed behaviour:

- `ErrorState` heads a problem that has a title with `"<status> · <title>"`; before, with its reason code.
- `trendTable(points, series, options)` takes `{ unit, cap, head, noun }` in place of the positional `unit` and `cap`.
- `Sheet` opens and closes in 200ms (was 500ms and 300ms).
