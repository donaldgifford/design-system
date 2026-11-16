import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@donaldgifford/design-system/components/alert";
import { Button } from "@donaldgifford/design-system/components/button";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  IconAlertCircle,
  IconAlertTriangle,
  IconCircleCheck,
  IconInfoCircle,
} from "@tabler/icons-react";

const variants = ["default", "destructive", "success", "warning", "info"] as const;

const icons = {
  default: IconInfoCircle,
  destructive: IconAlertCircle,
  success: IconCircleCheck,
  warning: IconAlertTriangle,
  info: IconInfoCircle,
} as const;

const meta = {
  title: "Primitives/Alert",
  component: Alert,
  args: { variant: "default" },
  argTypes: {
    variant: { control: "select", options: variants },
  },
  render: (args) => {
    const Icon = icons[args.variant ?? "default"];
    return (
      <Alert {...args} className="max-w-xl">
        <Icon aria-hidden="true" />
        <AlertTitle>Quota nearly used</AlertTitle>
        <AlertDescription>30 of 32 vCPU in use in us-west-2.</AlertDescription>
      </Alert>
    );
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Destructive: Story = { args: { variant: "destructive" } };

/** Without an icon the grid collapses to one column. */
export const WithoutIcon: Story = {
  render: (args) => (
    <Alert {...args} className="max-w-xl">
      <AlertTitle>Maintenance window</AlertTitle>
      <AlertDescription>Upgrades run Sundays from 02:00 to 04:00 UTC.</AlertDescription>
    </Alert>
  ),
};

/** AlertAction pins to the top right and reserves room on the right. */
export const WithAction: Story = {
  args: { variant: "warning" },
  render: (args) => (
    <Alert {...args} className="max-w-xl">
      <IconAlertTriangle aria-hidden="true" />
      <AlertTitle>Certificate expires in 6 days</AlertTitle>
      <AlertDescription>payments.example.com renews from the cluster issuer.</AlertDescription>
      <AlertAction>
        <Button variant="outline" size="sm">
          Renew
        </Button>
      </AlertAction>
    </Alert>
  ),
};

export const AllVariants: Story = {
  render: (args) => (
    <div className="grid max-w-xl gap-3">
      {variants.map((variant) => {
        const Icon = icons[variant];
        return (
          <Alert key={variant} {...args} variant={variant}>
            <Icon aria-hidden="true" />
            <AlertTitle>{variant}</AlertTitle>
            <AlertDescription>30 of 32 vCPU in use.</AlertDescription>
          </Alert>
        );
      })}
    </div>
  ),
};
