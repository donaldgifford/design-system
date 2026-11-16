import { Badge } from "@donaldgifford/design-system/components/badge";
import { Button } from "@donaldgifford/design-system/components/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@donaldgifford/design-system/components/card";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Primitives/Card",
  component: Card,
  args: { className: "max-w-md" },
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>payments-prod-usw2</CardTitle>
        <CardDescription>apps · us-west-2</CardDescription>
        <CardAction>
          <Button variant="outline" size="sm">
            Open
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="text-muted-foreground">
        24 nodes, upgrading node group 2/3.
      </CardContent>
      <CardFooter className="text-muted-foreground text-xs">Updated 2m ago</CardFooter>
    </Card>
  ),
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Without a CardAction the header is a single column. */
export const HeaderOnly: Story = {
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>No sandboxes yet</CardTitle>
        <CardDescription>Create one from a profile to start.</CardDescription>
      </CardHeader>
    </Card>
  ),
};

/** A `border-b` header and a `border-t` footer pick up extra padding. */
export const Bordered: Story = {
  render: (args) => (
    <Card {...args}>
      <CardHeader className="border-b">
        <CardTitle>Node groups</CardTitle>
        <CardDescription>3 groups, 24 nodes</CardDescription>
        <CardAction>
          <Badge variant="running">upgrading</Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ul className="grid gap-1 text-sm">
          <li>general · 12 nodes</li>
          <li>memory · 8 nodes</li>
          <li>gpu · 4 nodes</li>
        </ul>
      </CardContent>
      <CardFooter className="justify-end gap-2 border-t">
        <Button variant="ghost" size="sm">
          Cancel
        </Button>
        <Button size="sm">Save</Button>
      </CardFooter>
    </Card>
  ),
};

/**
 * `render` changes the element: a card that is a labelled `section`, with
 * its title as a heading.
 */
export const AsSection: Story = {
  render: (args) => (
    <Card {...args} render={<section aria-label="Coverage" />}>
      <CardHeader>
        <CardTitle render={(props) => <h3 {...props} />}>Coverage</CardTitle>
        <CardDescription>412 of 450 repositories pass.</CardDescription>
      </CardHeader>
    </Card>
  ),
};
