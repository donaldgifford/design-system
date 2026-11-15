import { Button } from "@donaldgifford/design-system/components/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@donaldgifford/design-system/components/dialog";
import { Input } from "@donaldgifford/design-system/components/input";
import { Label } from "@donaldgifford/design-system/components/label";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Primitives/Dialog",
  component: DialogContent,
  args: { showCloseButton: true },
  argTypes: {
    showCloseButton: { control: "boolean" },
  },
  render: (args) => (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" />}>Delete sandbox</DialogTrigger>
      <DialogContent {...args}>
        <DialogHeader>
          <DialogTitle>Delete sandbox?</DialogTitle>
          <DialogDescription>This stops the VM and removes its disk.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
          <Button variant="destructive">Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
} satisfies Meta<typeof DialogContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** DialogFooter's showCloseButton appends an outline Close button. */
export const FooterClose: Story = {
  args: { showCloseButton: false },
  render: (args) => (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" />}>View event</DialogTrigger>
      <DialogContent {...args}>
        <DialogHeader>
          <DialogTitle>NodeGroupUpgraded</DialogTitle>
          <DialogDescription>payments-prod-usw2 · node group 2/3 · 4m ago</DialogDescription>
        </DialogHeader>
        <DialogFooter showCloseButton />
      </DialogContent>
    </Dialog>
  ),
};

export const WithForm: Story = {
  render: (args, { id }) => (
    <Dialog>
      <DialogTrigger render={<Button />}>Rename sandbox</DialogTrigger>
      <DialogContent {...args}>
        <DialogHeader>
          <DialogTitle>Rename sandbox</DialogTitle>
          <DialogDescription>The name shows in the list and the console.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-2">
          <Label htmlFor={`${id}-name`}>Name</Label>
          <Input id={`${id}-name`} defaultValue="sbx-dev" />
        </div>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
          <Button>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

/** Open on load, for the canvas; kept off the docs page so it doesn't cover it. */
export const Open: Story = {
  tags: ["!autodocs"],
  render: (args) => (
    <Dialog defaultOpen>
      <DialogTrigger render={<Button variant="outline" />}>Delete sandbox</DialogTrigger>
      <DialogContent {...args}>
        <DialogHeader>
          <DialogTitle>Delete sandbox?</DialogTitle>
          <DialogDescription>This stops the VM and removes its disk.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
          <Button variant="destructive">Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};
