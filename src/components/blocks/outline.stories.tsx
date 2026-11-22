import { Outline, type OutlineItem } from "@donaldgifford/design-system/blocks/outline";
import { useActiveHeading } from "@donaldgifford/design-system/hooks/use-active-heading";
import type { Meta, StoryObj } from "@storybook/react-vite";

const items: OutlineItem[] = [
  { id: "summary", text: "Summary", depth: 2 },
  { id: "problem-statement", text: "Problem Statement", depth: 2 },
  { id: "supporting-data", text: "Supporting Data", depth: 3 },
  { id: "proposed-solution", text: "Proposed Solution", depth: 2 },
  { id: "the-component", text: "The component", depth: 3 },
  { id: "on-the-icon-rail-and-on-mobile", text: "On the icon rail and on mobile", depth: 3 },
  { id: "alternatives-considered", text: "Alternatives Considered", depth: 2 },
  { id: "references", text: "References", depth: 2 },
];

const meta = {
  title: "Blocks/Outline",
  component: Outline,
  args: { items, activeId: "the-component", label: "On this page" },
  decorators: [
    (Story) => (
      <div className="w-56">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Outline>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The heading being read is marked on its own segment of the line. */
export const Default: Story = {};

/** Before any heading has been reached. */
export const NoneActive: Story = { args: { activeId: undefined } };

export const Flat: Story = {
  args: { items: items.filter((item) => item.depth === 2), activeId: "summary" },
};

const filler =
  "A row that is a link gets a separate caret button, so following the link and looking inside are two actions. ";

/** Beside a long page, with `useActiveHeading` choosing the active heading as the page scrolls. */
export const WithScrollSpy: Story = {
  decorators: [],
  render: function Render(args) {
    const activeId = useActiveHeading(args.items.map((item) => item.id));
    return (
      <div className="flex gap-10">
        <article className="max-w-prose flex-1 space-y-4">
          {args.items.map((item) => (
            <section key={item.id} className="space-y-2">
              {item.depth === 2 ? (
                <h2 id={item.id} className="scroll-mt-4 font-medium text-lg">
                  {item.text}
                </h2>
              ) : (
                <h3 id={item.id} className="scroll-mt-4 font-medium">
                  {item.text}
                </h3>
              )}
              <p className="text-muted-foreground">{filler.repeat(9)}</p>
            </section>
          ))}
        </article>
        <aside className="w-56 shrink-0">
          <div className="sticky top-4">
            <Outline {...args} activeId={activeId} />
          </div>
        </aside>
      </div>
    );
  },
};
