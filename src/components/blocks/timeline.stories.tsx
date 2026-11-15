import { Changelog, Timeline } from "@donaldgifford/design-system/blocks/timeline";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconCheck, IconGitBranch, IconShieldCheck, IconX } from "@tabler/icons-react";

const meta = {
  title: "Blocks/Timeline",
  component: Timeline,
  args: {
    items: [
      {
        id: "1",
        actor: "marcus",
        verb: "requested",
        object: <b className="font-semibold">PaymentsOperator in payments-prod (JIT 4h)</b>,
        detail: "INC-1042 ledger latency: needs RDS reboot rights",
        when: "10:52",
        tags: [{ label: "aws" }, { label: "high risk", variant: "destructive" }],
      },
      {
        id: "2",
        actor: "authzd",
        icon: IconShieldCheck,
        tone: "info",
        verb: "routed to approvers via",
        object: <b className="font-semibold">team owners</b>,
        when: "10:52",
        tags: [{ label: "routing", variant: "info" }],
      },
      {
        id: "3",
        actor: "mappings repo",
        icon: IconGitBranch,
        tone: "info",
        verb: "staged a change to",
        object: <b className="font-semibold">aws/assignments/payments-prod.yaml</b>,
        when: "10:53",
        tags: [{ label: "diff", variant: "outline" }],
      },
      {
        id: "4",
        actor: "donald",
        icon: IconCheck,
        tone: "success",
        verb: "approved",
        object: <b className="font-semibold">PaymentsOperator in payments-prod</b>,
        detail: "expires 18:00 · incident window only",
        when: "11:04",
        tags: [{ label: "approved", variant: "success" }],
      },
      {
        id: "5",
        actor: "system",
        icon: IconX,
        tone: "destructive",
        verb: "revoked",
        object: "a stale session",
        when: "18:00",
        tags: [
          { label: "expiry", variant: "warning" },
          { label: "automatic", variant: "default" },
        ],
      },
    ],
  },
  decorators: [
    (Story) => (
      <div className="max-w-xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Timeline>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Every avatar tone (neutral, info, success, destructive) and tag variant. */
export const Default: Story = {};

/** Without an icon the avatar is the actor's initials. */
export const Initials: Story = {
  args: {
    items: [
      {
        id: "1",
        actor: "kim@example.com",
        verb: "deployed",
        object: "payments-api v2.14.0",
        when: "2m ago",
      },
      { id: "2", actor: "sam lee", verb: "promoted", object: "v1.4.0 to prod", when: "now" },
    ],
  },
};

/** The sibling block: dated releases on a rail, the newest marked. */
export const ChangelogList: Story = {
  render: () => (
    <Changelog
      items={[
        {
          id: "c1",
          date: "2026-10-25",
          title: "Single sign-on",
          detail: "Sign in with your identity provider; sessions last eight hours.",
          tags: [{ label: "web" }, { label: "auth", variant: "info" }],
        },
        {
          id: "c2",
          date: "2026-10-21",
          title: "Clusters register automatically",
          tags: [{ label: "clusters" }],
        },
        {
          id: "c3",
          date: "2026-10-01",
          title: "Gated promotions",
          detail: "A release waits for approval before it reaches production.",
        },
      ]}
    />
  ),
};
