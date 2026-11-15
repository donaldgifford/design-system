import { Skeleton } from "@donaldgifford/design-system/components/skeleton";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Primitives/Skeleton",
  component: Skeleton,
  args: { className: "h-4 w-48" },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** A card's placeholder: avatar, title, and two lines. */
export const Card: Story = {
  render: () => (
    <div className="grid w-80 gap-4 rounded-lg border bg-card p-4">
      <div className="flex items-center gap-3">
        <Skeleton className="size-8 rounded-md" />
        <div className="grid flex-1 gap-2">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-4/5" />
    </div>
  ),
};

/** Table rows while a list loads. */
export const Rows: Story = {
  render: () => (
    <div className="grid w-96 gap-3">
      {["a", "b", "c", "d"].map((row) => (
        <div key={row} className="flex items-center gap-4">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-4 w-12" />
        </div>
      ))}
    </div>
  ),
};
