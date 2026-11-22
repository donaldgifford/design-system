import { useEffect, useState } from "react";

interface ActiveHeadingOptions {
  /**
   * The band of the viewport a heading must be in to count as being
   * read, as an `IntersectionObserver` root margin. The default is the
   * top third.
   */
  rootMargin?: string | undefined;
}

/**
 * The scroll spy behind an `Outline`: of the elements with these ids,
 * the one being read. That is the first, in the order given, inside the
 * top band of the viewport; between headings it stays the last one that
 * was, so a long section keeps its heading marked.
 *
 * Returns undefined until a heading has been seen, on the server, and
 * where there is no `IntersectionObserver`.
 */
export function useActiveHeading(
  ids: readonly string[],
  { rootMargin = "0px 0px -66% 0px" }: ActiveHeadingOptions = {},
): string | undefined {
  const [active, setActive] = useState<string | undefined>(undefined);
  // The ids as one string, so a new array with the same ids does not re-observe.
  const key = ids.join("\n");

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const order = key === "" ? [] : key.split("\n");
    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        const first = order.find((id) => visible.has(id));
        if (first !== undefined) setActive(first);
      },
      { rootMargin },
    );
    for (const id of order) {
      const heading = document.getElementById(id);
      if (heading) observer.observe(heading);
    }
    return () => observer.disconnect();
  }, [key, rootMargin]);

  return active;
}
