import { Button } from "@donaldgifford/design-system/components/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandFilters,
  CommandFooter,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@donaldgifford/design-system/components/command";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  IconBox,
  IconNetwork,
  IconPlus,
  IconRotateClockwise,
  IconServer,
  IconSettings,
} from "@tabler/icons-react";
import { useState } from "react";

/** The palette's contents, shared by the inline and dialog stories. */
function PaletteItems() {
  return (
    <>
      {/* Named for the dialog, whose Command has no label; an inline label wins over it. */}
      <CommandInput aria-label="Search" placeholder="Go to a page or run a command…" />
      <CommandList>
        <CommandEmpty>No results.</CommandEmpty>
        <CommandGroup heading="Pages">
          <CommandItem>
            <IconServer aria-hidden="true" />
            Clusters
            <CommandShortcut>G C</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <IconBox aria-hidden="true" />
            Sandboxes
            <CommandShortcut>G S</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <IconNetwork aria-hidden="true" />
            Networks
          </CommandItem>
        </CommandGroup>
        <CommandGroup heading="Actions">
          <CommandItem>
            <IconPlus aria-hidden="true" />
            New sandbox
            <CommandShortcut>N</CommandShortcut>
          </CommandItem>
          <CommandItem disabled>
            <IconRotateClockwise aria-hidden="true" />
            Restart all sandboxes
          </CommandItem>
          <CommandItem>
            <IconSettings aria-hidden="true" />
            IconSettings
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </>
  );
}

const meta = {
  title: "Primitives/Command",
  component: Command,
  args: { label: "Command menu", loop: false, shouldFilter: true },
  argTypes: {
    loop: { control: "boolean" },
    shouldFilter: { control: "boolean" },
  },
  render: (args) => (
    <Command {...args} className="max-w-md rounded-lg border">
      <PaletteItems />
    </Command>
  ),
} satisfies Meta<typeof Command>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

// cmdk's listbox breaks aria-required-children in two states, so the rule is
// off only in the stories that show them.
const listboxChildrenOff = {
  a11y: { config: { rules: [{ id: "aria-required-children", enabled: false }] } },
};

/** A search with no match shows CommandEmpty, leaving cmdk's listbox with no options. */
export const NoResults: Story = {
  parameters: listboxChildrenOff,
  render: (args) => (
    <Command {...args} className="max-w-md rounded-lg border">
      <CommandInput value="kubectl" placeholder="Go to a page…" />
      <CommandList>
        <CommandEmpty>No results.</CommandEmpty>
        <CommandGroup heading="Pages">
          <CommandItem>Clusters</CommandItem>
          <CommandItem>Sandboxes</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};

/** The separator is visual and hidden from assistive technology; the groups carry the structure. */
export const WithSeparator: Story = {
  render: (args) => (
    <Command {...args} className="max-w-md rounded-lg border">
      <CommandInput placeholder="Go to a page…" />
      <CommandList>
        <CommandEmpty>No results.</CommandEmpty>
        <CommandGroup heading="Pages">
          <CommandItem>Clusters</CommandItem>
          <CommandItem>Sandboxes</CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem>New sandbox</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};

function PaletteDialog() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Open palette
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <PaletteItems />
      </CommandDialog>
    </>
  );
}

/** CommandDialog has no trigger part; the caller owns `open`. Its title and description are sr-only. */
export const InDialog: Story = {
  render: () => <PaletteDialog />,
};

/** Open on load, for the canvas; kept off the docs page so it doesn't cover it. */
export const DialogOpen: Story = {
  tags: ["!autodocs"],
  render: () => (
    <CommandDialog defaultOpen>
      <PaletteItems />
    </CommandDialog>
  ),
};

const pages = [
  { value: "clusters", label: "Clusters", about: "Every cluster in the fleet, by region." },
  { value: "sandboxes", label: "Sandboxes", about: "Short-lived environments and who owns them." },
  { value: "networks", label: "Networks", about: "VPCs, peering and the routes between them." },
];

function PaletteWithSlots() {
  const [value, setValue] = useState("clusters");
  const [mine, setMine] = useState(false);
  const current = pages.find((page) => page.value === value);
  return (
    <CommandDialog
      defaultOpen
      commandProps={{ value, onValueChange: setValue }}
      preview={
        current ? (
          <div className="grid gap-1">
            <div className="font-medium">{current.label}</div>
            <p className="text-muted-foreground">{current.about}</p>
          </div>
        ) : null
      }
    >
      <CommandInput aria-label="Search" placeholder="Go to a page…" />
      <CommandFilters>
        <Button
          variant="outline"
          size="sm"
          aria-pressed={mine}
          onClick={() => setMine((on) => !on)}
        >
          Mine only
        </Button>
      </CommandFilters>
      <CommandList>
        <CommandEmpty>No results.</CommandEmpty>
        <CommandGroup heading="Pages">
          {pages.map((page) => (
            <CommandItem key={page.value} value={page.value}>
              {page.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
      <CommandFooter>
        <span>↑ ↓ to move</span>
        <span>↵ to open</span>
        <span>esc to close</span>
      </CommandFooter>
    </CommandDialog>
  );
}

/**
 * The three optional parts: `CommandFilters` under the input,
 * `CommandFooter` along the foot, and `preview` on the dialog, a pane
 * beside the list for the highlighted item. A palette that uses none of
 * them is the one above. Shell/SearchTrigger has a fuller example.
 */
export const DialogWithSlots: Story = {
  tags: ["!autodocs"],
  render: () => <PaletteWithSlots />,
};
