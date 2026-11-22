import { markSegments } from "@donaldgifford/design-system/lib/mark";
import { cn } from "@donaldgifford/design-system/lib/utils";

interface MarkedProps {
  /** A snippet with its matches between literal `<em>` and `</em>`. */
  text: string;
  /** For each `<mark>`. */
  className?: string | undefined;
}

/**
 * A search snippet with its matched words marked: each run between
 * `<em>` and `</em>` becomes a `<mark>`, tinted with the primary color
 * behind the text's own color and weight. Everything else in the string
 * is text. It renders no other element, whatever the string holds, so a
 * snippet from an API is safe to pass as it came.
 */
export function Marked({ text, className }: MarkedProps) {
  return (
    <>
      {markSegments(text).map((segment, index) =>
        segment.marked ? (
          <mark
            // biome-ignore lint/suspicious/noArrayIndexKey: the runs of one string, never reordered
            key={index}
            data-slot="marked"
            className={cn("rounded-xs bg-primary/20 text-inherit", className)}
          >
            {segment.text}
          </mark>
        ) : (
          segment.text
        ),
      )}
    </>
  );
}
