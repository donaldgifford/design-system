import { InlineEmpty, InlineLoading } from "@donaldgifford/design-system/blocks/inline-state";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Blocks/InlineState",
  component: InlineLoading,
  decorators: [
    (Story) => (
      <div className="max-w-xl rounded-md border">
        <div className="border-b px-3.5 py-2 font-medium text-sm">Recent runs</div>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof InlineLoading>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A status region: the text is announced when it appears. */
export const Loading: Story = {};

export const LoadingWithText: Story = { args: { children: "Loading runs…" } };

/** The same line when there is nothing to show. */
export const Empty: Story = {
  render: () => <InlineEmpty>No runs in this range.</InlineEmpty>,
};
