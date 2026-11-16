import { describe, expect, test } from "bun:test";
import { Button, buttonVariants } from "@donaldgifford/design-system/components/button";
import { expectNoA11yViolations } from "@test/axe";
import { render, screen } from "@testing-library/react";

describe("Button", () => {
  test("renders a button with the default variant and size", () => {
    render(<Button>Save</Button>);
    const button = screen.getByRole("button", { name: "Save" });
    expect(button).toHaveAttribute("data-slot", "button");
    expect(button).toHaveAttribute("data-variant", "default");
    expect(button).toHaveAttribute("data-size", "default");
  });

  test("has success and warning variants on the shell's tokens", () => {
    expect(buttonVariants({ variant: "success" })).toContain("bg-success");
    expect(buttonVariants({ variant: "warning" })).toContain("bg-warning");
    render(<Button variant="success">Approve</Button>);
    expect(screen.getByRole("button", { name: "Approve" })).toHaveAttribute(
      "data-variant",
      "success",
    );
  });

  test("a link styled as a button stays a link", () => {
    render(
      <a href="/clusters" data-slot="button" className={buttonVariants({ variant: "link" })}>
        Clusters
      </a>,
    );
    const link = screen.getByRole("link", { name: "Clusters" });
    expect(link).toHaveAttribute("href", "/clusters");
    expect(link.className).toContain("underline-offset-4");
    expect(screen.queryByRole("button")).toBeNull();
  });

  test("disabled is passed through", () => {
    render(<Button disabled>Wait</Button>);
    expect(screen.getByRole("button", { name: "Wait" })).toBeDisabled();
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
          <Button key={variant} variant={variant}>
            {variant}
          </Button>
        ))}
        <Button size="icon" aria-label="Refresh">
          <svg aria-hidden="true" />
        </Button>
      </main>,
    );
    await expectNoA11yViolations(container);
  });
});
