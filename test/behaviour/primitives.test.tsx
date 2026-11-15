// Keyboard, focus, and role contracts for the non-overlay primitives on
// the engine: tabs, the sidebar, scroll area, separator,
// and the slot-based button, badge, and breadcrumb. Engine-agnostic, like
// overlays.test.tsx.
import { describe, expect, mock, test } from "bun:test";
import { Badge } from "@donaldgifford/design-system/components/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@donaldgifford/design-system/components/breadcrumb";
import { Button } from "@donaldgifford/design-system/components/button";
import { ScrollArea } from "@donaldgifford/design-system/components/scroll-area";
import { Separator } from "@donaldgifford/design-system/components/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@donaldgifford/design-system/components/sidebar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@donaldgifford/design-system/components/tabs";
import { expectNoA11yViolations } from "@test/axe";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("Tabs", () => {
  test("arrow keys move and activate, Home and End jump, Tab leaves the list", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <>
        <Tabs defaultValue="overview">
          <TabsList aria-label="Sections">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">Overview body</TabsContent>
          <TabsContent value="events">Events body</TabsContent>
          <TabsContent value="logs">Logs body</TabsContent>
        </Tabs>
        <button type="button">After</button>
      </>,
    );
    await user.tab();
    expect(screen.getByRole("tab", { name: "Overview" })).toHaveFocus();
    await user.keyboard("{ArrowRight}");
    const events = screen.getByRole("tab", { name: "Events" });
    expect(events).toHaveFocus();
    expect(events).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel", { name: "Events" })).toHaveTextContent("Events body");
    await user.keyboard("{End}");
    expect(screen.getByRole("tab", { name: "Logs" })).toHaveFocus();
    await user.keyboard("{Home}");
    expect(screen.getByRole("tab", { name: "Overview" })).toHaveFocus();
    await user.keyboard("{ArrowLeft}");
    expect(screen.getByRole("tab", { name: "Logs" })).toHaveFocus();
    await expectNoA11yViolations(container);
    await user.tab();
    expect(document.activeElement?.getAttribute("role")).not.toBe("tab");
  });
});

function SidebarState() {
  const { open } = useSidebar();
  return <output aria-label="Sidebar state">{open ? "open" : "closed"}</output>;
}

describe("Sidebar", () => {
  test("the trigger and the keyboard shortcut toggle it", async () => {
    const user = userEvent.setup();
    render(
      <SidebarProvider defaultOpen>
        <Sidebar collapsible="offcanvas">
          <SidebarContent>
            <nav aria-label="Main">nav</nav>
          </SidebarContent>
        </Sidebar>
        <main>
          <SidebarTrigger />
          <SidebarState />
        </main>
      </SidebarProvider>,
    );
    const state = screen.getByRole("status", { name: "Sidebar state" });
    expect(state).toHaveTextContent("open");
    await user.click(screen.getByRole("button", { name: "Toggle Sidebar" }));
    expect(state).toHaveTextContent("closed");
    await user.keyboard("{Control>}b{/Control}");
    expect(state).toHaveTextContent("open");
  });
});

describe("ScrollArea", () => {
  test("renders its content in a viewport", async () => {
    const { container } = render(
      <ScrollArea className="h-20">
        <p>Line one</p>
        <p>Line two</p>
      </ScrollArea>,
    );
    expect(screen.getByText("Line two")).toBeInTheDocument();
    await expectNoA11yViolations(container);
  });
});

describe("Separator", () => {
  test("is decorative by default and a vertical separator when asked", () => {
    render(
      <>
        <Separator data-testid="decorative" />
        <Separator decorative={false} orientation="vertical" />
      </>,
    );
    expect(screen.getByTestId("decorative")).not.toHaveAttribute("role", "separator");
    expect(screen.getByRole("separator")).toHaveAttribute("aria-orientation", "vertical");
  });
});

describe("Button, Badge, Breadcrumb", () => {
  test("a button is a button, focusable, and inert when disabled", async () => {
    const user = userEvent.setup();
    const onClick = mock(() => {});
    render(
      <>
        <Button onClick={onClick}>Save</Button>
        <Button disabled onClick={onClick}>
          Delete
        </Button>
      </>,
    );
    await user.tab();
    expect(screen.getByRole("button", { name: "Save" })).toHaveFocus();
    await user.keyboard("{Enter}");
    await user.click(screen.getByRole("button", { name: "Delete" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test("a badge is inline text with its variant", () => {
    render(<Badge variant="success">ready</Badge>);
    expect(screen.getByText("ready")).toHaveAttribute("data-variant", "success");
  });

  test("a breadcrumb is a navigation landmark ending at the current page", async () => {
    const { container } = render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Design system</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    );
    expect(screen.getByRole("navigation", { name: "breadcrumb" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
    expect(screen.getByText("Design system")).toHaveAttribute("aria-current", "page");
    await expectNoA11yViolations(container);
  });
});
