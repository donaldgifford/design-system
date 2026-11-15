import { EmptyState } from "@donaldgifford/design-system/blocks/empty-state";
import { Button } from "@donaldgifford/design-system/components/button";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconBoxMultiple, IconSearch, IconServer } from "@tabler/icons-react";

const meta = {
  title: "Blocks/EmptyState",
  component: EmptyState,
  args: {
    title: "No sandboxes",
    description: "Create one to get started.",
    icon: IconBoxMultiple,
    action: <Button>New sandbox</Button>,
  },
  argTypes: {
    icon: {
      control: "select",
      options: ["none", "Boxes", "Server", "Search"],
      mapping: { none: undefined, Boxes: IconBoxMultiple, Server: IconServer, Search: IconSearch },
    },
    action: { control: false },
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** A filter that matched nothing: no call to action. */
export const NoResults: Story = {
  args: {
    title: "No clusters match",
    description: "Clear the filter to see every cluster in the account.",
    icon: IconSearch,
    action: undefined,
  },
};

export const TitleOnly: Story = {
  args: { title: "No workflows yet", description: undefined, icon: undefined, action: undefined },
};
