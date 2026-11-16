import { ScrollArea, ScrollBar } from "@donaldgifford/design-system/components/scroll-area";
import type { Meta, StoryObj } from "@storybook/react-vite";

const regions = [
  "us-east-1",
  "us-east-2",
  "us-west-1",
  "us-west-2",
  "ca-central-1",
  "eu-west-1",
  "eu-west-2",
  "eu-central-1",
  "ap-south-1",
  "ap-northeast-1",
  "ap-southeast-1",
  "ap-southeast-2",
];

const meta = {
  title: "Primitives/ScrollArea",
  component: ScrollArea,
  args: { className: "h-48 w-64 rounded-lg border" },
} satisfies Meta<typeof ScrollArea>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The viewport takes focus while it overflows, so a keyboard can scroll it. */
export const Default: Story = {
  render: (args) => (
    <ScrollArea {...args}>
      <ul className="p-3 text-sm">
        {regions.map((region) => (
          <li key={region} className="py-1 font-mono">
            {region}
          </li>
        ))}
      </ul>
    </ScrollArea>
  ),
};

/** `ScrollBar orientation="horizontal"` adds the second bar beside the built-in vertical one. */
export const Horizontal: Story = {
  args: { className: "w-96 rounded-lg border whitespace-nowrap" },
  render: (args) => (
    <ScrollArea {...args}>
      <div className="flex w-max gap-3 p-3">
        {regions.map((region) => (
          <div key={region} className="rounded-md border bg-card px-3 py-2 font-mono text-sm">
            {region}
          </div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  ),
};

/** Focusable content inside: Tab reaches each link and scrolls it into view. */
export const FocusableContent: Story = {
  render: (args) => (
    <ScrollArea {...args}>
      <nav aria-label="Regions" className="grid p-2 text-sm">
        {regions.map((region) => (
          <a
            key={region}
            href={`#${region}`}
            className="rounded-md px-2 py-1 font-mono hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            {region}
          </a>
        ))}
      </nav>
    </ScrollArea>
  ),
};
