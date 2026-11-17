---
"@donaldgifford/design-system": minor
---

`DataTable`: a `sortable` prop. `sortable={false}` turns sorting off for every column, so the headers render as plain text; unset, nothing changes. A column's own `enableSorting: false` still applies, and `sortable` does not force sorting on for a `manual` table with no `onSearchChange`.
