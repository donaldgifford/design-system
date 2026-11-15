import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@donaldgifford/design-system/components/table";
import type { Meta, StoryObj } from "@storybook/react-vite";

const clusters = [
  { id: "payments-prod-usw2", region: "us-west-2", nodes: 24, version: "1.33" },
  { id: "payments-stage-usw2", region: "us-west-2", nodes: 8, version: "1.33" },
  { id: "ledger-prod-use1", region: "us-east-1", nodes: 16, version: "1.32" },
  { id: "ledger-stage-use1", region: "us-east-1", nodes: 6, version: "1.32" },
  { id: "search-prod-euw1", region: "eu-west-1", nodes: 12, version: "1.33" },
  { id: "search-stage-euw1", region: "eu-west-1", nodes: 4, version: "1.33" },
  { id: "ingest-prod-euc1", region: "eu-central-1", nodes: 10, version: "1.31" },
  { id: "ingest-stage-euc1", region: "eu-central-1", nodes: 3, version: "1.31" },
];

const meta = {
  title: "Primitives/Table",
  component: Table,
  args: { className: "max-w-xl" },
  render: (args) => (
    <Table {...args}>
      <TableCaption>Clusters in the estate.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Cluster</TableHead>
          <TableHead>Region</TableHead>
          <TableHead>Version</TableHead>
          <TableHead className="text-right">Nodes</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {clusters.slice(0, 4).map((cluster) => (
          <TableRow key={cluster.id}>
            <TableCell className="font-mono">{cluster.id}</TableCell>
            <TableCell>{cluster.region}</TableCell>
            <TableCell>{cluster.version}</TableCell>
            <TableCell className="text-right tabular-nums">{cluster.nodes}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** A totals row in `TableFooter`, and a selected row (`data-state="selected"`). */
export const FooterAndSelection: Story = {
  render: (args) => (
    <Table {...args}>
      <TableHeader>
        <TableRow>
          <TableHead>Cluster</TableHead>
          <TableHead className="text-right">Nodes</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {clusters.slice(0, 4).map((cluster, index) => (
          <TableRow key={cluster.id} data-state={index === 1 ? "selected" : undefined}>
            <TableCell className="font-mono">{cluster.id}</TableCell>
            <TableCell className="text-right tabular-nums">{cluster.nodes}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell>Total</TableCell>
          <TableCell className="text-right tabular-nums">
            {clusters.slice(0, 4).reduce((sum, cluster) => sum + cluster.nodes, 0)}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
};

/** `data-sticky` on the header pins it while the container scrolls. */
export const StickyHeader: Story = {
  args: { containerClassName: "max-h-48 rounded-lg border" },
  render: (args) => (
    <Table {...args}>
      <TableHeader data-sticky="">
        <TableRow>
          <TableHead>Cluster</TableHead>
          <TableHead>Region</TableHead>
          <TableHead className="text-right">Nodes</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {clusters.map((cluster) => (
          <TableRow key={cluster.id}>
            <TableCell className="font-mono">{cluster.id}</TableCell>
            <TableCell>{cluster.region}</TableCell>
            <TableCell className="text-right tabular-nums">{cluster.nodes}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};
