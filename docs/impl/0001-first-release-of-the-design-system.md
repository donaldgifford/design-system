---
id: IMPL-0001
title: "First release of the design system"
status: In Progress
author: Donald Gifford
created: 2026-11-15
---

<!-- markdownlint-disable-file MD024 MD025 MD041 -->

# IMPL-0001: First release of the design system

<!--toc:start-->
<!-- markdownlint-capture -->
<!-- markdownlint-disable MD013 -->
- [Objective](#objective)
- [Scope](#scope)
  - [In Scope](#in-scope)
  - [Out of Scope](#out-of-scope)
- [Implementation Phases](#implementation-phases)
  - [Phase 1: Repository setup](#phase-1-repository-setup)
    - [Tasks](#tasks)
    - [Success Criteria](#success-criteria)
  - [Phase 2: Import](#phase-2-import)
    - [Tasks](#tasks-1)
    - [Success Criteria](#success-criteria-1)
  - [Phase 3: Backports from repo-guardian](#phase-3-backports-from-repo-guardian)
    - [Tasks](#tasks-2)
    - [Success Criteria](#success-criteria-2)
  - [Phase 4: First published version](#phase-4-first-published-version)
    - [Tasks](#tasks-3)
    - [Success Criteria](#success-criteria-3)
  - [Phase 5: repo-guardian adoption](#phase-5-repo-guardian-adoption)
    - [Tasks](#tasks-4)
    - [Success Criteria](#success-criteria-4)
  - [Phase 6: docz adoption](#phase-6-docz-adoption)
    - [Tasks](#tasks-5)
    - [Success Criteria](#success-criteria-5)
- [File Changes](#file-changes)
- [Testing Plan](#testing-plan)
- [Dependencies](#dependencies)
- [References](#references)
<!-- markdownlint-restore -->
<!--toc:end-->

<!--docz:objective:start-->
## Objective

Get from an empty repo to a published package that repo-guardian and docz
both install in place of their own tokens and components.

**Implements:** [RFC-0001](../rfc/0001-shared-design-system-and-component-library-for-repo-guardian.md)

<!--docz:objective:end-->

<!--docz:scope:start-->
## Scope

<!--docz:in-scope:start-->
### In Scope

- Repo tooling, CI and release automation
- Importing the starting implementation
- Backports from repo-guardian
- First published version
- Adoption pull requests in repo-guardian and docz

<!--docz:in-scope:end-->

<!--docz:out-of-scope:start-->
### Out of Scope

- A second look or theme
- A Figma library
- A shadcn registry
- Components neither app uses today
- docz's document themes

<!--docz:out-of-scope:end-->
<!--docz:scope:end-->

## Implementation Phases

Each phase builds on the previous one. A phase is complete when all its tasks
are checked off and its success criteria are met.

---

<!--docz:phase:start-->
### Phase 1: Repository setup

Turn the service scaffold into a library repo with passing checks.

<!--docz:tasks:start-->
#### Tasks

- [x] Remove the service scaffold: container, Helm, SSR app and Go CI files
- [x] `package.json` for `@donaldgifford/design-system`, kept `private`
- [x] Biome for code and config; markdownlint, yamllint and actionlint for the rest
- [x] changesets config, `.npmrc` for GitHub Packages, release workflow
- [x] CI workflow running `just check`
- [x] INV-0001, RFC-0001, ADR-0001 to ADR-0004 and this plan
- [x] Merge the initialization branch
- [x] Create the repo labels with `scripts/labels.sh`

<!--docz:tasks:end-->

<!--docz:criteria:start-->
#### Success Criteria

- `just check` passes locally and in CI
- The release workflow runs on `main` and publishes nothing

<!--docz:criteria:end-->
<!--docz:phase:end-->

---

<!--docz:phase:start-->
### Phase 2: Import

Bring in the starting implementation and make it stand on its own in this repo.

Three blocks were left out because they only made sense in the app they came
from: a status badge with a fixed vocabulary of that app's states, a
permission matrix, and a cluster topology diagram. Apps map their own states
onto `Badge` variants instead.

<!--docz:tasks:start-->
#### Tasks

- [x] Copy tokens, primitives, blocks, shell parts, `lib`, `hooks`, stories and tests
- [x] Rename internal import paths to `@donaldgifford/design-system/*`
- [x] Add the `exports` map, `sideEffects`, dependencies and peer dependencies to `package.json`
- [x] Add `tsconfig.json`, `bunfig.toml`, the test setup and the Storybook config
- [x] Carry over the Biome rules, including the layer import boundaries
- [x] Keep the `tokens.json` export; leave out the Figma token files and the code that writes them
- [x] Leave out blocks that only make sense in the app they came from
- [x] Add CI jobs: typecheck, `bun test`, Storybook build, CodeQL for TypeScript
- [x] Add a first changeset
- [ ] Add a browser check that runs axe, with color contrast on, over every story in the Storybook build

<!--docz:tasks:end-->

<!--docz:criteria:start-->
#### Success Criteria

- Typecheck, tests and the Storybook build pass in CI
- Every component has a story and passes its accessibility test
- Token contrast tests pass in both modes
- Nothing in the repo names or links to where the code came from

<!--docz:criteria:end-->
<!--docz:phase:end-->

---

<!--docz:phase:start-->
### Phase 3: Backports from repo-guardian

Add what repo-guardian has and the import lacks, rebuilt on the package's primitives and tokens.

<!--docz:tasks:start-->
#### Tasks

- [x] Charts: trend, bar buckets, pair bars, bar list, stacked bars, sparkline, tooltip, scale helpers
- [x] Chart card with a plot / table toggle
- [x] Filter chip
- [x] Group grid with expandable rows and heat-shaded cells
- [x] Meter with threshold tones
- [x] Data-table columns that hide below a breakpoint, and a selected row
- [x] Detail panel that is inline on wide screens and a drawer below (it was missing: `detail-sheet` is overlay-only)
- [x] Time display with a local / UTC toggle
- [x] CSV export button and "load more" control
- [x] Series pills, the legend that picks a chart's series (found while checking the success criteria)
- [x] A story and tests for each

<!--docz:tasks:end-->

<!--docz:criteria:start-->
#### Success Criteria

- Every component in repo-guardian's `components/ui` and `components/charts` has an equivalent in the package
- Each backport uses only tokens and package primitives

<!--docz:criteria:end-->
<!--docz:phase:end-->

---

<!--docz:phase:start-->
### Phase 4: First published version

Publish 0.1.0 and prove it installs outside this repo.

<!--docz:tasks:start-->
#### Tasks

- [ ] Remove `"private": true`
- [ ] Merge the "version packages" pull request
- [ ] Confirm the package and the GitHub Release exist
- [ ] Install the package in a scratch Vite and Tailwind v4 project and render a page
- [ ] Publish the Storybook

<!--docz:tasks:end-->

<!--docz:criteria:start-->
#### Success Criteria

- `bun add @donaldgifford/design-system` works with a token set
- A page in the scratch project renders in light and dark using only package imports

<!--docz:criteria:end-->
<!--docz:phase:end-->

---

<!--docz:phase:start-->
### Phase 5: repo-guardian adoption

Done in the repo-guardian repo, one component group at a time.

<!--docz:tasks:start-->
#### Tasks

- [ ] Add `.npmrc` and the CI token; install the package
- [ ] Replace the token block in `index.css` with the package's `globals.css`
- [ ] Rename `ok` / `warn` / `bad` / `panel` / `accent` usages to the package's names
- [ ] Swap primitives, then blocks and charts, then the shell
- [ ] Delete `components/ui`, `components/charts` and the local shell
- [ ] Update visual snapshots; add a mode toggle

<!--docz:tasks:end-->

<!--docz:criteria:start-->
#### Success Criteria

- repo-guardian has no token definitions and no `components/ui` directory
- Its e2e, accessibility and visual tests pass

<!--docz:criteria:end-->
<!--docz:phase:end-->

---

<!--docz:phase:start-->
### Phase 6: docz adoption

Done in the docz repo. Tokens first, components after.

<!--docz:tasks:start-->
#### Tasks

- [ ] Decide how the Go export gets `tokens.css` (RFC-0001 open question 1)
- [ ] Replace the shell stylesheet and the duplicated dark block with `tokens.css`
- [ ] Derive the `charcoal` document theme from `tokens.css`
- [ ] Switch the mode toggle from `data-mode` to `.dark`, in the app and the export
- [ ] Replace the dropdowns, command palette and breadcrumbs with package components

<!--docz:tasks:end-->

<!--docz:criteria:start-->
#### Success Criteria

- docz has one definition of the shell colors, and it comes from the package
- docz's contrast tests pass in both modes
- Exported HTML pages look the same as before

<!--docz:criteria:end-->
<!--docz:phase:end-->

---

<!--docz:file-changes:start-->
## File Changes

| File | Action | Description |
| ---- | ------ | ----------- |
| `package.json` | Modify | Exports map, dependencies, scripts; drop `private` at release |
| `src/styles/tokens.css`, `globals.css` | Create | Tokens and the Tailwind theme |
| `src/components/ui/`, `blocks/`, `shell/` | Create | The three component layers |
| `src/lib/`, `src/hooks/` | Create | Shared helpers |
| `scripts/tokens-export.ts`, `tokens.json` | Create | DTCG export |
| `.storybook/` | Create | Catalog config |
| `test/` | Create | Test setup, accessibility helper, token and discipline tests |
| `tsconfig.json`, `bunfig.toml`, `biome.json` | Create / Modify | Type, test and lint config |
| `.github/workflows/ci.yml` | Modify | Typecheck, test, Storybook build, CodeQL |

<!--docz:file-changes:end-->

<!--docz:testing:start-->
## Testing Plan

- [ ] Unit tests per component with `bun test`, happy-dom and Testing Library
- [ ] axe check on every component
- [ ] Token contrast tests for both modes
- [ ] Discipline test: no raw colors or arbitrary values in components
- [ ] Every component has a story
- [ ] Install test from a scratch project before each consumer adoption

<!--docz:testing:end-->

<!--docz:dependencies:start-->
## Dependencies

- GitHub Packages enabled for the repo, with workflow permission to write
  packages
- A personal access token with `read:packages` for local installs in the
  consuming repos
- repo-guardian's and docz's existing test suites, which gate their
  adoption phases

<!--docz:dependencies:end-->

<!--docz:references:start-->
## References

- [RFC-0001](../rfc/0001-shared-design-system-and-component-library-for-repo-guardian.md)
- [INV-0001](../investigation/0001-consolidate-duplicated-design-tokens-and-ui-components-into-a.md)
- [ADR-0001](../adr/0001-release-with-changesets-to-github-packages.md),
  [ADR-0002](../adr/0002-use-storybook-as-the-only-component-catalog.md),
  [ADR-0003](../adr/0003-build-components-on-tailwind-v4-shadcn-and-base-ui.md),
  [ADR-0004](../adr/0004-author-tokens-as-css-in-oklch-with-shadcn-semantic-names.md)

<!--docz:references:end-->
