# @donaldgifford/design-system

## 0.1.1

### Patch Changes

- [#9](https://github.com/donaldgifford/design-system/pull/9) [`fd53ed5`](https://github.com/donaldgifford/design-system/commit/fd53ed59e597af27cf3b1a6ec5b083bfbbe4ff8c) Thanks [@donaldgifford](https://github.com/donaldgifford)! - Typecheck in apps that set `exactOptionalPropertyTypes` or have no Node types. The package ships source, so a consumer's compiler checks it under the consumer's flags: every optional prop now accepts an explicit `undefined`, and `lib/deprecation` no longer needs `@types/node`.

## 0.1.0

### Minor Changes

- [#3](https://github.com/donaldgifford/design-system/pull/3) [`3f7581d`](https://github.com/donaldgifford/design-system/commit/3f7581d25a9d4e798a1155e2d584241f04b85631) Thanks [@donaldgifford](https://github.com/donaldgifford)! - Add the design tokens, the primitives, blocks and shell parts, the Storybook catalog and the test suite.

- [#5](https://github.com/donaldgifford/design-system/pull/5) [`8f77ac3`](https://github.com/donaldgifford/design-system/commit/8f77ac3ede4991c5572c9f46529533ba4d60185f) Thanks [@donaldgifford](https://github.com/donaldgifford)! - Add the blocks repo-guardian has and the first import lacked: the chart blocks (`trend-chart`, `bar-buckets`, `pair-bars`, `bar-list`, `stacked-bars`, `sparkline`) with `chart-card` and its plot / table toggle, `series-pills`, `filter-chip`, `group-grid`, `meter`, `time` with a local / UTC toggle, `export-button`, `load-more`, and the `detail-panel` shell part. `DataTable` gains `meta.hideBelow`, `compact`, and `selectedId`. New helpers: `lib/chart-scale`, `lib/csv`, `lib/time`, `lib/percent`, and `hooks/use-media-query`.
