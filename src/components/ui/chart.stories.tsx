import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@donaldgifford/design-system/components/chart";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";

const deploys = [
  { day: "Mon", succeeded: 18, failed: 2 },
  { day: "Tue", succeeded: 24, failed: 1 },
  { day: "Wed", succeeded: 21, failed: 4 },
  { day: "Thu", succeeded: 30, failed: 3 },
  { day: "Fri", succeeded: 16, failed: 0 },
  { day: "Sat", succeeded: 4, failed: 1 },
  { day: "Sun", succeeded: 6, failed: 0 },
];

const deploysConfig = {
  succeeded: { label: "succeeded", color: "var(--chart-2)" },
  failed: { label: "failed", color: "var(--chart-5)" },
} satisfies ChartConfig;

const latency = [
  { hour: "00", p50: 42, p99: 180 },
  { hour: "04", p50: 38, p99: 150 },
  { hour: "08", p50: 55, p99: 240 },
  { hour: "12", p50: 61, p99: 310 },
  { hour: "16", p50: 58, p99: 270 },
  { hour: "20", p50: 47, p99: 200 },
];

const latencyConfig = {
  p50: { label: "p50 (ms)", color: "var(--chart-1)" },
  p99: { label: "p99 (ms)", color: "var(--chart-4)" },
} satisfies ChartConfig;

const sync = [
  { status: "synced", value: 42, fill: "var(--color-synced)" },
  { status: "outOfSync", value: 5, fill: "var(--color-outOfSync)" },
  { status: "progressing", value: 3, fill: "var(--color-progressing)" },
];

const syncConfig = {
  synced: { label: "Synced", color: "var(--chart-2)" },
  outOfSync: { label: "Out of sync", color: "var(--chart-4)" },
  progressing: { label: "Progressing", color: "var(--chart-1)" },
} satisfies ChartConfig;

const axis = { tickLine: false, axisLine: false, fontSize: 11 } as const;

const meta = {
  title: "Primitives/Chart",
  component: ChartContainer,
  args: {
    config: deploysConfig,
    className: "h-56 w-full max-w-2xl",
    // The container's child is the Recharts chart; it isn't a control.
    children: (
      <BarChart data={deploys} margin={{ left: -20, right: 4, top: 4 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="day" {...axis} />
        <YAxis {...axis} width={40} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="succeeded" fill="var(--color-succeeded)" radius={[3, 3, 0, 0]} />
        <Bar dataKey="failed" fill="var(--color-failed)" radius={[3, 3, 0, 0]} />
      </BarChart>
    ),
  },
  argTypes: {
    config: { control: "object" },
    children: { control: false },
  },
} satisfies Meta<typeof ChartContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The config's colors become `--color-<key>` on the container, which the series read. */
export const Default: Story = {};

export const Stacked: Story = {
  render: (args) => (
    <ChartContainer {...args}>
      <BarChart data={deploys} margin={{ left: -20, right: 4, top: 4 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="day" {...axis} />
        <YAxis {...axis} width={40} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="succeeded" stackId="a" fill="var(--color-succeeded)" />
        <Bar dataKey="failed" stackId="a" fill="var(--color-failed)" radius={[3, 3, 0, 0]} />
      </BarChart>
    </ChartContainer>
  ),
};

export const LineSeries: Story = {
  args: { config: latencyConfig },
  render: (args) => (
    <ChartContainer {...args}>
      <LineChart data={latency} margin={{ left: -20, right: 4, top: 4 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="hour" {...axis} />
        <YAxis {...axis} width={40} />
        <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Line
          dataKey="p50"
          type="monotone"
          stroke="var(--color-p50)"
          strokeWidth={1.5}
          dot={false}
        />
        <Line
          dataKey="p99"
          type="monotone"
          stroke="var(--color-p99)"
          strokeWidth={1.5}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  ),
};

export const AreaSeries: Story = {
  args: { config: latencyConfig },
  render: (args) => (
    <ChartContainer {...args}>
      <AreaChart data={latency} margin={{ left: -20, right: 4, top: 4 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="hour" {...axis} />
        <YAxis {...axis} width={40} />
        <ChartTooltip content={<ChartTooltipContent indicator="dashed" />} />
        <Area
          dataKey="p99"
          type="monotone"
          stroke="var(--color-p99)"
          fill="var(--color-p99)"
          fillOpacity={0.2}
        />
        <Area
          dataKey="p50"
          type="monotone"
          stroke="var(--color-p50)"
          fill="var(--color-p50)"
          fillOpacity={0.2}
        />
      </AreaChart>
    </ChartContainer>
  ),
};

/** `nameKey` points the tooltip and legend at the config key held in each slice. */
export const Donut: Story = {
  args: { config: syncConfig, className: "h-64 w-72" },
  render: (args) => (
    <ChartContainer {...args}>
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent nameKey="status" hideLabel />} />
        <ChartLegend content={<ChartLegendContent nameKey="status" />} />
        <Pie data={sync} dataKey="value" nameKey="status" innerRadius={48} outerRadius={72}>
          {sync.map((slice) => (
            <Cell key={slice.status} fill={slice.fill} />
          ))}
        </Pie>
      </PieChart>
    </ChartContainer>
  ),
};

/** The three tooltip indicators, held open on Thursday through `defaultIndex` and `active`. */
export const TooltipIndicators: Story = {
  render: (args) => (
    <div className="grid gap-4">
      {(["dot", "line", "dashed"] as const).map((indicator) => (
        <ChartContainer key={indicator} {...args} className="h-48 w-full max-w-xl">
          <BarChart data={deploys} margin={{ left: -20, right: 4, top: 4 }}>
            <XAxis dataKey="day" {...axis} />
            <ChartTooltip
              active
              defaultIndex={3}
              content={<ChartTooltipContent indicator={indicator} />}
            />
            <Bar dataKey="succeeded" fill="var(--color-succeeded)" radius={[3, 3, 0, 0]} />
            <Bar dataKey="failed" fill="var(--color-failed)" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ChartContainer>
      ))}
    </div>
  ),
};
