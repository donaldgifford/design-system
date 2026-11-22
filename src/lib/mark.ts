/**
 * Search snippets with their matches marked. A search API returns a
 * snippet as a string with the matched words wrapped in literal `<em>`
 * and `</em>`; `markSegments` splits it into the marked and unmarked
 * runs, for `Marked` to draw.
 *
 * A snippet is untrusted text. Only those two exact markers mean
 * anything: an `<em>` with attributes, any other tag, and any entity
 * stay as the characters they are, for React to escape. Nothing here
 * parses or produces HTML.
 */

export interface MarkSegment {
  text: string;
  /** Whether the run sat inside an `<em>` marker. */
  marked: boolean;
}

const marker = /(<\/?em>)/;

/** Splits `text` on literal `<em>` and `</em>` into runs, in order, with no empty run. */
export function markSegments(text: string): MarkSegment[] {
  const segments: MarkSegment[] = [];
  let depth = 0;
  for (const part of text.split(marker)) {
    if (part === "<em>") {
      depth += 1;
    } else if (part === "</em>") {
      // A closer with no opener is ignored, not counted against the next opener.
      depth = Math.max(0, depth - 1);
    } else if (part !== "") {
      const marked = depth > 0;
      const last = segments.at(-1);
      // Nested markers and back-to-back ones yield one run, not several.
      if (last && last.marked === marked) last.text += part;
      else segments.push({ text: part, marked });
    }
  }
  return segments;
}
