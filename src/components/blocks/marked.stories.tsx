import { List, ListRow } from "@donaldgifford/design-system/blocks/list-row";
import { Marked } from "@donaldgifford/design-system/blocks/marked";
import { Time } from "@donaldgifford/design-system/blocks/time";
import { Badge } from "@donaldgifford/design-system/components/badge";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Blocks/Marked",
  component: Marked,
  args: { text: "The <em>shell</em> takes the package's tokens, light and <em>dark</em>." },
  render: (args) => (
    <p className="max-w-md text-muted-foreground text-sm">
      <Marked {...args} />
    </p>
  ),
} satisfies Meta<typeof Marked>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Each run between `<em>` and `</em>` is marked. */
export const Default: Story = {};

/** Anything else in the string is text: no tag in a snippet renders. */
export const Untrusted: Story = {
  args: { text: "<script>alert(1)</script> and <b>bold</b> stay text; <em>this</em> is marked." },
};

const hits = [
  {
    id: "DESIGN-0026",
    type: "design",
    tone: "var(--category-2)",
    title: "The shell in repo-guardian's look",
    snippet:
      "The site's chrome takes the package's tokens: graphite surfaces, a sky accent, and the <em>sidebar</em> beside the content. A repository's <em>sidebar</em> is a tree.",
    at: "2026-10-14T16:42:00Z",
  },
  {
    id: "RFC-0003",
    type: "rfc",
    tone: "var(--category-5)",
    title: "Sidebar tree: nested rows in the shell sidebar that open and close",
    snippet:
      "Add a <em>sidebar</em> tree to the shell: a nav row that can hold more rows, to any depth.",
    at: "2026-11-22T09:10:00Z",
  },
  {
    id: "ADR-0004",
    type: "adr",
    tone: "var(--category-1)",
    title: "One repository: docz, docz-api and docz-site",
    snippet: "No snippet matched the <em>sidebar</em> here beyond the title.",
    at: "2026-08-30T11:05:00Z",
  },
];

/**
 * A search result list: `ListRow` with an eyebrow, the title as the
 * app's link, the snippet as its detail with the matches marked, and the
 * time as a date over a time.
 */
export const SearchResults: Story = {
  render: () => (
    <List className="max-w-2xl">
      {hits.map((hit) => (
        <ListRow
          key={hit.id}
          eyebrow={`docz · ${hit.id}`}
          title={hit.title}
          render={<a href={`#${hit.id}`} />}
          detail={<Marked text={hit.snippet} />}
          trailing={
            <>
              <Badge tone={hit.tone}>{hit.type}</Badge>
              <Time iso={hit.at} style="stacked" />
            </>
          }
        />
      ))}
    </List>
  ),
};
