import { type Step, Stepper, type StepStatus } from "@donaldgifford/design-system/blocks/stepper";
import type { Meta, StoryObj } from "@storybook/react-vite";

const statuses: StepStatus[] = ["done", "current", "upcoming", "failed"];

const meta = {
  title: "Blocks/Stepper",
  component: Stepper,
  args: {
    steps: [
      { id: "plan", label: "Plan", status: "done", description: "09:12" },
      { id: "provision", label: "Provision", status: "done", description: "EKS · 14m" },
      { id: "bootstrap", label: "Bootstrap", status: "current", description: "Add-ons, GitOps" },
      { id: "register", label: "Register", status: "upcoming" },
      { id: "ready", label: "Ready", status: "upcoming" },
    ],
  },
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A cluster's phases mid-bootstrap. */
export const Default: Story = {};

export const Failed: Story = {
  args: {
    steps: [
      { id: "validate", label: "Validate", status: "done" },
      { id: "run", label: "Run MicroVM", status: "failed", description: "image pull timed out" },
      { id: "verify", label: "Verify", status: "upcoming" },
    ],
  },
};

export const AllStatuses: Story = {
  args: {
    steps: statuses.map((status) => ({ id: status, label: status, status })),
  },
};

const lifecycle = [
  { id: "draft", label: "Draft", status: "done", description: "2026-10-02" },
  { id: "proposed", label: "Proposed", status: "done", description: "2026-10-09" },
  { id: "accepted", label: "Accepted", status: "current", description: "2026-10-14" },
  { id: "implemented", label: "Implemented", status: "upcoming" },
  { id: "superseded", label: "Superseded", status: "upcoming" },
] satisfies Step[];

/** Stacked on a line, for a narrow column where the horizontal form would wrap. */
export const Vertical: Story = {
  args: { orientation: "vertical" },
  decorators: [
    (Story) => (
      <div className="w-48">
        <Story />
      </div>
    ),
  ],
};

/** The small size marks each step with a dot and no number. */
export const Small: Story = { args: { size: "sm" } };

/** A document's lifecycle in a side rail: its type's statuses in order, its own marked. */
export const Lifecycle: Story = {
  args: { orientation: "vertical", size: "sm", steps: lifecycle },
  decorators: [
    (Story) => (
      <div className="w-40">
        <Story />
      </div>
    ),
  ],
};

/** The four statuses as dots, on a line. */
export const SmallStatuses: Story = {
  args: {
    orientation: "vertical",
    size: "sm",
    steps: statuses.map((status) => ({ id: status, label: status, status })),
  },
};
