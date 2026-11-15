import { Label } from "@donaldgifford/design-system/components/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@donaldgifford/design-system/components/select";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentProps, useState } from "react";

const profiles = [
  { value: "small", label: "Small · 2 vCPU" },
  { value: "medium", label: "Medium · 4 vCPU" },
  { value: "large", label: "Large · 8 vCPU" },
];

const regions = {
  americas: ["us-east-1", "us-east-2", "us-west-2", "ca-central-1"],
  europe: ["eu-west-1", "eu-central-1"],
};

// `size` belongs to SelectTrigger; the stories pass it through.
type SelectStoryArgs = ComponentProps<typeof Select<string>> & {
  size?: "sm" | "default";
};

const meta = {
  title: "Primitives/Select",
  component: Select,
  subcomponents: { SelectTrigger, SelectContent, SelectItem, SelectGroup, SelectLabel },
  args: { size: "default", disabled: false, defaultValue: "small", items: profiles },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "default"] },
  },
  render: ({ size, ...args }) => (
    <Select {...args}>
      <SelectTrigger size={size} aria-label="Profile">
        <SelectValue placeholder="Profile" />
      </SelectTrigger>
      <SelectContent>
        {profiles.map((profile) => (
          <SelectItem key={profile.value} value={profile.value}>
            {profile.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  ),
} satisfies Meta<SelectStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Placeholder: Story = { args: { defaultValue: undefined } };

export const Disabled: Story = { args: { disabled: true } };

/** Both trigger sizes; each resolves to the same `--control-h` height today. */
export const AllSizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      {(["sm", "default"] as const).map((size) => (
        <Select key={size} {...args}>
          <SelectTrigger size={size} aria-label={`Profile (${size})`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {profiles.map((profile) => (
              <SelectItem key={profile.value} value={profile.value}>
                {profile.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}
    </div>
  ),
};

/** Labelled groups, a separator, and a disabled item. */
export const Grouped: Story = {
  args: { defaultValue: "us-west-2", items: undefined },
  render: ({ size, ...args }) => (
    <div className="grid gap-2">
      <Label htmlFor="select-region">Region</Label>
      <Select {...args}>
        <SelectTrigger id="select-region" size={size} className="w-48">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Americas</SelectLabel>
            {regions.americas.map((region) => (
              <SelectItem key={region} value={region} disabled={region === "ca-central-1"}>
                {region}
              </SelectItem>
            ))}
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Europe</SelectLabel>
            {regions.europe.map((region) => (
              <SelectItem key={region} value={region}>
                {region}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  ),
};

/** Controlled through `value` and `onValueChange(value, details)`. */
export const Controlled: Story = {
  render: function Controlled({ size, defaultValue: _defaultValue, ...args }) {
    const [value, setValue] = useState<string | null>("medium");
    return (
      <div className="grid gap-2">
        <Select {...args} value={value} onValueChange={(next) => setValue(next)}>
          <SelectTrigger size={size} aria-label="Profile">
            <SelectValue placeholder="Profile" />
          </SelectTrigger>
          <SelectContent>
            {profiles.map((profile) => (
              <SelectItem key={profile.value} value={profile.value}>
                {profile.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground">Value: {value ?? "none"}</p>
      </div>
    );
  },
};

/** The popup, open on load. */
export const Open: Story = {
  tags: ["!autodocs"],
  args: { defaultOpen: true },
};
