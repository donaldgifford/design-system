import { Button } from "@donaldgifford/design-system/components/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@donaldgifford/design-system/components/dropdown-menu";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  IconCopy,
  IconDots,
  IconRotateClockwise,
  IconTerminal2,
  IconTrash,
} from "@tabler/icons-react";
import type { ComponentProps } from "react";

const meta = {
  title: "Primitives/DropdownMenu",
  component: DropdownMenuContent,
  args: { side: "bottom", align: "start", sideOffset: 4, alignOffset: 0 },
  argTypes: {
    side: { control: "select", options: ["top", "bottom", "left", "right"] },
    align: { control: "inline-radio", options: ["start", "center", "end"] },
    sideOffset: { control: "number" },
    alignOffset: { control: "number" },
  },
  render: (args) => (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>Open menu</DropdownMenuTrigger>
      <DropdownMenuContent {...args}>
        <DropdownMenuItem>Restart</DropdownMenuItem>
        <DropdownMenuItem>Open console</DropdownMenuItem>
        <DropdownMenuItem disabled>Snapshot</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
} satisfies Meta<typeof DropdownMenuContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Shared by AllParts and Open. Each label sits in a group: Base UI's GroupLabel throws without one. */
function FullMenu(props: ComponentProps<typeof DropdownMenuContent>) {
  return (
    <DropdownMenuContent className="w-56" {...props}>
      <DropdownMenuGroup>
        <DropdownMenuLabel>sbx-dev</DropdownMenuLabel>
        <DropdownMenuItem>
          <IconRotateClockwise aria-hidden="true" />
          Restart
          <DropdownMenuShortcut>⇧R</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <IconTerminal2 aria-hidden="true" />
          Open console
          <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <IconCopy aria-hidden="true" />
            IconCopy
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>ID</DropdownMenuItem>
            <DropdownMenuItem>ARN</DropdownMenuItem>
            <DropdownMenuItem>SSH command</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuLabel inset>Notify</DropdownMenuLabel>
        <DropdownMenuCheckboxItem defaultChecked>On failure</DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem>On success</DropdownMenuCheckboxItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuLabel inset>Profile</DropdownMenuLabel>
        <DropdownMenuRadioGroup defaultValue="small">
          <DropdownMenuRadioItem value="small">small</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="medium">medium</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="large" disabled>
            large
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem inset>Rename…</DropdownMenuItem>
      <DropdownMenuItem variant="destructive">
        <IconTrash aria-hidden="true" />
        Delete
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
}

/** Every part: labels, icons, shortcuts, a submenu, checkbox and radio items, inset, destructive. */
export const AllParts: Story = {
  render: (args) => (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>Actions</DropdownMenuTrigger>
      <FullMenu {...args} />
    </DropdownMenu>
  ),
};

/** An icon-only trigger, named by aria-label. */
export const IconTrigger: Story = {
  args: { align: "end" },
  render: (args) => (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="ghost" size="icon" aria-label="More actions" />}
      >
        <IconDots aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent {...args}>
        <DropdownMenuItem>Restart</DropdownMenuItem>
        <DropdownMenuItem>Open console</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

/** Open on load, for the canvas; kept off the docs page so it doesn't cover it. */
export const Open: Story = {
  tags: ["!autodocs"],
  render: (args) => (
    <DropdownMenu defaultOpen>
      <DropdownMenuTrigger render={<Button variant="outline" />}>Actions</DropdownMenuTrigger>
      <FullMenu {...args} />
    </DropdownMenu>
  ),
};
