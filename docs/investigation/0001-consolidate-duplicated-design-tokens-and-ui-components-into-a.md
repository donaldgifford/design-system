---
id: INV-0001
title: "Consolidate duplicated design tokens and UI components into a shared design system"
status: Concluded
author: Donald Gifford
created: 2026-11-14
---

<!-- markdownlint-disable-file MD025 MD041 -->

# INV-0001: Consolidate duplicated design tokens and UI components into a shared design system

<!--toc:start-->
<!-- markdownlint-capture -->
<!-- markdownlint-disable MD013 -->
- [Question](#question)
- [Hypothesis](#hypothesis)
- [Context](#context)
- [Approach](#approach)
- [Environment](#environment)
- [Findings](#findings)
  - [1. There is one current look, and it has been typed out more than once](#1-there-is-one-current-look-and-it-has-been-typed-out-more-than-once)
  - [2. The stacks have converged; the differences left are few and specific](#2-the-stacks-have-converged-the-differences-left-are-few-and-specific)
  - [3. Component overlap is high for primitives and page furniture](#3-component-overlap-is-high-for-primitives-and-page-furniture)
  - [4. The starting implementation covers most of the library, and repo-guardian covers the gaps](#4-the-starting-implementation-covers-most-of-the-library-and-repo-guardian-covers-the-gaps)
  - [5. The earlier attempts stopped for reasons that can be avoided](#5-the-earlier-attempts-stopped-for-reasons-that-can-be-avoided)
  - [6. docz needs the tokens outside React](#6-docz-needs-the-tokens-outside-react)
  - [7. Most of the uncommitted scaffold in this repo does not fit](#7-most-of-the-uncommitted-scaffold-in-this-repo-does-not-fit)
  - [8. Going public changes the registry and the license](#8-going-public-changes-the-registry-and-the-license)
- [Conclusion](#conclusion)
- [Recommendation](#recommendation)
  - [What to build](#what-to-build)
  - [First release](#first-release)
  - [Decisions to settle in the RFC](#decisions-to-settle-in-the-rfc)
  - [Order of adoption](#order-of-adoption)
  - [Guardrails, taken from what stopped the earlier attempts](#guardrails-taken-from-what-stopped-the-earlier-attempts)
  - [Next steps](#next-steps)
- [References](#references)
<!-- markdownlint-restore -->
<!--toc:end-->

<!--docz:question:start-->
## Question

Several codebases carry their own copy of what is meant to be one design.
Before any code or design doc is written for this repo:

1. How much of the design (tokens, themes) and the component set is actually
   the same across them, and where do they differ?
2. Is there an existing implementation complete enough to seed a shared
   library, or does this repo start from a blank page?
3. What shape should this repo take so that repo-guardian and docz can
   consume it first, and other apps after them?

<!--docz:question:end-->

<!--docz:hypothesis:start-->
## Hypothesis

The apps share a visual language but not code: each one re-typed the same
palette, fonts and primitives. An existing implementation is probably far
enough along to be lifted into this repo, which would make the work a
move-and-publish job more than a design job.

<!--docz:hypothesis:end-->

<!--docz:context:start-->
## Context

This repo was scaffolded to be two things: a **design system** (tokens,
themes, rules) and a **component library** that apps install instead of
copying. It replaces an earlier private attempt, referred to here as the old
design system. The difference this time is that the repo is public.

**Triggered by:** the decision to create this repo. No parent document yet;
this investigation is the input to the first RFC.

What was looked at:

| Source                                                                  | State                             | Weight                                                                                               |
| ----------------------------------------------------------------------- | --------------------------------- | ---------------------------------------------------------------------------------------------------- |
| [repo-guardian](https://github.com/donaldgifford/repo-guardian) (`ui/`) | in use                            | high: origin of the current look, first consumer                                                     |
| [docz](https://github.com/donaldgifford/docz) (`ui/`, `pkg/theme/`)     | in use                            | high: second consumer                                                                                |
| The starting implementation                                             | in use                            | high: an existing internal implementation of the same look, to be imported as this repo's first code |
| The old design system (v0.4.0)                                          | abandoned, last commit 2026-05-15 | reference only                                                                                       |
| rfc-site                                                                | idle since 2026-05-28             | reference only                                                                                       |

Other internal codebases were read for background. They are not described
in this document.

<!--docz:context:end-->

<!--docz:approach:start-->
## Approach

1. Clone the four GitHub repos at their default branch head; read the two
   local repos in place. Nothing was built or run, so every claim below is
   from reading source and docs.
2. For each repo record: stack, where tokens live and their literal values,
   theme mechanism, every reusable component, the app shell, and any design
   docs that state intent.
3. Line the six inventories up against each other to find what is the same,
   what differs by accident, and what differs on purpose.
4. Read the earlier attempts' docs and changelogs for why they stopped.
5. Check the uncommitted scaffold in this repo against what a published
   token and component package needs.

<!--docz:approach:end-->

<!--docz:environment:start-->
## Environment

| Component             | Version / Value                         |
| --------------------- | --------------------------------------- |
| repo-guardian         | `fe48e6c` (2026-10-28)                  |
| docz                  | `0aa53f1` (2026-11-05)                  |
| The old design system | v0.4.0, last commit 2026-05-15          |
| rfc-site              | `e1228ea` (2026-05-28)                  |
| This repo             | `ad580e6` plus the uncommitted scaffold |
| Date of investigation | 2026-11-14                              |

<!--docz:environment:end-->

<!--docz:findings:start-->
## Findings

### 1. There is one current look, and it has been typed out more than once

The look the in-use apps share is repo-guardian's "v2" UI: graphite
surfaces, a sky-blue accent, IBM Plex Sans with JetBrains Mono, 3px corners,
a 14px body, a 40px top bar and a compact density. It was designed in
repo-guardian and then copied outward:

- **docz** copied it for its app chrome. The header of
  `ui/src/theme/shell.css` says so directly: "These are repo-guardian's
  tokens, copied in rather than imported". Its `charcoal` document theme
  is the same palette a second time, and the dark values are repeated a third
  time in `ui/src/theme/tokens.css` because Tailwind needs literal values (a
  test holds the copies equal).
- **The starting implementation** is the same look again, with the colors
  converted to oklch and a light mode added.

The copies have already drifted:

| Role           | repo-guardian | docz shell (dark) | docz `charcoal` |
| -------------- | ------------- | ----------------- | --------------- |
| Background     | `#17191d`     | `#17191c`         | `#17191d`       |
| Raised surface | `#1f2227`     | `#202328`         | `#1f2227`       |
| Border         | `#31363d`     | `#32373e`         | `#31363d`       |
| Muted text     | `#9aa1ab`     | `#9aa2ac`         | `#9aa1ab`       |
| Accent         | `#5fa8f5`     | `#61a8f5`         | `#5fa8f5`       |
| Success        | `#3fb950`     | `#40ba52`         | `#3fb950`       |
| Warning        | `#d9a020`     | `#d99f21`         | `#d9a020`       |
| Danger         | `#f2554d`     | `#f7756e`         | `#f4645c`       |

Most differences are one or two hex steps, which reads as re-typing and
contrast nudges, not as design intent. Danger has three different values.

### 2. The stacks have converged; the differences left are few and specific

Same everywhere it matters: React 19, Vite 8, Bun, Tailwind v4 in CSS-first
mode (`@theme`, no config file), `class-variance-authority` for variants,
TanStack Query, self-hosted fonts through `@fontsource`.

|                     | repo-guardian              | docz                            | Starting implementation           |
| ------------------- | -------------------------- | ------------------------------- | --------------------------------- |
| Headless primitives | Radix                      | none (hand-rolled, plus `cmdk`) | Base UI                           |
| shadcn              | hand-copied, Radix flavour | no                              | CLI, Base UI preset               |
| Icons               | Tabler                     | inline SVG                      | Tabler                            |
| Charts              | Recharts + plain elements  | none                            | Recharts via shadcn chart         |
| Color format        | hex                        | hex                             | oklch                             |
| Modes               | dark only                  | light + dark                    | light + dark                      |
| Mode switch         | none                       | `data-mode` attribute           | `.dark` class                     |
| Token tiers         | one flat set               | one flat set per theme          | raw, semantic, component          |
| Component catalog   | none                       | none                            | Storybook                         |
| Accessibility tests | axe in e2e                 | axe in e2e, contrast tests      | axe per component, contrast tests |

Token **names** are the least aligned part. Three vocabularies describe the
same roles:

| Role                       | repo-guardian         | docz                  | Starting implementation (shadcn names) |
| -------------------------- | --------------------- | --------------------- | -------------------------------------- |
| Page background            | `background`          | `bg-base`             | `background`                           |
| Raised surface             | `panel`               | `bg-raised`           | `card`                                 |
| Body text                  | `foreground`          | `fg-primary`          | `foreground`                           |
| Main action color          | `accent`              | `accent`              | `primary`                              |
| Success / warning / danger | `ok` / `warn` / `bad` | `ok` / `warn` / `bad` | `success` / `warning` / `destructive`  |

In shadcn naming `accent` means a hover surface, so the same word means two
different things.

repo-guardian and docz have no spacing or type-scale tokens. Both use
arbitrary pixel values (`12.5px`, `10.5px`) and repeat the same shadow
literal in several files. The starting implementation has scales for both.

### 3. Component overlap is high for primitives and page furniture

| Component               | repo-guardian |       docz        | Starting implementation |
| ----------------------- | :-----------: | :---------------: | :---------------------: |
| Button                  |      yes      | one local variant |           yes           |
| Badge                   |      yes      |    status only    |           yes           |
| Card                    |      yes      |     CSS class     |           yes           |
| Tabs                    |  hand-rolled  |        no         |           yes           |
| Table                   |      yes      |     per route     |           yes           |
| Data table              |      yes      |        no         |           yes           |
| Dialog                  |      yes      |        no         |           yes           |
| Drawer / sheet          |      yes      |        no         |           yes           |
| Popover                 |      yes      |        no         |           yes           |
| Dropdown menu           |      yes      | hand-rolled twice |           yes           |
| Command palette         |  hand-rolled  |      `cmdk`       |         `cmdk`          |
| Input, select, checkbox |      no       |        no         |           yes           |
| Tooltip                 |      no       |        no         |           yes           |
| KPI tile                |      yes      |        no         |           yes           |
| Stat strip              |      yes      |        no         |           yes           |
| Meter / progress bar    |      yes      |        no         |           yes           |
| Page header             |      yes      |        no         |           yes           |
| Breadcrumbs             |      yes      |        yes        |           yes           |
| Empty / error state     |      yes      |        yes        |           yes           |
| Timeline                | inline, twice |  lifecycle rail   |           yes           |
| Stepper, flow diagram   |      no       | yes (doc widgets) |           yes           |
| Code block              |      no       |       Shiki       |     own highlighter     |
| Top bar + sidebar shell |      yes      |   top bar only    |           yes           |
| Mode toggle             |      no       |        yes        |           yes           |

- Almost every primitive repo-guardian has, the starting implementation
  also has, in the same look, on a different primitive library.
- docz has the fewest shared components but hand-rolls the ones that are
  hardest to get right (dropdowns, a 3-column frame) with no headless
  library underneath.
- Each app also has components that are about its own domain and should
  stay there: repo-guardian's finding filters and compliance badges, and
  docz's review UI and document themes.

### 4. The starting implementation covers most of the library, and repo-guardian covers the gaps

What the starting implementation has:

- 29 primitives, 18 composite "blocks" and 5 presentational shell parts,
  with a rule that primitives never import blocks and blocks never import
  app code.
- Three token tiers in plain CSS (raw oklch steps, semantic roles, component
  sizes), a light and a dark mode, and spacing, type, radius, elevation and
  motion scales.
- A script that generates a DTCG `tokens.json` from the CSS, plus light and
  dark token files shaped for Figma import.
- One Storybook story per component, axe on every component, contrast tests
  on the tokens, and a lint test that rejects raw colors and arbitrary
  values inside components.
- Subpath exports with no barrel and no build step: consumers compile the
  source with their own Tailwind.

What repo-guardian has that it does not, checked by searching the starting
implementation's source:

| repo-guardian has                                                                                                   | Where                             | Starting implementation                          |
| ------------------------------------------------------------------------------------------------------------------- | --------------------------------- | ------------------------------------------------ |
| Chart set: `TrendChart`, `BarBuckets`, `PairBars`, `BarList`, `StackedBars`, `Sparkline`, chart tooltip, `scale.ts` | `components/charts/`              | only the Recharts wrapper and a distribution bar |
| `ChartCard` with a plot / table toggle                                                                              | `components/charts/`              | none                                             |
| Filter `Chip` (`key = value`, dashed "+ filter")                                                                    | `components/ui/chip.tsx`          | none                                             |
| `GroupGrid`: expandable rows with heat-shaded cells                                                                 | `components/ui/group-grid.tsx`    | none                                             |
| `Meter` that changes tone at 70% and 90%                                                                            | `components/ui/meter.tsx`         | a progress bar with no thresholds                |
| `DataTable` columns that hide below a breakpoint                                                                    | `components/ui/data-table.tsx`    | none                                             |
| Detail panel that sits inline on wide screens and becomes a drawer below                                            | `components/ui/detail-drawer.tsx` | drawer only (not confirmed)                      |
| Local / UTC time display and toggle                                                                                 | `components/time.tsx`             | none                                             |
| CSV export button, "load more" control                                                                              | `components/`                     | none                                             |

These are the backport candidates. Without them repo-guardian cannot
delete its own copies, so they belong in the first release.

### 5. The earlier attempts stopped for reasons that can be avoided

**The old design system** reached v0.4.0 with five primitives (Badge,
Button, Card, Input, Kbd) and about seventeen more planned.

- It was extracted from a static mockup of one site, not from running apps.
  Status tokens were named after RFC lifecycle states (`draft`,
  `proposed`), so they meant nothing to a second consumer. There was no
  generic success / warning / danger set.
- It ruled out Tailwind and used plain CSS classes. Every app in use today
  is on Tailwind v4, so it was pointed away from where the apps went.
- Components entered through a promotion loop (build in the app, wait for
  two uses and two weeks of stability, then copy over). The one consumer
  gave up and removed the dependency.
- The process was large for the output: a custom token build script, five
  token test suites, a private registry that every consumer needed a
  personal access token for, and roughly 2,300 lines of docs.
- Its docs listed "public" as a non-goal and the license is `UNLICENSED`,
  so nothing in it was written with a public repo in mind.

**rfc-site** was that consumer. In May it deleted every design-system
import and went back to its own CSS, accepting in writing that the result
might be too coupled to extract later. It is dark-only, has no Tailwind and
has not changed since.

### 6. docz needs the tokens outside React

docz renders documents in two places: the React app, and a static HTML
export produced by Go, which embeds the CSS files under `pkg/theme/`. The
Go side is the source and the React side is generated from it. So a shared
design system that only ships React components and Tailwind utilities
cannot fully replace docz's copy. The tokens have to be usable as a plain
CSS file with no build step and no JavaScript.

docz's `paper` and `classic` themes are about how a document page reads
(serif prose, measure, per-document-type accents). They are a docz product
feature, not part of the shared look.

### 7. Most of the uncommitted scaffold in this repo does not fit

The scaffold came from a service template, with app config files copied from
rfc-site on top. There is no `src/` and no lockfile.

| Files                                                                                               | What they are                                                                                 | Fit for a published library              |
| --------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ---------------------------------------- |
| `package.json`                                                                                      | rfc-site's, name and all (`rfc-site`, private, `UNLICENSED`)                                  | replace                                  |
| `react-router.config.ts`, `orval.config.ts`, `vite.config.ts`, `justfile`                           | SSR app and API client config from rfc-site                                                   | remove or rewrite                        |
| `Dockerfile`, `docker-bake.hcl`, `docker-compose.yml`, `justfile.docker`, `.dockerignore`           | container build for a service; references files that do not exist and another project by name | remove                                   |
| `charts/`, `ct.yaml`                                                                                | stock Helm chart                                                                              | remove                                   |
| `.github/workflows/ci.yml`, `release.yml`, `codeql.yml`, `security.yml`, `license-check.yml`        | Go toolchain: golangci-lint, goreleaser, govulncheck, go-licenses                             | replace with JS equivalents              |
| `cliff.toml`, `.github/workflows/changelog.yml`, `changelog-regen.yml`                              | git-cliff changelog generation                                                                | remove: changesets writes `CHANGELOG.md` |
| `.github/dependabot.yml`, `.github/licenses-csv.tpl`, `.codecov.yml`, part of `.github/labeler.yml` | Go and Docker ecosystems                                                                      | fix or remove                            |
| `bunfig.toml`                                                                                       | preloads a test setup file that does not exist                                                | fix                                      |
| `.prettierrc.json` and `.prettierrc.yaml`                                                           | two Prettier configs                                                                          | keep one                                 |
| `tsconfig.json`, `vitest.config.ts`, `eslint.config.js`                                             | reusable with edits                                                                           | keep                                     |
| `mise.toml`, `renovate.json5`                                                                       | reusable once Helm and Docker entries are dropped                                             | keep                                     |
| `.docz.yaml`, `CONTRIBUTING.md`, lint configs, `scripts/labels.sh`, label and secret-scan workflows | generic repo hygiene                                                                          | keep                                     |

One side effect: rfc-site has a test that reads a mockup file from
`../design-system/`. That path is now this repo, which does not have the
file, so that test will fail if rfc-site is ever run again.

### 8. Going public changes the registry and the license

- **How the old design system released.** changesets, through
  `changesets/action`: a "version packages" pull request, then on merge a
  package publish and a GitHub Release. The package went to GitHub Packages
  (the npm-protocol registry at `npm.pkg.github.com`) with restricted
  access. It was never published to npmjs.org.
- **Registry.** GitHub Packages was chosen because CI could publish with
  the built-in token. It requires a token to _install_ an npm package even
  when the package is public. For a private package that was acceptable.
  For a public library used by two public repos it means every outside
  contributor needs a personal access token to run `bun install`.
- **License.** repo-guardian and docz are Apache-2.0. The old design system
  and the scaffold's `package.json` are `UNLICENSED`.
- **Mockups.** The old design system's mockup file should not be copied
  here; the running apps are the visual reference now.

<!--docz:findings:end-->

<!--docz:conclusion:start-->
## Conclusion

**Answer:** Yes on all three questions.

1. The in-use apps share one look and roughly twenty components. The
   differences between them are mostly accidents of copying (hex drift,
   three token vocabularies) plus four real choices that have to be made
   once: headless library, icon set, token names, and how the mode is
   switched.
2. There is a seed. The starting implementation is the same look, is more
   complete and better tested than either app's copy, and makes those four
   choices already. This repo does not start from a blank page, and does not
   start from the old design system.
3. The shape that fits both first consumers is a token layer that works as
   plain CSS on its own, with a React and Tailwind v4 component layer on top
   of it, shipped as source.

The hypothesis held, with two additions. docz's Go export is the reason the
token layer has to stand alone. And the seed alone is not enough for
repo-guardian: the first release also has to carry the pieces listed in
finding 4.

<!--docz:conclusion:end-->

<!--docz:recommendation:start-->
## Recommendation

### What to build

1. **Import the starting implementation as this repo's first code**:
   tokens, primitives, blocks, shell parts, stories and tests. Anything
   specific to the app it came from stays behind.
2. **One package, `@donaldgifford/design-system`, with subpath exports**
   and no barrel: `./tokens.css`, `./globals.css`, `./components/*`,
   `./blocks/*`, `./shell/*`, `./lib/*`. `tokens.css` must import nothing,
   so docz's Go export and any non-React page can use it alone. Split into
   two packages later only if a consumer needs it.
3. **Ship source, not a build.** Consumers already run Tailwind v4 and can
   point `@source` at the package. This removes the build pipeline that
   weighed down the old attempt.
4. **Four layers, with a one-way dependency rule**: tokens, primitives,
   blocks, shell. Domain components stay in the apps.
5. **One look.** Light and dark modes of the repo-guardian v2 look. No
   multi-look mechanism until a second look actually exists. docz's `paper`
   and `classic` document themes stay in docz.

### First release

The first release is the point at which repo-guardian and docz can both
install the package and delete their own copies. It has three parts.

| Part                        | Contents                                                                                                                                                                                                                                                                        |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Import                      | Everything in "What to build" item 1, renamed and licensed for this repo, minus the Figma token files                                                                                                                                                                           |
| Backport from repo-guardian | The chart set and `ChartCard`, filter `Chip`, `GroupGrid`, threshold `Meter`, responsive `DataTable` columns, inline detail panel, time display and toggle, CSV export, "load more". Each one is rebuilt on the package's primitives and tokens, not copied with its Radix base |
| docz needs                  | `tokens.css` usable with no build step, and a light mode that passes docz's existing contrast tests                                                                                                                                                                             |

More backports will surface during repo-guardian's adoption. The rule for
them is the same: if repo-guardian or docz needs it to remove a local copy,
it goes in the package; if it is about one app's domain, it stays in that
app.

### Decisions to settle in the RFC

| Decision               | Recommendation                                                                                   | Why                                                                                                                                                                                                                        |
| ---------------------- | ------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Headless library       | Base UI                                                                                          | The starting implementation is built on it. repo-guardian's Radix primitives get replaced by the package's, not ported.                                                                                                    |
| Icons                  | Tabler                                                                                           | Used by repo-guardian and the starting implementation.                                                                                                                                                                     |
| Token names            | shadcn semantic names plus `success` / `warning` / `info`                                        | Lets upstream shadcn components drop in unedited. repo-guardian and docz rename `ok` / `warn` / `bad` once, at adoption.                                                                                                   |
| Color format           | oklch, authored in `tokens.css`, with a DTCG `tokens.json` generated from it                     | Already done in the starting implementation; contrast tests come with it. The JSON gives non-CSS tools a way to read the tokens.                                                                                           |
| Mode switch            | `.dark` class on `<html>`                                                                        | What shadcn components assume. docz changes from `data-mode`; its static export needs the same change.                                                                                                                     |
| Charts                 | Recharts behind the shadcn chart wrapper                                                         | repo-guardian and the starting implementation both use Recharts.                                                                                                                                                           |
| Versioning and release | changesets, with a GitHub Release and a package publish on each version                          | Decided. Same flow as the old design system.                                                                                                                                                                               |
| Registry               | GitHub Packages (`npm.pkg.github.com`), public access, published from CI with the built-in token | Decided. Same registry as the old design system. Installing needs a token even for a public package, so each consuming repo carries an `.npmrc` for the `@donaldgifford` scope and passes a token in CI and Docker builds. |
| License                | Apache-2.0                                                                                       | Matches repo-guardian and docz.                                                                                                                                                                                            |
| Catalog                | Storybook only, published from this repo. No Figma library and no Figma token files              | Decided. One story per component comes with the starting implementation. The two Figma token files are left out of the import; the export script keeps generating `tokens.json`.                                           |

### Order of adoption

1. **repo-guardian** replaces `components/ui`, its charts and its token
   block. It is the origin of the look, the largest reduction in duplicated
   code, and gains a light mode as a side effect.
2. **docz** replaces `shell.css` and the duplicated dark block with
   `tokens.css`, and derives `charcoal` from it. Components follow where
   they exist (dropdown, command palette, breadcrumbs).
3. **rfc-site and the old design system**: archive. Nothing migrates.

### Guardrails, taken from what stopped the earlier attempts

- A component enters the library only if a running app already uses it.
  No mockup-first components and no waiting period.
- No token is named after one app's domain. Lifecycle and compliance states
  map onto generic status roles inside the app.
- Process stays proportional: this investigation, one RFC, a handful of
  ADRs for the table above, one implementation plan.

### Next steps

1. Clear the scaffold as listed in finding 7, before the first real commit.
2. Write RFC-0001 covering scope, package shape, the first release and the
   decisions table.
3. Document the consumer setup (`.npmrc`, token in CI and Docker builds) in
   the README, since every consuming repo needs it.

<!--docz:recommendation:end-->

<!--docz:references:start-->
## References

Follow-ups: [RFC-0001](../rfc/0001-shared-design-system-and-component-library-for-repo-guardian.md)
and [IMPL-0001](../impl/0001-first-release-of-the-design-system.md).

- [repo-guardian](https://github.com/donaldgifford/repo-guardian): `ui/web/src/index.css` (tokens),
  `ui/web/src/components/` (components),
  `docs/design/0036-frontend-design-cleanup-and-refresh-for-the-v2-ui.md`
  (the look's specification)
- [docz](https://github.com/donaldgifford/docz): `ui/src/theme/shell.css`, `ui/src/theme/tokens.css`,
  `pkg/theme/` (Go-side themes), DESIGN-0025 and DESIGN-0026 in `docs/design/`
- [changesets](https://github.com/changesets/changesets) and
  [changesets/action](https://github.com/changesets/action)
- [Design Tokens Community Group format](https://www.designtokens.org/)
- [Tailwind CSS v4 `@source`](https://tailwindcss.com/docs/detecting-classes-in-source-files)
- [Base UI](https://base-ui.com/)
- [GitHub Packages npm registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry)

<!--docz:references:end-->
