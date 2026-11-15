// Keyboard and focus contracts for the overlay primitives.
// They go through the package's components and the roles a screen reader
// sees, never the engine's attributes, so the same tests pass on Radix and
// on Base UI.
import { describe, expect, mock, test } from "bun:test";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@donaldgifford/design-system/components/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@donaldgifford/design-system/components/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@donaldgifford/design-system/components/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@donaldgifford/design-system/components/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@donaldgifford/design-system/components/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@donaldgifford/design-system/components/tooltip";
import { expectNoA11yViolations } from "@test/axe";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("Dialog", () => {
  test("opens from the keyboard, traps focus, closes on Escape, and returns focus", async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger>Delete cluster</DialogTrigger>
        <DialogContent>
          <DialogTitle>Delete prod-1?</DialogTitle>
          <DialogDescription>This cannot be undone.</DialogDescription>
          <input aria-label="Type the name" />
        </DialogContent>
      </Dialog>,
    );
    const trigger = screen.getByRole("button", { name: "Delete cluster" });
    await user.tab();
    expect(trigger).toHaveFocus();
    await user.keyboard("{Enter}");

    const dialog = await screen.findByRole("dialog", { name: "Delete prod-1?" });
    expect(dialog).toHaveAccessibleDescription("This cannot be undone.");
    await waitFor(() => expect(dialog.contains(document.activeElement)).toBe(true));
    for (let i = 0; i < 4; i++) {
      await user.tab();
      expect(dialog.contains(document.activeElement)).toBe(true);
    }
    await expectNoA11yViolations(dialog);

    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(trigger).toHaveFocus();
  });
});

describe("Sheet", () => {
  test("opens from the keyboard, closes on Escape, and returns focus", async () => {
    const user = userEvent.setup();
    render(
      <Sheet>
        <SheetTrigger>Details</SheetTrigger>
        <SheetContent>
          <SheetTitle>op_01</SheetTitle>
          <SheetDescription>CreateSandbox</SheetDescription>
        </SheetContent>
      </Sheet>,
    );
    const trigger = screen.getByRole("button", { name: "Details" });
    trigger.focus();
    await user.keyboard("{Enter}");

    const sheet = await screen.findByRole("dialog", { name: "op_01" });
    expect(sheet).toHaveAccessibleDescription("CreateSandbox");
    await waitFor(() => expect(sheet.contains(document.activeElement)).toBe(true));
    await user.tab();
    expect(sheet.contains(document.activeElement)).toBe(true);
    await expectNoA11yViolations(sheet);

    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(trigger).toHaveFocus();
  });
});

describe("DropdownMenu", () => {
  test("opens from the keyboard, moves between items, selects, and returns focus", async () => {
    const user = userEvent.setup();
    const onRename = mock(() => {});
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Actions</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Open</DropdownMenuItem>
          <DropdownMenuItem onClick={onRename}>Rename</DropdownMenuItem>
          <DropdownMenuItem>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );
    const trigger = screen.getByRole("button", { name: "Actions" });
    trigger.focus();
    await user.keyboard("{Enter}");

    const menu = await screen.findByRole("menu");
    expect(screen.getAllByRole("menuitem").map((item) => item.textContent)).toEqual([
      "Open",
      "Rename",
      "Delete",
    ]);
    await waitFor(() => expect(menu.contains(document.activeElement)).toBe(true));
    await user.keyboard("{ArrowDown}");
    await waitFor(() => expect(screen.getByRole("menuitem", { name: "Rename" })).toHaveFocus());
    await expectNoA11yViolations(menu);

    await user.keyboard("{Enter}");
    expect(onRename).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
    expect(trigger).toHaveFocus();
  });

  test("closes on Escape and returns focus", async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Actions</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Open</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );
    const trigger = screen.getByRole("button", { name: "Actions" });
    trigger.focus();
    await user.keyboard("{Enter}");
    await screen.findByRole("menu");
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
    expect(trigger).toHaveFocus();
  });
});

