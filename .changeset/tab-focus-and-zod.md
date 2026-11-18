---
"@donaldgifford/design-system": patch
---

- `TabsTrigger` no longer narrows its focus outline to 1px; it takes the 2px outline every other focusable element gets from `globals.css`.
- `lib/errors` no longer imports zod, so an app that renders an `ErrorState` or uses `ApiError` does not bundle it. `ApiError.from` reads the problem body with a new `parseProblem`, which accepts what `problemSchema` accepts. `lib/problem` still exports `problemSchema` and re-exports the rest.
