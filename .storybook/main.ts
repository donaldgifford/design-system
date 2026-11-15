import type { StorybookConfig } from "@storybook/react-vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { mergeConfig } from "vite";

/**
 * The package's workshop: a story beside every
 * component, on the package's own globals.css, with the accessibility
 * addon on every story and docs pages generated from them.
 */
const config: StorybookConfig = {
  framework: "@storybook/react-vite",
  stories: ["./docs/*.mdx", "../src/components/**/*.stories.tsx"],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y", "@storybook/addon-themes"],
  core: { disableTelemetry: true },
  // react-docgen-typescript needs TypeScript's JS API, which TypeScript 7
  // doesn't ship; react-docgen reads props from the source with Babel.
  typescript: { reactDocgen: "react-docgen" },
  viteFinal: (base) => mergeConfig(base, { plugins: [react(), tailwindcss()] }),
};

export default config;
