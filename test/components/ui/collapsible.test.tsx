import { describe, expect, mock, test } from "bun:test";
import {
  Collapsible,
  CollapsiblePanel,
  CollapsibleTrigger,
} from "@donaldgifford/design-system/components/collapsible";
import { expectNoA11yViolations } from "@test/axe";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

function Example(props: { defaultOpen?: boolean; onOpenChange?: (open: boolean) => void }) {
  return (
    <main>
      <Collapsible {...props}>
        <CollapsibleTrigger>Checks</CollapsibleTrigger>
        <CollapsiblePanel>
          <p>Branch protection is on</p>
        </CollapsiblePanel>
      </Collapsible>
    </main>
  );
}

describe("Collapsible", () => {
  test("closed, the trigger says so and the panel is not in the DOM", async () => {
    const { container } = render(<Example />);
    expect(screen.getByRole("button", { name: "Checks" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(screen.queryByText("Branch protection is on")).toBeNull();
    expect(container.querySelector("[data-slot=collapsible-panel]")).toBeNull();
    await expectNoA11yViolations(container);
  });

  test("open, the trigger controls the panel", async () => {
    const { container } = render(<Example defaultOpen />);
    const trigger = screen.getByRole("button", { name: "Checks" });
    const panel = container.querySelector("[data-slot=collapsible-panel]");
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(panel).toHaveTextContent("Branch protection is on");
    expect(trigger.getAttribute("aria-controls")).toBe(panel?.id ?? "");
    await expectNoA11yViolations(container);
  });

  test("a click, Enter and Space each toggle it", async () => {
    const user = userEvent.setup();
    const onOpenChange = mock((_: boolean) => {});
    render(<Example onOpenChange={onOpenChange} />);
    const trigger = screen.getByRole("button", { name: "Checks" });
    await user.click(trigger);
    expect(onOpenChange.mock.calls.at(-1)?.[0]).toBe(true);
    expect(screen.getByText("Branch protection is on")).toBeInTheDocument();
    await user.keyboard("{Enter}");
    expect(onOpenChange.mock.calls.at(-1)?.[0]).toBe(false);
    await user.keyboard(" ");
    expect(onOpenChange.mock.calls.at(-1)?.[0]).toBe(true);
  });
});
