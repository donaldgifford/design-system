import { describe, expect, mock, test } from "bun:test";
import {
  DetailInset,
  DetailPanel,
  DetailSection,
} from "@donaldgifford/design-system/shell/detail-panel";
import { expectNoA11yViolations } from "@test/axe";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRef, useState } from "react";

function Page({
  inline,
  returnToRow = true,
  onChange = () => {},
}: {
  inline: boolean;
  returnToRow?: boolean;
  onChange?: (open: boolean) => void;
}) {
  const [open, setOpen] = useState(false);
  const row = useRef<HTMLButtonElement>(null);
  return (
    <main>
      <button type="button" ref={row} onClick={() => setOpen(true)}>
        payments/api
      </button>
      <button type="button">another row</button>
      <DetailPanel
        open={open}
        onOpenChange={(next) => {
          onChange(next);
          setOpen(next);
        }}
        inline={inline}
        title="payments/api"
        description="codeowners · failing"
        footer={<button type="button">Waive</button>}
        returnFocusTo={returnToRow ? () => row.current : undefined}
      >
        <DetailSection title="Evidence">
          <DetailInset aria-label="Evidence">CODEOWNERS: not found</DetailInset>
        </DetailSection>
      </DetailPanel>
    </main>
  );
}

describe.each([
  ["inline", true],
  ["overlay", false],
] as const)("DetailPanel, %s", (form, inline) => {
  test("is a named, described dialog that takes focus, closes on Escape, and returns focus", async () => {
    const user = userEvent.setup();
    const onChange = mock((_: boolean) => {});
    render(<Page inline={inline} onChange={onChange} />);
    expect(screen.queryByRole("dialog")).toBeNull();
    const row = screen.getByRole("button", { name: "payments/api" });
    row.focus();
    await user.keyboard("{Enter}");

    const dialog = await screen.findByRole("dialog", { name: "payments/api" });
    expect(dialog).toHaveAttribute("data-form", form);
    expect(dialog).toHaveAccessibleDescription("codeowners · failing");
    await waitFor(() => expect(dialog.contains(document.activeElement)).toBe(true));
    expect(screen.getByRole("heading", { name: "Evidence" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Waive" })).toBeInTheDocument();
    expect(screen.getByText("CODEOWNERS: not found")).toHaveClass("font-mono");
    await expectNoA11yViolations(dialog);

    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(onChange).toHaveBeenLastCalledWith(false);
    await waitFor(() => expect(row).toHaveFocus());
  });

  test("closes from its close button", async () => {
    const user = userEvent.setup();
    render(<Page inline={inline} />);
    await user.click(screen.getByRole("button", { name: "payments/api" }));
    await screen.findByRole("dialog");
    await user.click(screen.getByRole("button", { name: "Close" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    await waitFor(() => expect(screen.getByRole("button", { name: "payments/api" })).toHaveFocus());
  });
});

describe("DetailPanel", () => {
  test("inline sits in the page, not modal, and leaves the rest of the page reachable", async () => {
    const user = userEvent.setup();
    const { container } = render(<Page inline />);
    await user.click(screen.getByRole("button", { name: "payments/api" }));
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "false");
    expect(container.contains(dialog)).toBe(true);
    await expectNoA11yViolations(container);
    await user.click(screen.getByRole("button", { name: "another row" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  test("overlay renders outside the page, over it", async () => {
    const user = userEvent.setup();
    const { container } = render(<Page inline={false} />);
    await user.click(screen.getByRole("button", { name: "payments/api" }));
    const dialog = await screen.findByRole("dialog");
    expect(container.contains(dialog)).toBe(false);
  });
});

describe.each([
  ["inline", true],
  ["overlay", false],
] as const)("DetailPanel label (%s)", (_form, inline) => {
  test("a label names the dialog in place of the title", async () => {
    render(
      <DetailPanel
        open
        onOpenChange={() => {}}
        inline={inline}
        title={<a href="/repos/payments/api">payments/api</a>}
        label="Finding: payments/api, codeowners"
      >
        body
      </DetailPanel>,
    );
    const dialog = await screen.findByRole("dialog", { name: "Finding: payments/api, codeowners" });
    expect(dialog).not.toHaveAttribute("aria-labelledby");
  });
});

function Rows() {
  const [subject, setSubject] = useState("a");
  return (
    <main>
      <button type="button" onClick={() => setSubject("b")}>
        row b
      </button>
      <DetailPanel open onOpenChange={() => {}} inline title={subject} subject={subject}>
        body
      </DetailPanel>
    </main>
  );
}

describe("DetailPanel subject", () => {
  test("an inline panel takes focus again when it is pointed at another subject", async () => {
    const user = userEvent.setup();
    render(<Rows />);
    const close = within(screen.getByRole("dialog")).getByRole("button", { name: /close/i });
    await waitFor(() => expect(close).toHaveFocus());
    await user.click(screen.getByRole("button", { name: "row b" }));
    await waitFor(() =>
      expect(
        within(screen.getByRole("dialog", { name: "b" })).getByRole("button", { name: /close/i }),
      ).toHaveFocus(),
    );
  });
});
