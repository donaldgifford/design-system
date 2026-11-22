---
id: IMPL-0002
title: "Parts for docz-site: the sidebar tree and the rest of issue 32"
status: Draft
author: Donald Gifford
created: 2026-11-22
---

<!-- markdownlint-disable-file MD024 MD025 MD041 -->

# IMPL-0002: Parts for docz-site: the sidebar tree and the rest of issue 32

<!--toc:start-->
<!-- markdownlint-capture -->
<!-- markdownlint-disable MD013 -->
- [Objective](#objective)
- [Scope](#scope)
  - [In Scope](#in-scope)
  - [Out of Scope](#out-of-scope)
- [Implementation Phases](#implementation-phases)
  - [Phase 1: Tokens and stylesheet entries](#phase-1-tokens-and-stylesheet-entries)
    - [Tasks](#tasks)
    - [Success Criteria](#success-criteria)
  - [Phase 2: Small parts](#phase-2-small-parts)
    - [Tasks](#tasks-1)
    - [Success Criteria](#success-criteria-1)
  - [Phase 3: Search rows and the outline](#phase-3-search-rows-and-the-outline)
    - [Tasks](#tasks-2)
    - [Success Criteria](#success-criteria-2)
  - [Phase 4: The palette and the top bar](#phase-4-the-palette-and-the-top-bar)
    - [Tasks](#tasks-3)
    - [Success Criteria](#success-criteria-3)
  - [Phase 5: The sidebar tree](#phase-5-the-sidebar-tree)
    - [Tasks](#tasks-4)
    - [Success Criteria](#success-criteria-4)
  - [Phase 6: Release 0.5.0 and report back](#phase-6-release-050-and-report-back)
    - [Tasks](#tasks-5)
    - [Success Criteria](#success-criteria-5)
- [Resolved Questions](#resolved-questions)
  - [1. How is the work split into branches and pull requests?](#1-how-is-the-work-split-into-branches-and-pull-requests)
  - [2. When does the release happen?](#2-when-does-the-release-happen)
  - [3. What is the prop for a tone the app supplies (A8)?](#3-what-is-the-prop-for-a-tone-the-app-supplies-a8)
  - [4. Where do the eight category colours start (A8)?](#4-where-do-the-eight-category-colours-start-a8)
  - [5. Which are "the three surfaces" the category colours must pass on?](#5-which-are-the-three-surfaces-the-category-colours-must-pass-on)
  - [6. Which existing parts take --border-strong and --surface-pressed (A9)?](#6-which-existing-parts-take---border-strong-and---surface-pressed-a9)
  - [7. What are the new stylesheet entries called (C1, C2)?](#7-what-are-the-new-stylesheet-entries-called-c1-c2)
  - [8. Are the palette's slots props or parts (A4)?](#8-are-the-palettes-slots-props-or-parts-a4)
  - [9. How many states does ModeToggle have (A5)?](#9-how-many-states-does-modetoggle-have-a5)
  - [10. Does docz get a pre-release to try before 0.5.0?](#10-does-docz-get-a-pre-release-to-try-before-050)
  - [11. How is marked text drawn in a snippet (A3)?](#11-how-is-marked-text-drawn-in-a-snippet-a3)
- [File Changes](#file-changes)
- [Testing Plan](#testing-plan)
- [Dependencies](#dependencies)
- [References](#references)
<!-- markdownlint-restore -->
<!--toc:end-->

<!--docz:objective:start-->
## Objective

Add to the package everything issue #32 decided as **package**, so docz-site
can move onto it without keeping local copies: the sidebar tree of RFC-0003,
eight smaller parts and props, new tokens, and a stylesheet entry an app
can take without the whole package's classes or its fonts. It ships as
0.5.0.

**Implements:** [RFC-0003](../rfc/0003-sidebar-tree-nested-rows-in-the-shell-sidebar-that-open-and.md)
and the decisions on
[issue #32](https://github.com/donaldgifford/design-system/issues/32#issuecomment-7083176221).

<!--docz:objective:end-->

<!--docz:scope:start-->
## Scope

<!--docz:in-scope:start-->
### In Scope

Item letters are issue #32's.

- A1: the sidebar tree, `ShellSidebarTreeItem` and `useTreeOpen` (RFC-0003)
- A2: `Outline` and `useActiveHeading`
- A3: `eyebrow`, `detail` and `render` on `ListRow`; a two-line `Time`; the
  helper that turns `<em>` markers into `<mark>`
- A4: `filters`, `preview` and `footer` on `CommandDialog`
- A5: `SearchTrigger` and `ModeToggle`
- A6: a vertical `Stepper` and its small size
- A7: `Collapsible` and `Disclosure`
- A8: a tone the app supplies on `Badge` and `Dot`; `--category-1` to
  `--category-8`
- A9: `--border-strong` and `--surface-pressed`, used by the package's own
  parts
- B2: a pressed form of `FilterChip`
- B3, C3: README notes on `accent` and on following the system's colour
  scheme
- C1, C2: a stylesheet entry with no `@source` and no fonts, and a fonts
  entry
- Releasing 0.5.0 and reporting back on issue #32

<!--docz:in-scope:end-->

<!--docz:out-of-scope:start-->
### Out of Scope

- docz's own migration. It happens in docz's repository, after this.
- B1: a code surface that stays dark. Decided as intended; docz moves to a
  theme pair.
- A variant for `Superseded`. docz maps it to `ignored`.
- docz's document pane, markdown pipeline, mermaid, widgets, and its type
  and status colours. They stay in docz.
- A top-bar form of `AppSwitcher` (RFC-0002, question 2). Not asked for in
  issue #32.
- Changing what `globals.css` gives an app that already imports it.

<!--docz:out-of-scope:end-->
<!--docz:scope:end-->

## Implementation Phases

Each phase builds on the previous one. A phase is complete when all its tasks
are checked off and its success criteria are met.

All of it lands on this plan's branch, `feat/docz-site-parts`, as one
pull request: the two documents first, then a commit per task or small
group of tasks, with one changeset per phase.

Every new or changed part follows "Adding a component" in the README: a
story beside it, a test under `test/` that renders each form with axe, and
a changeset. Those are listed once per phase, not once per part.

---

<!--docz:phase:start-->
### Phase 1: Tokens and stylesheet entries

The tokens later phases draw with, and the changes that are only CSS and
README. Nothing here changes a component's API.

<!--docz:tasks:start-->
#### Tasks

- [x] Add `--category-1` to `--category-8` to `tokens.css` for both themes,
      starting from docz's `--color-hash-0` to `-7`, converted to oklch
      and adjusted until the contrast tests pass
- [x] Add `--border-strong` and `--surface-pressed` to `tokens.css` for both
      themes
- [x] Map all ten in the `@theme inline` block (`--color-category-1`,
      `--color-border-strong`, ...)
- [x] Use `--border-strong` on the hover border of `Input`, `Textarea`
      and the `Select` trigger, and on the edge of `Popover` and
      `DropdownMenu`
- [x] Use `--surface-pressed` on the pressed state of sidebar rows,
      `OptionItem` and the clickable `ListRow`
- [x] Extend `test/styles/tokens.test.ts`: each category colour is at least
      4.5:1 as text on `--background`, `--card` and `--sidebar`, in both
      themes, both plain and in the tinted badge's mix
- [x] Run `just tokens` and commit the new `tokens.json`
- [x] Split the stylesheet: `src/styles/fonts.css` holds the five
      `@fontsource` imports; `src/styles/core.css` holds Tailwind, the
      animation plugin, the tokens, the `dark` variant, the theme map, the
      badge utilities and the base layer
- [x] `globals.css` becomes three lines: import `fonts.css`, import
      `core.css`, `@source ".."`
- [x] Add `./core.css` and `./fonts.css` to `exports` in `package.json`
- [x] Add a test that builds `globals.css` before and after the split and
      requires the same CSS, apart from the new tokens
      Done as: the two builds were compared once at the split (the same lines, with only the `@font-face` blocks moved), and `test/styles/entries.test.ts` builds both entries on every run.
- [x] README, "Using it": the `core.css` route, with an `@source` line per
      part the app uses and the app's own fonts (C1, C2)
- [x] README: following `prefers-color-scheme`, with the script that sets
      `.dark` before first paint (C3)
- [x] README: a note that `accent` is a hover surface here and the brand
      colour is `primary` (B3)
- [x] Changeset

<!--docz:tasks:end-->

<!--docz:criteria:start-->
#### Success Criteria

- An app that imports `globals.css` gets the CSS it got from 0.4.0 plus
  the new tokens, and nothing else changes for it
- A scratch app that imports `core.css` and points `@source` at two
  components gets no classes for the others and emits no font files
- The contrast tests pass for all eight category colours in both themes
- `just check` passes

<!--docz:criteria:end-->
<!--docz:phase:end-->

---

<!--docz:phase:start-->
### Phase 2: Small parts

Four independent pieces. `Collapsible` comes first because the sidebar
tree in phase 5 opens and closes with it.

<!--docz:tasks:start-->
#### Tasks

- [x] `components/collapsible`: `Collapsible`, `CollapsibleTrigger` and
      `CollapsiblePanel` on Base UI's `Collapsible`, restyled with tokens.
      A closed panel is not in the DOM. (A7)
- [x] `blocks/disclosure`: `Disclosure`, a bordered block over
      `Collapsible` with a `label`, a `value` shown while closed, and
      `open` / `defaultOpen` / `onOpenChange` (A7)
- [x] `Badge`: a `tone` prop that takes a CSS colour and overrides the
      variant's colour. It sets `--tone` and keeps the tinted form's mix. It applies to the tinted
      form only; `fill="filled"` with an app's tone is a type error, since
      the package cannot know a foreground for it. (A8)
- [x] `Dot`: `tone` widens to the five names or any CSS colour (A8)
- [x] `Stepper`: `orientation="vertical"` with a line joining the markers,
      and `size="sm"`, whose marker is a dot with no number. The two props
      are independent. The default stays horizontal and numbered. (A6)
- [x] `FilterChip`: `pressed` and `onPressedChange`. A pressed chip is a
      toggle with `aria-pressed`, labelled by its children, with no
      `key = value` and no editor. It sits in `FilterBar` unchanged. (B2)
- [x] Stories: each new form, and `Badge` and `Dot` on all eight category
      colours in both themes
- [x] Tests with axe for each; keyboard tests for `Collapsible`,
      `Disclosure` and the pressed chip
- [x] Changeset

<!--docz:tasks:end-->

<!--docz:criteria:start-->
#### Success Criteria

- docz's document lifecycle can be drawn with `Stepper` alone in a narrow
  column, and its type filter with `FilterBar` and pressed `FilterChip`s
- A `Badge` and a `Dot` take `var(--category-3)` and any other CSS colour
  with no class override
- Existing `Badge`, `Dot`, `Stepper` and `FilterChip` call sites render as
  they did, in markup and in their tests
- `just check` passes

<!--docz:criteria:end-->
<!--docz:phase:end-->

---

<!--docz:phase:start-->
### Phase 3: Search rows and the outline

What a search result and a long document need.

<!--docz:tasks:start-->
#### Tasks

- [x] `ListRow`: `eyebrow`, a mono line over the title (A3)
- [x] `ListRow`: `detail`, text under the title that wraps to two lines
      and is then cut (A3)
- [x] `ListRow`: `render`, so the title is the app's link stretched over
      the row, as the `onClick` form's button is today. `render` and
      `onClick` together is a type error. (A3)
      Done differently: a union of the two forms collapses Storybook's arg types to `never`, so both stay optional and with `render` the row ignores `onClick`, which a test holds.
- [x] `lib/time`: a `"time"` style for `formatTime`. `Time`:
      `style="stacked"`, the date over the time, still one `<time>` with
      the other zone in its title. (A3)
- [x] `lib/mark`: `markSegments(text)`, which splits a string on literal
      `<em>` and `</em>` into marked and unmarked text. Only those exact
      markers count, an unbalanced closer is ignored, and everything else
      stays text. It never produces HTML. (A3)
- [x] `blocks/marked`: `Marked`, which renders the segments with `<mark>`
      as a tint of `--primary` behind the matched words, in the text's
      own colour and weight (A3)
- [x] `blocks/outline`: `Outline` with `items` (`{ id, text, depth }`),
      `activeId` and `label` (default "On this page"). A `nav` of links to
      `#id` on a hairline, the active one marked on its own segment. (A2)
- [x] `hooks/use-active-heading`: `useActiveHeading(ids)`, the id of the
      heading being read, from an `IntersectionObserver`. Safe to call on
      the server. (A2)
- [x] Stories: a search results list built from `ListRow`, `Marked` and the
      stacked `Time`; an `Outline` beside a long page using the hook
- [x] Tests with axe; `markSegments` against docz's cases (attributes on
      the marker, nested and unbalanced markers, script tags as text);
      `useActiveHeading` with a mocked observer
- [x] Changeset

<!--docz:tasks:end-->

<!--docz:criteria:start-->
#### Success Criteria

- docz's search hit (eyebrow, linked title, marked snippet, date over
  time) is drawn with package parts and no class overrides
- No input to `markSegments` or `Marked` produces an element other than
  `<mark>`
- `lib/mark` and `hooks/use-active-heading` import nothing but React
- Existing `ListRow` and `Time` call sites render as they did
- `just check` passes

<!--docz:criteria:end-->
<!--docz:phase:end-->

---

<!--docz:phase:start-->
### Phase 4: The palette and the top bar

The command palette's three slots, and the two controls `TopBarLayout`
documents and does not ship.

<!--docz:tasks:start-->
#### Tasks

- [x] `CommandFilters` and `CommandFooter`: new parts the app places
      among `CommandDialog`'s children, as it places `CommandInput` and
      `CommandList`. A row of filters under the input, and a row of key
      hints along the foot. (A4)
- [x] `CommandDialog`: a `preview` prop, a pane beside the list (A4)
- [x] `CommandDialog` is wider when it has a preview, and the preview is
      hidden below a breakpoint, where the list takes the full width (A4)
- [x] Arrow keys and Enter still drive the list while focus is in the
      input, with filters and a preview present. Test it. (A4)
- [ ] `shell/search-trigger`: `SearchTrigger`, a button shaped like a
      field, with a `label`, a `shortcut` shown as `Kbd`, and an icon-only
      form below a breakpoint (A5)
- [ ] `shell/mode-toggle`: `ModeToggle`, controlled, with two states:
      `mode` (`light` or `dark`) and `onToggle`. It stores nothing; where
      the mode is kept, and following the system, are the app's. (A5)
- [ ] `TopBarLayout`'s story shows `SearchTrigger`, `TimeZoneToggle` and
      `ModeToggle` in `end`, so the documented slot matches what ships
- [ ] Stories: a palette with none of the slots (repo-guardian's), and one
      with all three (docz's)
- [ ] Tests with axe; the accessible names of both top-bar controls
- [ ] Changeset

<!--docz:tasks:end-->

<!--docz:criteria:start-->
#### Success Criteria

- A `CommandDialog` that uses none of the three renders the markup it
  renders in 0.4.0
- docz's palette (filters, preview, key hints) is drawn on `CommandDialog`
  with no direct use of cmdk for layout
- Every control `TopBarLayout` documents for `end` exists in the package
- `just check` passes

<!--docz:criteria:end-->
<!--docz:phase:end-->

---

<!--docz:phase:start-->
### Phase 5: The sidebar tree

RFC-0003, with its seven questions already answered there. It needs
`Collapsible` from phase 2, and `Dot`'s tone from phase 2 for its stories.

<!--docz:tasks:start-->
#### Tasks

- [ ] `components/sidebar`: a row with both a badge and an action shows
      the badge left of the action. Record the edit in the README's
      local-edits table.
- [ ] `shell/sidebar-tree`: `ShellSidebarTreeItem` in its three forms: a
      leaf link, a link with a separate caret, and a row that toggles
- [ ] The caret: a button with `aria-expanded` and `aria-controls`, named
      from the row's label; `expandable` shows it before there are
      children; `disabled` makes it inert
- [ ] Children in a `Collapsible` panel as a nested list, not in the DOM
      while closed; `open`, `defaultOpen` and `onOpenChange`
- [ ] Depth tracked by the component: each level indents one step on the
      hairline
- [ ] A leaf is one line, cut with an ellipsis, its label as `title`; the
      active leaf colours its 2px segment in `--sidebar-primary` and sets
      `aria-current="page"`
- [ ] On the icon rail: a top-level row shows its `leading` with the label
      as tooltip, and a neutral letter mark when it has none
- [ ] On the icon rail: a top-level row with children opens a `Popover`
      with its subtree fully expanded, under a height cap in a
      `ScrollArea`. Opening it calls the row's `onOpenChange(true)`.
- [ ] `hooks/use-tree-open`: `useTreeOpen(activeKey)`. The active branch is
      open, a manual toggle overrides it, and overrides reset when
      `activeKey` changes.
- [ ] Stories: each form; open, closed, loading, disabled and active;
      depth five; the icon rail; mobile; docz's shape (type rows with
      counts that load on open, and a pages tree)
- [ ] Tests: the three forms, `aria-expanded`, `aria-current`, keyboard
      use, the badge beside the caret, `useTreeOpen`, and axe
- [ ] A test that a flat `ShellSidebarGroup` renders the markup it renders
      in 0.4.0
- [ ] Changeset

<!--docz:tasks:end-->

<!--docz:criteria:start-->
#### Success Criteria

- RFC-0003's success criteria that this repository can meet are met: the
  stories and tests it lists exist and pass
- docz's repository navigation, as drawn in its `candidates.html` § 1, is
  reproduced in a story from package parts alone
- Every link in a tree is reachable by keyboard with the sidebar expanded,
  on the icon rail and on mobile
- repo-guardian's flat navigation is unchanged
- `just check` passes

<!--docz:criteria:end-->
<!--docz:phase:end-->

---

<!--docz:phase:start-->
### Phase 6: Release 0.5.0 and report back

Publish, prove it installs outside this repository, and answer issue #32.

<!--docz:tasks:start-->
#### Tasks

- [ ] Merge the "version packages" pull request; confirm the package and
      the GitHub Release exist
- [ ] Install 0.5.0 from the registry in the scratch consumer (TypeScript
      5.9, `exactOptionalPropertyTypes`): every module typechecks and a
      Vite build succeeds, once through `globals.css` and once through
      `core.css` with `@source` lines
- [ ] Record the scratch app's stylesheet size by each route, to answer
      C1's numbers
- [ ] Publish the Storybook
- [ ] Comment on issue #32 with what landed, item by item, as on issue #11
- [ ] Fix what docz finds when it takes the release, as patch releases
- [ ] Close issue #32 when docz confirms; set this plan to Completed

<!--docz:tasks:end-->

<!--docz:criteria:start-->
#### Success Criteria

- 0.5.0 is on GitHub Packages with every **package** item of issue #32 in
  it, or the tree alone following in the next minor if question 2 allows
- The scratch consumer passes by both stylesheet routes
- Issue #32 has a comment that maps each item to what shipped
- docz reports no item it still has to build around

<!--docz:criteria:end-->
<!--docz:phase:end-->

---

## Resolved Questions

Answered by Donald Gifford on 2026-11-22. In each, **a** was the
recommendation and the other letters the alternatives. The tasks above
already carry the answers.

### 1. How is the work split into branches and pull requests?

- **a.** This branch (`feat/docz-site-parts`) carries RFC-0003 and this
  plan as one docs pull request. Then one branch and pull request per
  phase, each with its changeset. Small reviews, and `main` always passes.
- **b.** Everything on this branch, one pull request at the end.
- **c.** One pull request per issue item (about fourteen).
- **other:**

Answer: **b.** One branch and one pull request.

### 2. When does the release happen?

- **a.** One release. Phases 1 to 5 merge with their changesets and the
  "version packages" pull request is merged once, as 0.5.0. If the tree
  (phase 5) is the only thing left and is not close, release 0.5.0
  without it and ship the tree as 0.6.0, as RFC-0003's rollout allows.
- **b.** A release per phase (0.5.0, 0.6.0, ...), so docz can start on the
  earlier parts sooner.
- **c.** One release, and it waits for the tree however long that takes.
- **other:**

Answer: **a.** With one pull request (question 1), leaving the tree out
means moving phase 5 to its own branch before this one merges.

### 3. What is the prop for a tone the app supplies (A8)?

`Badge` has `variant` and no `tone` prop. `Dot` has `tone`, a union of
five names.

- **a.** `tone` on both, taking a CSS colour. On `Badge` it is new and
  overrides the variant's colour. On `Dot` the type widens to the five
  names or any CSS colour. One name, and it is the one issue #32 used.
- **b.** A separate `color` prop on both, leaving `Dot`'s `tone` a closed
  union. No string can mean two things, at the cost of two props on `Dot`.
- **other:**

Answer: **a.**

### 4. Where do the eight category colours start (A8)?

- **a.** From docz's `--color-hash-0` to `-7`, converted to oklch and
  adjusted until the contrast tests pass. They are already used as text
  colours in a running app.
- **b.** Derived from the package's own hues (blue, green, amber, red)
  plus four new ones, so the set is designed with the palette instead of
  borrowed.
- **other:**

Answer: **a.**

### 5. Which are "the three surfaces" the category colours must pass on?

Issue #32 says 4.5:1 "on the three surfaces" and does not name them.

- **a.** `--background`, `--card` and `--sidebar`: where a type's badge or
  dot actually sits (a page, a card, the navigation).
- **b.** `--background`, `--card` and `--muted`: adds the hover and
  secondary surface, drops the sidebar.
- **c.** All four.
- **other:**

Answer: **a.**

### 6. Which existing parts take `--border-strong` and `--surface-pressed` (A9)?

Using them changes how those parts look in repo-guardian too.

- **a.** `--border-strong` on the hover border of `Input`, `Textarea` and
  the `Select` trigger, and on the edge of `Popover` and `DropdownMenu`.
  `--surface-pressed` on the pressed state of sidebar rows, `OptionItem`
  and the clickable `ListRow`. repo-guardian takes the change, as the
  package's look.
- **b.** Only the parts added in this plan use them. Existing parts keep
  their look.
- **c.** Do not add the tokens. docz maps both to a neighbour, as it does
  for its other five.
- **other:**

Answer: **a.**

### 7. What are the new stylesheet entries called (C1, C2)?

- **a.** `core.css` (tokens, theme map, base layer; no `@source`, no fonts)
  and `fonts.css`. `globals.css` is the two plus `@source`.
- **b.** `theme.css` and `fonts.css`.
- **c.** `globals.css` stays whole, and the new entry is
  `globals-lean.css`, which says what it is relative to the first.
- **other:**

Answer: **a.**

### 8. Are the palette's slots props or parts (A4)?

The input and the list are children of `CommandDialog` today, so a
`filters` prop has no fixed place to render "under the input" unless the
dialog starts owning the layout.

- **a.** `filters` and `footer` are new parts, `CommandFilters` and
  `CommandFooter`, that the app places among the children, as it places
  `CommandInput` and `CommandList`. `preview` is a prop on `CommandDialog`,
  because it changes the dialog's width and splits its body. Nothing
  about an existing palette changes.
- **b.** All three are props, as issue #32 wrote them. `CommandDialog`
  finds the input among its children and renders `filters` after it.
  Simpler to call, and fragile if the children are wrapped.
- **c.** All three are props on a new `CommandPalette` block that renders
  the input and list itself. The cleanest layout, and a second way to
  build a palette.
- **other:**

Answer: **a.**

### 9. How many states does `ModeToggle` have (A5)?

- **a.** Two, `light` and `dark`: `mode` and `onToggle`, as issue #32
  proposed. An app that follows the system resolves it to one of the two
  before passing it. The README's script (C3) covers first paint.
- **b.** Three, with `system`: `mode` and `onModeChange`, cycling or as a
  small menu. The control then shows that the app is following the
  system.
- **c.** Two states, plus a `useMode` hook in the package that stores the
  choice and follows the system, so each app does not write it.
- **other:**

Answer: **a.**

### 10. Does docz get a pre-release to try before 0.5.0?

- **a.** No. docz takes 0.5.0 and anything it finds is a patch release,
  as with repo-guardian and issue #11, where each fix shipped quickly.
- **b.** Yes: a changesets snapshot (`0.5.0-next.N`) published from `main`
  as phases merge, so findings land before the real version.
- **other:**

Answer: **a.**

### 11. How is marked text drawn in a snippet (A3)?

- **a.** A tint of `--primary` behind the matched words, in the text's own
  colour and weight. It reads as a highlight in both themes and does not
  depend on colour alone.
- **b.** No background; the matched words in `--primary` and medium
  weight, which is docz's look today.
- **c.** No background; medium weight in `--foreground` only.
- **other:**

Answer: **a.**

---

<!--docz:file-changes:start-->
## File Changes

Each new part also gets `<name>.stories.tsx` beside it and a test under
`test/`. Paths are under `src/` unless they start elsewhere.

| File | Action | Description |
| ---- | ------ | ----------- |
| `styles/tokens.css` | Modify | Category colours, `--border-strong`, `--surface-pressed` |
| `styles/core.css` | Create | The stylesheet with no `@source` and no fonts |
| `styles/fonts.css` | Create | The five font imports |
| `styles/globals.css` | Modify | Becomes the two entries plus `@source` |
| `tokens.json` | Modify | Regenerated |
| `package.json` | Modify | `exports` for the two new stylesheets |
| `README.md` | Modify | The `core.css` route, system colour scheme, `accent`, local edits |
| `components/ui/collapsible.tsx` | Create | `Collapsible` on Base UI |
| `components/ui/badge.tsx` | Modify | A tone from the app |
| `components/ui/command.tsx` | Modify | Filters, preview and footer |
| `components/ui/sidebar.tsx` | Modify | Badge left of an action |
| `components/blocks/disclosure.tsx` | Create | `Disclosure` |
| `components/blocks/stepper.tsx` | Modify | `orientation`, `size` |
| `components/blocks/filter-chip.tsx` | Modify | The pressed form |
| `components/blocks/list-row.tsx` | Modify | `eyebrow`, `detail`, `render`; `Dot`'s tone |
| `components/blocks/time.tsx` | Modify | `style="stacked"` |
| `components/blocks/marked.tsx` | Create | `Marked` |
| `components/blocks/outline.tsx` | Create | `Outline` |
| `components/shell/search-trigger.tsx` | Create | `SearchTrigger` |
| `components/shell/mode-toggle.tsx` | Create | `ModeToggle` |
| `components/shell/sidebar-tree.tsx` | Create | `ShellSidebarTreeItem` |
| `lib/mark.ts` | Create | `markSegments` |
| `lib/time.ts` | Modify | A `"time"` style |
| `hooks/use-active-heading.ts` | Create | The scroll spy |
| `hooks/use-tree-open.ts` | Create | Which branches are open |
| `test/styles/tokens.test.ts` | Modify | Contrast for the category colours |
| `.changeset/*.md` | Create | One per phase |

<!--docz:file-changes:end-->

<!--docz:testing:start-->
## Testing Plan

- [ ] Every new part and every new form of an existing part renders under
      axe in `test/components`
- [ ] Keyboard tests for `Collapsible`, `Disclosure`, the pressed
      `FilterChip`, the palette with filters, and the sidebar tree
- [ ] Unit tests for `markSegments`, the `"time"` style, `useActiveHeading`
      and `useTreeOpen`
- [ ] Contrast tests for the eight category colours on three surfaces in
      both themes
- [ ] "Unchanged" tests where an existing part gained props: a call with
      none of the new props renders the markup it rendered in 0.4.0
- [ ] `test/bundle.test.ts` still passes: nothing new imports zod or a
      schema module
- [ ] `test/stories.test.ts` and `test/discipline.test.ts` pass with the
      new files
- [ ] The scratch consumer builds from the registry by both stylesheet
      routes

<!--docz:testing:end-->

<!--docz:dependencies:start-->
## Dependencies

- `@base-ui/react` 1.9.0, already a dependency, for `Collapsible`. Confirm
  the import path at the start of phase 2.
- No new runtime dependency is expected. `IntersectionObserver` is the
  browser's.
- Phase 5 needs phase 2 (`Collapsible`, `Dot`'s tone). Phases 3 and 4 need
  only phase 1. Phase 6 needs all of them, subject to question 2.
- docz taking the release is outside this repository and is what closes
  issue #32.

<!--docz:dependencies:end-->

<!--docz:references:start-->
## References

- [Issue #32](https://github.com/donaldgifford/design-system/issues/32):
  docz's gap list, and the
  [decisions](https://github.com/donaldgifford/design-system/issues/32#issuecomment-7083176221)
  this plan implements.
- [RFC-0003](../rfc/0003-sidebar-tree-nested-rows-in-the-shell-sidebar-that-open-and.md):
  the sidebar tree.
- [RFC-0001](../rfc/0001-shared-design-system-and-component-library-for-repo-guardian.md):
  the package and how a component gets in.
- [IMPL-0001](0001-first-release-of-the-design-system.md): the first
  release; its phase 6 is docz's adoption, which this plan unblocks.
- [Issue #11](https://github.com/donaldgifford/design-system/issues/11):
  repo-guardian's list, and the form the report in phase 6 follows.
- docz's sketches, `ui/design/candidates.html` and `ui/design/mockup.html`
  in <https://github.com/donaldgifford/docz>.

<!--docz:references:end-->
