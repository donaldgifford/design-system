# @donaldgifford/design-system

## 0.3.2

### Patch Changes

- [#21](https://github.com/donaldgifford/design-system/pull/21) [`3147cc0`](https://github.com/donaldgifford/design-system/commit/3147cc0d826ad8402ff2c8a4f8857064b6d1ef4e) Thanks [@donaldgifford](https://github.com/donaldgifford)! - `DataTable` no longer brings zod into an app's bundle. The zod-free part of the list convention (`ListSearch`, `listSearchDefaults`, `parseSort`, `formatSort`, `compactSearch`) moved to a new `lib/list-params`, which the table imports. `lib/list-search` re-exports all of it beside `listSearchSchema`, so existing imports keep working; only an app that imports `lib/list-search` or `lib/problem` gets zod.

## 0.3.1

### Patch Changes

- [#19](https://github.com/donaldgifford/design-system/pull/19) [`38ea5c0`](https://github.com/donaldgifford/design-system/commit/38ea5c0f6164bd83b190b20ca5fe2051ad5bb394) Thanks [@donaldgifford](https://github.com/donaldgifford)! - - `TabsTrigger` no longer narrows its focus outline to 1px; it takes the 2px outline every other focusable element gets from `globals.css`.
  - `lib/errors` no longer imports zod, so an app that renders an `ErrorState` or uses `ApiError` does not bundle it. `ApiError.from` reads the problem body with a new `parseProblem`, which accepts what `problemSchema` accepts. `lib/problem` still exports `problemSchema` and re-exports the rest.

## 0.3.0

### Minor Changes

- [#17](https://github.com/donaldgifford/design-system/pull/17) [`9cd904f`](https://github.com/donaldgifford/design-system/commit/9cd904fc9133bc8f45d780f91b6e1f62037c5315) Thanks [@donaldgifford](https://github.com/donaldgifford)! - `DataTable`: a `sortable` prop. `sortable={false}` turns sorting off for every column, so the headers render as plain text; unset, nothing changes. A column's own `enableSorting: false` still applies, and `sortable` does not force sorting on for a `manual` table with no `onSearchChange`.

## 0.2.1

### Patch Changes

- [#15](https://github.com/donaldgifford/design-system/pull/15) [`91d5d29`](https://github.com/donaldgifford/design-system/commit/91d5d29a375cae7ed9d863f0fe2cdc60215e41b8) Thanks [@donaldgifford](https://github.com/donaldgifford)! - `DataTable`: a `manual` table with no `onSearchChange` no longer renders sort buttons. Before, a header click flipped the arrow and `aria-sort` while the rows, which the server orders, stayed where they were.

## 0.2.0

### Minor Changes

- [#12](https://github.com/donaldgifford/design-system/pull/12) [`932cfee`](https://github.com/donaldgifford/design-system/commit/932cfeeb6c4ab302bdfceacae0ea75b0b09410eb) Thanks [@donaldgifford](https://github.com/donaldgifford)! - Component gaps found by the first consumer's migration ([#11](https://github.com/donaldgifford/design-system/issues/11)).
  
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

## 0.1.1

### Patch Changes

- [#9](https://github.com/donaldgifford/design-system/pull/9) [`fd53ed5`](https://github.com/donaldgifford/design-system/commit/fd53ed59e597af27cf3b1a6ec5b083bfbbe4ff8c) Thanks [@donaldgifford](https://github.com/donaldgifford)! - Typecheck in apps that set `exactOptionalPropertyTypes` or have no Node types. The package ships source, so a consumer's compiler checks it under the consumer's flags: every optional prop now accepts an explicit `undefined`, and `lib/deprecation` no longer needs `@types/node`.

## 0.1.0

### Minor Changes

- [#3](https://github.com/donaldgifford/design-system/pull/3) [`3f7581d`](https://github.com/donaldgifford/design-system/commit/3f7581d25a9d4e798a1155e2d584241f04b85631) Thanks [@donaldgifford](https://github.com/donaldgifford)! - Add the design tokens, the primitives, blocks and shell parts, the Storybook catalog and the test suite.

- [#5](https://github.com/donaldgifford/design-system/pull/5) [`8f77ac3`](https://github.com/donaldgifford/design-system/commit/8f77ac3ede4991c5572c9f46529533ba4d60185f) Thanks [@donaldgifford](https://github.com/donaldgifford)! - Add the blocks repo-guardian has and the first import lacked: the chart blocks (`trend-chart`, `bar-buckets`, `pair-bars`, `bar-list`, `stacked-bars`, `sparkline`) with `chart-card` and its plot / table toggle, `series-pills`, `filter-chip`, `group-grid`, `meter`, `time` with a local / UTC toggle, `export-button`, `load-more`, and the `detail-panel` shell part. `DataTable` gains `meta.hideBelow`, `compact`, and `selectedId`. New helpers: `lib/chart-scale`, `lib/csv`, `lib/time`, `lib/percent`, and `hooks/use-media-query`.
