import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cn } from "@donaldgifford/design-system/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-lg text-xs/compact font-medium whitespace-nowrap transition-all outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive/18 text-destructive focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        outline: "border bg-card text-foreground hover:bg-muted",
        secondary: "border bg-card text-foreground hover:bg-muted",
        ghost:
          "border border-transparent text-muted-foreground hover:bg-muted hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        success:
          "bg-success/18 text-success focus-visible:ring-success/20 dark:focus-visible:ring-success/40",
        warning:
          "bg-warning/18 text-warning focus-visible:ring-warning/20 dark:focus-visible:ring-warning/40",
        info: "bg-info/18 text-info focus-visible:ring-info/20 dark:focus-visible:ring-info/40",
      },
      size: {
        default: "h-(--control-h) px-2.5",
        xs: "h-5.5 gap-1 px-1.75 text-label/dense [&_svg:not([class*='size-'])]:size-3",
        sm: "h-5.5 gap-1.5 px-1.75 text-label/compact",
        lg: "h-8 px-3.5",
        icon: "size-(--control-h) p-0",
        "icon-xs": "size-5.5 p-0 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-5.5 p-0",
        "icon-lg": "h-(--control-h) w-10 px-2.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
