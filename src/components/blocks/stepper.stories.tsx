import { Stepper, type StepStatus } from "@donaldgifford/design-system/blocks/stepper";
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
