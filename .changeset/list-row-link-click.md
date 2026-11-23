---
"@donaldgifford/design-system": patch
---

`ListRow` with both `render` and `onClick` now runs `onClick` when the
link is followed, as well as the link's own handler. In 0.5.0 it was
dropped without a word, which left a row that is a link unable to close
the palette it sits in.
