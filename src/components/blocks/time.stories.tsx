import { Time, TimeZoneProvider, TimeZoneToggle } from "@donaldgifford/design-system/blocks/time";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Blocks/Time",
  component: Time,
  args: { iso: "2026-03-14T09:26:53Z", style: "datetime" },
  argTypes: { style: { control: "inline-radio", options: ["datetime", "date", "relative"] } },
} satisfies Meta<typeof Time>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Without a provider a time renders local; hover it for the same moment in UTC. */
export const Default: Story = {};

export const DateOnly: Story = { args: { style: "date" } };

/** A relative time's title is the absolute one. */
export const Relative: Story = {
  args: { iso: new Date(Date.now() - 3 * 3_600_000).toISOString(), style: "relative" },
};

/** A missing time is a dash, never "Invalid Date". */
export const Missing: Story = { args: { iso: undefined } };

/**
 * The toggle switches every time under the provider. The provider keeps
 * the choice in localStorage; this one uses its own key so the story does
 * not share it with an app on the same origin.
 */
export const WithToggle: Story = {
  render: (args) => (
    <TimeZoneProvider storageKey="storybook.tz">
      <div className="space-y-3">
        <TimeZoneToggle />
        <ul className="space-y-1 text-sm">
          <li>
            Opened <Time {...args} />
          </li>
          <li>
            Closed <Time {...args} iso="2026-03-15T23:40:00Z" />
          </li>
        </ul>
      </div>
    </TimeZoneProvider>
  ),
};
