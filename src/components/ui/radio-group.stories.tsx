import { Label } from "@donaldgifford/design-system/components/label";
import { RadioGroup, RadioGroupItem } from "@donaldgifford/design-system/components/radio-group";
import type { Meta, StoryObj } from "@storybook/react-vite";

const profiles = ["small", "medium", "large"] as const;

const meta = {
  title: "Primitives/RadioGroup",
  component: RadioGroup,
  args: { "aria-label": "Profile", defaultValue: "small", disabled: false },
  argTypes: {
    defaultValue: { control: "inline-radio", options: profiles },
    disabled: { control: "boolean" },
  },
  // The story id keeps each label's target unique on the docs page.
  render: (args, { id }) => (
    <RadioGroup {...args}>
      {profiles.map((profile) => (
        <div key={profile} className="flex items-center gap-2">
          <RadioGroupItem value={profile} id={`${id}-${profile}`} />
          <Label htmlFor={`${id}-${profile}`}>{profile}</Label>
        </div>
      ))}
    </RadioGroup>
  ),
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Labels wrapping their items, laid out in a row. */
export const Horizontal: Story = {
  render: (args) => (
    <RadioGroup {...args} className="flex gap-4">
      {profiles.map((profile) => (
        <Label key={profile}>
          <RadioGroupItem value={profile} />
          {profile}
        </Label>
      ))}
    </RadioGroup>
  ),
};

export const Disabled: Story = { args: { disabled: true } };

/** One item off while the rest stay selectable. */
export const DisabledItem: Story = {
  render: (args, { id }) => (
    <RadioGroup {...args}>
      {profiles.map((profile) => (
        <div key={profile} className="flex items-center gap-2">
          <RadioGroupItem value={profile} id={`${id}-${profile}`} disabled={profile === "large"} />
          <Label htmlFor={`${id}-${profile}`}>
            {profile === "large" ? "large (quota reached)" : profile}
          </Label>
        </div>
      ))}
    </RadioGroup>
  ),
};

export const Invalid: Story = {
  render: (args, { id }) => (
    <RadioGroup {...args}>
      {profiles.map((profile) => (
        <div key={profile} className="flex items-center gap-2">
          <RadioGroupItem value={profile} id={`${id}-${profile}`} aria-invalid />
          <Label htmlFor={`${id}-${profile}`}>{profile}</Label>
        </div>
      ))}
    </RadioGroup>
  ),
};
