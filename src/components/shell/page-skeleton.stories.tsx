import { PageSkeleton } from "@donaldgifford/design-system/shell/page-skeleton";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Shell/PageSkeleton",
  component: PageSkeleton,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof PageSkeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

/** What a route shows while its loader runs; it takes no props. */
export const Default: Story = {};
