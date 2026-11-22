import { Button } from "@donaldgifford/design-system/components/button";
import { IconMoon, IconSun } from "@tabler/icons-react";
import type { ComponentProps } from "react";

export type Mode = "light" | "dark";

interface ModeToggleProps
  extends Omit<ComponentProps<typeof Button>, "children" | "onClick" | "onToggle"> {
  /** The mode in force. An app that follows the system resolves it to one of the two first. */
  mode: Mode;
  /** Called with the other mode. */
  onToggle: (next: Mode) => void;
}

/**
 * The top bar's light and dark switch. It is given the mode and reports
 * the other one; it stores nothing and touches no class. Where the
 * choice is kept, and setting `.dark` on `<html>`, are the app's (the
 * README has the script for first paint).
 */
export function ModeToggle({
  mode,
  onToggle,
  variant = "ghost",
  size = "icon-sm",
  ...props
}: ModeToggleProps) {
  const next: Mode = mode === "dark" ? "light" : "dark";
  const label = `Switch to ${next} mode`;
  const Icon = next === "light" ? IconSun : IconMoon;
  return (
    <Button
      data-slot="mode-toggle"
      data-mode={mode}
      variant={variant}
      size={size}
      aria-label={label}
      title={label}
      {...props}
      onClick={() => onToggle(next)}
    >
      <Icon aria-hidden="true" />
    </Button>
  );
}
