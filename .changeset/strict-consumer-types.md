---
"@donaldgifford/design-system": patch
---

Typecheck in apps that set `exactOptionalPropertyTypes` or have no Node types. The package ships source, so a consumer's compiler checks it under the consumer's flags: every optional prop now accepts an explicit `undefined`, and `lib/deprecation` no longer needs `@types/node`.
