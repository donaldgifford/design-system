import { CodeBlock } from "@donaldgifford/design-system/blocks/code-block";
import type { Meta, StoryObj } from "@storybook/react-vite";

const languages = ["json", "yaml", "shell", "hcl", "text"] as const;

const samples: Record<(typeof languages)[number], { title: string; code: string }> = {
  yaml: {
    title: "cluster.yaml",
    code: `# cluster.yaml
name: payments-prod-usw2
region: us-west-2
nodes:
  - pool: general
    count: 3
ready: true
`,
  },
  json: {
    title: "pin-regions.json",
    code: `{
  "Effect": "Deny",
  "Resource": "*",
  "Condition": { "regions": ["us-west-2"] }
}
`,
  },
  shell: {
    title: "terminal",
    code: `# Point kubectl at the local stack
export KUBECONFIG=~/.kube/local
kubectl get nodes --context dev
`,
  },
  hcl: {
    title: "main.tf",
    code: `module "spoke" {
  source  = "./modules/spoke"
  name    = "dev-usw2"
  enabled = true
  nodes   = 3
}
`,
  },
  text: {
    title: "workflow.log",
    code: `run-microvm started
verify passed in 41s
`,
  },
};

const meta = {
  title: "Blocks/CodeBlock",
  component: CodeBlock,
  args: {
    code: samples.yaml.code,
    language: "yaml",
    title: samples.yaml.title,
    lineNumbers: false,
  },
  argTypes: {
    language: { control: "select", options: languages },
  },
} satisfies Meta<typeof CodeBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LineNumbers: Story = { args: { lineNumbers: true } };

/** Without a title the header shows the language. */
export const Untitled: Story = { args: { title: undefined } };

/** Each language the highlighter knows, with and without line numbers. */
export const AllLanguages: Story = {
  render: (args) => (
    <div className="grid gap-4 lg:grid-cols-2">
      {languages.map((language) => (
        <CodeBlock
          key={language}
          {...args}
          language={language}
          title={samples[language].title}
          code={samples[language].code}
          lineNumbers={language === "hcl" || language === "json"}
        />
      ))}
    </div>
  ),
};
