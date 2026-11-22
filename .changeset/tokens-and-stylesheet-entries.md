---
"@donaldgifford/design-system": minor
---

Tokens and stylesheet entries for apps that take part of the package.

- `core.css`: Tailwind, the tokens, the theme map and the base layer, with
  no `@source` and no fonts. An app that imports it names the parts it
  uses with its own `@source` lines and gets no classes for the rest.
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
