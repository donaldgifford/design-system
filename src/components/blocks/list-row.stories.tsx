import { Dot, type DotTone, List, ListRow } from "@donaldgifford/design-system/blocks/list-row";
import { Badge } from "@donaldgifford/design-system/components/badge";
import { Button } from "@donaldgifford/design-system/components/button";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

const tones: DotTone[] = ["neutral", "ok", "info", "warn", "bad"];

const meta = {
  title: "Blocks/ListRow",
  component: ListRow,
  args: {
    leading: <Dot tone="ok" />,
    title: "payments-prod-use1",
    subtitle: "us-east-1 · 24 nodes · EKS 1.33",
    trailing: <Badge variant="success">ready</Badge>,
  },
  argTypes: {
    leading: { control: false },
    trailing: { control: false },
  },
  decorators: [
    (Story) => (
      <div className="max-w-xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ListRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** With `onClick` the title is a button stretched over the row; the trailing action stays its own control. */
export const Clickable: Story = {
  args: {
    leading: <Dot tone="warn" />,
    title: "Raise payments-prod node quota",
    subtitle: "quota change · requested by marcus",
    trailing: (
      <Button variant="outline" size="sm">
        Review
      </Button>
    ),
    onClick: fn(),
  },
};

export const TitleOnly: Story = {
  args: { leading: undefined, subtitle: undefined, trailing: undefined },
};

/** Every Dot tone in a List; `live` pulses the one in motion. */
export const AllTones: Story = {
  render: () => (
    <List>
      {tones.map((tone) => (
        <ListRow
          key={tone}
          leading={<Dot tone={tone} live={tone === "info"} />}
          title={`sandbox-${tone}`}
          subtitle="us-east-1 · 2 vCPU"
          trailing={<Badge variant="outline">{tone}</Badge>}
        />
      ))}
    </List>
  ),
};

const categories = Array.from({ length: 8 }, (_, index) => `var(--category-${index + 1})`);

/** A Dot in a tone the app supplies: the eight category colors, one per document type here. */
export const CategoryDots: Story = {
  render: () => (
    <List>
      {categories.map((tone, index) => (
        <ListRow
          key={tone}
          leading={<Dot tone={tone} />}
          title={`category-${index + 1}`}
          subtitle={tone}
        />
      ))}
    </List>
  ),
};
