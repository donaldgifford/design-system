import { cn } from "@donaldgifford/design-system/lib/utils";
import { useId } from "react";

export interface OutlineItem {
  /** The heading element's id; the link goes to `#id`. */
  id: string;
  text: string;
  /** The heading's level: 2 for an `h2`. Only the differences between items matter. */
  depth: number;
}

interface OutlineProps {
  items: readonly OutlineItem[];
  /** The heading being read, from `useActiveHeading` or the app's own spy. */
  activeId?: string | undefined;
  /** The heading over the list, and the landmark's name. */
  label?: string | undefined;
  className?: string | undefined;
}

/** One step of indent per level below the shallowest, up to four levels. */
const indentClass = ["pl-3", "pl-6", "pl-9", "pl-12"] as const;

/**
 * "On this page": a document's headings as links on a hairline, with
 * the one being read marked on its own segment of the line. It draws
 * what it is given; which heading is active is the caller's, usually
 * `useActiveHeading(items.map((item) => item.id))`.
 */
export function Outline({ items, activeId, label = "On this page", className }: OutlineProps) {
  const labelId = useId();
  if (items.length === 0) return null;
  const shallowest = Math.min(...items.map((item) => item.depth));
  return (
    <nav data-slot="outline" aria-labelledby={labelId} className={cn("text-sm", className)}>
      <div
        id={labelId}
        className="mb-2 font-medium text-label text-muted-foreground uppercase tracking-label"
      >
        {label}
      </div>
      <ul className="border-l">
        {items.map((item) => {
          const active = item.id === activeId;
          const level = Math.min(item.depth - shallowest, indentClass.length - 1);
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                data-active={active}
                aria-current={active ? "location" : undefined}
                className={cn(
                  // Drawn over the list's hairline, so the active link colors its own segment.
                  "-ml-px block border-l-2 border-transparent py-1 pr-2 text-muted-foreground leading-compact outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring",
                  "data-[active=true]:border-primary data-[active=true]:font-medium data-[active=true]:text-foreground",
                  indentClass[level],
                )}
              >
                {item.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
