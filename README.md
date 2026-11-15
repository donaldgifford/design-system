# design-system

Design tokens and a React component library shared by
[repo-guardian](https://github.com/donaldgifford/repo-guardian),
[docz](https://github.com/donaldgifford/docz) and other apps, so they install
one design instead of each keeping a copy.

> **Status:** initial setup. The package is not published yet. See
> [RFC-0001](docs/rfc/) for the plan and [IMPL-0001](docs/impl/) for progress.

## What it will ship

One package, `@donaldgifford/design-system`, consumed as source:

- `tokens.css`: the tokens as plain CSS custom properties, usable with no
  build step and no JavaScript
- `globals.css`: the Tailwind v4 theme built on those tokens
- React components in three layers: primitives, blocks and shell parts
- A Storybook catalog

## Development

```sh
mise install    # pinned toolchain
just install    # dependencies
just            # list recipes
just check      # everything CI runs
```

## Releasing

Releases use [changesets](https://github.com/changesets/changesets). Run
`just changeset` in any pull request that should change the published
package. Merging to `main` opens a "version packages" pull request; merging
that one publishes to GitHub Packages and creates a GitHub Release.

## Installing from GitHub Packages

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

## Documentation

Design decisions live in [`docs/`](docs/) and are managed with
[docz](https://github.com/donaldgifford/docz).

## License

Apache-2.0
