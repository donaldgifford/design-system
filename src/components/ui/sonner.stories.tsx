import { Button } from "@donaldgifford/design-system/components/button";
import { Toaster } from "@donaldgifford/design-system/components/sonner";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { toast } from "sonner";

const positions = [
  "top-left",
  "top-center",
  "top-right",
  "bottom-left",
  "bottom-center",
  "bottom-right",
] as const;

const meta = {
  title: "Primitives/Sonner",
  component: Toaster,
  args: { position: "bottom-right", expand: false, richColors: false, closeButton: false },
  argTypes: {
    position: { control: "select", options: positions },
    theme: { control: "inline-radio", options: ["light", "dark", "system"] },
  },
  // Each story's Toaster takes the story id, and its toasts target it, so
  // the docs page's stories don't all show every toast. The theme follows
  // the toolbar unless the control sets one.
  render: (args, { id, globals }) => (
    <>
      <Button variant="outline" onClick={() => toast("Sandbox created", { toasterId: id })}>
        Show toast
      </Button>
      <Toaster
        {...args}
        id={id}
        theme={args.theme ?? (globals.theme === "light" ? "light" : "dark")}
      />
    </>
  ),
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** One button per toast type, plus a description and an action. */
export const AllTypes: Story = {
  render: (args, { id, globals }) => (
    <>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={() => toast("Sandbox created", { toasterId: id })}>
          Default
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast("Deployment started", {
              toasterId: id,
              description: "payments-api to payments-prod-usw2",
            })
          }
        >
          Description
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.success("Promotion approved", { toasterId: id })}
        >
          Success
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.info("Node group 2/3 upgrading", { toasterId: id })}
        >
          Info
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.warning("30 of 32 vCPU in use", { toasterId: id })}
        >
          Warning
        </Button>
        <Button variant="outline" onClick={() => toast.error("Sync failed", { toasterId: id })}>
          Error
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.loading("Creating sandbox…", { toasterId: id })}
        >
          Loading
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast("Sandbox stopped", {
              toasterId: id,
              action: { label: "Undo", onClick: () => undefined },
            })
          }
        >
          Action
        </Button>
      </div>
      <Toaster
        {...args}
        id={id}
        theme={args.theme ?? (globals.theme === "light" ? "light" : "dark")}
      />
    </>
  ),
};

export const RichColors: Story = { ...AllTypes, args: { richColors: true } };
