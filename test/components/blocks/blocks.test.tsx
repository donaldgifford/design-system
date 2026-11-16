import { describe, expect, test } from "bun:test";
import { CodeBlock } from "@donaldgifford/design-system/blocks/code-block";
import { EmptyState } from "@donaldgifford/design-system/blocks/empty-state";
import { ErrorState } from "@donaldgifford/design-system/blocks/error-state";
import { Kpi } from "@donaldgifford/design-system/blocks/kpi";
import { PageHeader } from "@donaldgifford/design-system/blocks/page-header";
import { Stepper } from "@donaldgifford/design-system/blocks/stepper";
import { Button } from "@donaldgifford/design-system/components/button";
import { ApiError } from "@donaldgifford/design-system/lib/errors";
import { IconBoxMultiple } from "@tabler/icons-react";
import { expectNoA11yViolations } from "@test/axe";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("Kpi", () => {
  test("renders label, value, and hint", async () => {
    const { container } = render(
      <main>
        <Kpi label="Sandboxes" value={3} hint="of 5" icon={IconBoxMultiple} tone="warning" />
      </main>,
    );
    expect(screen.getByText("Sandboxes")).toBeInTheDocument();
    expect(screen.getByText("3")).toHaveClass("text-warning");
    expect(screen.getByText("of 5")).toBeInTheDocument();
    await expectNoA11yViolations(container);
  });
});

describe("PageHeader", () => {
  test("renders the title as the page heading with description and actions", async () => {
    const { container } = render(
      <main>
        <PageHeader
          title="Sandboxes"
          description="Your team's sandboxes"
          actions={<Button>New sandbox</Button>}
        />
      </main>,
    );
    expect(screen.getByRole("heading", { level: 1, name: "Sandboxes" })).toBeInTheDocument();
    expect(screen.getByText("Your team's sandboxes")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "New sandbox" })).toBeInTheDocument();
    await expectNoA11yViolations(container);
  });
});

describe("Stepper", () => {
  test("marks the current step and renders done and failed markers", async () => {
    const { container } = render(
      <main>
        <Stepper
          steps={[
            { id: "a", label: "Validate", status: "done" },
            { id: "b", label: "Run", status: "current", description: "run-microvm" },
            { id: "c", label: "Verify", status: "upcoming" },
            { id: "d", label: "Cleanup", status: "failed" },
          ]}
        />
      </main>,
    );
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(4);
    expect(items[1]).toHaveAttribute("aria-current", "step");
    expect(items[0]).toHaveAttribute("data-status", "done");
    expect(items[3]).toHaveAttribute("data-status", "failed");
    expect(screen.getByText("run-microvm")).toBeInTheDocument();
    await expectNoA11yViolations(container);
  });
});

describe("CodeBlock", () => {
  test("highlights tokens and copies the code", async () => {
    const user = userEvent.setup();
    let copied = "";
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async (text: string) => {
          copied = text;
        },
      },
    });
    const code = '{"name": "prod-1", "ready": true, "nodes": 3}';
    const { container } = render(
      <main>
        <CodeBlock code={code} language="json" title="cluster.json" />
      </main>,
    );
    expect(screen.getByText("cluster.json")).toBeInTheDocument();
    const codeEl = container.querySelector("code");
    expect(codeEl).toHaveAttribute("data-language", "json");
    expect(codeEl?.textContent).toBe(code);
    expect(screen.getByText('"name"')).toHaveClass("text-chart-1");
    expect(screen.getByText("true")).toHaveClass("text-chart-5");
    await user.click(screen.getByRole("button", { name: "Copy" }));
    expect(copied).toBe(code);
    expect(await screen.findByRole("button", { name: "Copied" })).toBeInTheDocument();
    await expectNoA11yViolations(container);
  });
});

describe("EmptyState and ErrorState", () => {
  test("EmptyState renders the call to action", async () => {
    const { container } = render(
      <main>
        <EmptyState
          title="No sandboxes"
          description="Create one to start."
          icon={IconBoxMultiple}
          action={<Button>Create</Button>}
        />
      </main>,
    );
    expect(screen.getByRole("heading", { name: "No sandboxes" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create" })).toBeInTheDocument();
    await expectNoA11yViolations(container);
  });

  test("ErrorState shows an ApiError's reason and request id and retries", async () => {
    const user = userEvent.setup();
    let retried = 0;
    const { container } = render(
      <main>
        <ErrorState
          error={new ApiError(403, "NOT_ENTITLED", "team payments lacks sandbox", "req-7")}
          onRetry={() => retried++}
        />
      </main>,
    );
    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("NOT_ENTITLED");
    expect(alert).toHaveTextContent("team payments lacks sandbox");
    expect(alert).toHaveTextContent("request req-7");
    await user.click(screen.getByRole("button", { name: "Retry" }));
    expect(retried).toBe(1);
    await expectNoA11yViolations(container);
  });
});
