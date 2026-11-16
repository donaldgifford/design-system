/**
 * The change policy: removing a variant or prop is a
 * deprecation first, for one minor release, and a removal in the next
 * major. A deprecation is an entry in `deprecations`. The component calls
 * `warnDeprecated` with it where the old prop or variant is used, and
 * Storybook can badge the component from the same entry.
 */
export interface Deprecation {
  /** The component's export name, e.g. `Badge`. */
  component: string;
  /** The deprecated prop or variant, e.g. `variant="pending"`. */
  what: string;
  /** What to use instead. */
  instead: string;
}

/** Every current deprecation. Nothing is deprecated yet. */
export const deprecations: readonly Deprecation[] = [];

/** The deprecations on one component, for its story. */
export function deprecationsOf(
  component: string,
  list: readonly Deprecation[] = deprecations,
): Deprecation[] {
  return list.filter((entry) => entry.component === component);
}

export function deprecationMessage({ component, what, instead }: Deprecation): string {
  return `@donaldgifford/design-system: ${component} ${what} is deprecated and goes in the next major; use ${instead}.`;
}

// Declared here so the module typechecks in an app with no Node types;
// the bundler replaces the expression either way.
declare const process: { env: { NODE_ENV?: string | undefined } };

const warned = new Set<string>();

/**
 * Warns once per deprecation, in development only. Production builds
 * replace `process.env.NODE_ENV`, so the check and the warning drop out.
 */
export function warnDeprecated(entry: Deprecation): void {
  if (process.env.NODE_ENV === "production") return;
  const message = deprecationMessage(entry);
  if (warned.has(message)) return;
  warned.add(message);
  console.warn(message);
}
