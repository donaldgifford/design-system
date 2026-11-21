---
id: RFC-0001
title: "Shared design system and component library for repo-guardian and docz"
status: Accepted
author: Donald Gifford
created: 2026-11-15
---

<!-- markdownlint-disable-file MD025 MD041 -->

# RFC-0001: Shared design system and component library for repo-guardian and docz

<!--toc:start-->
<!-- markdownlint-capture -->
<!-- markdownlint-disable MD013 -->
- [Summary](#summary)
- [Problem Statement](#problem-statement)
  - [Supporting Data](#supporting-data)
- [Proposed Solution](#proposed-solution)
  - [Package shape](#package-shape)
  - [Layers](#layers)
  - [One look, two modes](#one-look-two-modes)
  - [What stays in the apps](#what-stays-in-the-apps)
  - [First release](#first-release)
  - [Adoption](#adoption)
  - [How a component gets in](#how-a-component-gets-in)
  - [Decisions recorded separately](#decisions-recorded-separately)
  - [Open questions](#open-questions)
- [Alternatives Considered](#alternatives-considered)
  - [Start from an empty repo](#start-from-an-empty-repo)
  - [Revive the old design system](#revive-the-old-design-system)
  - [Distribute as a shadcn registry (apps copy files in)](#distribute-as-a-shadcn-registry-apps-copy-files-in)
  - [Two packages, tokens and components](#two-packages-tokens-and-components)
  - [Ship a compiled build](#ship-a-compiled-build)
  - [Keep copying between apps](#keep-copying-between-apps)
- [Risks and Mitigations](#risks-and-mitigations)
- [Success Criteria](#success-criteria)
- [References](#references)
<!-- markdownlint-restore -->
<!--toc:end-->

<!--docz:summary:start-->
## Summary

Make this repo the one place the design lives. It publishes a single
package, `@donaldgifford/design-system`, containing the design tokens as
plain CSS and a React component library built on them. repo-guardian and
docz install it and delete their own copies. The first code is an import of
an existing internal implementation of the same look; the first release adds
what repo-guardian needs on top of it.

<!--docz:summary:end-->

<!--docz:problem:start-->
## Problem Statement

repo-guardian and docz are meant to look the same and do, roughly, but
neither shares code with the other. Each keeps its own tokens, its own
primitives and its own app shell. A change to the design has to be made
once per app by hand, and the copies drift between changes.

An earlier attempt at a shared design system stalled at five components and
its only consumer removed it. [INV-0001](../investigation/0001-consolidate-duplicated-design-tokens-and-ui-components-into-a.md)
covers what exists today and why that attempt stopped.

### Supporting Data

From INV-0001:

- docz's shell stylesheet states that its tokens are repo-guardian's,
  "copied in rather than imported". The dark values are stored three times
  inside docz alone.
- The copies have drifted. The danger color has three different values
  across repo-guardian and docz; most other colors differ by one or two hex
  steps.
- Three different names exist for the same token roles (`panel`,
  `bg-raised`, `card`).
- About twenty components exist in more than one codebase, on three
  different foundations: Radix, hand-rolled, and Base UI.
- Neither app has spacing or type-scale tokens. Both use arbitrary pixel
  values.

<!--docz:problem:end-->

<!--docz:proposal:start-->
## Proposed Solution

### Package shape

One package, shipped as TypeScript and CSS source with no build step.
Consumers compile it with their own Tailwind v4 by pointing `@source` at the
package.

| Export | Contents |
| ------ | -------- |
| `./tokens.css` | Every token as a CSS custom property. Imports nothing, so it works on a plain HTML page |
| `./tokens.json` | The same tokens in DTCG format, generated from the CSS |
| `./globals.css` | The Tailwind v4 theme mapped onto the tokens, plus base styles |
| `./components/*` | Primitives: button, badge, dialog, tabs and so on |
| `./blocks/*` | Composites built from primitives: KPI tile, data table, page header, charts |
| `./shell/*` | Presentational app chrome: top bar, sidebar, detail sheet |
| `./lib/*`, `./hooks/*` | Shared helpers |

There is no barrel file. Each component is imported by its own path.

### Layers

Tokens, primitives, blocks, shell. Each layer may import only from the
layers before it. Nothing in the package imports app code, fetches data or
knows about routing; the shell parts take their content through props.

### One look, two modes

The look is repo-guardian's v2 UI in a light and a dark mode. There is no
mechanism for additional looks. If a second look is ever needed, that is a
new RFC.

### What stays in the apps

- Anything about one app's domain: repo-guardian's finding filters and
  compliance badges, docz's review UI.
- docz's document themes (`paper`, `classic`). They control how a document
  reads, not how the app looks.
- Mapping from an app's states to the generic status colors.

### First release

The first release is the point at which both apps can install the package
and delete their copies.

1. **Import** the starting implementation: tokens, primitives, blocks, shell
   parts, stories and tests.
2. **Backport from repo-guardian** what it has and the import lacks: the
   chart set and chart card, filter chip, group grid, threshold meter,
   responsive data-table columns, inline detail panel, time display with a
   zone toggle, CSV export and "load more". Each is rebuilt on the package's
   primitives and tokens.
3. **Meet docz's needs**: `tokens.css` usable with no build step, and a
   light mode that passes docz's contrast tests.

[IMPL-0001](../impl/0001-first-release-of-the-design-system.md) breaks this
into phases.

### Adoption

repo-guardian first, then docz. Each adoption is a pull request in that
repo that installs the package and removes the local copies.

### How a component gets in

- It is already used by a running app, or an app being built on the
  package needs it and it is generic. Such a component is drafted and
  seen working in that app first; nothing is built from a mockup alone
  (amended 2026-11-21, boop INV-0005 OQ7).
- It is needed for an app to delete a local copy, or to not start one.
- It is not named after, or shaped around, one app's domain.

There is no waiting period and no promotion ceremony.

### Decisions recorded separately

| Decision | Record |
| -------- | ------ |
| Release tooling and registry | [ADR-0001](../adr/0001-release-with-changesets-to-github-packages.md) |
| Component catalog | [ADR-0002](../adr/0002-use-storybook-as-the-only-component-catalog.md) |
| Component foundation | [ADR-0003](../adr/0003-build-components-on-tailwind-v4-shadcn-and-base-ui.md) |
| Token format and names | [ADR-0004](../adr/0004-author-tokens-as-css-in-oklch-with-shadcn-semantic-names.md) |

### Open questions

1. How docz's Go HTML export picks up `tokens.css`. That it uses the
   package's `tokens.css` is decided; the mechanism is not designed yet. The
   export embeds CSS files at build time, so the file has to be copied or
   generated into the Go tree from the installed package. Designed in
   [IMPL-0001](../impl/0001-first-release-of-the-design-system.md) phase 6.
2. ~~Where the Storybook is hosted.~~ Resolved: GitHub Pages, deployed from
   `main` at <https://donaldgifford.github.io/design-system/>.
3. What 1.0 means. Proposed: both apps have adopted the package and gone one
   release cycle without a breaking change.

<!--docz:proposal:end-->

<!--docz:alternatives:start-->
## Alternatives Considered

### Start from an empty repo

An implementation of this look already exists with tests and stories. Rebuilding it would repeat finished work.

### Revive the old design system

It banned Tailwind, was shaped around one site's mockup, and had five components. Every app has since moved to Tailwind v4.

### Distribute as a shadcn registry (apps copy files in)

Copying is how the apps drifted in the first place. A registry can be added later for people who want to fork a component.

### Two packages, tokens and components

Subpath exports give the same separation with one version and one release. Split later if a consumer needs it.

### Ship a compiled build

Adds a build pipeline and a second copy of every class. All consumers already run Tailwind v4.

### Keep copying between apps

The current state, with the drift described above.

<!--docz:alternatives:end-->

<!--docz:risks:start-->
## Risks and Mitigations

| Risk | Impact | Likelihood | Mitigation |
| ---- | ------ | ---------- | ---------- |
| The effort stalls like the previous one | High | Medium | Start from working code; scope the first release to what two real consumers need; keep process to this RFC, four ADRs and one plan |
| The import carries assumptions from the app it came from | Medium | Medium | Remove app-specific blocks during import; the layer rule forbids app imports; repo-guardian's adoption is the test |
| repo-guardian's move from Radix to Base UI changes behavior | Medium | Medium | Adopt one component group at a time; its existing e2e, accessibility and visual tests gate each step |
| docz's Go export cannot consume the package cleanly | Medium | Low | `tokens.css` has no imports, so the fallback is copying one file at build time |
| A consumer is on a different Tailwind major | Medium | Low | Tailwind is a peer dependency pinned to v4; a v5 move is coordinated as a major release |
| Installing from GitHub Packages needs a token | Low | High | Documented in the README; CI uses the built-in token |
| The package is published empty | Low | Low | `private` stays set in `package.json` until the first release is ready |

<!--docz:risks:end-->

<!--docz:criteria:start-->
## Success Criteria

- repo-guardian has no local `components/ui` directory and no token
  definitions of its own.
- docz's shell stylesheet and its duplicated dark token block are gone, and
  its `charcoal` theme is derived from `tokens.css`.
- A color change is one pull request in this repo plus a version bump in
  each app.
- Both apps install the package in CI.
- Every component in the package has a Storybook story and passes its
  accessibility test.

<!--docz:criteria:end-->

<!--docz:references:start-->
## References

- [INV-0001](../investigation/0001-consolidate-duplicated-design-tokens-and-ui-components-into-a.md)
- [IMPL-0001](../impl/0001-first-release-of-the-design-system.md)
- [repo-guardian](https://github.com/donaldgifford/repo-guardian)
- [docz](https://github.com/donaldgifford/docz)
- [Tailwind CSS v4 `@source`](https://tailwindcss.com/docs/detecting-classes-in-source-files)

<!--docz:references:end-->
