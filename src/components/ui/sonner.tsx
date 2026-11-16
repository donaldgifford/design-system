import {
  IconAlertOctagon,
  IconAlertTriangle,
  IconCircleCheck,
  IconInfoCircle,
  IconLoader2,
} from "@tabler/icons-react";
import type * as React from "react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

// Toaster is sonner's toast region, themed from the shell's tokens. The
// shell passes the resolved color mode as `theme` instead of next-themes.
const Toaster = ({ theme = "dark", ...props }: ToasterProps) => (
  <Sonner
    theme={theme}
    className="toaster group"
    icons={{
      success: <IconCircleCheck className="size-4" />,
      info: <IconInfoCircle className="size-4" />,
      warning: <IconAlertTriangle className="size-4" />,
      error: <IconAlertOctagon className="size-4" />,
      loading: <IconLoader2 className="size-4 animate-spin" />,
    }}
    style={
      {
        "--normal-bg": "var(--popover)",
        "--normal-text": "var(--popover-foreground)",
        "--normal-border": "var(--border)",
        "--border-radius": "var(--radius)",
      } as React.CSSProperties
    }
    {...props}
  />
);

export { Toaster };
