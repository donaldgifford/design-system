---
"@donaldgifford/design-system": minor
---

Small parts an app with documents and categories needs.

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
