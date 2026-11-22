/** The palette's filters, preview and footer. */
import { describe, expect, mock, test } from "bun:test";
import { FilterChip } from "@donaldgifford/design-system/blocks/filter-chip";
import {
  CommandDialog,
  CommandFilters,
  CommandFooter,
  CommandInput,
  CommandItem,
  CommandList,
} from "@donaldgifford/design-system/components/command";
import { expectNoA11yViolations } from "@test/axe";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";

interface PaletteProps {
  onSelect?: (value: string) => void;
  onPressedChange?: (pressed: boolean) => void;
}

/** docz's palette: filters under the input, a preview of the highlighted hit, key hints. */
function Palette({ onSelect, onPressedChange }: PaletteProps) {
  const [value, setValue] = useState("");
  const [design, setDesign] = useState(false);
  return (
    <CommandDialog
      open
      commandProps={{ value, onValueChange: setValue, label: "Search documents" }}
      preview={<p>Previewing {value}</p>}
    >
      <CommandInput placeholder="Search" />
      <CommandFooter>
        <span>enter to open</span>
      </CommandFooter>
      <CommandFilters>
        <FilterChip
          pressed={design}
          onPressedChange={(pressed) => {
            setDesign(pressed);
            onPressedChange?.(pressed);
          }}
        >
          design
        </FilterChip>
      </CommandFilters>
      <CommandList>
        <CommandItem value="adr-0004" onSelect={(item) => onSelect?.(item)}>
          ADR-0004
        </CommandItem>
        <CommandItem value="design-0026" onSelect={(item) => onSelect?.(item)}>
          DESIGN-0026
        </CommandItem>
      </CommandList>
    </CommandDialog>
  );
}

const selected = () => document.querySelector("[cmdk-item][data-selected=true]");

describe("CommandDialog with none of the slots", () => {
  test("renders as it did: one column, the dialog's own width, no extra parts", () => {
    render(
      <CommandDialog open>
        <CommandInput placeholder="Search" />
        <CommandList>
          <CommandItem>payments/api</CommandItem>
        </CommandList>
      </CommandDialog>,
    );
    const command = document.querySelector("[data-slot=command]") as HTMLElement;
    expect(command.className).not.toContain("sm:grid");
    expect(command.children).toHaveLength(3); // cmdk's label, the input, the list
    expect(document.querySelector("[data-slot=dialog-content]")?.className).toContain(
      "sm:max-w-lg",
    );
    expect(document.querySelector("[data-slot=command-preview]")).toBeNull();
  });
});

describe("CommandDialog with filters, a preview and a footer", () => {
  test("has a named filter group, a named preview and a footer placed last", async () => {
    render(<Palette />);
    const dialog = screen.getByRole("dialog");
    const filters = within(dialog).getByRole("group", { name: "Filters" });
    expect(within(filters).getByRole("button", { name: "design" })).toBeInTheDocument();
    const preview = within(dialog).getByRole("group", { name: "Preview" });
    expect(preview).toHaveAttribute("data-slot", "command-preview");
    // The footer was given second; its order class puts it last.
    expect(document.querySelector("[data-slot=command-footer]")?.className).toContain("order-last");
    await expectNoA11yViolations(dialog);
  });

  test("is wider, splits in two from sm, and hides the preview below it", () => {
    render(<Palette />);
    expect(document.querySelector("[data-slot=dialog-content]")?.className).toContain(
      "sm:max-w-3xl",
    );
    const command = document.querySelector("[data-slot=command]") as HTMLElement;
    expect(command.className).toContain("sm:grid-cols-2");
    const preview = document.querySelector("[data-slot=command-preview]") as HTMLElement;
    expect(preview.className).toContain("hidden");
    expect(preview.className).toContain("sm:block");
  });

  test("the arrow keys and Enter in the input drive the list, and the preview follows", async () => {
    const user = userEvent.setup();
    const onSelect = mock((_: string) => {});
    render(<Palette onSelect={onSelect} />);
    await user.click(screen.getByPlaceholderText("Search"));
    expect(selected()).toHaveTextContent("ADR-0004");
    await user.keyboard("{ArrowDown}");
    expect(selected()).toHaveTextContent("DESIGN-0026");
    expect(screen.getByRole("group", { name: "Preview" })).toHaveTextContent(
      "Previewing design-0026",
    );
    await user.keyboard("{Enter}");
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenLastCalledWith("design-0026");
  });

  test("a filter keeps Enter and Space for itself, and the arrows still move the list", async () => {
    const user = userEvent.setup();
    const onSelect = mock((_: string) => {});
    const onPressedChange = mock((_: boolean) => {});
    render(<Palette onSelect={onSelect} onPressedChange={onPressedChange} />);
    // Tab from the input, as a reader would; the dialog puts focus in the input when it opens.
    await user.click(screen.getByPlaceholderText("Search"));
    await user.tab();
    expect(screen.getByRole("button", { name: "design" })).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(onPressedChange).toHaveBeenLastCalledWith(true);
    await user.keyboard(" ");
    expect(onPressedChange).toHaveBeenLastCalledWith(false);
    expect(onSelect).not.toHaveBeenCalled();
    await user.keyboard("{ArrowDown}");
    expect(selected()).toHaveTextContent("DESIGN-0026");
  });
});
