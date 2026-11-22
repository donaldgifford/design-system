import { Button } from "@donaldgifford/design-system/components/button";
import {
  Collapsible,
  CollapsiblePanel,
  CollapsibleTrigger,
} from "@donaldgifford/design-system/components/collapsible";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { fn } from "storybook/test";

const meta = {
  title: "Primitives/Collapsible",
  component: Collapsible,
  args: { defaultOpen: false, disabled: false, onOpenChange: fn() },
  render: (args) => (
    <Collapsible {...args} className="grid w-80 gap-2">
      <CollapsibleTrigger render={<Button variant="outline" size="sm" />}>
        Show the three checks
      </CollapsibleTrigger>
      <CollapsiblePanel>
        <ul className="grid gap-1 text-muted-foreground text-sm">
          <li>Branch protection is on</li>
          <li>CODEOWNERS exists</li>
          <li>Secret scanning is on</li>
        </ul>
      </CollapsiblePanel>
    </Collapsible>
  ),
} satisfies Meta<typeof Collapsible>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Closed, the panel is not in the DOM. */
export const Default: Story = {};

export const Open: Story = { args: { defaultOpen: true } };

export const Disabled: Story = { args: { disabled: true } };

/** The app holds the state, to load what the panel shows when it first opens. */
export const Controlled: Story = {
  render: function Render(args) {
    const [open, setOpen] = useState(false);
    return (
      <Collapsible {...args} open={open} onOpenChange={setOpen} className="grid w-80 gap-2">
        <CollapsibleTrigger render={<Button variant="outline" size="sm" />}>
          {open ? "Hide" : "Show"} the details
        </CollapsibleTrigger>
        <CollapsiblePanel>
          <p className="text-muted-foreground text-sm">Fetched when this opened.</p>
        </CollapsiblePanel>
      </Collapsible>
    );
  },
};
