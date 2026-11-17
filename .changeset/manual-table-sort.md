---
"@donaldgifford/design-system": patch
---

`DataTable`: a `manual` table with no `onSearchChange` no longer renders sort buttons. Before, a header click flipped the arrow and `aria-sort` while the rows, which the server orders, stayed where they were.
