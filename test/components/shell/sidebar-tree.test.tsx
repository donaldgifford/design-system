import { describe, expect, mock, test } from "bun:test";
import { Dot } from "@donaldgifford/design-system/blocks/list-row";
import { SidebarProvider } from "@donaldgifford/design-system/components/sidebar";
import { ShellSidebar, ShellSidebarGroup } from "@donaldgifford/design-system/shell/sidebar";
import {
  ShellSidebarTreeItem,
  ShellSidebarTreeNote,
} from "@donaldgifford/design-system/shell/sidebar-tree";
import { expectNoA11yViolations } from "@test/axe";
import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";

function Nav({ children, open = true }: { children: ReactNode; open?: boolean }) {
  return (
    <SidebarProvider open={open}>
      <ShellSidebar label="Repository navigation">
        <ShellSidebarGroup label="Documents">{children}</ShellSidebarGroup>
      </ShellSidebar>
    </SidebarProvider>
  );
}

const item = (label: string) => {
  const row = screen.getByText(label).closest("[data-slot=sidebar-tree-item]");
  if (!(row instanceof HTMLElement)) throw new Error(`no row for ${label}`);
  return row;
};

describe("ShellSidebarTreeItem, the three forms", () => {
  test("render and no children: a link, with no caret", async () => {
    const { container } = render(
      <Nav>
        <ShellSidebarTreeItem label="Overview" render={<a href="#overview" />} />
      </Nav>,
    );
    const link = screen.getByRole("link", { name: "Overview" });
    expect(link).toHaveAttribute("href", "#overview");
    expect(link).toHaveAttribute("data-slot", "sidebar-menu-button");
    expect(item("Overview").tagName).toBe("LI");
    expect(item("Overview")).toHaveAttribute("data-depth", "0");
    expect(within(item("Overview")).queryByRole("button")).toBeNull();
    await expectNoA11yViolations(container);
  });

  test("render and children: a link, and a caret that only toggles", async () => {
    const user = userEvent.setup();
    const onOpenChange = mock((_: boolean) => {});
    const { container } = render(
      <Nav>
        <ShellSidebarTreeItem
          label="design"
          render={<a href="#design" />}
          onOpenChange={onOpenChange}
        >
          <ShellSidebarTreeItem label="DESIGN-0026" render={<a href="#design-0026" />} />
        </ShellSidebarTreeItem>
      </Nav>,
    );
    const link = screen.getByRole("link", { name: "design" });
    const caret = screen.getByRole("button", { name: "design, show contents" });
    expect(link).not.toHaveAttribute("aria-expanded");
    expect(caret).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("link", { name: "DESIGN-0026" })).toBeNull();

    await user.click(caret);
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
    expect(caret).toHaveAttribute("aria-expanded", "true");
    const panel = container.querySelector("[data-slot=collapsible-panel]");
    expect(caret.getAttribute("aria-controls")).toBe(panel?.id ?? "");
    expect(screen.getByRole("link", { name: "DESIGN-0026" })).toBeInTheDocument();
    // The caret is the last control in its row, after the link.
    expect(link.compareDocumentPosition(caret) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(caret.nextElementSibling).toBe(panel);
    await expectNoA11yViolations(container);
  });

  test("children and no render: one button, and the whole row toggles", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Nav>
        <ShellSidebarTreeItem label="Guides">
          <ShellSidebarTreeItem label="Install" render={<a href="#install" />} />
        </ShellSidebarTreeItem>
      </Nav>,
    );
    const row = screen.getByRole("button", { name: "Guides" });
    expect(within(item("Guides")).getAllByRole("button")).toHaveLength(1);
    expect(row).toHaveAttribute("aria-expanded", "false");
    await user.click(row);
    expect(row).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("link", { name: "Install" })).toBeInTheDocument();
    await expectNoA11yViolations(container);
  });
});

