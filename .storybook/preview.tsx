import "../src/styles/globals.css";
import { withThemeByClassName } from "@storybook/addon-themes";
import type { Preview } from "@storybook/react-vite";

const preview: Preview = {
  // The shell's contract: tokens.css's :root is light, and the .dark class
  // on <html> switches to the default dark theme. The toolbar toggles it.
  decorators: [withThemeByClassName({ themes: { dark: "dark", light: "" }, defaultTheme: "dark" })],
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    // Axe on every story; a violation fails the story, as in bun test.
    // The page-level rules are off: a story renders a component, not a page.
    a11y: {
      test: "error",
      config: {
        rules: ["region", "landmark-one-main", "page-has-heading-one"].map((id) => ({
          id,
          enabled: false,
        })),
      },
    },
    backgrounds: { disable: true },
    controls: { expanded: true, sort: "requiredFirst" },
  },
};

export default preview;
