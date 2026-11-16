import { Separator as SeparatorPrimitive } from "@base-ui/react/separator";
import { cn } from "@donaldgifford/design-system/lib/utils";

const separatorClass =
  "shrink-0 bg-border data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px";

interface SeparatorProps extends SeparatorPrimitive.Props {
  /** Purely visual: hidden from assistive tech. A real separator when false. */
  decorative?: boolean | undefined;
}

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: SeparatorProps) {
  // Base UI's separator is always semantic; a decorative one drops the role.
  const semantics = decorative ? { role: "none", "aria-orientation": undefined } : {};
  return (
    <SeparatorPrimitive
      data-slot="separator"
      orientation={orientation}
      className={cn(separatorClass, className)}
      {...props}
      {...semantics}
    />
  );
}

export { Separator };
