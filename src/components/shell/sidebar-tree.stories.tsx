import { InlineLoading } from "@donaldgifford/design-system/blocks/inline-state";
import { Dot } from "@donaldgifford/design-system/blocks/list-row";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@donaldgifford/design-system/components/sidebar";
import { useTreeOpen } from "@donaldgifford/design-system/hooks/use-tree-open";
import { ShellSidebar, ShellSidebarGroup } from "@donaldgifford/design-system/shell/sidebar";
import {
  ShellSidebarTreeItem,
  ShellSidebarTreeNote,
} from "@donaldgifford/design-system/shell/sidebar-tree";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  IconBook,
  IconFileText,
  IconFolder,
  IconHistory,
  IconHome,
  IconLayoutDashboard,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { userEvent, within } from "storybook/test";

/** Opens the mobile sheet once the story has mounted. */
function OpenOnMobile() {
  const { isMobile, setOpenMobile } = useSidebar();
  useEffect(() => {
    if (isMobile) setOpenMobile(true);
  }, [isMobile, setOpenMobile]);
  return null;
}

const meta = {
  title: "Shell/SidebarTree",
  component: ShellSidebarTreeItem,
  parameters: { layout: "fullscreen" },
  args: { label: "Documents" },
  argTypes: {
    leading: { control: false },
    badge: { control: false },
    render: { control: false },
    children: { control: false },
  },
  // The sidebar is fixed to the viewport; the transform makes this bounded
  // box its containing block, so it stays inside the story.
  decorators: [
    (Story, { parameters }) => (
      <div className="h-[40rem] transform-gpu overflow-hidden">
        <SidebarProvider defaultOpen={parameters.sidebarOpen !== false} className="h-full min-h-0">
          <ShellSidebar label="Repository navigation">
            <Story />
          </ShellSidebar>
          <SidebarInset className="min-w-0 p-3">
            <SidebarTrigger />
          </SidebarInset>
          {parameters.openMobile === true ? <OpenOnMobile /> : null}
        </SidebarProvider>
      </div>
    ),
  ],
} satisfies Meta<typeof ShellSidebarTreeItem>;

export default meta;
type Story = StoryObj<typeof meta>;

const forms = (
  <ShellSidebarGroup label="Repository">
    <ShellSidebarTreeItem
      label="Overview"
      leading={<IconLayoutDashboard aria-hidden="true" />}
      render={<a href="#overview" />}
    />
    <ShellSidebarTreeItem
      label="Documents"
      leading={<IconFileText aria-hidden="true" />}
      badge={3}
      render={<a href="#documents" />}
      defaultOpen
    >
      <ShellSidebarTreeItem label="RFC-0003 Sidebar tree" render={<a href="#rfc-0003" />} />
      <ShellSidebarTreeItem label="ADR-0004 One repository" render={<a href="#adr-0004" />} />
      <ShellSidebarTreeItem
        label="DESIGN-0026 The shell in the look of its first consumer"
        render={<a href="#design-0026" />}
      />
    </ShellSidebarTreeItem>
    <ShellSidebarTreeItem label="Guides" leading={<IconBook aria-hidden="true" />} defaultOpen>
      <ShellSidebarTreeItem label="Install" render={<a href="#install" />} />
      <ShellSidebarTreeItem label="Configure" render={<a href="#configure" />} />
    </ShellSidebarTreeItem>
  </ShellSidebarGroup>
);

/**
 * The three forms, decided by a row's props. "Overview" has `render`
 * and no children: a link. "Documents" has both: a link, and a caret
 * after it that only toggles, with the badge left of the caret. "Guides"
 * has children and no `render`: the whole row is the toggle.
 */
export const Forms: Story = { render: () => forms };

/**
 * Each state a branch can be in. Closed, its children are not in the
 * DOM. While they load, the app passes `InlineLoading` in a
 * `ShellSidebarTreeNote`. `disabled` is a caret that cannot open, for a
 * row known to be empty. The active row is the current page: a nested
 * one also colors its stretch of the hairline.
 */
