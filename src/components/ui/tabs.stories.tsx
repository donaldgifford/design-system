import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@donaldgifford/design-system/components/tabs";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconActivity, IconLayoutDashboard, IconScript } from "@tabler/icons-react";
import type { ComponentProps } from "react";

const tabs = [
  { value: "overview", label: "Overview", icon: IconLayoutDashboard, body: "24 nodes, healthy." },
  { value: "events", label: "Events", icon: IconActivity, body: "No events in the last hour." },
  { value: "logs", label: "Logs", icon: IconScript, body: "Streaming from 3 pods." },
];

// `variant` and `activateOnFocus` belong to TabsList; the stories pass them through.
type TabsStoryArgs = ComponentProps<typeof Tabs> &
  Pick<ComponentProps<typeof TabsList>, "variant" | "activateOnFocus">;

function Demo({ variant, activateOnFocus, ...args }: TabsStoryArgs) {
  return (
    <Tabs {...args}>
      <TabsList variant={variant} activateOnFocus={activateOnFocus}>
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value} className="text-sm text-muted-foreground">
          {tab.body}
        </TabsContent>
      ))}
    </Tabs>
  );
}

const meta = {
  title: "Primitives/Tabs",
  component: Tabs,
  subcomponents: { TabsList, TabsTrigger, TabsContent },
  args: {
    defaultValue: "overview",
    orientation: "horizontal",
    variant: "default",
    activateOnFocus: true,
  },
  argTypes: {
    orientation: { control: "inline-radio", options: ["horizontal", "vertical"] },
    variant: { control: "inline-radio", options: ["default", "line"] },
  },
  render: (args) => <Demo {...args} />,
} satisfies Meta<TabsStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** `line` is shadcn's name for the same quiet underline; the two render alike. */
export const Line: Story = { args: { variant: "line" } };

/** The rule moves beside the active tab. */
export const Vertical: Story = { args: { orientation: "vertical" } };

/** Each variant in each orientation. */
export const AllVariants: Story = {
  render: (args) => (
    <div className="grid gap-8">
      {(["horizontal", "vertical"] as const).map((orientation) =>
        (["default", "line"] as const).map((variant) => (
          <Demo
            key={`${orientation}-${variant}`}
            {...args}
            orientation={orientation}
            variant={variant}
          />
        )),
      )}
    </div>
  ),
};

/** Icons in the triggers, and a disabled tab. */
export const IconsAndDisabled: Story = {
  render: ({ variant, activateOnFocus, ...args }) => (
    <Tabs {...args}>
      <TabsList variant={variant} activateOnFocus={activateOnFocus}>
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value} disabled={tab.value === "logs"}>
            <tab.icon aria-hidden="true" />
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value} className="text-sm text-muted-foreground">
          {tab.body}
        </TabsContent>
      ))}
    </Tabs>
  ),
};
