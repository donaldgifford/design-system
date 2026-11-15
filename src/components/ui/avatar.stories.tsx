import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@donaldgifford/design-system/components/avatar";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconCheck } from "@tabler/icons-react";

const sizes = ["sm", "default", "lg"] as const;

// An inline image, so the story needs no network.
const portrait = `data:image/svg+xml,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'><rect width='40' height='40' fill='steelblue'/><circle cx='20' cy='15' r='7' fill='lightsteelblue'/><path d='M6 40c0-9 6-14 14-14s14 5 14 14z' fill='lightsteelblue'/></svg>",
)}`;

const people = ["DG", "AK", "MR", "JT"];

const meta = {
  title: "Primitives/Avatar",
  component: Avatar,
  args: { size: "default" },
  argTypes: {
    size: { control: "inline-radio", options: sizes },
  },
  render: (args) => (
    <Avatar {...args}>
      <AvatarFallback>DG</AvatarFallback>
    </Avatar>
  ),
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** The fallback shows until the image loads, and stays if it fails. */
export const WithImage: Story = {
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage src={portrait} alt="Donald Gifford" />
      <AvatarFallback>DG</AvatarFallback>
    </Avatar>
  ),
};

/** The badge scales with the avatar; at `sm` it drops its icon. */
export const WithBadge: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      {sizes.map((size) => (
        <Avatar key={size} {...args} size={size}>
          <AvatarFallback>DG</AvatarFallback>
          <AvatarBadge>
            <IconCheck aria-hidden="true" />
          </AvatarBadge>
        </Avatar>
      ))}
    </div>
  ),
};

export const AllSizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      {sizes.map((size) => (
        <Avatar key={size} {...args} size={size}>
          <AvatarFallback>DG</AvatarFallback>
        </Avatar>
      ))}
    </div>
  ),
};

/** The overflow count follows the size of the avatars in the group. */
export const Group: Story = {
  render: (args) => (
    <div className="grid gap-3">
      {sizes.map((size) => (
        <AvatarGroup key={size}>
          {people.map((initials) => (
            <Avatar key={initials} {...args} size={size}>
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          ))}
          <AvatarGroupCount>+3</AvatarGroupCount>
        </AvatarGroup>
      ))}
    </div>
  ),
};