describe("ShellSidebarTreeItem, the caret", () => {
  test("expandable shows it before there are children", () => {
    render(
      <Nav>
        <ShellSidebarTreeItem label="rfc" render={<a href="#rfc" />} expandable />
      </Nav>,
    );
    expect(screen.getByRole("button", { name: "rfc, show contents" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  test("disabled, it cannot open and the link still works", async () => {
    const user = userEvent.setup();
    const onOpenChange = mock((_: boolean) => {});
    render(
      <Nav>
        <ShellSidebarTreeItem
          label="adr"
          render={<a href="#adr" />}
          expandable
          disabled
          onOpenChange={onOpenChange}
        />
      </Nav>,
    );
    const caret = screen.getByRole("button", { name: "adr, show contents" });
    expect(caret).toBeDisabled();
    await user.click(caret);
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(screen.getByRole("link", { name: "adr" })).toHaveAttribute("href", "#adr");
  });

  test("a badge sits beside it, left of it", () => {
    render(
      <Nav>
        <ShellSidebarTreeItem label="design" badge={27} render={<a href="#design" />} expandable />
      </Nav>,
    );
    const row = item("design");
    const badge = row.querySelector("[data-slot=sidebar-menu-badge]");
    const caret = within(row).getByRole("button", { name: "design, show contents" });
    expect(badge).toHaveTextContent("27");
    // The badge comes before the caret, and moves left for it.
    expect(badge?.nextElementSibling).toBe(caret);
    expect(badge?.className).toContain("has-[~[data-sidebar=menu-action]]:right-7");
    expect(screen.getByRole("link", { name: "design" }).className).toContain("pr-14");
  });
});

describe("ShellSidebarTreeItem, open state", () => {
  const branch = (props: {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
  }) => (
    <Nav>
      <ShellSidebarTreeItem label="design" render={<a href="#design" />} {...props}>
        <ShellSidebarTreeItem label="DESIGN-0026" render={<a href="#design-0026" />} />
        <ShellSidebarTreeNote>No more documents</ShellSidebarTreeNote>
      </ShellSidebarTreeItem>
    </Nav>
  );

  test("closed, the children are not in the DOM", () => {
    const { container } = render(branch({}));
    expect(container.querySelector("[data-slot=collapsible-panel]")).toBeNull();
    expect(container.querySelector("[data-slot=sidebar-menu-sub]")).toBeNull();
  });

  test("defaultOpen: the children are a nested list in the row's own item", async () => {
    const { container } = render(branch({ defaultOpen: true }));
    const list = container.querySelector("[data-slot=sidebar-menu-sub]");
    expect(list?.tagName).toBe("UL");
    expect(list?.closest("[data-slot=sidebar-tree-item]")).toBe(item("design"));
    expect(item("DESIGN-0026").parentElement === list).toBe(true);
    expect(screen.getByText("No more documents").tagName).toBe("LI");
    await expectNoA11yViolations(container);
  });

  test("controlled: it reports a toggle and waits for the app", async () => {
    const user = userEvent.setup();
    const onOpenChange = mock((_: boolean) => {});
    const { rerender } = render(branch({ open: false, onOpenChange }));
    const caret = screen.getByRole("button", { name: "design, show contents" });
    await user.click(caret);
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
    expect(caret).toHaveAttribute("aria-expanded", "false");
    rerender(branch({ open: true, onOpenChange }));
    expect(caret).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("link", { name: "DESIGN-0026" })).toBeInTheDocument();
  });
});

describe("ShellSidebarTreeItem, depth and leaves", () => {
  test("each level is a list in the one above, and counts its own depth", async () => {
    const { container } = render(
      <Nav>
        <ShellSidebarTreeItem label="one" defaultOpen>
          <ShellSidebarTreeItem label="two" defaultOpen>
            <ShellSidebarTreeItem label="three" defaultOpen>
              <ShellSidebarTreeItem label="four" defaultOpen>
                <ShellSidebarTreeItem label="five" render={<a href="#five" />} />
              </ShellSidebarTreeItem>
            </ShellSidebarTreeItem>
          </ShellSidebarTreeItem>
        </ShellSidebarTreeItem>
      </Nav>,
    );
    for (const [depth, label] of ["one", "two", "three", "four", "five"].entries()) {
      expect(item(label)).toHaveAttribute("data-depth", String(depth));
    }
    const lists = [...container.querySelectorAll("[data-slot=sidebar-menu-sub]")];
    expect(lists.map((list) => list.getAttribute("data-depth"))).toEqual(["1", "2", "3", "4"]);
    // The first list hangs under the row's icon; the ones below it step in less.
    expect(lists[0]?.className).not.toContain("ml-2");
    expect(lists[1]?.className).toContain("ml-2");
    await expectNoA11yViolations(container);
  });

  test("a nested leaf is one line with its label as title", () => {
    const label = "DESIGN-0026 The shell in the look of its first consumer";
    render(
      <Nav>
        <ShellSidebarTreeItem label="design" defaultOpen>
          <ShellSidebarTreeItem label={label} render={<a href="#design-0026" />} />
        </ShellSidebarTreeItem>
      </Nav>,
    );
    const link = screen.getByRole("link", { name: label });
    expect(link).toHaveAttribute("data-slot", "sidebar-menu-sub-button");
    expect(link).toHaveAttribute("title", label);
    expect(screen.getByText(label).className).toContain("truncate");
  });

  test("the active leaf is the current page and colors its stretch of the hairline", async () => {
    const { container } = render(
      <Nav>
        <ShellSidebarTreeItem label="design" render={<a href="#design" />} defaultOpen>
          <ShellSidebarTreeItem label="DESIGN-0026" render={<a href="#design-0026" />} active />
          <ShellSidebarTreeItem label="DESIGN-0027" render={<a href="#design-0027" />} />
        </ShellSidebarTreeItem>
      </Nav>,
    );
    const current = screen.getByRole("link", { name: "DESIGN-0026" });
    expect(current).toHaveAttribute("aria-current", "page");
    expect(current).toHaveAttribute("data-active", "true");
    expect(item("DESIGN-0026").className).toContain("before:bg-sidebar-primary");
    expect(item("DESIGN-0026").className).toContain("before:w-0.5");
    expect(screen.getByRole("link", { name: "DESIGN-0027" })).not.toHaveAttribute("aria-current");
    expect(item("DESIGN-0027").className).not.toContain("before:bg-sidebar-primary");
    expect(screen.getByRole("link", { name: "design" })).not.toHaveAttribute("aria-current");
    await expectNoA11yViolations(container);
  });

  test("leading sits before the label in one fixed square", () => {
    render(
      <Nav>
        <ShellSidebarTreeItem
          label="design"
          leading={<Dot tone="var(--category-2)" />}
          render={<a href="#design" />}
        />
      </Nav>,
    );
    const link = screen.getByRole("link", { name: "design" });
    const leading = link.querySelector("[data-slot=sidebar-tree-leading]");
    expect(leading?.querySelector("[data-slot=dot]")).toBeInTheDocument();
    expect(leading?.nextElementSibling).toHaveTextContent("design");
  });
});

describe("ShellSidebarTreeItem, the keyboard", () => {
  test("Tab reaches every link and caret in order; Enter and Space toggle a caret", async () => {
    const user = userEvent.setup();
    render(
      <Nav>
        <ShellSidebarTreeItem label="design" render={<a href="#design" />} defaultOpen>
          <ShellSidebarTreeItem label="DESIGN-0026" render={<a href="#design-0026" />} />
        </ShellSidebarTreeItem>
        <ShellSidebarTreeItem label="Guides">
          <ShellSidebarTreeItem label="Install" render={<a href="#install" />} />
        </ShellSidebarTreeItem>
      </Nav>,
    );
    const design = screen.getByRole("link", { name: "design" });
    const caret = screen.getByRole("button", { name: "design, show contents" });
    act(() => design.focus());
    await user.tab();
    expect(caret).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("link", { name: "DESIGN-0026" })).toHaveFocus();
    await user.tab();
    const guides = screen.getByRole("button", { name: "Guides" });
    expect(guides).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(guides).toHaveAttribute("aria-expanded", "true");
    await user.tab();
    expect(screen.getByRole("link", { name: "Install" })).toHaveFocus();

    act(() => caret.focus());
    await user.keyboard(" ");
    expect(caret).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("link", { name: "DESIGN-0026" })).toBeNull();
    await user.keyboard("{Enter}");
    expect(caret).toHaveAttribute("aria-expanded", "true");
  });
});

describe("ShellSidebarTreeItem, on the icon rail", () => {
  test("a top-level row shows its leading, or a mark with the label's first letter", async () => {
    const { container } = render(
      <Nav open={false}>
        <ShellSidebarTreeItem
          label="design"
          leading={<Dot tone="var(--category-2)" />}
          render={<a href="#design" />}
        />
        <ShellSidebarTreeItem label="rfc" render={<a href="#rfc" />} />
      </Nav>,
    );
    const design = screen.getByRole("link", { name: "design" });
    expect(design.querySelector("[data-slot=dot]")).toBeInTheDocument();
    expect(design.querySelector("[data-slot=sidebar-tree-mark]")).toBeNull();
    const mark = screen
      .getByRole("link", { name: "rfc" })
      .querySelector("[data-slot=sidebar-tree-mark]");
    expect(mark).toHaveTextContent("r");
    expect(mark).toHaveAttribute("aria-hidden", "true");
    await expectNoA11yViolations(container);
  });

  test("the label is the row's tooltip", async () => {
    const user = userEvent.setup();
    render(
      <Nav open={false}>
        <ShellSidebarTreeItem label="design" render={<a href="#design" />} />
      </Nav>,
    );
    await user.tab();
    expect(screen.getByRole("link", { name: "design" })).toHaveFocus();
    expect(await screen.findByRole("tooltip")).toHaveTextContent("design");
  });

  test("expanded, there is no mark", () => {
    render(
      <Nav>
        <ShellSidebarTreeItem label="rfc" render={<a href="#rfc" />} />
      </Nav>,
    );
    expect(document.querySelector("[data-slot=sidebar-tree-mark]")).toBeNull();
  });

  test("a row with children opens a popover with its subtree fully open", async () => {
    const user = userEvent.setup();
    const onOpenChange = mock((_: boolean) => {});
    render(
      <Nav open={false}>
        <ShellSidebarTreeItem
          label="design"
          render={<a href="#design" />}
          active
          onOpenChange={onOpenChange}
        >
          <ShellSidebarTreeItem label="DESIGN-0026" render={<a href="#design-0026" />} />
          <ShellSidebarTreeItem label="Archive">
            <ShellSidebarTreeItem label="DESIGN-0001" render={<a href="#design-0001" />} />
          </ShellSidebarTreeItem>
          <ShellSidebarTreeNote>No more documents</ShellSidebarTreeNote>
        </ShellSidebarTreeItem>
      </Nav>,
    );
    // Nested rows are not on the rail, and the row is a button, not the link.
    expect(screen.queryByRole("link")).toBeNull();
    const row = screen.getByRole("button", { name: "design" });
    expect(row).toHaveAttribute("aria-haspopup", "dialog");
    expect(onOpenChange).not.toHaveBeenCalled();

    await user.tab();
    expect(row).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(onOpenChange).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenLastCalledWith(true);

    const popover = await screen.findByRole("dialog", { name: "design" });
    // The popover's heading is the row's link.
    const heading = within(popover).getByRole("link", { name: "design" });
    expect(heading).toHaveAttribute("href", "#design");
    expect(heading).toHaveAttribute("aria-current", "page");
    // Every branch is open and none has a caret.
    expect(within(popover).getByRole("link", { name: "DESIGN-0026" })).toBeInTheDocument();
    expect(within(popover).getByRole("link", { name: "DESIGN-0001" })).toBeInTheDocument();
    expect(within(popover).queryByRole("button")).toBeNull();
    expect(within(popover).getByText("Archive").closest("a, button")).toBeNull();
    // Under a height cap, in a ScrollArea.
    const area = popover.querySelector("[data-slot=scroll-area]");
    expect(area?.className).toContain("max-h-80");
    expect(area?.querySelector("[data-slot=sidebar-tree-flyout]")?.tagName).toBe("UL");
    await expectNoA11yViolations(popover);

    // Every link in the popover is a tab stop.
    const links = within(popover).getAllByRole("link");
    expect(links.map((link) => link.textContent)).toEqual(["design", "DESIGN-0026", "DESIGN-0001"]);
    for (const link of links) expect(link.tabIndex).toBe(0);
  });

  test("a row that toggles gets a plain heading in the popover", async () => {
    const user = userEvent.setup();
    render(
      <Nav open={false}>
        <ShellSidebarTreeItem label="Guides">
          <ShellSidebarTreeItem label="Install" render={<a href="#install" />} />
        </ShellSidebarTreeItem>
      </Nav>,
    );
    await user.click(screen.getByRole("button", { name: "Guides" }));
    const popover = await screen.findByRole("dialog", { name: "Guides" });
    expect(popover.querySelector("[data-slot=sidebar-tree-heading]")).toHaveTextContent("Guides");
    expect(within(popover).getAllByRole("link")).toHaveLength(1);
  });
});
