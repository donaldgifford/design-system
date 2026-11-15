import { DetailsGrid } from "@donaldgifford/design-system/blocks/details-grid";
import { Timeline } from "@donaldgifford/design-system/blocks/timeline";
import { Badge } from "@donaldgifford/design-system/components/badge";
import { Button } from "@donaldgifford/design-system/components/button";
import { DetailSheetLayout } from "@donaldgifford/design-system/shell/detail-sheet";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useArgs } from "storybook/preview-api";
import { fn } from "storybook/test";

const meta = {
  title: "Shell/DetailSheet",
  component: DetailSheetLayout,
  args: {
    open: false,
    onOpenChange: fn(),
    title: "payments-prod-use1",
    description: "cluster · us-east-1 · account 111111111111",
    children: (
      <div className="space-y-6">
        <DetailsGrid
          columns={1}
          items={[
            { label: "Phase", value: <Badge variant="success">ready</Badge> },
            { label: "Sync", value: <Badge variant="success">synced</Badge> },
            { label: "Version", value: "EKS 1.33" },
            { label: "Nodes", value: 24 },
            { label: "Hub", value: "mgmt-hub" },
          ]}
        />
        <section className="space-y-3">
          <h3 className="font-semibold text-sm">Recent operations</h3>
          <Timeline
            items={[
              {
                id: "1",
                actor: "deploy-bot",
                verb: "promoted",
                object: "payments-api v2.14.0",
                when: "12m ago",
                tone: "success",
              },
              {
                id: "2",
                actor: "kim@example.com",
                verb: "scaled",
                object: "the apps node group to 24",
                when: "2h ago",
              },
            ]}
          />
        </section>
      </div>
    ),
  },
  argTypes: {
    children: { control: false },
  },
} satisfies Meta<typeof DetailSheetLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

/** What opens the sheet is the caller's; here a button sets `open`, and closing writes it back. */
export const Default: Story = {
  render: function Render(args) {
    const [, updateArgs] = useArgs<typeof args>();
    const setOpen = (open: boolean) => {
      args.onOpenChange(open);
      updateArgs({ open });
    };
    return (
      <>
        <Button variant="outline" onClick={() => setOpen(true)}>
          View payments-prod-use1
        </Button>
        <DetailSheetLayout {...args} onOpenChange={setOpen} />
      </>
    );
  },
};

/** Open on load; kept off the docs page, where the overlay would cover it. */
export const Open: Story = {
  ...Default,
  tags: ["!autodocs"],
  args: { open: true },
};
