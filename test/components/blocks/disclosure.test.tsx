import { describe, expect, mock, test } from "bun:test";
import { Disclosure } from "@donaldgifford/design-system/blocks/disclosure";
import { expectNoA11yViolations } from "@test/axe";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";

function ControlledPage() {
  const [open, setOpen] = useState(true);
  return (
    <>
      <button type="button" onClick={() => setOpen(false)}>
        Close it
      </button>
      <Disclosure label="Filters" open={open} onOpenChange={setOpen}>
        <p>type = design</p>
      </Disclosure>
    </>
  );
}

describe("Disclosure", () => {
  test("closed, it shows the value and leaves the content out of the DOM", async () => {
    const { container } = render(
      <main>
        <Disclosure label="Front matter" value="4 fields">
          <p>status: Accepted</p>
        </Disclosure>
      </main>,
    );
    const trigger = screen.getByRole("button", { name: /Front matter/ });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveTextContent("4 fields");
    expect(screen.queryByText("status: Accepted")).toBeNull();
    await expectNoA11yViolations(container);
  });

  test("open, it shows the content", async () => {
    const { container } = render(
      <main>
        <Disclosure label="Front matter" value="4 fields" defaultOpen>
          <p>status: Accepted</p>
        </Disclosure>
      </main>,
    );
    expect(screen.getByRole("button", { name: /Front matter/ })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(screen.getByText("status: Accepted")).toBeInTheDocument();
    await expectNoA11yViolations(container);
  });

  test("the keyboard opens and closes it", async () => {
    const user = userEvent.setup();
    const onOpenChange = mock((_: boolean) => {});
    render(
      <Disclosure label="Front matter" onOpenChange={onOpenChange}>
        <p>status: Accepted</p>
      </Disclosure>,
    );
    await user.tab();
    expect(screen.getByRole("button", { name: "Front matter" })).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
    expect(screen.getByText("status: Accepted")).toBeInTheDocument();
    await user.keyboard(" ");
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });

  test("controlled, it follows the page's state", async () => {
    const user = userEvent.setup();
    render(<ControlledPage />);
    expect(screen.getByRole("button", { name: "Filters" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    await user.click(screen.getByRole("button", { name: "Close it" }));
    expect(screen.getByRole("button", { name: "Filters" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  test("disabled, it cannot be opened", async () => {
    const user = userEvent.setup();
    render(
      <Disclosure label="Front matter" disabled>
        <p>status: Accepted</p>
      </Disclosure>,
    );
    await user.click(screen.getByRole("button", { name: "Front matter" }));
    expect(screen.queryByText("status: Accepted")).toBeNull();
  });
});
