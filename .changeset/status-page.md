---
"@donaldgifford/design-system": minor
---

A public status page's parts, after repo-guardian's page and built from
the package's own `Alert`, `Dot`, `ListRow`, `Badge` and `PageHeader`:

- `blocks/status`: `StatusBanner` (the overall state as a headline in its
  tone), `StatusComponents` (a row per part of the service), `StatusBadge`,
  and `statusTone` / `statusHeadline`. A state that is not known reads as a
  disruption.
- `shell/status-page`: `StatusPageLayout`, the narrow column outside the
  app shell, under a `PageHeader`, with a footer.
