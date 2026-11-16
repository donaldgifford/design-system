import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";
import { cn } from "@donaldgifford/design-system/lib/utils";
import * as React from "react";

// Base UI leaves tooltips out of the accessibility tree; the wrapper keeps
// the WAI-ARIA contract: the popup is a tooltip and describes its trigger
// while open.
const TooltipContext = React.createContext<{ id: string; open: boolean } | null>(null);

function TooltipProvider({ delay = 0, ...props }: TooltipPrimitive.Provider.Props) {
  return <TooltipPrimitive.Provider data-slot="tooltip-provider" delay={delay} {...props} />;
}

function Tooltip({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  ...props
}: TooltipPrimitive.Root.Props) {
  const id = React.useId();
  const [openState, setOpenState] = React.useState(defaultOpen);
  const open = openProp ?? openState;
  const handleOpenChange: NonNullable<TooltipPrimitive.Root.Props["onOpenChange"]> = (
    next,
    details,
  ) => {
    setOpenState(next);
    onOpenChange?.(next, details);
  };
  const context = React.useMemo(() => ({ id, open }), [id, open]);
  return (
    <TooltipContext.Provider value={context}>
      <TooltipPrimitive.Root
        data-slot="tooltip"
        open={open}
        onOpenChange={handleOpenChange}
        {...props}
      />
    </TooltipContext.Provider>
  );
}

function TooltipTrigger({ ...props }: TooltipPrimitive.Trigger.Props) {
  const context = React.useContext(TooltipContext);
  return (
    <TooltipPrimitive.Trigger
      data-slot="tooltip-trigger"
      aria-describedby={context?.open ? context.id : undefined}
      {...props}
    />
  );
}

function TooltipContent({
  className,
  side = "top",
  sideOffset = 0,
  align = "center",
  alignOffset = 0,
  children,
  ...props
}: TooltipPrimitive.Popup.Props &
  Pick<TooltipPrimitive.Positioner.Props, "align" | "alignOffset" | "side" | "sideOffset">) {
  const context = React.useContext(TooltipContext);
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        className="isolate z-50"
      >
        <TooltipPrimitive.Popup
          data-slot="tooltip-content"
          id={context?.id}
          role="tooltip"
          className={cn(
            "z-50 w-fit origin-(--transform-origin) rounded-lg border bg-popover px-3 py-1.5 text-base/dense text-balance text-popover-foreground data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            className,
          )}
          {...props}
        >
          {children}
          <TooltipPrimitive.Arrow className="z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-xs bg-popover fill-popover data-[side=bottom]:top-1 data-[side=left]:top-1/2! data-[side=left]:-right-1 data-[side=left]:-translate-y-1/2 data-[side=right]:top-1/2! data-[side=right]:-left-1 data-[side=right]:-translate-y-1/2 data-[side=top]:-bottom-2.5" />
        </TooltipPrimitive.Popup>
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  );
}

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
