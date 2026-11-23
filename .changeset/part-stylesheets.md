---
"@donaldgifford/design-system": minor
---

A stylesheet per part, for apps on `core.css`.

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
