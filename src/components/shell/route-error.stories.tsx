import { RouteErrorLayout } from "@donaldgifford/design-system/shell/route-error";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

const meta = {
  title: "Shell/RouteError",
  component: RouteErrorLayout,
  parameters: { layout: "fullscreen" },
  args: {
    title: "CLUSTER_NOT_FOUND",
    message: "No cluster named payments-prod-euw1 in account 111111111111.",
    status: 404,
    requestId: "req_01JZA4M8Q2V7",
    onRetry: fn(),
  },
} satisfies Meta<typeof RouteErrorLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

/** An API error: the reason code, the HTTP status, and the request id to quote. */
export const ApiError: Story = {};

/** Anything else: a generic title and the error's message. */
export const Generic: Story = {
  args: {
    title: "Something went wrong",
    message: "Failed to fetch",
    status: undefined,
    requestId: undefined,
  },
};
