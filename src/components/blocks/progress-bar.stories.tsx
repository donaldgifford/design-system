import { ProgressBar, type ProgressTone } from "@donaldgifford/design-system/blocks/progress-bar";
import type { Meta, StoryObj } from "@storybook/react-vite";

const tones: ProgressTone[] = ["default", "success", "warning", "destructive"];

const meta = {
  title: "Blocks/ProgressBar",
  component: ProgressBar,
  args: { value: 60, tone: "default", label: "Deploy payments-api: 6 of 10 tasks" },
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100, step: 1 } },
    tone: { control: "select", options: tones },
  },
  decorators: [
    (Story) => (
      <div className="max-w-md">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Warning: Story = {
  args: { value: 85, tone: "warning", label: "vCPU quota used in sandbox" },
};

/** Every tone; `default` and `success` share a color. */
export const AllTones: Story = {
  render: (args) => (
    <div className="grid gap-3">
      {tones.map((tone, index) => (
        <div key={tone} className="grid gap-1">
          <span className="text-muted-foreground text-xs">{tone}</span>
          <ProgressBar {...args} tone={tone} value={25 * (index + 1)} label={`${tone} progress`} />
        </div>
      ))}
    </div>
  ),
};
