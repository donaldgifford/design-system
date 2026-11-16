import { DetailsGrid } from "@donaldgifford/design-system/blocks/details-grid";
import { Badge } from "@donaldgifford/design-system/components/badge";
import { Button } from "@donaldgifford/design-system/components/button";
import { useMediaQuery } from "@donaldgifford/design-system/hooks/use-media-query";
import { cn } from "@donaldgifford/design-system/lib/utils";
import {
  DETAIL_INLINE_QUERY,
  DetailInset,
  DetailPanel,
  DetailSection,
} from "@donaldgifford/design-system/shell/detail-panel";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useRef, useState } from "react";
import { fn } from "storybook/test";

const findings = ["payments/api", "payments/web", "data/etl"];

const body = (
  <>
    <DetailsGrid
      columns={1}
      items={[
        { label: "Status", value: <Badge variant="destructive">failing</Badge> },
        { label: "Rule", value: "codeowners" },
        { label: "First seen", value: "2026-03-02" },
      ]}
    />
    <DetailSection title="Evidence">
      <DetailInset aria-label="Evidence">
        {"CODEOWNERS: not found\nchecked: /, /docs, /.github"}
      </DetailInset>
    </DetailSection>
  </>
);

const meta = {
  title: "Shell/DetailPanel",
  component: DetailPanel,
  args: {
    open: true,
    onOpenChange: fn(),
    inline: true,
    title: "payments/api",
    description: "codeowners · failing",
    footer: (
      <>
        <Button variant="outline" size="sm">
          Waive
        </Button>
        <Button size="sm">Open pull request</Button>
      </>
    ),
    children: body,
  },
  argTypes: { children: { control: false }, footer: { control: false } },
} satisfies Meta<typeof DetailPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A list with its detail panel. `inline` puts the panel in the page, in
 * a grid column the page gives it; Escape or the close button returns
 * focus to the row that opened it.
 */
export const Inline: Story = {
  render: function Render(args) {
    const [selected, setSelected] = useState<string | undefined>(findings[0]);
    const rows = useRef(new Map<string, HTMLButtonElement>());
    const open = selected !== undefined;
    return (
      <div className={cn("grid items-start gap-4", open && args.inline && "grid-cols-2")}>
        <ul className="divide-y rounded-md border">
          {findings.map((name) => (
            <li key={name}>
              <button
                type="button"
                ref={(el) => {
                  if (el) rows.current.set(name, el);
                }}
                aria-current={selected === name ? "true" : undefined}
                onClick={() => setSelected(name)}
                className="w-full px-3 py-2 text-left font-mono text-sm outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 aria-current:bg-primary/12"
              >
                {name}
              </button>
            </li>
          ))}
        </ul>
        <DetailPanel
          {...args}
          open={open}
          title={selected ?? ""}
          onOpenChange={(next) => {
            args.onOpenChange(next);
            if (!next) setSelected(undefined);
          }}
          returnFocusTo={() => (selected ? rows.current.get(selected) : undefined)}
        />
      </div>
    );
  },
};

/** The same panel as a sheet over the page; kept off the docs page, which it would cover. */
export const Overlay: Story = {
  ...Inline,
  tags: ["!autodocs"],
  args: { inline: false },
};

/**
 * What a page does: inline from `DETAIL_INLINE_QUERY` (1600px) up, an
 * overlay below. Resize the window to see it change form.
 */
export const Responsive: Story = {
  tags: ["!autodocs"],
  render: function Render(args) {
    const inline = useMediaQuery(DETAIL_INLINE_QUERY);
    const [open, setOpen] = useState(false);
    return (
      <div className={cn("grid items-start gap-4", open && inline && "grid-cols-2")}>
        <div>
          <Button variant="outline" onClick={() => setOpen(true)}>
            View payments/api
          </Button>
        </div>
        <DetailPanel {...args} inline={inline} open={open} onOpenChange={setOpen} />
      </div>
    );
  },
};
