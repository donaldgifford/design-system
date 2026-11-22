import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible";
import { cn } from "@donaldgifford/design-system/lib/utils";

/**
 * A region that opens and closes under one trigger. Controlled with
 * `open` and `onOpenChange`, or left to itself with `defaultOpen`.
 */
function Collapsible(props: CollapsiblePrimitive.Root.Props) {
  return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />;
}

/** The button that toggles the panel. It carries `aria-expanded` and `data-panel-open`. */
function CollapsibleTrigger(props: CollapsiblePrimitive.Trigger.Props) {
  return <CollapsiblePrimitive.Trigger data-slot="collapsible-trigger" {...props} />;
}

/**
 * What opens. Closed, it is not in the DOM, so a long closed region costs
 * nothing; pass `keepMounted` to keep it for find-in-page. Its height
 * animates between zero and its content's.
 */
function CollapsiblePanel({ className, ...props }: CollapsiblePrimitive.Panel.Props) {
  return (
    <CollapsiblePrimitive.Panel
      data-slot="collapsible-panel"
      className={cn(
        "h-(--collapsible-panel-height) overflow-hidden transition-[height] duration-(--duration-normal) ease-(--ease-standard) data-ending-style:h-0 data-starting-style:h-0",
        className,
      )}
      {...props}
    />
  );
}

export { Collapsible, CollapsiblePanel, CollapsibleTrigger };
