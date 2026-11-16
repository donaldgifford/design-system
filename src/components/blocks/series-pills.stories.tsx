import { SeriesPills } from "@donaldgifford/design-system/blocks/series-pills";
import { TrendChart } from "@donaldgifford/design-system/blocks/trend-chart";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { fn } from "storybook/test";

const series = [
  { key: "payments", label: "payments", color: "var(--chart-1)", value: "98.1%" },
  { key: "web", label: "web", color: "var(--chart-2)", value: "87.4%" },
  { key: "data", label: "data", color: "var(--chart-3)", value: "92.0%" },
];

const meta = {
  title: "Blocks/SeriesPills",
  component: SeriesPills,
  args: { items: series, value: "payments", onValueChange: fn(), label: "Org" },
  render: function Render(args) {
    const [value, setValue] = useState(args.value);
    return (
      <SeriesPills
        {...args}
        value={value}
        onValueChange={(key) => {
          args.onValueChange(key);
          setValue(key);
        }}
      />
    );
  },
} satisfies Meta<typeof SeriesPills>;

export default meta;
type Story = StoryObj<typeof meta>;

/** One pill is always selected; Tab reaches the group and the arrow keys move within it. */
export const Default: Story = {};

export const WithoutValues: Story = {
  args: { items: series.map(({ value: _value, ...item }) => item) },
};

/** What it is for: picking the one series a chart draws, in that series' color. */
export const PickingASeries: Story = {
  render: function Render(args) {
    const [value, setValue] = useState(args.value);
    const picked = series.find((s) => s.key === value) ?? series[0];
    const base = { payments: 91, web: 84, data: 90 }[value] ?? 90;
    const points = Array.from({ length: 30 }, (_, i) => ({
      at: new Date(Date.UTC(2026, 2, 1 + i)).toISOString(),
      value: Math.round((base + i * 0.12 + ((i * 3) % 4) * 0.3) * 10) / 10,
    }));
    return (
      <div className="max-w-2xl space-y-3">
        <SeriesPills {...args} value={value} onValueChange={setValue} />
        <TrendChart
          points={points}
          color={picked?.color}
          series={picked?.label ?? ""}
          label={`Passing checks, ${picked?.label}`}
        />
      </div>
    );
  },
};
