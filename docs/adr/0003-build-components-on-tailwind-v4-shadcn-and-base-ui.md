---
id: ADR-0003
title: "Build components on Tailwind v4, shadcn and Base UI"
status: Proposed
author: Donald Gifford
created: 2026-11-15
---

<!-- markdownlint-disable-file MD025 MD041 -->

# ADR-0003: Build components on Tailwind v4, shadcn and Base UI

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

Components are React 19, styled with Tailwind v4, started from shadcn's
Base UI flavour, and shipped as source. Icons are Tabler, charts are
Recharts, and the command palette is `cmdk`.

<!--docz:summary:end-->

<!--docz:context:start-->
## Context

The apps agree on React, Vite, Bun and Tailwind v4 but not on what sits
under the components: repo-guardian uses Radix through hand-copied shadcn
files, docz hand-rolls its primitives, and the starting implementation uses
Base UI through the shadcn CLI. A shared library has to pick one.

<!--docz:context:end-->

<!--docz:decision:start-->
## Decision

| Concern | Choice |
| ------- | ------ |
| Styling | Tailwind v4, CSS-first (`@theme`), no config file |
| Distribution | Source. Consumers add the package to `@source` |
| Primitives | shadcn components on Base UI, owned in this repo and edited freely |
| Variants | `class-variance-authority` |
| Class merging | `clsx` with `tailwind-merge` |
| Icons | Tabler (`@tabler/icons-react`) |
| Charts | Recharts behind the shadcn chart wrapper |
| Command palette | `cmdk` |
| Data table | TanStack Table |
| Peer dependencies | `react`, `react-dom`, `tailwindcss` v4 |

### Supporting Data

The starting implementation already makes every choice in this table, with
tests. repo-guardian shares four of them (Tailwind v4, cva, Tabler,
Recharts).

<!--docz:decision:end-->

<!--docz:consequences:start-->
## Consequences

<!--docz:positive:start-->
### Positive

- No build step and no compiled CSS to keep in sync.
- Upstream shadcn components can be added with the CLI and then adjusted.
- repo-guardian keeps its icon set and chart library.

<!--docz:positive:end-->

<!--docz:negative:start-->
### Negative

- repo-guardian's Radix-based primitives are replaced, not ported, which
  can change focus and keyboard behavior in small ways.
- Consumers must be on Tailwind v4.
- docz gains a headless library it deliberately avoided.

<!--docz:negative:end-->

<!--docz:neutral:start-->
### Neutral

- shadcn components are a starting point, not a dependency. Upstream
  changes are pulled in by hand when wanted.

<!--docz:neutral:end-->
<!--docz:consequences:end-->

<!--docz:alternatives:start-->
## Alternatives Considered

| Alternative | Why not |
| ----------- | ------- |
| Radix | Only repo-guardian uses it; choosing it means rewriting the import |
| No headless library | docz's approach. It leaves focus management and ARIA behavior to hand-written code in every component |
| Plain CSS classes, no Tailwind | The old design system's approach; no current app works this way |
| Lucide icons | Not used by either first consumer |

<!--docz:alternatives:end-->

<!--docz:references:start-->
## References

- [RFC-0001](../rfc/0001-shared-design-system-and-component-library-for-repo-guardian.md)
- [INV-0001](../investigation/0001-consolidate-duplicated-design-tokens-and-ui-components-into-a.md)
- [Base UI](https://base-ui.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS v4](https://tailwindcss.com/)

<!--docz:references:end-->
