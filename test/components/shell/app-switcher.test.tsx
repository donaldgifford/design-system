import { describe, expect, test } from "bun:test";
import { SidebarProvider } from "@donaldgifford/design-system/components/sidebar";
import { AppSwitcher, type SwitcherApp } from "@donaldgifford/design-system/shell/app-switcher";
import { ShellSidebar } from "@donaldgifford/design-system/shell/sidebar";
import { IconRefresh, IconShieldCheck } from "@tabler/icons-react";
import { expectNoA11yViolations } from "@test/axe";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const apps: SwitcherApp[] = [
  { id: "updates", name: "Updates", subtitle: "fleet", icon: IconRefresh, url: "https://u.test" },
  { id: "compliance", name: "Compliance", icon: IconShieldCheck, url: "https://c.test" },
  { id: "wiki", name: "Wiki", url: "https://w.test" },
];

// biome-ignore lint/a11y/useAnchorContent: the switcher renders its content into the link
const home = <a href="/home" />;

function Frame({ list, current = "updates" }: { list: readonly SwitcherApp[]; current?: string }) {
  return (
    <SidebarProvider>
      <ShellSidebar
        label="Home navigation"
        header={<AppSwitcher apps={list} current={current} home={home} />}
      />
    </SidebarProvider>
  );
}

describe("AppSwitcher", () => {
  test("with one app is the identity as a link home, with no menu", async () => {
    const { container } = render(<Frame list={apps.slice(0, 1)} />);
    const home = screen.getByRole("link", { name: /Updates/ });
    expect(home).toHaveAttribute("href", "/home");
    expect(home).toHaveTextContent("fleet");
    expect(screen.queryByRole("button", { name: /Apps/ })).toBeNull();
    await expectNoA11yViolations(container);
  });

  test("with more is a menu: the current app marked, the others plain links", async () => {
    const user = userEvent.setup();
    render(<Frame list={apps} />);
    const trigger = screen.getByRole("button", { name: /Apps: Updates/ });
    expect(screen.queryByRole("menu")).toBeNull();
    await user.click(trigger);
    const menu = await screen.findByRole("menu");
    const items = within(menu).getAllByRole("menuitem");
    expect(items).toHaveLength(3);
    const [self, other, unknown] = items;
    expect(self).toHaveAttribute("aria-current", "true");
    expect(self).toHaveAttribute("href", "/home");
    expect(self).toHaveTextContent("current");
    expect(other).toHaveAttribute("href", "https://c.test");
    expect(other).not.toHaveAttribute("aria-current");
    expect(other).not.toHaveAttribute("target");
    expect(other?.tagName).toBe("A");
    expect(unknown).toHaveAttribute("href", "https://w.test");
    // Every row has a mark, the one with no icon included.
    expect(menu.querySelectorAll('[data-slot="app-mark"][data-size="sm"] svg')).toHaveLength(3);
    await expectNoA11yViolations(menu);
  });

  test("opens from the keyboard and closes on Escape", async () => {
    const user = userEvent.setup();
    render(<Frame list={apps} />);
    screen.getByRole("button", { name: /Apps: Updates/ }).focus();
    await user.keyboard("{Enter}");
    expect(await screen.findByRole("menu")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("menu")).toBeNull();
  });

  test("the current app need not be first", async () => {
    const user = userEvent.setup();
    render(<Frame list={apps} current="compliance" />);
    await user.click(screen.getByRole("button", { name: /Apps: Compliance/ }));
    const menu = await screen.findByRole("menu");
    expect(within(menu).getByRole("menuitem", { name: /Compliance/ })).toHaveAttribute(
      "aria-current",
      "true",
    );
  });

  test("throws when the current app is not in the list", () => {
    const error = console.error;
    console.error = () => {};
    try {
      expect(() => render(<Frame list={apps} current="nope" />)).toThrow(/no app with id "nope"/);
    } finally {
      console.error = error;
    }
  });
});

describe("AppMark in a menu row", () => {
  test("the icon carries its own color and size, so an item's tint skips it", async () => {
    const user = userEvent.setup();
    render(<Frame list={apps} />);
    await user.click(screen.getByRole("button", { name: /Apps: Updates/ }));
    const menu = await screen.findByRole("menu");
    const icon = menu.querySelector('[data-slot="app-mark"] svg');
    expect(icon).toHaveClass("text-current", "size-3.5");
  });
});
