---
"@donaldgifford/design-system": minor
---

What a search result and a long document need.

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
