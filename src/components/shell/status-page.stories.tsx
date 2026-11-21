import { StatStrip } from "@donaldgifford/design-system/blocks/stat-strip";
import { StatusBanner, StatusComponents } from "@donaldgifford/design-system/blocks/status";
import { Changelog } from "@donaldgifford/design-system/blocks/timeline";
import { Button } from "@donaldgifford/design-system/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@donaldgifford/design-system/components/card";
import { StatusPageLayout } from "@donaldgifford/design-system/shell/status-page";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconRefresh } from "@tabler/icons-react";

const meta = {
  title: "Shell/StatusPage",
  component: StatusPageLayout,
  parameters: { layout: "fullscreen" },
  args: {
    title: "Fleet status",
    mark: <IconRefresh aria-hidden="true" />,
    description: "updated 12s ago · refreshes every 30s",
    actions: (
      <Button variant="outline" size="sm" nativeButton={false} render={<a href="#sign-in" />}>
        Sign in
      </Button>
    ),
    footer: <code className="font-mono">GET /api/v1/status</code>,
  },
} satisfies Meta<typeof StatusPageLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

const components = [
  { name: "api", state: "operational", detail: "p95 84 ms" },
  { name: "workers", state: "operational", detail: "2 pollers on the task queue" },
  { name: "ingest", state: "degraded", detail: "last delivery 14m ago" },
  { name: "database", state: "operational", detail: "3 ms" },
];

/** A whole page: the banner, the components, a strip of fleet numbers, and releases. */
export const Default: Story = {
  render: (args) => (
    <StatusPageLayout {...args}>
      <StatusBanner state="degraded" note="Public and aggregate-only. No names appear here." />
      <Card className="gap-0 py-0">
        <CardHeader className="px-3.5 py-2.5">
          <CardTitle>Components</CardTitle>
        </CardHeader>
        <StatusComponents items={components} />
      </Card>
      <Card className="gap-0 py-0">
        <StatStrip
          className="border-y-0"
          items={[
            { label: "Repositories", value: "318" },
            { label: "Open pull requests", value: "212" },
            { label: "Runs in 24h", value: "1,204" },
            { label: "Version", value: "v0.9.2" },
          ]}
        />
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Changelog</CardTitle>
        </CardHeader>
        <CardContent>
          <Changelog
            items={[
              {
                id: "v0.9.2",
                date: "Mar 14",
                title: "v0.9.2",
                detail: "Faster discovery passes.",
                tags: [{ label: "running", variant: "success" }],
              },
              { id: "v0.9.1", date: "Mar 2", title: "v0.9.1", detail: "Webhook retries." },
            ]}
          />
        </CardContent>
      </Card>
    </StatusPageLayout>
  ),
};

/** The frame alone, before anything has been measured. */
export const NotYetMeasured: Story = {
  args: { description: "not yet computed · refreshes every 30s" },
  render: (args) => (
    <StatusPageLayout {...args}>
      <StatusBanner state="unknown" />
    </StatusPageLayout>
  ),
};