export const States: Story = {
  render: () => (
    <ShellSidebarGroup label="Documents">
      <ShellSidebarTreeItem
        label="open"
        leading={<Dot tone="var(--category-1)" />}
        badge={2}
        render={<a href="#open" />}
        defaultOpen
      >
        <ShellSidebarTreeItem label="ADR-0004 One repository" render={<a href="#adr-0004" />} />
        <ShellSidebarTreeItem
          label="ADR-0005 Leave impl out of the export"
          render={<a href="#adr-0005" />}
        />
      </ShellSidebarTreeItem>
      <ShellSidebarTreeItem
        label="closed"
        leading={<Dot tone="var(--category-2)" />}
        badge={27}
        render={<a href="#closed" />}
      >
        <ShellSidebarTreeItem label="DESIGN-0024 docz-review" render={<a href="#design-0024" />} />
      </ShellSidebarTreeItem>
      <ShellSidebarTreeItem
        label="loading"
        leading={<Dot tone="var(--category-3)" />}
        badge={31}
        render={<a href="#loading" />}
        expandable
        defaultOpen
      >
        <ShellSidebarTreeNote>
          <InlineLoading className="p-0" />
        </ShellSidebarTreeNote>
      </ShellSidebarTreeItem>
      <ShellSidebarTreeItem
        label="disabled"
        leading={<Dot tone="var(--category-4)" />}
        badge={0}
        render={<a href="#disabled" />}
        expandable
        disabled
      />
      <ShellSidebarTreeItem
        label="active"
        leading={<Dot tone="var(--category-5)" />}
        badge={3}
        render={<a href="#active" />}
        defaultOpen
      >
        <ShellSidebarTreeItem label="RFC-0002 Tokens" render={<a href="#rfc-0002" />} />
        <ShellSidebarTreeItem
          label="RFC-0003 Sidebar tree"
          render={<a href="#rfc-0003" />}
          active
        />
        <ShellSidebarTreeItem label="RFC-0004 Search" render={<a href="#rfc-0004" />} />
      </ShellSidebarTreeItem>
    </ShellSidebarGroup>
  ),
};

/**
 * Five levels. The component counts depth itself: the first list hangs
 * under the row's icon, and each one below it steps in on its own
 * hairline. A long label is cut with an ellipsis and is the row's
 * `title`.
 */
export const DepthFive: Story = {
  render: () => (
    <ShellSidebarGroup label="Pages">
      <ShellSidebarTreeItem label="guides/" leading={<IconFolder aria-hidden="true" />} defaultOpen>
        <ShellSidebarTreeItem label="Markdown specimen" render={<a href="#specimen" />} />
        <ShellSidebarTreeItem label="operations/" defaultOpen>
          <ShellSidebarTreeItem label="Publishing an image" render={<a href="#publishing" />} />
          <ShellSidebarTreeItem label="registries/" defaultOpen>
            <ShellSidebarTreeItem label="private/" defaultOpen>
              <ShellSidebarTreeItem
                label="Rotating the credentials a registry pulls with"
                render={<a href="#rotating" />}
                active
              />
              <ShellSidebarTreeItem label="Mirrors" render={<a href="#mirrors" />} />
            </ShellSidebarTreeItem>
          </ShellSidebarTreeItem>
        </ShellSidebarTreeItem>
      </ShellSidebarTreeItem>
    </ShellSidebarGroup>
  ),
};

/**
 * Collapsed to the icon rail. A top-level row shows its `leading` with
 * the label as its tooltip; "Changelog" has none, so it gets a mark with
 * its first letter. Nested rows are not drawn. A row with children opens
 * a popover that holds its subtree with every branch open: click
 * "Documents" or "Guides". Opening it calls the row's
 * `onOpenChange(true)`.
 */
export const IconRail: Story = {
  parameters: { sidebarOpen: false },
  render: () => (
    <>
      {forms}
      <ShellSidebarGroup>
        <ShellSidebarTreeItem label="Changelog" render={<a href="#changelog" />} />
      </ShellSidebarGroup>
    </>
  ),
};

/**
 * The popover a row with children opens on the rail: its heading is the
 * row's link, and under it the subtree with every branch open and no
 * carets, scrolling past a height cap.
 */
export const IconRailPopover: Story = {
  parameters: { sidebarOpen: false },
  render: () => forms,
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: "Documents" }));
  },
};

/**
 * Below `md` the sidebar is a sheet at full width, and the tree is drawn
 * as it is expanded: carets, nested lists and all.
 */
