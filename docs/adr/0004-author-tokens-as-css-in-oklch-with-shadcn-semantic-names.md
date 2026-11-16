---
id: ADR-0004
title: "Author tokens as CSS in oklch with shadcn semantic names"
status: Accepted
author: Donald Gifford
created: 2026-11-15
---

<!-- markdownlint-disable-file MD025 MD041 -->

# ADR-0004: Author tokens as CSS in oklch with shadcn semantic names

<!--toc:start-->
<!-- markdownlint-capture -->
<!-- markdownlint-disable MD013 -->
- [Summary](#summary)
- [Context](#context)
- [Decision](#decision)
  - [Supporting Data](#supporting-data)
- [Consequences](#consequences)
  - [Positive](#positive)
  - [Negative](#negative)
  - [Neutral](#neutral)
- [Alternatives Considered](#alternatives-considered)
- [References](#references)
<!-- markdownlint-restore -->
<!--toc:end-->

<!--docz:summary:start-->
## Summary

Tokens are written by hand in one CSS file, in three tiers, with colors in
oklch. Semantic tokens use shadcn's names plus `success`, `warning` and
`info`. Light is the default and dark is switched with a `.dark` class.

<!--docz:summary:end-->

<!--docz:context:start-->
## Context

repo-guardian and docz each have a flat set of hex tokens under different
names, and they switch modes differently: repo-guardian is dark only, docz
uses a `data-mode` attribute. docz also needs the tokens on pages that are
not React and have no build step.

<!--docz:context:end-->

<!--docz:decision:start-->
## Decision

- **Source of truth:** `src/styles/tokens.css`, exported as `./tokens.css`.
  It imports nothing.
- **Tiers:** raw values (`--slate-21`), semantic roles (`--background`,
  `--primary`), and component sizes (`--control-h`, `--badge-radius`).
  Components use semantic and component tokens, never raw values or literal
  colors. A test enforces this.
- **Color format:** oklch.
- **Semantic names:** shadcn's set (`background`, `foreground`, `card`,
  `popover`, `primary`, `secondary`, `muted`, `accent`, `destructive`,
  `border`, `input`, `ring`) plus `success`, `warning`, `info` and their
  foregrounds.
- **Scales:** spacing, type, radius, elevation and motion are tokens too.
- **Modes:** light on `:root`, dark under `.dark` on `<html>`. Storing the
  user's preference is the app's job.
- **Contrast:** token pairs are tested at 4.5:1 for text and 3:1 for
  non-text.
- **JSON:** `tokens.json` is generated from the CSS (see ADR-0002).

### Supporting Data

| Role | repo-guardian today | docz today | This repo |
| ---- | ------------------- | ---------- | --------- |
| Page background | `background` | `bg-base` | `background` |
| Raised surface | `panel` | `bg-raised` | `card` |
| Main action color | `accent` | `accent` | `primary` |
| Success / warning / danger | `ok` / `warn` / `bad` | `ok` / `warn` / `bad` | `success` / `warning` / `destructive` |

<!--docz:decision:end-->

<!--docz:consequences:start-->
## Consequences

<!--docz:positive:start-->
### Positive

- One file a non-React page can link directly.
- shadcn components work without renaming their classes.
- Light and dark both exist from the start; repo-guardian gains a light
  mode.
- Arbitrary pixel values in the apps have named replacements.

<!--docz:positive:end-->

<!--docz:negative:start-->
### Negative

- repo-guardian and docz each rename their tokens once at adoption.
- `accent` changes meaning for both apps: it becomes a hover surface, and
  the main action color is `primary`.
- docz changes its mode switch from `data-mode` to `.dark`, in the app and
  in its static export.

<!--docz:negative:end-->

<!--docz:neutral:start-->
### Neutral

- App-specific states (document status, compliance result) map onto the
  status roles inside each app.

<!--docz:neutral:end-->
<!--docz:consequences:end-->

<!--docz:alternatives:start-->
## Alternatives Considered

| Alternative | Why not |
| ----------- | ------- |
| Tokens authored in TypeScript or JSON and compiled to CSS | The old design system did this with a custom build script. CSS as the source needs no build |
| Keep repo-guardian's names | shadcn components would need every class renamed |
| Hex colors | oklch makes lightness steps predictable and is what the import uses |
| `data-theme` or `data-mode` attribute | shadcn components and Tailwind's `dark` variant assume the class by default |

<!--docz:alternatives:end-->

<!--docz:references:start-->
## References

- [RFC-0001](../rfc/0001-shared-design-system-and-component-library-for-repo-guardian.md)
- [INV-0001](../investigation/0001-consolidate-duplicated-design-tokens-and-ui-components-into-a.md)
- [ADR-0002](0002-use-storybook-as-the-only-component-catalog.md)
- [shadcn/ui theming](https://ui.shadcn.com/docs/theming)

<!--docz:references:end-->
