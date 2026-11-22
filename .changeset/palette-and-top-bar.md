---
"@donaldgifford/design-system": minor
---

The command palette's optional parts, and the top bar's two controls.

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
