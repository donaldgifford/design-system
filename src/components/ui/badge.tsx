import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "@donaldgifford/design-system/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

// A variant names its tone (and, for a filled badge, the fill and text
// when they aren't the tone and its foreground); `fill` picks the form.
const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-(--badge-radius) border-0 px-(--badge-px) py-(--badge-py) font-mono text-xs/none font-normal whitespace-nowrap transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3",
  {
    variants: {
      variant: {
        default: "[--tone-foreground:var(--primary-foreground)] [--tone:var(--primary)]",
        secondary:
          "[--tone-fill:var(--muted)] [--tone-foreground:var(--muted-foreground)] [--tone:var(--muted-foreground)]",
        muted:
          "[--tone-fill:var(--muted)] [--tone-foreground:var(--muted-foreground)] [--tone:var(--muted-foreground)]",
        destructive:
          "[--tone-foreground:var(--destructive-foreground)] [--tone:var(--destructive)] focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        success: "[--tone-foreground:var(--success-foreground)] [--tone:var(--success)]",
        warning: "[--tone-foreground:var(--warning-foreground)] [--tone:var(--warning)]",
        info: "[--tone-foreground:var(--info-foreground)] [--tone:var(--info)]",
        pending:
          "[--tone-fill:var(--pending)] [--tone-foreground:var(--pending-foreground)] [--tone:var(--muted-foreground)]",
        approved: "[--tone-foreground:var(--approved-foreground)] [--tone:var(--approved)]",
        ignored:
          "[--tone-fill:var(--ignored)] [--tone-foreground:var(--ignored-foreground)] [--tone:var(--muted-foreground)]",
        running: "[--tone-foreground:var(--running-foreground)] [--tone:var(--running)]",
        outline: "border border-border bg-transparent px-1.5 py-1 text-muted-foreground",
        ghost: "[--tone-foreground:var(--primary-foreground)] [--tone:var(--primary)]",
        link: "[--tone-foreground:var(--primary-foreground)] [--tone:var(--primary)] underline-offset-4 [a&]:hover:underline",
      },
      fill: {
        tinted: "badge-tinted",
        filled: "badge-filled",
      },
    },
    defaultVariants: {
      variant: "default",
      fill: "tinted",
    },
  },
);

type BadgeVariantProps = VariantProps<typeof badgeVariants>;

/**
 * A badge's color comes from its variant, or from the app. A `tone` is
 * for a category the package has no name for, such as a document type or
 * a team; it is any CSS color, usually one of `var(--category-1)` to
 * `var(--category-8)`. It applies to the tinted form only: a filled
 * badge needs a foreground the package cannot know for an app's color.
 */
type BadgeToneProps =
  | { tone?: undefined; fill?: BadgeVariantProps["fill"] }
  | { tone: string; fill?: "tinted" | undefined };

type BadgeProps = useRender.ComponentProps<"span"> &
  Omit<BadgeVariantProps, "fill"> &
  BadgeToneProps;

function Badge({
  className,
  variant = "default",
  fill = "tinted",
  tone,
  render,
  ...props
}: BadgeProps) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        "data-slot": "badge",
        "data-variant": variant ?? "default",
        "data-fill": variant === "outline" ? undefined : (fill ?? "tinted"),
        "data-tone": tone === undefined ? undefined : "custom",
        // Inline, so it outranks the --tone the variant's class sets.
        style: tone === undefined ? undefined : ({ "--tone": tone } as React.CSSProperties),
        // An outline badge has one form: no tint, no fill.
        className: cn(
          badgeVariants({ variant, fill: variant === "outline" ? null : fill }),
          className,
        ),
      } as React.ComponentProps<"span">,
      props,
    ),
    render,
  });
}

export { Badge, type BadgeProps, badgeVariants };
