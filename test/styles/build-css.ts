import tailwindcss from "@tailwindcss/vite";
import { build } from "vite";

export interface BuiltCss {
  /** The compiled stylesheet. */
  css: string;
  /** Every other file the build emitted: the font files a stylesheet pulls in. */
  assets: string[];
}

/**
 * Compiles a stylesheet the way an app's Vite build does: Tailwind's
 * plugin over one CSS entry. `root` is the app's root, which is where
 * Tailwind looks for class names when the stylesheet names no `@source`.
 */
export async function buildCss(entry: string, root: string): Promise<BuiltCss> {
  const result = await build({
    root,
    configFile: false,
    logLevel: "silent",
    plugins: [tailwindcss()],
    build: { write: false, minify: false, rollupOptions: { input: entry } },
  });
  const outputs = (Array.isArray(result) ? result : [result]).flatMap((r) =>
    "output" in r ? r.output : [],
  );
  const css = outputs
    .filter((file) => file.type === "asset" && file.fileName.endsWith(".css"))
    .map((file) => (file.type === "asset" ? String(file.source) : ""))
    .join("\n");
  const assets = outputs
    .filter((file) => !file.fileName.endsWith(".css") && !file.fileName.endsWith(".js"))
    .map((file) => file.fileName);
  return { css, assets };
}
