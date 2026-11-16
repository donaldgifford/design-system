import { describe, expect, mock, test } from "bun:test";
import { CodeBlock, splitLines } from "@donaldgifford/design-system/blocks/code-block";
import { DetailsGrid } from "@donaldgifford/design-system/blocks/details-grid";
import { DiffView, diffLines } from "@donaldgifford/design-system/blocks/diff-view";
import { DistBar, Outcomes } from "@donaldgifford/design-system/blocks/dist-bar";
import { Flow } from "@donaldgifford/design-system/blocks/flow";
import { Dot, List, ListRow } from "@donaldgifford/design-system/blocks/list-row";
import { ProgressBar } from "@donaldgifford/design-system/blocks/progress-bar";
import { StatStrip } from "@donaldgifford/design-system/blocks/stat-strip";
import { Changelog, Timeline } from "@donaldgifford/design-system/blocks/timeline";
import { tokenize } from "@donaldgifford/design-system/lib/highlight";
import { IconCpu, IconRocket } from "@tabler/icons-react";
import { expectNoA11yViolations } from "@test/axe";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("CodeBlock with line numbers", () => {
  test("splitLines keeps one token row per source line", () => {
    const lines = splitLines(tokenize("a: 1\nb: two\n# c", "yaml"));
    expect(lines).toHaveLength(3);
    expect(lines.map((line) => line.map((token) => token.text).join(""))).toEqual([
      "a: 1",
      "b: two",
      "# c",
    ]);
  });

  test("renders a gutter the screen reader skips and the token kinds as data", async () => {
    const { container } = render(
      <main>
        <CodeBlock
          code={'{\n  "Effect": "Deny"\n}'}
          language="json"
          title="policy.json"
          lineNumbers
        />
      </main>,
    );
    expect(screen.getByText("policy.json")).toBeInTheDocument();
    const gutters = container.querySelectorAll("[aria-hidden='true'].select-none");
    expect(gutters).toHaveLength(3);
    expect(container.querySelector("[data-token='key']")).toHaveTextContent('"Effect"');
    await expectNoA11yViolations(container);
  });
});

describe("ProgressBar", () => {
  test("is a labelled progressbar clamped to 0..100", async () => {
    const { container } = render(
      <main>
        <ProgressBar label="Onboarding" value={140} tone="success" />
      </main>,
    );
    const bar = screen.getByRole("progressbar", { name: "Onboarding" });
    expect(bar).toHaveAttribute("aria-valuenow", "100");
    expect(container.querySelector("[data-slot='progress-bar']")).toHaveAttribute(
      "data-tone",
      "success",
    );
    await expectNoA11yViolations(container);
  });
});

describe("ListRow", () => {
  test("with onClick the title is a button and trailing actions stay separate controls", async () => {
    const user = userEvent.setup();
    const open = mock();
    const connect = mock();
    const { container } = render(
      <main>
        <List>
          <ListRow
            leading={<Dot tone="ok" live />}
            title="sbx-01"
            subtitle="security-agent"
            onClick={open}
            trailing={
              <button type="button" onClick={connect}>
                Connect
              </button>
            }
          />
          <ListRow title="plain" subtitle="no action" />
        </List>
      </main>,
    );
    await user.click(screen.getByRole("button", { name: "sbx-01" }));
    await user.click(screen.getByRole("button", { name: "Connect" }));
    expect(open).toHaveBeenCalledTimes(1);
    expect(connect).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("button", { name: "plain" })).not.toBeInTheDocument();
    await expectNoA11yViolations(container);
  });
});

describe("DetailsGrid and StatStrip", () => {
  test("render definition lists of label and value", async () => {
    const { container } = render(
      <main>
        <DetailsGrid
          items={[
            { label: "Region", value: "us-west-2" },
            { label: "Nodes", value: 12 },
          ]}
        />
        <StatStrip items={[{ label: "Generation", value: "3", hint: "mvm-1c887" }]} />
      </main>,
    );
    expect(screen.getAllByRole("term")).toHaveLength(3);
    expect(screen.getByText("us-west-2")).toBeInTheDocument();
    expect(screen.getByText("mvm-1c887")).toBeInTheDocument();
    await expectNoA11yViolations(container);
  });
});

