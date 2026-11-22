import { describe, expect, test } from "bun:test";
import { type Step, Stepper } from "@donaldgifford/design-system/blocks/stepper";
import { expectNoA11yViolations } from "@test/axe";
import { render, screen, within } from "@testing-library/react";

const steps: Step[] = [
  { id: "draft", label: "Draft", status: "done" },
  { id: "accepted", label: "Accepted", status: "current", description: "2026-10-14" },
  { id: "implemented", label: "Implemented", status: "upcoming" },
];

describe("Stepper", () => {
  test("by default it is horizontal and numbered, with no new attributes", async () => {
    const { container } = render(
      <main>
        <Stepper steps={steps} />
      </main>,
    );
    const list = screen.getByRole("list");
    expect(list).not.toHaveAttribute("data-orientation");
    expect(list).not.toHaveAttribute("data-size");
    expect(list.className).toContain("flex-wrap");
    const items = within(list).getAllByRole("listitem");
    expect(items).toHaveLength(3);
    expect(items[1]).toHaveAttribute("aria-current", "step");
    expect(items[1]).toHaveTextContent("2");
    expect(container.querySelector("[data-slot=stepper-line]")).toBeNull();
    await expectNoA11yViolations(container);
  });

  test("vertical stacks the steps and joins them with a line", async () => {
    const { container } = render(
      <main>
        <Stepper steps={steps} orientation="vertical" />
      </main>,
    );
    const list = screen.getByRole("list");
    expect(list).toHaveAttribute("data-orientation", "vertical");
    expect(list.className).toContain("flex-col");
    // A line under every step but the last.
    expect(container.querySelectorAll("[data-slot=stepper-line]")).toHaveLength(2);
    expect(within(list).getAllByRole("listitem")[1]).toHaveTextContent("2");
    await expectNoA11yViolations(container);
  });

  test("the small size marks a step with a dot and no number", async () => {
    const { container } = render(
      <main>
        <Stepper steps={steps} size="sm" />
      </main>,
    );
    const list = screen.getByRole("list");
    expect(list).toHaveAttribute("data-size", "sm");
    const items = within(list).getAllByRole("listitem");
    expect(items[1]).toHaveTextContent(/^Accepted2026-10-14$/);
    expect(items[1]).toHaveAttribute("aria-current", "step");
    expect(container.querySelector("svg")).toBeNull();
    await expectNoA11yViolations(container);
  });

  test("the two props are independent", () => {
    const { container } = render(<Stepper steps={steps} orientation="vertical" size="sm" />);
    const list = screen.getByRole("list");
    expect(list).toHaveAttribute("data-orientation", "vertical");
    expect(list).toHaveAttribute("data-size", "sm");
    expect(container.querySelectorAll("[data-slot=stepper-line]")).toHaveLength(2);
  });
});
