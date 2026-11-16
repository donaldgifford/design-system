import { Flow, type FlowEdge, type FlowNode } from "@donaldgifford/design-system/blocks/flow";
import { Badge } from "@donaldgifford/design-system/components/badge";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  IconBox,
  IconGitBranch,
  IconPackage,
  IconRocket,
  IconShieldCheck,
} from "@tabler/icons-react";
import { fn } from "storybook/test";

const pipelineNodes: FlowNode[] = [
  {
    kind: "icon",
    id: "commit",
    x: 20,
    y: 40,
    icon: IconGitBranch,
    title: "commit",
    detail: "a1b2c3d",
    status: "ok",
  },
  {
    kind: "approve",
    id: "approve",
    x: 170,
    y: 49,
    icon: IconShieldCheck,
    title: "Promote to prod",
    detail: "needs an approver",
    actionLabel: "Approve",
    onAction: fn(),
  },
  {
    kind: "card",
    id: "prod",
    x: 480,
    y: 34,
    icon: IconRocket,
    title: "prod",
    detail: "payments-prod-usw2",
    footer: "v1.4.2 · synced",
    status: "warn",
  },
];
const pipelineEdges: FlowEdge[] = [
  { from: "commit", to: "approve", status: "ok" },
  { from: "approve", to: "prod", status: "dim", label: "pending" },
];

const meta = {
  title: "Blocks/Flow",
  component: Flow,
  args: { width: 760, height: 150, nodes: pipelineNodes, edges: pipelineEdges },
  argTypes: {
    nodes: { control: false },
    edges: { control: false },
    bar: { control: false },
  },
} satisfies Meta<typeof Flow>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A commit waiting on an approval before it promotes to prod. */
export const Default: Story = {};

export const WithBar: Story = {
  args: {
    bar: (
      <>
        <span className="font-medium">payments-api</span>
        <span className="text-muted-foreground">dev → stage → prod</span>
        <Badge variant="warning" className="ml-auto">
          1 waiting
        </Badge>
      </>
    ),
  },
};

const statuses = ["ok", "warn", "bad"] as const;

/**
 * Every node kind and status, and every edge status: icon nodes in the
 * top row, card nodes in the second, edges between them `ok`, `warn`,
 * `bad`, and `dim` from left to right.
 */
export const AllVariants: Story = {
  args: {
    width: 760,
    height: 330,
    nodes: [
      ...statuses.map(
        (status, index): FlowNode => ({
          kind: "icon",
          id: `icon-${status}`,
          x: 20 + 170 * index,
          y: 20,
          icon: IconPackage,
          title: `build-${status}`,
          detail: status,
          status,
        }),
      ),
      {
        kind: "icon",
        id: "icon-none",
        x: 530,
        y: 20,
        icon: IconBox,
        title: "artifact",
        detail: "no status",
      },
      ...statuses.map(
        (status, index): FlowNode => ({
          kind: "card",
          id: `card-${status}`,
          x: 20 + 250 * index,
          y: 150,
          icon: IconRocket,
          title: `deploy-${status}`,
          detail: "web-stage-usw2",
          footer: `v2.0.${index} · ${status}`,
          status,
          width: 220,
        }),
      ),
      {
        kind: "approve",
        id: "approve",
        x: 20,
        y: 270,
        icon: IconShieldCheck,
        title: "Promote web to prod",
        detail: "kim approves",
        actionLabel: "Review",
        onAction: fn(),
      },
      {
        kind: "card",
        id: "card-plain",
        x: 500,
        y: 270,
        icon: IconRocket,
        title: "prod",
        detail: "no footer",
        width: 220,
      },
    ],
    edges: [
      { from: "icon-ok", to: "icon-warn", status: "ok", label: "ok" },
      { from: "icon-warn", to: "icon-bad", status: "warn", label: "warn" },
      { from: "icon-bad", to: "icon-none", status: "bad", label: "bad" },
      { from: "icon-ok", to: "card-ok", status: "dim", label: "dim" },
      { from: "card-ok", to: "card-warn", status: "ok" },
      { from: "card-warn", to: "card-bad", status: "warn" },
      { from: "approve", to: "card-plain", status: "dim", direction: "h", at: 0.3 },
    ],
  },
};
