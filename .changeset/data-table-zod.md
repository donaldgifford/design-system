---
"@donaldgifford/design-system": patch
---

`DataTable` no longer brings zod into an app's bundle. The zod-free part of the list convention (`ListSearch`, `listSearchDefaults`, `parseSort`, `formatSort`, `compactSearch`) moved to a new `lib/list-params`, which the table imports. `lib/list-search` re-exports all of it beside `listSearchSchema`, so existing imports keep working; only an app that imports `lib/list-search` or `lib/problem` gets zod.