describe("DistBar and Outcomes", () => {
  test("describe the distribution for assistive tech and list every segment", async () => {
    const { container } = render(
      <main>
        <DistBar
          segments={[
            { label: "archived", value: 150, color: "red" },
            { label: "fork", value: 50, color: "blue" },
          ]}
        />
        <Outcomes
          items={[
            { label: "Completed", value: 3, color: "green" },
            { label: "Failed", value: 1, color: "red" },
          ]}
        />
      </main>,
    );
    expect(screen.getByRole("img", { name: /archived 150/ })).toBeInTheDocument();
    expect(screen.getByText("75%")).toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();
    expect(screen.getByText("Failed")).toBeInTheDocument();
    await expectNoA11yViolations(container);
  });
});

describe("Timeline and Changelog", () => {
  test("render each entry with its actor, object, time and tags", async () => {
    const { container } = render(
      <main>
        <Timeline
          items={[
            {
              id: "1",
              actor: "marcus",
              verb: "requested",
              object: <b>PaymentsOperator</b>,
              detail: "INC-1042",
              when: "10:52",
              tags: [{ label: "high risk", variant: "destructive" }],
            },
          ]}
        />
        <Changelog
          items={[
            {
              id: "r1",
              date: "2026-10-01",
              title: "v1.4.0",
              detail: "Looks shipped.",
              tags: [{ label: "ui", variant: "info" }],
            },
          ]}
        />
      </main>,
    );
    expect(screen.getByText("marcus")).toBeInTheDocument();
    expect(screen.getByText("PaymentsOperator")).toBeInTheDocument();
    expect(screen.getByText("10:52")).toBeInTheDocument();
    expect(screen.getByText("high risk")).toHaveAttribute("data-variant", "destructive");
    expect(screen.getByText("v1.4.0")).toBeInTheDocument();
    expect(screen.getByText("ui")).toHaveAttribute("data-variant", "info");
    await expectNoA11yViolations(container);
  });
});

describe("DiffView", () => {
  test("diffLines finds the common lines and numbers both sides", () => {
    const lines = diffLines("a\nb\nc\n", "a\nc\nd\n");
    expect(lines.map((line) => `${line.op}${line.text}`)).toEqual(["=a", "-b", "=c", "+d"]);
    expect(lines[1]?.oldNumber).toBe(2);
    expect(lines[1]?.newNumber).toBeUndefined();
    expect(lines[3]?.oldNumber).toBeUndefined();
    expect(lines[3]?.newNumber).toBe(3);
  });

  test("renders the counts, the file name, and the rows", async () => {
    const { container } = render(
      <main>
        <DiffView before={"a: 1\nb: 2"} after={"a: 1\nb: 3"} language="yaml" file="x.yaml" />
      </main>,
    );
    expect(screen.getByText("x.yaml")).toBeInTheDocument();
    expect(screen.getByText("+1")).toBeInTheDocument();
    expect(screen.getByText("−1")).toBeInTheDocument();
    expect(container.querySelectorAll("tbody tr")).toHaveLength(3);
    await expectNoA11yViolations(container);
  });
});

describe("Flow", () => {
  test("renders nodes with their status, the approval action, and an edge per pair", async () => {
    const user = userEvent.setup();
    const onAction = mock();
    const { container } = render(
      <main>
        <Flow
          width={600}
          height={160}
          nodes={[
            {
              kind: "icon",
              id: "a",
              x: 20,
              y: 20,
              icon: IconCpu,
              title: "dev",
              detail: "2m ago",
              status: "ok",
            },
            {
              kind: "icon",
              id: "b",
              x: 200,
              y: 20,
              icon: IconCpu,
              title: "stage",
              detail: "verifying",
              status: "warn",
            },
            {
              kind: "approve",
              id: "c",
              x: 380,
              y: 20,
              icon: IconRocket,
              title: "prod",
              detail: "Awaiting approval",
              onAction,
            },
          ]}
          edges={[
            { from: "a", to: "b", status: "ok", label: "f-1" },
            { from: "b", to: "c", status: "warn" },
          ]}
          bar={<span>Pipelines</span>}
        />
      </main>,
    );
    expect(screen.getByText("dev")).toBeInTheDocument();
    expect(screen.getByText("Pipelines")).toBeInTheDocument();
    expect(screen.getByText("f-1")).toBeInTheDocument();
    const edges = container.querySelector("svg[preserveAspectRatio='none']");
    expect(edges?.querySelectorAll("path")).toHaveLength(2);
    const approve = within(
      screen.getByText("Awaiting approval").closest("[data-slot]") ?? container,
    );
    await user.click(approve.getByRole("button"));
    expect(onAction).toHaveBeenCalledTimes(1);
    await expectNoA11yViolations(container);
  });
});
