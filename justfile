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

# Type-check
typecheck:
    bun run typecheck

# Unit, accessibility, token and discipline tests
test *args:
    bun test {{ args }}

# Storybook dev server on :6006
storybook:
    bun --bun run storybook

# Storybook's static build into storybook-static/
storybook-build:
    bun --bun run storybook:build --quiet

# Regenerate tokens.json from tokens.css
tokens:
    bun run tokens

# Copy a shadcn primitive into src/components/ui: just add button
add component:
    bunx --bun shadcn@4.22.1 add {{ component }}

# Everything CI runs
check: lint typecheck test lint-md lint-yaml lint-actions docs-validate

# Record a change for the next release
changeset:
    bun run changeset
