import { ErrorState } from "@donaldgifford/design-system/blocks/error-state";
import { ApiError } from "@donaldgifford/design-system/lib/errors";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

const errors = {
  apiError: new ApiError(
    403,
    "NOT_ENTITLED",
    "team payments lacks the sandbox entitlement",
    "req-7f3a91c2",
  ),
  problem: new ApiError(404, undefined, "no repository named payments/apx", "req-2b81d0aa", {
    type: "about:blank",
    title: "Not Found",
    status: 404,
  }),
  error: new Error("Failed to fetch clusters: network unreachable"),
  string: "the deploy service timed out",
};

const meta = {
  title: "Blocks/ErrorState",
  component: ErrorState,
  args: {
    error: errors.apiError,
    onRetry: fn(),
  },
  argTypes: {
    error: {
      control: "select",
      options: Object.keys(errors),
      mapping: errors,
    },
  },
} satisfies Meta<typeof ErrorState>;

export default meta;
type Story = StoryObj<typeof meta>;

/** An API problem: its reason heads the block and its request id shows under the message. */
export const Default: Story = {};

/** A problem body with a title is headed by its status and that title. */
export const Problem: Story = { args: { error: errors.problem } };

/** Any other error reads "Something went wrong" over its message. */
export const PlainError: Story = { args: { error: errors.error } };

export const CustomTitle: Story = {
  args: { error: errors.string, title: "Couldn't load deploys" },
};

// Storybook types an arg from the meta's value, which leaves no room for "unset".
export const WithoutRetry: Story = { args: { onRetry: undefined as never } };
