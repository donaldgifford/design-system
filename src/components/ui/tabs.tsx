import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import { cn } from "@donaldgifford/design-system/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

function Tabs({ className, orientation = "horizontal", ...props }: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      orientation={orientation}
      className={cn("group/tabs flex gap-2 data-[orientation=horizontal]:flex-col", className)}
      {...props}
    />
  );
}

// Two forms. `default` is repo-guardian's segmented control: one
// bordered row, the active tab lifted onto the accent surface. `line` is
// the quiet highlight for a page's sections: the list sits on a
// hairline and the active tab gets a primary rule under it (beside it
// when vertical).
const tabsListVariants = cva(
  "group/tabs-list inline-flex w-fit items-center justify-center text-muted-foreground group-data-[orientation=horizontal]/tabs:h-(--control-h) group-data-[orientation=vertical]/tabs:h-fit group-data-[orientation=vertical]/tabs:flex-col",
  {
    variants: {
      variant: {
        default: "overflow-hidden rounded-lg border",
        line: "gap-1 group-data-[orientation=horizontal]/tabs:border-b group-data-[orientation=vertical]/tabs:border-l",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function TabsList({
  className,
  variant = "default",
  activateOnFocus = true,
  ...props
}: TabsPrimitive.List.Props & VariantProps<typeof tabsListVariants>) {
  // Automatic activation, as the WAI-ARIA tabs pattern recommends when
  // panels render without a fetch; Base UI defaults to manual.
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      activateOnFocus={activateOnFocus}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  );
}

function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(
        "relative inline-flex h-full items-center justify-center gap-1.5 rounded-none px-2.5 py-0 text-xs/compact font-medium whitespace-nowrap text-muted-foreground transition-colors group-data-[orientation=vertical]/tabs:w-full group-data-[orientation=vertical]/tabs:justify-start group-data-[orientation=vertical]/tabs:py-1.5 hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 data-active:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        "group-data-[variant=default]/tabs-list:data-active:bg-accent group-data-[variant=default]/tabs-list:data-active:text-accent-foreground",
        "after:absolute after:bg-primary after:opacity-0 after:transition-opacity group-data-[variant=line]/tabs-list:data-active:after:opacity-100 group-data-[orientation=horizontal]/tabs:after:inset-x-0 group-data-[orientation=horizontal]/tabs:after:-bottom-px group-data-[orientation=horizontal]/tabs:after:h-0.5 group-data-[orientation=vertical]/tabs:after:inset-y-0 group-data-[orientation=vertical]/tabs:after:-left-px group-data-[orientation=vertical]/tabs:after:w-0.5",
        className,
      )}
      {...props}
    />
  );
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  );
}

export { Tabs, TabsContent, TabsList, TabsTrigger, tabsListVariants };
