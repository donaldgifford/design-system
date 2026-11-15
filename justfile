set shell := ["bash", "-cu"]

default:
    @just --list

# Install dependencies
install:
    bun install

# Lint and format-check code and config (Biome)
lint:
    bun run lint

# Fix what Biome can fix
lint-fix:
    bun run lint:fix

# Lint Markdown
lint-md:
    markdownlint-cli2 "**/*.md" "#node_modules" "#.changeset"

# Lint YAML
lint-yaml:
    yamllint .

# Lint GitHub Actions workflows
lint-actions:
    actionlint

# Validate docz documents
docs-validate:
    docz validate

# Regenerate docz index tables
docs-update:
    docz update

# Everything CI runs
check: lint lint-md lint-yaml lint-actions docs-validate

# Record a change for the next release
changeset:
    bun run changeset
