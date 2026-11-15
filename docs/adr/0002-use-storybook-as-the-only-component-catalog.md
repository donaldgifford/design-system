---
id: ADR-0002
title: "Use Storybook as the only component catalog"
status: Accepted
author: Donald Gifford
created: 2026-11-15
---

<!-- markdownlint-disable-file MD025 MD041 -->

# ADR-0002: Use Storybook as the only component catalog

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

Storybook is the only catalog for the design system. There is no Figma
library and no Figma token files. The tokens are still exported as a
generic DTCG `tokens.json`.

<!--docz:summary:end-->

<!--docz:context:start-->
## Context

A design system needs one place to see every token and component. The
starting implementation comes with a Storybook story per component and also
with a script that writes token files shaped for Figma import. Keeping two
catalogs in step is work with no one asking for it.

<!--docz:context:end-->

<!--docz:decision:start-->
## Decision

- Storybook is the catalog. Every component has a story; stories are the
  target for accessibility checks.
- No Figma library is maintained, and the Figma-shaped token files and the
  code that writes them are left out of the import.
- The export script keeps generating `tokens.json` in DTCG format from
  `tokens.css`, and the package exports it.

### Supporting Data

The Figma output and the DTCG output come from separate functions in the
export script, so one can be removed without touching the other.

<!--docz:decision:end-->

<!--docz:consequences:start-->
## Consequences

<!--docz:positive:start-->
### Positive

- One catalog to keep current, and it is built from the real components.
- `tokens.json` gives non-CSS tools a way to read the tokens.

<!--docz:positive:end-->

<!--docz:negative:start-->
### Negative

- Anyone who designs in Figma has no library to work from.

<!--docz:negative:end-->

<!--docz:neutral:start-->
### Neutral

- `tokens.json` is in the format Figma can import, so a Figma library can
  be added later without changing the tokens.

<!--docz:neutral:end-->
<!--docz:consequences:end-->

<!--docz:alternatives:start-->
## Alternatives Considered

| Alternative | Why not |
| ----------- | ------- |
| Storybook and a Figma library | Two catalogs to maintain, no current need |
| Drop `tokens.json` as well | It is cheap to keep and useful to tools that cannot read CSS |
| An in-app gallery page | Belongs to an app, not to the package |

<!--docz:alternatives:end-->

<!--docz:references:start-->
## References

- [RFC-0001](../rfc/0001-shared-design-system-and-component-library-for-repo-guardian.md)
- [INV-0001](../investigation/0001-consolidate-duplicated-design-tokens-and-ui-components-into-a.md)
- [Storybook](https://storybook.js.org/)
- [Design Tokens Community Group format](https://www.designtokens.org/)

<!--docz:references:end-->
