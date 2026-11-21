import { describe, expect, test } from "bun:test";
import {
  StatusBanner,
  StatusComponents,
  statusHeadline,
  statusTone,
} from "@donaldgifford/design-system/blocks/status";
import { StatusPageLayout } from "@donaldgifford/design-system/shell/status-page";
import { expectNoA11yViolations } from "@test/axe";
import { render, screen, within } from "@testing-library/react";

describe("statusTone and statusHeadline", () => {
  test("known states have their tone; anything else is a disruption", () => {
    expect(["operational", "degraded", "unknown", "down", "on_fire", ""].map(statusTone)).toEqual([
      "success",
      "warning",
      "muted",
      "destructive",
      "destructive",
      "destructive",
    ]);
    expect(["operational", "degraded", "unknown", "down"].map(statusHeadline)).toEqual([
      "All systems operational",
      "Degraded performance",
      "Status not yet available",
      "Service disruption",
    ]);
  });
});

describe("StatusBanner", () => {
  test("is a named status region with the state's headline, tone and badge", async () => {
    const { container, rerender } = render(
      <main>
        <StatusBanner state="degraded" note="Aggregate-only." />
      </main>,
    );
    const banner = screen.getByRole("status", { name: "Overall status" });
    expect(banner).toHaveAttribute("data-state", "degraded");
    expect(banner).toHaveAttribute("data-slot", "alert");
    expect(banner).toHaveTextContent("Degraded performance");
    expect(banner).toHaveTextContent("Aggregate-only.");
    expect(banner.querySelector('[data-slot="status-badge"]')).toHaveTextContent("degraded");
    const dot = banner.querySelector('[data-slot="dot"]');
    expect(dot).toHaveAttribute("data-tone", "warn");
    expect(dot).toHaveClass("animate-pulse");
    await expectNoA11yViolations(container);

    rerender(
      <main>
        <StatusBanner state="unknown" headline="Starting up" />
      </main>,
    );
    const quiet = screen.getByRole("status", { name: "Overall status" });
    expect(quiet).toHaveTextContent("Starting up");
    expect(quiet.querySelector('[data-slot="dot"]')).not.toHaveClass("animate-pulse");
  });
});

describe("StatusComponents", () => {
  test("is a list row per component with its detail and state, then the note", async () => {
    const { container } = render(
      <main>
        <StatusComponents
          items={[
            { name: "api", state: "operational", detail: "p95 84 ms" },
            { name: "queue", state: "rate_limited" },
          ]}
          note="queue is informational."
        />
      </main>,
    );
    const rows = screen.getAllByRole("listitem");
    expect(rows).toHaveLength(2);
    expect(rows[0]).toHaveTextContent("apip95 84 msoperational");
    expect(rows[0]).toHaveAttribute("data-component", "api");
    expect(rows[0]?.querySelector('[data-slot="list-row"]')).not.toBeNull();
    expect(rows[1]).toHaveTextContent("rate limited");
    expect(rows[1]?.querySelector('[data-slot="dot"]')).toHaveAttribute("data-tone", "bad");
    expect(screen.getByText("queue is informational.")).toBeInTheDocument();
    await expectNoA11yViolations(container);
  });

  test("says so when nothing has reported", () => {
    render(<StatusComponents items={[]} empty="Nothing yet." />);
    expect(screen.queryByRole("list")).toBeNull();
    expect(screen.getByText("Nothing yet.")).toBeInTheDocument();
  });
});

describe("StatusPageLayout", () => {
  test("is the main landmark under a PageHeader, with actions and a footer", async () => {
    const { container } = render(
      <StatusPageLayout
        title="Fleet status"
        description="updated 12s ago"
        actions={<a href="/in">Sign in</a>}
        footer={<code>GET /status</code>}
      >
        <StatusBanner state="operational" />
      </StatusPageLayout>,
    );
    const main = screen.getByRole("main");
    expect(main.querySelector('[data-slot="page-header"]')).not.toBeNull();
    expect(within(main).getByRole("heading", { level: 1 })).toHaveTextContent("Fleet status");
    expect(main).toHaveTextContent("updated 12s ago");
    expect(within(main).getByRole("link", { name: "Sign in" })).toHaveAttribute("href", "/in");
    expect(screen.getByRole("contentinfo")).toHaveTextContent("GET /status");
    await expectNoA11yViolations(container);
  });

  test("leaves out the description, actions and footer when not given", () => {
    render(<StatusPageLayout title="Fleet status" />);
    expect(screen.queryByRole("contentinfo")).toBeNull();
    expect(screen.getByRole("main").querySelector("p")).toBeNull();
    expect(screen.getByRole("main").querySelector('[data-slot="page-header-actions"]')).toBeNull();
  });
});
