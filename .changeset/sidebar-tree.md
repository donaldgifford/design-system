---
"@donaldgifford/design-system": minor
---

The sidebar tree: rows in the shell sidebar that hold more rows (RFC-0003).

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
