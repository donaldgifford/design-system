import { PageHeader } from "@donaldgifford/design-system/blocks/page-header";
import { Badge } from "@donaldgifford/design-system/components/badge";
import { Button } from "@donaldgifford/design-system/components/button";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconPlus, IconRefresh } from "@tabler/icons-react";

const meta = {
  title: "Blocks/PageHeader",
  component: PageHeader,
  parameters: { layout: "fullscreen" },
  args: {
    title: "Clusters",
    description: "Every cluster in the fleet, with its phase and the last operation against it.",
    meta: <Badge variant="outline">14</Badge>,
    actions: (
      <>
        <Button variant="outline" size="sm">
          <IconRefresh aria-hidden="true" />
          Refresh
        </Button>
        <Button size="sm">
          <IconPlus aria-hidden="true" />
          New cluster
        </Button>
      </>
    ),
  },
  argTypes: {
    meta: { control: false },
    actions: { control: false },
  },
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** A resource's header: its state leads beside the title. */
export const Resource: Story = {
  args: {
    title: "payments-prod-use1",
    description: "payments · us-east-1 · account 111111111111",
    meta: (
      <Badge variant="running" fill="filled">
        upgrading
      </Badge>
    ),
    actions: (
      <Button variant="outline" size="sm">
        Open deployment
      </Button>
    ),
  },
};

export const TitleOnly: Story = {
  args: { description: undefined, meta: undefined, actions: undefined },
};
