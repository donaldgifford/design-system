/** The two controls `TopBarLayout` documents for its end slot. */
import { describe, expect, mock, test } from "bun:test";
import { type Mode, ModeToggle } from "@donaldgifford/design-system/shell/mode-toggle";
import { SearchTrigger } from "@donaldgifford/design-system/shell/search-trigger";
import { expectNoA11yViolations } from "@test/axe";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("SearchTrigger", () => {
  test("is a button named by its label, with the shortcut as a hint only", async () => {
    const { container } = render(
      <main>
        <SearchTrigger shortcut="⌘K" aria-keyshortcuts="Meta+K Control+K" />
      </main>,
    );
    const button = screen.getByRole("button", { name: "Search" });
    expect(button).toHaveAttribute("type", "button");
    expect(button).toHaveAttribute("aria-keyshortcuts", "Meta+K Control+K");
    expect(button.querySelector("kbd")).toHaveAttribute("aria-hidden", "true");
    await expectNoA11yViolations(container);
  });

  test("below md it is the icon alone: the label is for screen readers and the hint is hidden", () => {
    render(<SearchTrigger label="Search documents" shortcut="⌘K" />);
    const button = screen.getByRole("button", { name: "Search documents" });
    expect(button.className).toContain("md:w-56");
    const label = screen.getByText("Search documents");
    expect(label.className).toContain("sr-only");
    expect(label.className).toContain("md:not-sr-only");
    expect(button.querySelector("kbd")?.className).toContain("hidden");
    expect(button.querySelector("kbd")?.className).toContain("md:inline-flex");
  });

  test("reports a click and the keyboard, and has no hint without a shortcut", async () => {
    const user = userEvent.setup();
    const onClick = mock(() => {});
    render(<SearchTrigger onClick={onClick} />);
    const button = screen.getByRole("button", { name: "Search" });
    expect(button.querySelector("kbd")).toBeNull();
    await user.click(button);
    await user.keyboard("{Enter}");
    expect(onClick).toHaveBeenCalledTimes(2);
  });
});

describe("ModeToggle", () => {
  test("in dark mode it offers light, and says so", async () => {
    const user = userEvent.setup();
    const onToggle = mock((_: Mode) => {});
    const { container } = render(
      <main>
        <ModeToggle mode="dark" onToggle={onToggle} />
      </main>,
    );
    const button = screen.getByRole("button", { name: "Switch to light mode" });
    expect(button).toHaveAttribute("data-mode", "dark");
    await user.click(button);
    expect(onToggle).toHaveBeenLastCalledWith("light");
    await expectNoA11yViolations(container);
  });

  test("in light mode it offers dark", async () => {
    const user = userEvent.setup();
    const onToggle = mock((_: Mode) => {});
    render(<ModeToggle mode="light" onToggle={onToggle} />);
    await user.click(screen.getByRole("button", { name: "Switch to dark mode" }));
    expect(onToggle).toHaveBeenLastCalledWith("dark");
  });

  test("it stores nothing and sets no class", async () => {
    const user = userEvent.setup();
    render(<ModeToggle mode="light" onToggle={() => {}} />);
    await user.click(screen.getByRole("button", { name: "Switch to dark mode" }));
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    // Controlled: with the same mode passed back, it still offers dark.
    expect(screen.getByRole("button", { name: "Switch to dark mode" })).toBeInTheDocument();
  });
});
