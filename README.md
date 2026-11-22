# design-system

Design tokens and a React component library shared by
[repo-guardian](https://github.com/donaldgifford/repo-guardian),
[docz](https://github.com/donaldgifford/docz) and other apps, so they install
one design instead of each keeping a copy.

The package is `@donaldgifford/design-system`. It has no build step:
consumers compile its TypeScript and CSS with their own Vite and Tailwind v4.
React, React DOM and Tailwind are peer dependencies.

The component catalog is the
[Storybook](https://donaldgifford.github.io/design-system/), deployed from
`main`.

> **Status:** 0.x, published to GitHub Packages. Expect breaking changes
> between minor versions until 1.0. See [RFC-0001](docs/rfc/) for the plan
> and [IMPL-0001](docs/impl/) for progress.

## Using it

Import subpaths, never a barrel:

| Import | What |
| --- | --- |
| `@donaldgifford/design-system/tokens.css` | every token as a CSS custom property; imports nothing, so it works on a plain HTML page |
| `@donaldgifford/design-system/tokens.json` | the same tokens as W3C Design Tokens (DTCG) |
| `@donaldgifford/design-system/globals.css` | everything: `fonts.css`, `core.css`, and an `@source` over the package |
| `@donaldgifford/design-system/core.css` | Tailwind, the tokens and both themes, the `@theme inline` map and the base layer; no fonts and no `@source` |
| `@donaldgifford/design-system/fonts.css` | IBM Plex Sans and JetBrains Mono, self-hosted (latin, five static files) |
| `@donaldgifford/design-system/components/<name>` | a primitive (`button`, `dialog`, `sidebar`, ...) |
| `@donaldgifford/design-system/blocks/<name>` | a block (`data-table`, `kpi`, `page-header`, `trend-chart`, `group-grid`, ...) |
| `@donaldgifford/design-system/shell/<name>` | presentational chrome (`top-bar`, `sidebar`, `detail-sheet`, `detail-panel`, `route-error`, `page-skeleton`) |
| `@donaldgifford/design-system/lib/<name>` | `utils` (`cn()`), `errors`, `problem`, `highlight`, `list-search`, `list-params`, `chart-scale`, `csv`, `time`, `percent`, `mark` |
| `@donaldgifford/design-system/hooks/<name>` | shared hooks (`use-mobile`, `use-media-query`, `use-active-heading`) |

Import `globals.css` once, from the app's entry. Its `@source` is what
generates the package's classes, since a consumer's Tailwind scans only its
own project. Dark is switched with a `.dark` class on `<html>`; storing the
user's choice is the app's job.

### Only the parts you use

`globals.css` scans the whole package, so an app gets the classes of every
component, used or not, and the package's font files. An app that wants
neither imports `core.css` and names the parts it uses:

```css
@import "@donaldgifford/design-system/core.css";
/* One line per part the app imports, relative to this file. */
@source "../node_modules/@donaldgifford/design-system/src/components/ui/button.tsx";
@source "../node_modules/@donaldgifford/design-system/src/components/blocks/list-row.tsx";
```

A part that renders another part needs that one's line too (`data-table`
uses `table`); a missing line shows as an unstyled component, not an
error. A directory is a valid `@source`, so
`.../src/components/ui` takes every primitive.

`core.css` loads no fonts. The tokens name `"IBM Plex Sans"` and
`"JetBrains Mono"`, so either add
`@import "@donaldgifford/design-system/fonts.css";` or load those
families yourself, as variable fonts for example.

### Following the system's color scheme

The tokens have no `prefers-color-scheme` block: the theme is the `.dark`
class and nothing else, so that a user's choice can override the system.
To follow the system, set the class before the first paint, in a script
in `<head>` ahead of the stylesheet:

```html
<script>
  (() => {
    const stored = localStorage.getItem("mode");
    const dark = stored ? stored === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.classList.toggle("dark", dark);
  })();
</script>
```

The storage key is the app's. Under a content security policy with no
inline scripts, serve the same lines as a small blocking script file.
`ModeToggle` (`shell/mode-toggle`) is the control; it is given the mode
and stores nothing.

### Installing from GitHub Packages

GitHub Packages needs a token to install, even for a public package. In the
consuming repo add an `.npmrc`:

```ini
@donaldgifford:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=${NPM_TOKEN}
```

Set `NPM_TOKEN` to a personal access token with `read:packages` locally. In
GitHub Actions pass `NPM_TOKEN: ${{ secrets.GITHUB_TOKEN }}` to the install
step, and pass it as a build secret to any Docker build that installs
dependencies.

### Coming from Radix-based shadcn

The primitives sit on Base UI, which differs from Radix in a few places
that compile and then fail quietly:

- **Menu items take `onClick`, not `onSelect`.** Base UI's `Menu.Item` has
  no `onSelect`; on `DropdownMenuItem` it type-checks as the native
  text-selection handler and never fires.
- **`DropdownMenuLabel` goes inside a `DropdownMenuGroup`.** Outside one,
  Base UI throws "Menu group parts must be used within <Menu.Group>".
- **`render`, not `asChild`.** `render={<a href="…" />}`, or the function
  form `render={(props) => <h2 {...props} />}`, which also satisfies a
  lint rule that wants heading content.
- **Naming a dialog yourself.** `aria-label` with
  `aria-labelledby={undefined}` on `DialogContent` or `SheetContent`
  replaces the title as the accessible name; a consumer's props merge
  last. `DetailPanel` has a `label` prop that does this.
- **Icon props take a component, not a node.** Blocks that show an icon
  (`EmptyState`, the sidebar's items) take a Tabler icon type:
  `icon={IconServer}`, not `icon={<IconServer />}`.
- **Tests under happy-dom or jsdom.** Base UI and cmdk decide when they
  are first imported whether a document exists, so register the DOM in a
  preload before anything imports them (this repo's `test/setup.ts` is
  the pattern). cmdk also needs a `ResizeObserver`, which happy-dom has
  and jsdom does not.
- **Reduced motion.** `core.css` (and so `globals.css`) cuts every animation and transition
  to nothing under `prefers-reduced-motion: reduce`; an app's own rule
  for that can go.

### Coming from another token set

- **`accent` is a hover surface, not the brand color.** Here, as in
  shadcn, `bg-accent` is the neutral fill under a hovered row and
  `--primary` is the brand color. An app whose own `--accent` or
  `--color-accent` means the brand color should rename it before
  importing the package's stylesheet, or its links and buttons turn gray.

## Layout

```text
package.json        # the exports map, peer dependencies
components.json     # where the shadcn CLI lands a new primitive
.storybook/         # Storybook config; docs/ renders sections of this README
tokens.json         # the DTCG export of tokens.css (just tokens)
scripts/            # tokens-export.ts
src/
  styles/           # tokens.css, core.css, fonts.css and globals.css
  components/       # each <name>.tsx with its <name>.stories.tsx beside it
    ui/             # shadcn-origin primitives, owned here
    blocks/         # composites: DataTable, Kpi, Timeline, the charts, ...
    shell/          # presentational chrome; takes what it renders as props or slots
  lib/              # cn(), ApiError and problem details, the highlighter, list search, chart scales, CSV, time
  hooks/            # use-mobile, use-media-query
test/               # a test per primitive, block, shell part, and lib module
docs/               # design decisions, managed with docz
```

## Layers

| Layer | Holds | Rule |
| --- | --- | --- |
| Tokens | raw, semantic, and component tokens; the `@theme inline` map; base styles; both themes | values only; no selectors beyond `:root` and `.dark` |
| Primitives | the headless engine (Base UI) restyled with Tailwind v4 and `cn()` | import only other primitives, `lib` and `hooks` |
| Blocks | composites built from primitives | never import shell parts or app code |
| Shell | presentational app chrome | takes everything it renders as props or slots |
| Apps | pages, feature code, routing, data | import components from the package; only the package imports `@base-ui/react` |

There is one look, repo-guardian's v2 UI, in a light and a dark mode. Its
values are the tokens and its rules are in the components' classes and
`cva` variants, so nothing is styled by a selector outside a component.

## Tokens

`src/styles/tokens.css` holds every value, in three tiers;
`core.css` maps them into Tailwind with `@theme inline`, so
`bg-background`, `text-running`, and `h-control` read them.

| Tier | Names | Read by |
| --- | --- | --- |
| Raw | `--gray-*`, `--slate-*`, and the hues (`--blue-50` is a blue at 50% oklch lightness), `--font-family-sans`, `--font-family-mono`, `--radius-base`, `--space-1` to `--space-8` | the semantic and component tiers only |
| Semantic | the surfaces, actions, roles, and states below; `--chart-1` to `--chart-5`; `--category-1` to `--category-8`; `--code-bg`, `--diff-add`, `--diff-remove`; `--radius`, `--pill-radius`; `--control-h`, `--row-h`; `--text-xs` to `--text-xl`; `--label-size`, `--label-size-sm`, `--label-size-xs`, `--label-tracking`; `--line-height-compact`, `--line-height-dense`; `--duration-fast`, `--duration-normal`, `--ease-standard` | components, through the theme map |
| Component | `--sidebar`, `--sidebar-*`, `--header-height`, `--badge-radius`, `--badge-mix`, `--badge-tint`, `--badge-tint-text`, `--badge-px`, `--badge-py`, `--avatar`, `--table-row-h`, `--table-head-h`, `--table-max-h`, `--kpi-value-size`, `--sheet-width`, `--sheet-width-wide`, `--sheet-padding`, `--elevation-overlay`, `--elevation-tooltip` | that component, sparingly |

- **Colors** are full oklch values, defined on `:root` (light) and
  `.dark`. A tint is `color-mix(in oklch, var(--x) N%, transparent)`, or
  Tailwind's `bg-x/N`.
- **Surfaces and actions**: `background`, `card`, `popover`, `muted`,
  `accent`, `secondary`, `primary`, and `destructive`, each with
  `-foreground` (`background`'s is `--foreground`); `border`, `input`,
  and `ring`. Two steps past those: `border-strong`, a field's hover
  border and an overlay's edge, and `surface-pressed`, a row or control
  while it is pressed.
- **Categories**: `--category-1` to `--category-8` are eight hues for a
  tone the app supplies, such as a document type or a team. The app
  decides which category is which; `Badge` and `Dot` take one as `tone`.
  Each holds 4.5:1 as text on the page, a card and the sidebar in both
  themes, plain and in a tinted badge. `--chart-*` is tuned for bars and
  is not checked as text.
- **Status roles** `success`, `warning`, `info`, and `destructive`, each
  with `-foreground` for text on the filled color; tinted badges use the
  role itself as text. **States** `pending`, `approved`, `ignored`, and
  `running`, each with `-foreground`, default to a role or surface
  (`--approved: var(--success)`, `--pending: var(--secondary)`) and
  diverge only where the look needs it. Badge has a variant per state. An
  app maps its own states onto these variants; a new state token needs a
  state that appears in more than one app.
- **One sizing set**, compact, with no setting: `--control-h` (1.75rem),
  `--row-h` (2rem), `--table-row-h`, `--space-*`, and the type scale.
  The type scale uses Tailwind's own `--text-*` names, so `text-xs` to
  `text-xl` read it; `--text-base` is 14px and sets the body's.
  `leading-compact` and `leading-dense` are the ratio line heights of
  Tailwind's `sm` and `xs` steps, for a smaller size on the same rhythm.
  Numbers in tables and KPIs use Tailwind's `tabular-nums`.
- **Radii**: `--radius` (3px) for `rounded-sm` to `rounded-lg`, and
  `rounded-xl` 4px past it; a part that must not round reads a component
  token (`--badge-radius`) rather than `rounded-none`.
- **Elevation**: controls are flat; overlays (menus, popovers, selects,
  dialogs, sheets) take `shadow-overlay`, a chart tooltip
  `shadow-tooltip`, from `--elevation-overlay` and `--elevation-tooltip`.
- **Icons**: Tabler (`@tabler/icons-react`) at the default stroke; nav
  icons are 15px. A prop that takes an icon is typed `TablerIcon`.
- **Motion**: `--duration-fast` (150ms), `--duration-normal` (200ms),
  and `--ease-standard`, read as `duration-(--duration-fast)`; the
  durations are zero under `prefers-reduced-motion`.
- **Badges** are tinted: a variant sets `--tone`, the badge fills with
  18% of it and its text is the tone mixed toward `--badge-mix` (black
  in light, white in dark).
- **Tests.** `test/styles/tokens.test.ts` parses the CSS and checks
  every schema token in both themes, that `.dark` sets every color
  `:root` sets, each foreground on its surface, role, or state at
  4.5:1, the category colors as text and as tinted badges, and the
  focus ring at 3:1 against the background and card.
  `test/styles/entries.test.ts` compiles `globals.css` and `core.css`
  as an app's build would.
- **Export.** `tokens.json` is the tokens as W3C Design Tokens (DTCG),
  with `light` and `dark` as modes, each holding every token. A token
  that names another is an alias (`{slate-21}`), and `$type` comes from
  the resolved value. `just tokens` writes it from `tokens.css`, and
  `test/styles/tokens-export.test.ts` fails until it's rerun after a
  token change. Never edit the JSON.

## Component conventions

- Every DOM part carries `data-slot="<component>-<part>"`.
- Variants through `cva` only, never boolean-prop combinations.
- Props extend the primitive's props; polymorphism through Base UI's
  `render` prop: `<DropdownMenuTrigger render={<Button variant="ghost" />}>`
  puts the trigger's behaviour on the button, and the children go on the
  trigger. A part with no Base UI counterpart (`Badge`,
  `BreadcrumbLink`, the sidebar's slots) takes `render` through
  `useRender` and `mergeProps`.
- A link styled as a button is a link: `<Link className={buttonVariants({ variant })}>`.
  Base UI's `Button` gives a rendered anchor `role="button"`; pass
  `nativeButton={false}` only when it renders a non-link element.
- State selectors are Base UI's: `data-open` and `data-closed` on
  popups, `data-active` on a tab, `data-highlighted` on a menu or select
  item, `data-popup-open` on a trigger, and `--transform-origin`,
  `--available-height`, and `--anchor-width` from the positioner.
- Change callbacks take Base UI's event details as a second argument
  (`onOpenChange(open, details)`); a menu item's handler is `onClick`.
- No raw colors (hex, `rgb(`, `hsl(`), arbitrary values (`-[`),
  `rounded-full`, or literal font sizes (`text-[13px]`) in
  `src/components/**`. `test/discipline.test.ts` checks this. Its
  allowlist names each exception by file and exact utility, with a
  reason, and fails on an entry that no longer matches, so it only
  shrinks. `transition-[...]` property lists pass anywhere. Utilities
  that resolve to tokens are fine: `rounded-pill`, `text-label`,
  `h-(--control-h)`, `bg-muted`, and the spacing scale (`size-5.5`).
  A new value is a token in `tokens.css`, mapped in `core.css`'s
  `@theme`. A new text, radius, tracking, or leading step also goes in
  `cn()`'s tailwind-merge theme, or it gets merged away beside a color.
- Every component has a `bun test` file that renders each variant and
  runs axe, and a story beside it (`<name>.stories.tsx`, CSF3, importing
  only the package's exports) with every variant and controls for its
  props. `test/stories.test.ts` fails on a component module without one.
  react-docgen can't read `cva`'s variant props, so a story declares
  them in `argTypes`.

## Local edits

The primitives started from shadcn's `base-vega` style (Base UI). Every
primitive carries this look's classes rather than the style's, so the class
strings differ throughout; the table lists what differs beyond them. The
`"use client"` directive is gone from all of them.

| Primitive | Edit | Why |
| --- | --- | --- |
| `sidebar` | no `sidebar_state` cookie | the app owns persistence through a controlled provider |
| `sidebar` | `data-slot`, `data-active`, and `data-size` are attributes, not `useRender` state | state renders `data-active` only when true; the classes and tests key on `data-active="true"` |
| `sidebar` | the active item gets a `sidebar-accent` fill, with no rule or weight change; `SidebarMenu` items sit with no gap | a selection that reads at a glance |
| `tooltip` | the popup has `role="tooltip"` and describes its trigger while open | Base UI leaves tooltips out of the accessibility tree; WAI-ARIA's tooltip pattern describes the trigger |
| `tabs` | `TabsList` defaults `activateOnFocus` to true | automatic activation, as the WAI-ARIA tabs pattern recommends when panels need no fetch |
| `tabs` | `default` is a segmented control (a bordered row, the active tab on `accent`); `line` is a `primary` underline on a hairline, for a page's sections | repo-guardian's tabs, plus a quieter form |
| `separator` | a `decorative` prop (default true) drops the separator role | most separators are visual |
| `dropdown-menu` | content aligns `center` by default | `base-vega` aligns `start` |
| `sonner` | `theme` is a prop, not `next-themes` | the app resolves the color mode itself |
| `breadcrumb` | the current page drops `role="link"` and `aria-disabled` | it is plain text with `aria-current`; axe flags a link role on non-links |
| `command` | the hidden dialog title sits inside the content | upstream's header stays in the DOM while closed, outside any landmark |
| `command` | `CommandDialog` takes `commandProps` for its inner `Command` | a palette backed by a server search needs `shouldFilter={false}` |
| `card` | `Card` and `CardTitle` take `render` | a card that is a `section`, a title that is a heading |
| `sheet` | opens and closes in 200ms | upstream's 500ms open reads as lag on a detail panel |
| `badge` | `success`, `warning`, and `info` variants; `pending`, `approved`, `ignored`, and `running` | the status roles and states |
| `badge` | a `fill` axis (`tinted`, the default, or `filled`); each variant sets `--tone`, `--tone-fill`, and `--tone-foreground`, and the `badge-tinted` and `badge-filled` utilities draw them; `outline` has no fill | one tone per variant, two treatments, no per-variant color classes |
| `badge` | a `tone` prop takes a CSS color and sets `--tone` inline, for the tinted form only | a category the package has no variant for, such as a document type |
| `button` | `success`, `warning`, and `info` variants (filled) | the status roles |
| `collapsible` | the panel animates its height on the motion tokens; closed, it is not in the DOM | one disclosure for `Disclosure` and the sidebar tree |
| `input`, `textarea`, `select` | the border takes `border-strong` on hover | a field that answers the pointer |
| `popover`, `dropdown-menu` | the edge is `border-strong` | an overlay that separates from the page in both themes |
| `sidebar` | a pressed row takes `surface-pressed` | a press reads as one, past the hover fill |
| `input`, `textarea` | `text-[1rem]` instead of `text-base` below `md` | `text-base` is the 14px body size; 16px keeps iOS from zooming on focus |
| `table` | `containerClassName` reaches the scroll container; `TableHeader` sticks with `data-sticky`; heads take `--table-head-h` and the label type; a selected row is tinted `primary` at 12% | DataTable's sticky header and `--table-max-h` scroll |
| `label`, `textarea`, `checkbox`, `radio-group`, `switch`, `popover`, `toggle`, `toggle-group`, `alert`, `avatar` | no control shadows, the token control heights; `alert` gains `success`, `warning`, and `info`; the avatar fallback sits on `bg-avatar` | flat controls, the status roles, and a tokenized avatar color |
| `alert` | a tinted callout: each tone fills at 10% inside a full border of the tone at 40%, and the icon takes the tone | a status callout that stands out in the light theme too |
| `dropdown-menu`, `popover`, `select`, `dialog`, `sheet`, `chart` | overlays take `shadow-overlay` (the chart tooltip `shadow-tooltip`), from `--elevation-*` | lifted overlays; controls stay flat |
| `toggle-group` | spacing through a `--toggle-group-gap` property set from the `spacing` prop | a computed gap, not an arbitrary class |

## Change policy

- **Additive by default.** New variants, props, and components are minor
  changes.
- **Deprecation before removal.** A removed variant or prop first gets a
  development-only `console.warn` for one minor release, and goes in the
  next major. To deprecate, add a `Deprecation` to `deprecations` in
  `lib/deprecation.ts` and call `warnDeprecated(entry)` where the
  component sees the old prop or variant. The warning fires once per
  entry and drops out of production builds. Nothing is deprecated yet.
- **Tokens.** Renames are majors; value changes are patches, which is
  what tokens are for.
- **Versions and changelog.** [changesets](https://github.com/changesets/changesets).
  Run `just changeset` in any pull request that changes the published
  package. Merging to `main` opens a "version packages" pull request;
  merging that one publishes to GitHub Packages and creates a GitHub
  Release.
- **Upstream shadcn** is a source of ideas, not a tracked dependency:
  now and then, run `shadcn add <name> --overwrite` on a scratch
  checkout, diff it against the package, reapply the edits in the table
  above, and keep what is useful.

## Adding a component

1. `just add <name>` lands a shadcn primitive in `src/components/ui`; or
   write the component by hand following the conventions.
2. Restyle it with tokens only; record any structural change in the
   local-edits table.
3. It is exported by its path
   (`@donaldgifford/design-system/components/<name>`); add a test under
   `test/` that renders each variant with axe, and `<name>.stories.tsx`
   beside it (`just storybook` to work on it).
4. Run `just check`, and add a changeset.

A component belongs here when a running app already uses it and it is not
shaped around one app's domain.

## Development

```sh
mise install    # pinned toolchain
just install    # dependencies
just            # list recipes
just check      # everything CI runs
just storybook  # the component catalog on :6006
```

## Documentation

Design decisions live in [`docs/`](docs/) and are managed with
[docz](https://github.com/donaldgifford/docz).

## License

Apache-2.0
