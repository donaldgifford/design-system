/**
 * The sidebar tree is additive: an app whose navigation is flat rows in a
 * `ShellSidebarGroup` gets the markup it got in 0.4.0. The fixture is that
 * markup, recorded by rendering `FlatNav` below against the v0.4.0 tag.
 *
 * 0.5.0 restyled two things in `components/sidebar` on purpose (see the
 * README's local-edits table), and only in classes: a pressed row takes
 * `surface-pressed`, and a badge moves left of an action in the same row.
 * Those are undone before comparing, so anything else that differs fails.
 */
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@donaldgifford/design-system/components/sidebar";
import { ShellSidebar, ShellSidebarGroup } from "@donaldgifford/design-system/shell/sidebar";
import {
  IconGitBranch,
  IconLayoutDashboard,
  IconRocket,
  IconServer,
  type TablerIcon,
} from "@tabler/icons-react";
import { render, screen } from "@testing-library/react";

interface Item {
  label: string;
  href: string;
  icon: TablerIcon;
  count?: number;
}

const groups: { label?: string; items: Item[] }[] = [
  { items: [{ label: "Overview", href: "#overview", icon: IconLayoutDashboard }] },
  {
    label: "Fleet",
    items: [
      { label: "Clusters", href: "#clusters", icon: IconServer, count: 14 },
      { label: "Deployments", href: "#deployments", icon: IconRocket, count: 3 },
      { label: "Promotions", href: "#promotions", icon: IconGitBranch },
    ],
  },
];

const active = "#clusters";

/**
 * A flat navigation as an app on 0.4.0 composes it: groups of
 * `SidebarMenuItem`s, each a link with an icon, a tooltip for the rail
 * and sometimes a count. No tree rows.
 */
function FlatNav() {
  return (
    <SidebarProvider>
      <ShellSidebar label="Fleet navigation">
        {groups.map((group) => (
          <ShellSidebarGroup key={group.label ?? "ungrouped"} label={group.label}>
            {group.items.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  isActive={item.href === active}
                  tooltip={item.label}
                  render={
                    <a href={item.href} aria-current={item.href === active ? "page" : undefined} />
                  }
                >
                  <item.icon aria-hidden="true" />
                  <span>{item.label}</span>
                </SidebarMenuButton>
                {item.count ? <SidebarMenuBadge>{item.count}</SidebarMenuBadge> : null}
              </SidebarMenuItem>
            ))}
          </ShellSidebarGroup>
        ))}
      </ShellSidebar>
    </SidebarProvider>
  );
}

/** Classes 0.5.0 added to `components/sidebar`, and what each replaced. */
const restyled: readonly (readonly [added: string, was: string | undefined])[] = [
  ["active:bg-surface-pressed", "active:bg-sidebar-accent"],
  ["has-[~[data-sidebar=menu-action]]:right-7", undefined],
  ["[[data-sidebar=menu-action]~&]:right-7", undefined],
];

/** Generated ids differ from run to run; which element has one does not. */
const withoutIds = (html: string) => html.replace(/ id="base-ui-[^"]*"/g, ' id="generated"');

function markupAsIn040(nav: HTMLElement): string {
  const copy = nav.cloneNode(true) as HTMLElement;
  for (const element of copy.querySelectorAll("[class]")) {
    const classes = (element.getAttribute("class") ?? "").split(" ").flatMap((name) => {
      const change = restyled.find(([added]) => added === name);
      if (!change) return [name];
      return change[1] === undefined ? [] : [change[1]];
    });
    element.setAttribute("class", classes.join(" "));
  }
  return withoutIds(copy.innerHTML);
}

describe("a flat ShellSidebarGroup", () => {
  test("renders the markup it rendered in 0.4.0", () => {
    const recorded = readFileSync(
      join(import.meta.dir, "../../fixtures/flat-nav-0.4.0.html"),
      "utf8",
    ).trimEnd();
    render(<FlatNav />);
    const nav = screen.getByRole("navigation", { name: "Fleet navigation" });
    expect(markupAsIn040(nav)).toBe(withoutIds(recorded));
  });

  test("has no part of the tree in it", () => {
    render(<FlatNav />);
    const nav = screen.getByRole("navigation", { name: "Fleet navigation" });
    expect(nav.querySelector("[data-slot^=sidebar-tree]")).toBeNull();
    expect(nav.querySelector("[data-slot^=collapsible]")).toBeNull();
    expect(nav.querySelector("[aria-expanded]")).toBeNull();
  });
});
