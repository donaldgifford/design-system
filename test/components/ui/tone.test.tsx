/** A tone the app supplies, on `Badge` and on `Dot`. */
import { describe, expect, test } from "bun:test";
import { Dot } from "@donaldgifford/design-system/blocks/list-row";
import { Badge } from "@donaldgifford/design-system/components/badge";
import { expectNoA11yViolations } from "@test/axe";
import { render, screen } from "@testing-library/react";

describe("Badge with a tone from the app", () => {
  test("sets --tone inline and keeps the tinted form", async () => {
    const { container } = render(
      <main>
        <Badge tone="var(--category-3)">design</Badge>
      </main>,
    );
    const badge = screen.getByText("design");
    expect(badge.style.getPropertyValue("--tone")).toBe("var(--category-3)");
    expect(badge).toHaveAttribute("data-tone", "custom");
    expect(badge).toHaveAttribute("data-fill", "tinted");
    expect(badge.className).toContain("badge-tinted");
    await expectNoA11yViolations(container);
  });

  test("takes any CSS color and keeps the caller's own style", () => {
    render(
      <Badge tone="oklch(0.6 0.2 300)" style={{ marginLeft: 4 }}>
        team
      </Badge>,
    );
    const badge = screen.getByText("team");
    expect(badge.style.getPropertyValue("--tone")).toBe("oklch(0.6 0.2 300)");
    expect(badge.style.marginLeft).toBe("4px");
  });

  test("without a tone it renders as it did", () => {
    render(<Badge variant="success">ok</Badge>);
    const badge = screen.getByText("ok");
    expect(badge.getAttribute("style")).toBeNull();
    expect(badge).not.toHaveAttribute("data-tone");
    expect(badge).toHaveAttribute("data-variant", "success");
  });

  test("a filled badge with a tone is a type error", () => {
    // @ts-expect-error a filled badge needs a foreground the package cannot know for an app's color
    render(<Badge tone="var(--category-1)" fill="filled" />);
  });
});

describe("Dot with a tone from the app", () => {
  test("a named tone is a class, as before", () => {
    const { container } = render(<Dot tone="warn" />);
    const dot = container.querySelector("[data-slot=dot]") as HTMLElement;
    expect(dot).toHaveAttribute("data-tone", "warn");
    expect(dot.className).toContain("bg-warning");
    expect(dot.getAttribute("style")).toBeNull();
  });

  test("any other value is the dot's color", () => {
    const { container } = render(<Dot tone="var(--category-5)" />);
    const dot = container.querySelector("[data-slot=dot]") as HTMLElement;
    expect(dot).toHaveAttribute("data-tone", "custom");
    expect(dot.style.backgroundColor).toBe("var(--category-5)");
    expect(dot.className).not.toContain("bg-warning");
  });
});
