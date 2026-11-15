---
id: ADR-0001
title: "Release with changesets to GitHub Packages"
status: Accepted
author: Donald Gifford
created: 2026-11-15
---

<!-- markdownlint-disable-file MD025 MD041 -->

# ADR-0001: Release with changesets to GitHub Packages

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

Versions and changelogs are managed with changesets. Each release publishes
the package to GitHub Packages with public access and creates a GitHub
Release.

<!--docz:summary:end-->

<!--docz:context:start-->
## Context

The package needs a version, a changelog, a registry and a release trigger.
The previous design system used changesets and GitHub Packages, and that
flow is already familiar. The difference now is that the repo and the
package are public.

<!--docz:context:end-->

<!--docz:decision:start-->
## Decision

- **Versioning:** changesets. A pull request that changes the published
  package includes a changeset file stating the bump and the changelog line.
- **Release flow:** on push to `main`, `changesets/action` opens or updates
  a "version packages" pull request. Merging it publishes the package and
  creates a GitHub Release and tag.
- **Registry:** GitHub Packages (`npm.pkg.github.com`), `access: public`.
  CI publishes with the workflow's built-in token.
- **Changelog:** `CHANGELOG.md` is written by changesets. git-cliff is not
  used in this repo.
- Until the first release is ready, `package.json` keeps `"private": true`
  so nothing is published.

### Supporting Data

The `@donaldgifford` scope matches the GitHub owner, so publishing needs no
secret beyond the token every workflow already has.

<!--docz:decision:end-->

<!--docz:consequences:start-->
## Consequences

<!--docz:positive:start-->
### Positive

- No publishing secret to create or rotate.
- The release is a reviewable pull request that shows the version and the
  changelog before anything is published.
- Same flow as before, so nothing new to learn.

<!--docz:positive:end-->

<!--docz:negative:start-->
### Negative

- GitHub Packages requires a token to install, even for a public package.
  Every consuming repo needs an `.npmrc` for the scope, a token in CI and
  in Docker builds, and contributors need a personal access token locally.
- Pull requests opened with the built-in token do not trigger other
  workflows, so CI does not run on the "version packages" pull request
  unless a different token is supplied later.

<!--docz:negative:end-->

<!--docz:neutral:start-->
### Neutral

- Semver labels on pull requests are not used; the changeset file carries
  the bump.

<!--docz:neutral:end-->
<!--docz:consequences:end-->

<!--docz:alternatives:start-->
## Alternatives Considered

| Alternative | Why not |
| ----------- | ------- |
| Public npm registry | Installs need no token, but it was a new setup. The token requirement was judged acceptable |
| git-cliff with conventional commits | Derives versions from commit messages; changesets makes the bump an explicit, reviewed choice |
| Label-driven semver bump | Same objection, and it needs a required-label check on every pull request |

<!--docz:alternatives:end-->

<!--docz:references:start-->
## References

- [RFC-0001](../rfc/0001-shared-design-system-and-component-library-for-repo-guardian.md)
- [INV-0001](../investigation/0001-consolidate-duplicated-design-tokens-and-ui-components-into-a.md)
- [changesets](https://github.com/changesets/changesets)
- [GitHub Packages npm registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry)

<!--docz:references:end-->
