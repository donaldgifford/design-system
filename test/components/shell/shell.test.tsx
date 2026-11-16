import { describe, expect, mock, test } from "bun:test";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@donaldgifford/design-system/components/sidebar";
import { DetailSheetLayout } from "@donaldgifford/design-system/shell/detail-sheet";
import { PageSkeleton } from "@donaldgifford/design-system/shell/page-skeleton";
import { RouteErrorLayout } from "@donaldgifford/design-system/shell/route-error";
import {
  AppMark,
  AvatarMark,
  ShellSidebar,
  ShellSidebarGroup,
  ShellSidebarIdentity,
} from "@donaldgifford/design-system/shell/sidebar";
import { initialsOf, Kbd, TopBarLayout } from "@donaldgifford/design-system/shell/top-bar";
import { IconServer } from "@tabler/icons-react";
import { expectNoA11yViolations } from "@test/axe";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("initialsOf", () => {
  test("two initials from a name, else from the email's local part", () => {
    expect(initialsOf("Donald Gifford", "x@example.com")).toBe("DG");
    expect(initialsOf(undefined, "dev@example.com")).toBe("DE");
    expect(initialsOf("", "ana.ruiz@example.com")).toBe("AR");
    expect(initialsOf("Cher", "c@example.com")).toBe("CH");
  });
});

describe("TopBarLayout", () => {
  test("lays out its start and end slots in a banner", async () => {
    const { container } = render(
      <TopBarLayout
        start={<span>Clusters</span>}
        end={
          <button type="button">
            <span className="sr-only">Go to</span>
            <Kbd>⌘K</Kbd>
          </button>
        }
      />,
    );
    expect(screen.getByRole("banner")).toHaveAttribute("data-slot", "top-bar");
    expect(screen.getByRole("button", { name: "Go to ⌘K" })).toBeInTheDocument();
    expect(container.querySelector('[data-slot="kbd"]')).toHaveTextContent("⌘K");
    await expectNoA11yViolations(container);
  });
});

describe("ShellSidebar", () => {
  test("renders a named nav landmark with labelled and unlabelled groups", async () => {
    const { container } = render(
      <SidebarProvider>
        <ShellSidebar
          label="Home navigation"
          header={
            <SidebarMenuButton size="lg">
              <ShellSidebarIdentity mark={<AppMark icon={IconServer} />} title="Fleet" />
            </SidebarMenuButton>
          }
          footer={
            <SidebarMenuButton size="lg">
              <ShellSidebarIdentity
                mark={<AvatarMark initials="AL" />}
                title="Alex Lee"
                subtitle="alex@example.com"
              />
            </SidebarMenuButton>
          }
        >
          <ShellSidebarGroup label="Reference">
            <SidebarMenuItem>Design system</SidebarMenuItem>
          </ShellSidebarGroup>
          <ShellSidebarGroup>
            <SidebarMenuItem>Overview</SidebarMenuItem>
          </ShellSidebarGroup>
        </ShellSidebar>
      </SidebarProvider>,
    );
    expect(screen.getByRole("navigation", { name: "Home navigation" })).toBeInTheDocument();
    expect(screen.getByText("Reference")).toHaveAttribute("data-slot", "sidebar-group-label");
    expect(container.querySelectorAll('[data-slot="sidebar-group-label"]')).toHaveLength(1);
    expect(container.querySelector('[data-slot="sidebar-header"]')).toHaveTextContent("Fleet");
    expect(container.querySelector('[data-slot="app-mark"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="sidebar-footer"]')).toHaveTextContent(
      "ALAlex Leealex@example.com",
    );
    await expectNoA11yViolations(container);
  });
});

describe("DetailSheetLayout", () => {
  test("shows its title, description, and body while open, and reports a close", async () => {
    const onOpenChange = mock((_open: boolean) => undefined);
    const user = userEvent.setup();
    render(
      <DetailSheetLayout open onOpenChange={onOpenChange} title="op_01" description="CreateSandbox">
        <p>Body</p>
      </DetailSheetLayout>,
    );
    const dialog = screen.getByRole("dialog", { name: "op_01" });
    expect(dialog).toHaveTextContent("CreateSandbox");
    expect(dialog).toHaveTextContent("Body");
    await expectNoA11yViolations(dialog);
    await user.keyboard("{Escape}");
    expect(onOpenChange).toHaveBeenCalledWith(false, expect.anything());
  });

  test("renders nothing while closed", () => {
    render(
      <DetailSheetLayout open={false} onOpenChange={() => undefined} title="op_01">
        <p>Body</p>
      </DetailSheetLayout>,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});

describe("RouteErrorLayout", () => {
  test("shows the reason, status, message, and request id, and retries", async () => {
    const onRetry = mock(() => undefined);
    const user = userEvent.setup();
    const { container } = render(
      <RouteErrorLayout
        title="NOT_ENTITLED"
        status={403}
        message="team payments lacks the sandbox entitlement"
        requestId="req-1"
        onRetry={onRetry}
      />,
    );
    const alert = screen.getByRole("alert");
    expect(screen.getByTestId("error-reason")).toHaveTextContent("NOT_ENTITLED");
    expect(alert).toHaveTextContent("HTTP 403");
    expect(alert).toHaveTextContent("request req-1");
    await user.click(screen.getByRole("button", { name: "Retry" }));
    expect(onRetry).toHaveBeenCalledTimes(1);
    await expectNoA11yViolations(container);
  });

  test("leaves out the status and request id for a non-API error", () => {
    render(<RouteErrorLayout title="Something went wrong" message="boom" onRetry={() => {}} />);
    const alert = screen.getByRole("alert");
    expect(alert).not.toHaveTextContent("HTTP");
    expect(alert).not.toHaveTextContent("request");
  });
});

describe("PageSkeleton", () => {
  test("is a busy status region", async () => {
    const { container } = render(<PageSkeleton />);
    expect(screen.getByRole("status", { name: "Loading" })).toHaveAttribute("aria-busy", "true");
    await expectNoA11yViolations(container);
  });
});
