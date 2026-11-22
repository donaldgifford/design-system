---
id: RFC-0003
title: "Sidebar tree: nested rows in the shell sidebar that open and close"
status: Accepted
author: Donald Gifford
created: 2026-11-22
---

<!-- markdownlint-disable-file MD025 MD041 -->

# RFC-0003: Sidebar tree: nested rows in the shell sidebar that open and close

<!--toc:start-->
<!-- markdownlint-capture -->
<!-- markdownlint-disable MD013 -->
- [Summary](#summary)
- [Problem Statement](#problem-statement)
  - [Supporting Data](#supporting-data)
- [Proposed Solution](#proposed-solution)
  - [The component](#the-component)
  - [How it looks](#how-it-looks)
  - [Semantics and keys](#semantics-and-keys)
  - [On the icon rail and on mobile](#on-the-icon-rail-and-on-mobile)
  - [What it is not](#what-it-is-not)
  - [Rollout](#rollout)
  - [Resolved questions](#resolved-questions)
- [Alternatives Considered](#alternatives-considered)
  - [docz keeps its own tree](#docz-keeps-its-own-tree)
  - [Compose it from the primitives, with no shell part](#compose-it-from-the-primitives-with-no-shell-part)
  - [A real tree widget (role="tree")](#a-real-tree-widget-roletree)
  - [The whole row toggles, and the branch's page is its first child](#the-whole-row-toggles-and-the-branchs-page-is-its-first-child)
  - [An items array instead of children](#an-items-array-instead-of-children)
- [Risks and Mitigations](#risks-and-mitigations)
- [Success Criteria](#success-criteria)
- [References](#references)
<!-- markdownlint-restore -->
<!--toc:end-->

<!--docz:summary:start-->
## Summary

Add a sidebar tree to the shell: `ShellSidebarTreeItem`, a nav row that can
hold more rows, to any depth, and opens and closes. A row that is a link
gets a separate caret button, so following the link and looking inside are
two actions. It is built on the package's sidebar parts and the
`Collapsible` that issue #32 (A7) adds, and it is the first thing docz's
move to the package needs from the shell.

<!--docz:summary:end-->

<!--docz:problem:start-->
## Problem Statement

The shell's sidebar is a flat list. `ShellSidebarGroup` holds
`SidebarMenuItem`s, and the one nested part, `SidebarMenuSub`, is a single
level that is always open and has no way to close.

docz's navigation for a repository is a tree. It has one row per document
type with a count, each opening the list of that type's documents, and a
pages tree as deep as the repository's folders. A type row is a link to
the type's page, so its caret has to be its own button: the link
navigates and the caret only peeks. docz cannot draw this with the
package's parts, so it would keep 480 lines of its own navigation, styled
its own way, inside a shell that is otherwise the package's. That is the
drift the package exists to remove.

It is not only docz's shape. Any app whose navigation follows its data
(folders, an org's repositories, a control's rules) needs the same row.

### Supporting Data

- `SidebarMenuSub` (`components/ui/sidebar.tsx`) is a `ul` with a left
  border. It has no open state, and on the icon rail it is hidden
  (`group-data-[collapsible=icon]:hidden`), so its links cannot be reached
  there at all.
- The package has no `Collapsible`. Issue #32 decided A7 as **package**:
  `components/collapsible` on Base UI's `Collapsible`. This RFC builds on
  it.
- `SidebarMenuAction` and `SidebarMenuBadge` both sit at `right-1` of the
  row. A row with a count and a caret, which is every docz type row,
  draws one over the other today.
- docz's tree is `repo-nav.tsx`, `repo-nav-pages.tsx` and `nav-rail.ts`,
  482 lines. It holds the same open-state logic twice (the route's branch
  opens by itself, a manual toggle overrides it, and the overrides reset
  on navigation), once for types and once for pages.
- What docz's tree does today, and the new part has to carry:
  - a link row with a caret that is a separate button with
    `aria-expanded`;
  - a row that is not a link (a folder nothing is published at), where
    the whole row toggles;
  - children fetched when a row first opens, with a loading line until
    they arrive;
  - a disabled caret on a row with nothing in it (a type with a count of
    zero);
  - long leaf labels (`DESIGN-0026 · The shell in repo-guardian's look`)
    cut with an ellipsis, the full text in `title`.
- docz's sketch (`ui/design/candidates.html` § 1) draws these states on
  this package's tokens.

<!--docz:problem:end-->

<!--docz:proposal:start-->
## Proposed Solution

### The component

`shell/sidebar-tree` exports `ShellSidebarTreeItem`, used inside a
`ShellSidebarGroup` and inside itself:

```tsx
interface ShellSidebarTreeItemProps {
  label: string;
  /** Before the label: an icon, a `Dot`, or a mark. */
  leading?: ReactNode | undefined;
  /** After the label: a count or a short mono hint. */
  badge?: ReactNode | undefined;
  /** The current page. Sets `aria-current="page"` on the link. */
  active?: boolean | undefined;
  /** The app's link. Left out, a row with children is a button that toggles. */
  render?: ReactElement | undefined;
  /** Shows a caret before there are children, for a row that loads them. */
  expandable?: boolean | undefined;
  /** A caret that cannot open: a row known to be empty. */
  disabled?: boolean | undefined;
  open?: boolean | undefined;
  defaultOpen?: boolean | undefined;
  onOpenChange?: ((open: boolean) => void) | undefined;
  /** More `ShellSidebarTreeItem`s. None, and the row is a leaf. */
  children?: ReactNode | undefined;
}

<ShellSidebarGroup label="Documents">
  <ShellSidebarTreeItem
    label="design"
    leading={<Dot tone={typeColor("design")} />}
    badge={27}
    render={<NavLink to="/o/r/design" />}
    active={onTypePage}
    open={open}
    onOpenChange={setOpen}
    expandable
  >
    {docs?.map((d) => (
      <ShellSidebarTreeItem key={d.id} label={d.title} render={<NavLink to={d.to} />} />
    )) ?? <InlineLoading />}
  </ShellSidebarTreeItem>
</ShellSidebarGroup>
```

A row has one of three forms, decided by its props:

| `render` | children or `expandable` | The row is |
| -------- | ------------------------ | ---------- |
| yes | no | a link (a leaf) |
| yes | yes | a link, and a caret button after it that only toggles |
| no | yes | one button; the whole row toggles |

- The caret is a `button` with `aria-expanded` and `aria-controls`, named
  from the row ("design, show contents"). It is the last thing in the row.
  With a caret present the badge moves left of it, which fixes the
  overlap in Supporting Data.
- Children render in a `Collapsible` panel as a nested list. Closed, they
  are not in the DOM, so a tree of a thousand documents costs what is
  open.
- Open state is controlled (`open`, `onOpenChange`) or the row's own
  (`defaultOpen`). An app that loads children on open uses the controlled
  form and passes `InlineLoading` as the child until they arrive.

### How it looks

The look is the package's, not docz's current one.

- A top-level row is a `SidebarMenuButton`: same height, hover and active
  fill as every other sidebar row.
- A nested list hangs on the hairline `SidebarMenuSub` already draws.
  Each level indents by one step; the indent comes from a depth the
  component tracks, not from the app.
- A leaf is a `SidebarMenuSubButton`: one line, cut with an ellipsis, the
  full label as its `title`.
- The active leaf colours its own 2px segment of the hairline in
  `--sidebar-primary`, as well as taking the active fill. In a list of
  thirty muted siblings the fill alone is easy to miss; docz found the
  same.
- The caret is a chevron that turns a quarter when open, under the
  reduced-motion rule `globals.css` already ships.

### Semantics and keys

Nested lists inside the sidebar's `nav`, with disclosure buttons. Not
`role="tree"`.

- Tab reaches every link and caret in order. Enter follows a link. Enter
  or Space on a caret toggles it.
- A link row and its caret are two tab stops. That is the cost of two
  actions on one row, and it is what a screen reader user needs to tell
  them apart.

### On the icon rail and on mobile

- On the collapsed rail a top-level row shows its `leading` alone, with
  the label as the tooltip. A top-level row with no `leading` gets a
  neutral mark with the label's first letter, as `AppSwitcher` gives an
  app with no icon.
- A top-level row with children opens a `Popover` beside the rail holding
  the same subtree, fully expanded, so every link stays reachable. If the
  row is a link, the popover's heading is that link.
- Nested rows never appear on the rail themselves.
- On mobile the sidebar is already a sheet at full width, so the tree
  renders as it does expanded.

### What it is not

- Not a file explorer: no selection, no drag and drop, no rename, no
  multi-select.
- Not virtualised. A closed branch renders nothing, and an app with ten
  thousand open siblings should page them.
- Not a data API. The tree is composed from JSX, so the app keeps its
  own data shape, loading and prefetching. There is no `items` prop.
- It does not decide what is open. See question 1.

### Rollout

1. `components/collapsible` lands (issue #32 A7).
2. `ShellSidebarTreeItem` lands in `shell/sidebar-tree` with stories for
   each form and state, and tests. Targeted at 0.5.0; if it is not ready
   it follows in the next minor and does not hold the rest of 0.5.0.
3. docz builds its repository navigation on it during its migration and
   deletes `repo-nav.tsx`, `repo-nav-pages.tsx` and `nav-rail.ts`.

### Resolved questions

Answered by Donald Gifford on 2026-11-22.

| # | Question | Answer |
| - | -------- | -------- |
| 1 | Who opens the branch that holds the current page? | **The app**, through `open`. Only the app knows its routes, and with children loaded on open the package cannot see what a closed branch holds. The package ships a small hook, `useTreeOpen(activeKey)`, that holds the rule docz wrote twice: the active branch is open, a manual toggle overrides it, overrides reset when `activeKey` changes. |
| 2 | One component or two (`ShellSidebarTreeItem` for branches, a separate leaf)? | **One.** A leaf is a row with no children. Two names would make the app pick the component from its data. |
| 3 | `leading` as a node, or `icon` plus `mark` props as issue #32 sketched? | **`leading`**, one slot, matching `ListRow`. docz passes a `Dot`, another app an icon. |
| 4 | Does the active leaf's 2px segment take a tone from the app? | **No, `--sidebar-primary` only.** A tone per document type in the nav is docz's old look. The type's colour is already on the row's `Dot`. |
| 5 | Is a closed branch kept in the DOM? | **No.** Unmounted when closed. Find-in-page does not reach closed branches, which is also true of docz today. |
| 6 | On the rail, is the popover's subtree fully expanded or does it keep carets? | **Fully expanded**, scrolling past a height cap. A popover with its own open state is a second tree to keep in step. Opening the popover calls the row's `onOpenChange(true)`, so a branch that loads on open loads then. |
| 7 | Is the name `ShellSidebarTreeItem`? | **Yes.** Issue #32 said `ShellSidebarTree`, but there is no wrapper to carry that name: rows go straight into `ShellSidebarGroup`. |

<!--docz:proposal:end-->

<!--docz:alternatives:start-->
## Alternatives Considered

### docz keeps its own tree

No package work. docz's navigation then has its own row heights, hover,
active state and caret inside the package's sidebar, and the next app
with nested navigation writes a third. Issue #32 decided A1 as
**package** for this reason.

### Compose it from the primitives, with no shell part

Export `Collapsible` and let each app nest `SidebarMenuSub` itself. The
primitives cannot do it as they are: `SidebarMenuSub` has no depth, the
badge and the action overlap, and nothing handles the icon rail. Every
app would write the same hundred lines of glue, differently.

### A real tree widget (`role="tree"`)

Arrow keys move between rows, Left and Right close and open, and the
tree is one tab stop. It suits a file explorer. It is the wrong pattern
for site navigation: a `treeitem` cannot cleanly hold both a link and a
separate toggle, screen readers switch into a mode where links stop
behaving as links, and the roving focus is a lot of code to get right.
Nested lists with disclosure buttons are what the WAI-ARIA practices
give for navigation.

### The whole row toggles, and the branch's page is its first child

The simpler, common pattern: a branch is only a button, and "design"
overview is a leaf inside it. One tab stop per row and no separate
caret. docz's type row is a link to a page with its own content, and
reaching it should not take opening a drawer first. The proposal keeps
this form for rows with no `render`.

### An `items` array instead of children

`<ShellSidebarTree items={tree} />` with a fixed node shape. It reads
well for static data. It fits badly with children that load on open,
with per-row prefetching on hover, and with the app's own link
component, each of which would become another field on the node. JSX
children already express all three.

<!--docz:alternatives:end-->

<!--docz:risks:start-->
## Risks and Mitigations

| Risk | Impact | Likelihood | Mitigation |
| ---- | ------ | ---------- | ---------- |
| The API is shaped by one consumer | A second app needs a breaking change | Medium | The three forms cover a link, a link with a caret and a plain toggle; repo-guardian's flat nav is checked as the degenerate case before release |
| Deep nesting runs out of width | Labels are cut to a few letters at depth four or five | Medium | A small indent step, ellipsis with `title`, and a story at depth five to judge it |
| The rail popover is long or deep | A popover taller than the screen | Medium | A height cap with the package's `ScrollArea` |
| Two tab stops per branch | A long tree is slow to tab through | Low | Closed branches render nothing, and the palette is the fast path to a document |
| The caret and the link are confused by assistive tech | A user toggles when they meant to navigate | Low | Distinct accessible names, `aria-expanded` only on the caret, an axe check and a keyboard test per form |
| A1 holds up 0.5.0 | docz waits on everything for one part | Medium | Rollout step 2: the tree may follow in the next minor |

<!--docz:risks:end-->

<!--docz:criteria:start-->
## Success Criteria

- `ShellSidebarTreeItem` is in a release with stories for each form
  (leaf, link with caret, toggle row), each state (open, closed, loading,
  disabled, active), depth five, the icon rail and mobile.
- Tests cover the three forms, `aria-expanded` and `aria-current`,
  keyboard use, the badge beside the caret, and axe.
- docz draws its repository navigation, type drawers and pages tree,
  with it, and `repo-nav.tsx`, `repo-nav-pages.tsx` and `nav-rail.ts` are
  deleted.
- docz's open-state logic exists once, in `useTreeOpen`, not twice in
  docz.
- An existing flat `ShellSidebarGroup` is unchanged, in markup and in
  the visual baseline.

<!--docz:criteria:end-->

<!--docz:references:start-->
## References

- [Issue #32](https://github.com/donaldgifford/design-system/issues/32):
  docz's gap list against v0.3.2. A1 is this RFC; A7 is the
  `Collapsible` it builds on.
- [RFC-0001](0001-shared-design-system-and-component-library-for-repo-guardian.md):
  the package, its layers and how a component gets in.
- [RFC-0002](0002-app-switcher-a-shell-part-listing-a-deployments-apps-as-plain.md):
  the app switcher, the last shell part added this way.
- docz INV-0036, the migration this serves:
  <https://github.com/donaldgifford/docz/blob/main/docs/investigation/0036-docz-site-on-the-shared-design-system-or-docz-as-a-backend-of.md>
- docz's tree today (`ui/src/components/repo-nav.tsx`,
  `repo-nav-pages.tsx`, `nav-rail.ts`) and its sketch
  (`ui/design/candidates.html` § 1) in
  <https://github.com/donaldgifford/docz>.
- WAI-ARIA Authoring Practices, disclosure navigation:
  <https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/>
- shadcn sidebar-07, the collapsible sidebar the shell follows:
  <https://ui.shadcn.com/blocks/sidebar#sidebar-07>

<!--docz:references:end-->
