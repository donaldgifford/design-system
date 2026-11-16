import { LoadMore } from "@donaldgifford/design-system/blocks/load-more";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

const meta = {
  title: "Blocks/LoadMore",
  component: LoadMore,
  args: { loaded: 50, total: 1342, hasMore: true, loading: false, onMore: fn(), noun: "findings" },
  decorators: [
    (Story) => (
      <div className="max-w-xl rounded-md border">
        <div className="px-3.5 py-6 text-muted-foreground text-sm">The list's rows sit here.</div>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof LoadMore>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = { args: { loading: true } };

/** Without a total, only what is loaded is counted. */
export const UnknownTotal: Story = { args: { total: undefined } };

/** The last page: the count stays, the button goes. */
export const AllLoaded: Story = { args: { loaded: 1342, hasMore: false } };
