import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// The theme's own steps (globals.css's @theme inline map), so a label
// size isn't taken for a text color and dropped beside one.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ["label", "label-sm", "label-xs"],
      radius: ["pill"],
      tracking: ["label"],
      leading: ["compact", "dense"],
    },
  },
});

/** Merges class names the shadcn way: clsx for conditionals, tailwind-merge for conflicts. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
