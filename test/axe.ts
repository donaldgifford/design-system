import { expect } from "bun:test";
import axe, { type AxeResults } from "axe-core";

// expectNoA11yViolations runs axe-core on a rendered container. happy-dom
// has no layout, so the color-contrast rule (which needs computed
// positions) is left off; the structural and ARIA rules are what the
// component tests guard.
export async function expectNoA11yViolations(container: Element): Promise<AxeResults> {
  const results = await axe.run(container, {
    rules: { "color-contrast": { enabled: false } },
    resultTypes: ["violations"],
  });
  const summary = results.violations.map(
    (v) => `${v.id}: ${v.help} (${v.nodes.map((n) => n.target.join(" ")).join(", ")})`,
  );
  expect(summary).toEqual([]);
  return results;
}
