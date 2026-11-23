# @donaldgifford/design-system

## 0.6.0

### Minor Changes

- [#36](https://github.com/donaldgifford/design-system/pull/36) [`661b454`](https://github.com/donaldgifford/design-system/commit/661b454a8f56ebad2e278bb944c378c6dd5a8da6) Thanks [@donaldgifford](https://github.com/donaldgifford)! - A stylesheet per part, for apps on `core.css`.
  
  `@donaldgifford/design-system/parts/<kind>/<name>.css` exists for every
  component, block and shell part: `parts/components/button.css`,
  `parts/blocks/list-row.css`, `parts/shell/sidebar-tree.css`. Each is the
  `@source` lines for that part's file and every package file it imports,
  however far down, so one `@import` per part an app uses is enough and a
  part's dependencies cannot be missed. They are generated from the
  imports and held to them by a test.
  
  This replaces writing `@source` lines into `node_modules` by hand, which
  still works. Keep `source(none)` on the `core.css` import and the
  `@source` line for the app's own directory; the README has the lines.

### Patch Changes

- [#36](https://github.com/donaldgifford/design-system/pull/36) [`99e1dbf`](https://github.com/donaldgifford/design-system/commit/99e1dbf1303f5ce79cc46e29974a55a7c758f2a3) Thanks [@donaldgifford](https://github.com/donaldgifford)! - `ListRow` with both `render` and `onClick` now runs `onClick` when the
  link is followed, as well as the link's own handler. In 0.5.0 it was
  dropped without a word, which left a row that is a link unable to close
  the palette it sits in.

## 0.5.0

### Minor Changes

- [#33](https://github.com/donaldgifford/design-system/pull/33) [`bd858fc`](https://github.com/donaldgifford/design-system/commit/bd858fc6f2b18a46956fc65e235a899a79fa86fa) Thanks [@donaldgifford](https://github.com/donaldgifford)! - The command palette's optional parts, and the top bar's two controls.
  
  - `components/command`: `CommandFilters`, a row of filters under the
    input, and `CommandFooter`, a row of key hints along the foot. Both are
    placed among `CommandDialog`'s children like `CommandInput` and
    `CommandList`. `CommandDialog` takes `preview`, a pane beside the list
    for the highlighted item: with it the dialog is wider, and below `sm`
    the pane is hidden. A control in any of the three keeps Enter and Space
    while the arrow keys still move through the list. A palette that uses
    none of them is unchanged.
  - `shell/search-trigger`: `SearchTrigger`, the button shaped like a field
    that opens the palette, with a `label` and a `shortcut` hint. Below `md`
    it is the icon alone.
  - `shell/mode-toggle`: `ModeToggle`, the light and dark switch. It is
    controlled (`mode`, `onToggle`) and stores nothing.

- [#33](https://github.com/donaldgifford/design-system/pull/33) [`b8daa61`](https://github.com/donaldgifford/design-system/commit/b8daa616600480c7fa34a57108d97fb262f1dce4) Thanks [@donaldgifford](https://github.com/donaldgifford)! - What a search result and a long document need.
  
  - `ListRow` takes `eyebrow`, a mono line over the title; `detail`, text
    under it that wraps to two lines; and `render`, which makes the title
    the app's link stretched over the row, as `onClick` makes it a button.
  - `Time` takes `style="stacked"`, the date over the time in one `<time>`.
    `formatTime` takes `style: "time"` for `HH:mm`.
  - `lib/mark`: `markSegments(text)` splits a search snippet on literal
    `<em>` and `</em>` into marked and unmarked runs. `blocks/marked`:
    `Marked` draws them, the matches as `<mark>` on a primary tint. Nothing
    else in the string becomes an element, so an API's snippet is safe to
    pass as it came.
  - `blocks/outline`: `Outline`, "On this page": a document's headings as
    links on a hairline, the one being read marked. `hooks/use-active-heading`:
    `useActiveHeading(ids)`, the scroll spy that picks it.

- [#33](https://github.com/donaldgifford/design-system/pull/33) [`42b6173`](https://github.com/donaldgifford/design-system/commit/42b6173201194be507daca3426bd9b787094d865) Thanks [@donaldgifford](https://github.com/donaldgifford)! - The sidebar tree: rows in the shell sidebar that hold more rows (RFC-0003).
  
  - `shell/sidebar-tree`: `ShellSidebarTreeItem`, used inside a
    `ShellSidebarGroup` and inside itself. Its props decide its form: with
    `render` it is a link; with `render` and children (or `expandable`) it
    is a link and a caret button that only toggles; with children and no
    `render` the whole row toggles. It takes `label`, `leading`, `badge`,
    `active`, `disabled`, and `open`, `defaultOpen` and `onOpenChange`.
    Children are a nested list that is not in the DOM while closed, and
    depth is tracked by the component. A nested row is one line with its
    label as `title`; the active one sets `aria-current="page"` and colors
    its stretch of the hairline.
  - On the icon rail a top-level row shows its `leading`, or a mark with
    the label's first letter, with the label as its tooltip. A row with
    children opens a popover holding its subtree with every branch open,
    and opening it calls `onOpenChange(true)`. On mobile the tree is drawn
    as it is expanded.
  - `ShellSidebarTreeNote`: the list item for a line in a branch that is
    not a row, such as `InlineLoading` while the children load.
  - `hooks/use-tree-open`: `useTreeOpen(activeKey)`. The branch that holds
    the current page is open, a toggle by hand overrides that, and the
    overrides are dropped when the page moves to another branch.
    `item(key)` returns `open` and `onOpenChange` to spread on a row.
  - `components/sidebar`: a `SidebarMenuBadge` in a row that also has a
    `SidebarMenuAction` now sits left of the action instead of under it.
  
  A navigation of flat `SidebarMenuItem`s renders the markup it did in
  0.4.0.

- [#33](https://github.com/donaldgifford/design-system/pull/33) [`a1b32d3`](https://github.com/donaldgifford/design-system/commit/a1b32d3a5e1aecedde47daf8757a4d4a15c1a0cb) Thanks [@donaldgifford](https://github.com/donaldgifford)! - Small parts an app with documents and categories needs.
  
  - `components/collapsible`: `Collapsible`, `CollapsibleTrigger` and
    `CollapsiblePanel`, on Base UI. A closed panel is not in the DOM.
  - `blocks/disclosure`: `Disclosure`, a bordered block that opens under its
    label, with a `value` shown while it is closed.
  - `Badge` takes `tone`, any CSS color, for a category the package has no
    variant for: `<Badge tone="var(--category-3)">`. Tinted form only.
    `Dot`'s `tone` takes the five names or any CSS color.
  - `Stepper` takes `orientation="vertical"`, the steps stacked on a line,
    and `size="sm"`, a dot with no number. The two are independent, and the
    default is unchanged.
  - `FilterChip` takes `pressed` and `onPressedChange`: a toggle labelled by
    its children, one click to change, with no editor. It sits in a
    `FilterBar` like the `key = value` form.

- [#33](https://github.com/donaldgifford/design-system/pull/33) [`688cb86`](https://github.com/donaldgifford/design-system/commit/688cb86b7d9bcb6cf1795f9cc1f843c03444206e) Thanks [@donaldgifford](https://github.com/donaldgifford)! - Tokens and stylesheet entries for apps that take part of the package.
  
  - `core.css`: Tailwind, the tokens, the theme map and the base layer, with
    no `@source` and no fonts. An app that imports it with `source(none)`
    names its own directory and the parts it uses in `@source` lines, and
    gets no classes for the rest. The README has the lines.
    `fonts.css` is the five font imports on their own. `globals.css` is the
    two plus the package's sources and compiles to the CSS it did.
  - `--category-1` to `--category-8`: eight hues for a tone the app
    supplies, each at least 4.5:1 as text and in a tinted badge on the page,
    a card and the sidebar, in both themes.
  - `--border-strong` and `--surface-pressed`. A field's border darkens on
    hover, a popover and a menu take the stronger edge, and sidebar rows,
    option rows and a clickable `ListRow` show the pressed surface.
  - README: taking only the parts an app uses, following
    `prefers-color-scheme` before first paint, and what `accent` means here.

## 0.4.0

### Minor Changes

- [#26](https://github.com/donaldgifford/design-system/pull/26) [`86c5516`](https://github.com/donaldgifford/design-system/commit/86c551680316328f34110b494f0717173bb5ec9c) Thanks [@donaldgifford](https://github.com/donaldgifford)! - `shell/app-switcher`: `AppSwitcher`, the sidebar header as a menu of the
  apps a deployment runs, each a plain link to another origin (RFC-0002).
  With one app it is the identity as a link home.
  
  `AppMark` takes `size="sm"` for a menu row, and its icon now carries the
  mark's color, so a `DropdownMenuItem` no longer tints it muted.

- [#23](https://github.com/donaldgifford/design-system/pull/23) [`8272057`](https://github.com/donaldgifford/design-system/commit/82720571b4022701a51fbd42df76f08d889c4e1a) Thanks [@donaldgifford](https://github.com/donaldgifford)! - Four small blocks that apps were keeping local copies of:
  
  - `blocks/segmented-control`: `SegmentedControl`, the `Tabs` list with no
    panels, as a controlled choice between a few views.
  - `blocks/option-rows`: `OptionHeading`, `OptionItem` and `OptionSeparator`,
    the rows of a picker inside a `Popover`, with a current row and a mono
    detail.
  - `blocks/filter-bar`: `FilterBar`, the named group around `FilterChip`s,
    with "Clear" and a result count.
  - `blocks/inline-state`: `InlineLoading` and `InlineEmpty`, one line of
    loading or empty text inside a panel or under a table head.

- [#24](https://github.com/donaldgifford/design-system/pull/24) [`57c8e60`](https://github.com/donaldgifford/design-system/commit/57c8e600619dcfb811d7de1eaeba50e06bdea522) Thanks [@donaldgifford](https://github.com/donaldgifford)! - `blocks/stacked-bars-over-time`: `StackedBarsOverTime`, counts over time
  split by category as one stacked bar per bucket, with `stackTimeTable` for
  the `ChartCard` table and `stackTotal`. `TrendChart` draws one series and
  `StackedBars` has no time axis; this is the block for "runs by outcome over
  the range".

- [#27](https://github.com/donaldgifford/design-system/pull/27) [`efa7dc4`](https://github.com/donaldgifford/design-system/commit/efa7dc47ff3e9c2874515e5ae9bfe21e6ff3a890) Thanks [@donaldgifford](https://github.com/donaldgifford)! - A public status page's parts, after repo-guardian's page and built from
  the package's own `Alert`, `Dot`, `ListRow`, `Badge` and `PageHeader`:
  
  - `blocks/status`: `StatusBanner` (the overall state as a headline in its
    tone), `StatusComponents` (a row per part of the service), `StatusBadge`,
    and `statusTone` / `statusHeadline`. A state that is not known reads as a
    disruption.
  - `shell/status-page`: `StatusPageLayout`, the narrow column outside the
    app shell, under a `PageHeader`, with a footer.

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