export const Mobile: Story = {
  parameters: { openMobile: true },
  globals: { viewport: { value: "mobile1", isRotated: false } },
  render: () => forms,
};

interface Doc {
  id: string;
  title: string;
}

const types: { type: string; tone: string; count: number; docs: Doc[] }[] = [
  {
    type: "adr",
    tone: "var(--category-1)",
    count: 5,
    docs: [
      { id: "ADR-0004", title: "One repository: docz, docz-api and docz-site" },
      { id: "ADR-0005", title: "Leave impl out of the Confluence export" },
    ],
  },
  {
    type: "design",
    tone: "var(--category-2)",
    count: 27,
    docs: [
      { id: "DESIGN-0024", title: "docz-review" },
      { id: "DESIGN-0025", title: "docz-html" },
      { id: "DESIGN-0026", title: "The shell in repo-guardian's look" },
      { id: "DESIGN-0027", title: "docz view" },
    ],
  },
  {
    type: "impl",
    tone: "var(--category-3)",
    count: 31,
    docs: [
      { id: "IMPL-0030", title: "The site's shell" },
      { id: "IMPL-0031", title: "Search" },
    ],
  },
  { type: "runbook", tone: "var(--category-4)", count: 0, docs: [] },
];

const currentType = "design";
const currentDoc = "DESIGN-0026";

/** A document type's row. Its documents are fetched the first time it opens. */
function TypeRow({
  type,
  tone,
  count,
  docs,
  open,
  onOpenChange,
}: (typeof types)[number] & { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (!open || loaded) return;
    const timer = setTimeout(() => setLoaded(true), 900);
    return () => clearTimeout(timer);
  }, [open, loaded]);

  return (
    <ShellSidebarTreeItem
      label={type}
      leading={<Dot tone={tone} />}
      badge={count}
      render={<a href={`#${type}`} />}
      active={type === currentType}
      expandable
      disabled={count === 0}
      open={open}
      onOpenChange={onOpenChange}
    >
      {loaded ? (
        docs.map((doc) => (
          <ShellSidebarTreeItem
            key={doc.id}
            label={`${doc.id} · ${doc.title}`}
            render={<a href={`#${doc.id}`} />}
            active={doc.id === currentDoc}
          />
        ))
      ) : (
        <ShellSidebarTreeNote>
          <InlineLoading className="p-0" />
        </ShellSidebarTreeNote>
      )}
    </ShellSidebarTreeItem>
  );
}

function DoczNav() {
  // The route's type is open; a caret overrides that until the route moves on.
  const documents = useTreeOpen(currentType);
  return (
    <>
      <ShellSidebarGroup label="Repository">
        <ShellSidebarTreeItem
          label="Home"
          leading={<IconHome aria-hidden="true" />}
          badge="index.md"
          render={<a href="#home" />}
        />
        <ShellSidebarTreeItem
          label="Changelog"
          leading={<IconHistory aria-hidden="true" />}
          badge="CHANGELOG.md"
          render={<a href="#changelog" />}
        />
      </ShellSidebarGroup>
      <ShellSidebarGroup label="Documents">
        {types.map((row) => (
          <TypeRow key={row.type} {...row} {...documents.item(row.type)} />
        ))}
      </ShellSidebarGroup>
      <ShellSidebarGroup label="Pages">
        <ShellSidebarTreeItem
          label="guides/"
          leading={<IconFolder aria-hidden="true" />}
          defaultOpen
        >
          <ShellSidebarTreeItem label="Markdown specimen" render={<a href="#specimen" />} />
          <ShellSidebarTreeItem label="operations/" defaultOpen>
            <ShellSidebarTreeItem label="ECR publish setup" render={<a href="#ecr" />} />
          </ShellSidebarTreeItem>
        </ShellSidebarTreeItem>
      </ShellSidebarGroup>
    </>
  );
}

/**
 * docz's repository navigation, from package parts alone. Each document
 * type is a link with its count and a caret; its documents are fetched
 * the first time it opens, with a loading line until they arrive, and a
 * type with none has a caret that cannot open. `useTreeOpen` keeps the
 * current type open. Under it, a pages tree as deep as the repository's
 * folders, whose folder rows are toggles.
 */
export const DoczRepository: Story = { render: () => <DoczNav /> };
