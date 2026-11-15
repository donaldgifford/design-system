import { describe, expect, test } from "bun:test";
import { Badge, badgeVariants } from "@donaldgifford/design-system/components/badge";
import { expectNoA11yViolations } from "@test/axe";
import { render, screen } from "@testing-library/react";

describe("Badge", () => {
  test("renders a span with the variant as a data attribute", () => {
    render(<Badge variant="outline">prod</Badge>);
    const badge = screen.getByText("prod");
    expect(badge.tagName).toBe("SPAN");
    expect(badge).toHaveAttribute("data-slot", "badge");
    expect(badge).toHaveAttribute("data-variant", "outline");
  });

  test("has success and warning variants on the shell's tokens", () => {
    expect(badgeVariants({ variant: "success" })).toContain("[--tone:var(--success)]");
    expect(badgeVariants({ variant: "warning" })).toContain("[--tone:var(--warning)]");
  });

  test("a variant names its tone; fill picks the tinted or filled form", () => {
    expect(badgeVariants({ variant: "running" })).toContain("badge-tinted");
    const filled = badgeVariants({ variant: "pending", fill: "filled" });
    expect(filled).toContain("badge-filled");
    expect(filled).toContain("[--tone-fill:var(--pending)]");
    expect(filled).toContain("[--tone-foreground:var(--pending-foreground)]");
  });

  test("an outline badge has neither form", () => {
    render(
      <Badge variant="outline" fill="filled">
        prod
      </Badge>,
    );
    const badge = screen.getByText("prod");
    expect(badge.className).not.toContain("badge-filled");
    expect(badge.className).not.toContain("badge-tinted");
    expect(badge).not.toHaveAttribute("data-fill");
  });

  test("every variant is axe clean", async () => {
    const { container } = render(
      <main>
        {(
          [
            "default",
            "secondary",
            "outline",
            "ghost",
            "link",
            "destructive",
            "success",
            "warning",
          ] as const
        ).map((variant) => (
          <Badge key={variant} variant={variant}>
            {variant}
          </Badge>
        ))}
      </main>,
    );
    await expectNoA11yViolations(container);
  });

  test("render swaps the element", () => {
    render(<Badge render={<a href="/ops/op_1" />}>op_1</Badge>);
    expect(screen.getByRole("link", { name: "op_1" })).toHaveAttribute("data-slot", "badge");
  });
});
