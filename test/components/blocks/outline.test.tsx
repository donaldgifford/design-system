import { describe, expect, test } from "bun:test";
import { Outline, type OutlineItem } from "@donaldgifford/design-system/blocks/outline";
import { expectNoA11yViolations } from "@test/axe";
import { render, screen, within } from "@testing-library/react";

const items: OutlineItem[] = [
  { id: "summary", text: "Summary", depth: 2 },
  { id: "problem", text: "Problem Statement", depth: 2 },
  { id: "data", text: "Supporting Data", depth: 3 },
  { id: "deep", text: "A deep one", depth: 9 },
];

describe("Outline", () => {
  test("is a named landmark of links to the headings", async () => {
    const { container } = render(
      <main>
        <Outline items={items} activeId="problem" />
      </main>,
    );
    const nav = screen.getByRole("navigation", { name: "On this page" });
    const links = within(nav).getAllByRole("link");
    expect(links.map((link) => link.getAttribute("href"))).toEqual([
      "#summary",
      "#problem",
      "#data",
      "#deep",
    ]);
    await expectNoA11yViolations(container);
  });

  test("marks the active heading and no other", () => {
    render(<Outline items={items} activeId="problem" />);
    const active = screen.getByRole("link", { name: "Problem Statement" });
    expect(active).toHaveAttribute("aria-current", "location");
    expect(active).toHaveAttribute("data-active", "true");
    expect(screen.getByRole("link", { name: "Summary" })).not.toHaveAttribute("aria-current");
    expect(screen.getByRole("link", { name: "Summary" })).toHaveAttribute("data-active", "false");
  });

  test("indents by level below the shallowest, to a limit", () => {
    render(<Outline items={items} />);
    expect(screen.getByRole("link", { name: "Summary" }).className).toContain("pl-3");
    expect(screen.getByRole("link", { name: "Supporting Data" }).className).toContain("pl-6");
    expect(screen.getByRole("link", { name: "A deep one" }).className).toContain("pl-12");
  });

  test("takes its own label, and renders nothing with no headings", () => {
    const { rerender, container } = render(<Outline items={items} label="Contents" />);
    expect(screen.getByRole("navigation", { name: "Contents" })).toBeInTheDocument();
    rerender(<Outline items={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
