import { FilterChip } from "@donaldgifford/design-system/blocks/filter-chip";
import { Marked } from "@donaldgifford/design-system/blocks/marked";
import { Badge } from "@donaldgifford/design-system/components/badge";
import {
  CommandDialog,
  CommandEmpty,
  CommandFilters,
  CommandFooter,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@donaldgifford/design-system/components/command";
import { SearchTrigger } from "@donaldgifford/design-system/shell/search-trigger";
import { Kbd } from "@donaldgifford/design-system/shell/top-bar";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { fn } from "storybook/test";

const meta = {
  title: "Shell/SearchTrigger",
  component: SearchTrigger,
  args: { label: "Search", shortcut: "⌘K", onClick: fn(), disabled: false },
} satisfies Meta<typeof SearchTrigger>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A field from `md` up; the icon alone below it. Narrow the canvas to see it change. */
export const Default: Story = {
  args: { "aria-keyshortcuts": "Meta+K Control+K" },
};

export const NoShortcut: Story = { args: { shortcut: undefined } };

export const OwnLabel: Story = { args: { label: "Search documents" } };

const hits = [
  {
    value: "design-0026",
    id: "DESIGN-0026",
    type: "design",
    tone: "var(--category-2)",
    title: "The shell in repo-guardian's look",
    snippet: "A repository's <em>sidebar</em> is a tree of its document types and pages.",
  },
  {
    value: "rfc-0003",
    id: "RFC-0003",
    type: "rfc",
    tone: "var(--category-5)",
    title: "Sidebar tree",
    snippet: "Add a <em>sidebar</em> tree to the shell: a nav row that can hold more rows.",
  },
  {
    value: "adr-0004",
    id: "ADR-0004",
    type: "adr",
    tone: "var(--category-1)",
    title: "One repository",
    snippet: "docz, docz-api and docz-site live together; the <em>sidebar</em> follows.",
  },
];

const types = ["adr", "design", "rfc"] as const;

/**
 * The palette it opens, with all three of `CommandDialog`'s slots: a row
 * of filters under the input, a preview of the highlighted hit beside
 * the list, and key hints along the foot. The Command's `value` is the
 * highlighted item, which is what the preview reads.
 */
export const WithPalette: Story = {
  render: function Render(args) {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("design-0026");
    const [off, setOff] = useState<ReadonlySet<string>>(new Set());
    const shown = hits.filter((hit) => !off.has(hit.type));
    const current = shown.find((hit) => hit.value === value);
    return (
      <>
        <SearchTrigger {...args} onClick={() => setOpen(true)} />
        <CommandDialog
          open={open}
          onOpenChange={setOpen}
          title="Search documents"
          description="Search every document in the repository."
          commandProps={{ value, onValueChange: setValue, label: "Search documents" }}
          preview={
            current ? (
              <div className="grid gap-2">
                <div className="font-mono text-label text-muted-foreground">{current.id}</div>
                <div className="font-medium">{current.title}</div>
                <p className="text-muted-foreground">
                  <Marked text={current.snippet} />
                </p>
              </div>
            ) : (
              <p className="text-muted-foreground">Nothing highlighted.</p>
            )
          }
        >
          <CommandInput placeholder="Search documents…" />
          <CommandFilters aria-label="Document type">
            {types.map((type) => (
              <FilterChip
                key={type}
                pressed={!off.has(type)}
                onPressedChange={(pressed) => {
                  const next = new Set(off);
                  if (pressed) next.delete(type);
                  else next.add(type);
                  setOff(next);
                }}
              >
                {type}
              </FilterChip>
            ))}
          </CommandFilters>
          <CommandList>
            <CommandEmpty>No documents.</CommandEmpty>
            <CommandGroup heading="Documents">
              {shown.map((hit) => (
                <CommandItem key={hit.value} value={hit.value} onSelect={() => setOpen(false)}>
                  <Badge tone={hit.tone}>{hit.type}</Badge>
                  <span className="truncate">
                    {hit.id} · {hit.title}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandFooter>
            <span>
              <Kbd>↑</Kbd> <Kbd>↓</Kbd> move
            </span>
            <span>
              <Kbd>↵</Kbd> open
            </span>
            <span>
              <Kbd>esc</Kbd> close
            </span>
          </CommandFooter>
        </CommandDialog>
      </>
    );
  },
};