describe("Select", () => {
  test("opens from the keyboard, picks an option, and shows it", async () => {
    const user = userEvent.setup();
    const onValueChange = mock((_: string | null) => {});
    render(
      <Select defaultValue="small" onValueChange={onValueChange}>
        <SelectTrigger aria-label="Profile">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="small">small</SelectItem>
          <SelectItem value="medium">medium</SelectItem>
          <SelectItem value="large">large</SelectItem>
        </SelectContent>
      </Select>,
    );
    const trigger = screen.getByRole("combobox", { name: "Profile" });
    expect(trigger).toHaveTextContent("small");
    trigger.focus();
    await user.keyboard("{Enter}");

    const listbox = await screen.findByRole("listbox");
    expect(screen.getAllByRole("option").map((option) => option.textContent)).toEqual([
      "small",
      "medium",
      "large",
    ]);
    await waitFor(() => expect(screen.getByRole("option", { name: "small" })).toHaveFocus());
    await user.keyboard("{ArrowDown}");
    await waitFor(() => expect(screen.getByRole("option", { name: "medium" })).toHaveFocus());
    await expectNoA11yViolations(listbox);

    await user.keyboard("{Enter}");
    await waitFor(() => expect(screen.queryByRole("listbox")).toBeNull());
    expect(onValueChange).toHaveBeenCalledWith("medium", expect.anything());
    expect(trigger).toHaveTextContent("medium");
    expect(trigger).toHaveFocus();
  });

  test("closes on Escape without changing the value", async () => {
    const user = userEvent.setup();
    render(
      <Select defaultValue="small">
        <SelectTrigger aria-label="Profile">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="small">small</SelectItem>
          <SelectItem value="medium">medium</SelectItem>
        </SelectContent>
      </Select>,
    );
    const trigger = screen.getByRole("combobox", { name: "Profile" });
    trigger.focus();
    await user.keyboard("{Enter}");
    await screen.findByRole("listbox");
    await user.keyboard("{ArrowDown}{Escape}");
    await waitFor(() => expect(screen.queryByRole("listbox")).toBeNull());
    expect(trigger).toHaveTextContent("small");
    expect(trigger).toHaveFocus();
  });
});

describe("Tooltip", () => {
  test("shows on focus, names nothing it shouldn't, and hides on Escape", async () => {
    const user = userEvent.setup();
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Region</TooltipTrigger>
          <TooltipContent>us-west-2</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );
    await user.tab();
    const trigger = screen.getByRole("button", { name: "Region" });
    expect(trigger).toHaveFocus();
    const tooltip = await screen.findByRole("tooltip");
    expect(tooltip).toHaveTextContent("us-west-2");
    expect(trigger).toHaveAccessibleDescription("us-west-2");

    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("tooltip")).toBeNull());
    expect(trigger).toHaveFocus();
  });
});

describe("Command", () => {
  test("filters as you type and runs the highlighted item on Enter", async () => {
    const user = userEvent.setup();
    const onSelect = mock((_: string) => {});
    const { container } = render(
      <Command label="Go to">
        <CommandInput placeholder="Search" />
        <CommandList>
          <CommandEmpty>No results.</CommandEmpty>
          <CommandGroup heading="Pages">
            <CommandItem onSelect={onSelect}>Sandboxes</CommandItem>
            <CommandItem onSelect={onSelect}>Clusters</CommandItem>
            <CommandItem onSelect={onSelect}>Settings</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>,
    );
    await expectNoA11yViolations(container);
    const input = screen.getByRole("combobox");
    await user.click(input);
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("option", { name: "Clusters" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await user.type(input, "settin");
    expect(screen.getAllByRole("option").map((option) => option.textContent)).toEqual(["Settings"]);
    await user.keyboard("{Enter}");
    expect(onSelect).toHaveBeenCalledWith("Settings");
    await user.clear(input);
    await user.type(input, "zzz");
    expect(screen.getByText("No results.")).toBeInTheDocument();
  });
});
