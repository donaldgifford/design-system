/** The toggle form of `FilterChip`; the `key = value` form is in small-controls.test.tsx. */
import { describe, expect, mock, test } from "bun:test";
import { FilterBar } from "@donaldgifford/design-system/blocks/filter-bar";
import { FilterChip } from "@donaldgifford/design-system/blocks/filter-chip";
import { expectNoA11yViolations } from "@test/axe";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";

function TypeFilter({ onChange }: { onChange?: (pressed: boolean) => void }) {
  const [design, setDesign] = useState(false);
  return (
    <main>
      <FilterBar label="Document type">
        <FilterChip pressed>adr</FilterChip>
        <FilterChip
          pressed={design}
          onPressedChange={(pressed) => {
            setDesign(pressed);
            onChange?.(pressed);
          }}
        >
          design
        </FilterChip>
      </FilterBar>
    </main>
  );
}

describe("FilterChip as a toggle", () => {
  test("is a pressed or unpressed button labelled by its children", async () => {
    const { container } = render(<TypeFilter />);
    expect(screen.getByRole("button", { name: "adr" })).toHaveAttribute("aria-pressed", "true");
    const design = screen.getByRole("button", { name: "design" });
    expect(design).toHaveAttribute("aria-pressed", "false");
    expect(design).toHaveTextContent(/^design$/);
    expect(design).not.toHaveAttribute("data-add");
    await expectNoA11yViolations(container);
  });

  test("a click, Enter and Space each report the new state", async () => {
    const user = userEvent.setup();
    const onChange = mock((_: boolean) => {});
    render(<TypeFilter onChange={onChange} />);
    const design = screen.getByRole("button", { name: "design" });
    await user.click(design);
    expect(onChange).toHaveBeenLastCalledWith(true);
    expect(design).toHaveAttribute("aria-pressed", "true");
    await user.keyboard("{Enter}");
    expect(onChange).toHaveBeenLastCalledWith(false);
    await user.keyboard(" ");
    expect(onChange).toHaveBeenLastCalledWith(true);
  });

  test("an onClick that prevents the default keeps the state", async () => {
    const user = userEvent.setup();
    const onPressedChange = mock((_: boolean) => {});
    render(
      <FilterChip
        pressed={false}
        onPressedChange={onPressedChange}
        onClick={(event) => event.preventDefault()}
      >
        design
      </FilterChip>,
    );
    await user.click(screen.getByRole("button", { name: "design" }));
    expect(onPressedChange).not.toHaveBeenCalled();
  });

  test("the key = value form has no pressed state", () => {
    render(<FilterChip name="org" value="payments" />);
    expect(screen.getByRole("button", { name: "org = payments" })).not.toHaveAttribute(
      "aria-pressed",
    );
  });
});
