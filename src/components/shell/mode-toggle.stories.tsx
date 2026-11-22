import { type Mode, ModeToggle } from "@donaldgifford/design-system/shell/mode-toggle";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { fn } from "storybook/test";

const meta = {
  title: "Shell/ModeToggle",
  component: ModeToggle,
  args: { mode: "dark", onToggle: fn(), disabled: false },
  argTypes: { mode: { control: "inline-radio", options: ["light", "dark"] } },
} satisfies Meta<typeof ModeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

/** In dark mode it offers light: the sun. */
export const Dark: Story = {};

/** In light mode it offers dark: the moon. */
export const Light: Story = { args: { mode: "light" } };

/**
 * The app holds the mode. Here it is local state; a real app also sets
 * `.dark` on `<html>` and stores the choice.
 */
export const Controlled: Story = {
  render: function Render(args) {
    const [mode, setMode] = useState<Mode>("dark");
    return (
      <div className="flex items-center gap-3">
        <ModeToggle {...args} mode={mode} onToggle={setMode} />
        <span className="font-mono text-muted-foreground text-xs">mode = {mode}</span>
      </div>
    );
  },
};
