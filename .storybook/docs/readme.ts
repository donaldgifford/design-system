import readme from "../../README.md?raw";

/** The README's text up to the first `## ` heading: what the package is. */
export function readmeIntro(): string {
  return readme.slice(0, readme.indexOf("\n## ")).trim();
}

/**
 * One `## ` section of the package README, heading included. The docs
 * pages render the README rather than copy it, so they can't drift.
 */
export function readmeSection(heading: string): string {
  const start = readme.indexOf(`\n## ${heading}\n`);
  if (start < 0) throw new Error(`the README has no "## ${heading}" section`);
  const next = readme.indexOf("\n## ", start + 1);
  return readme.slice(start + 1, next < 0 ? undefined : next).trim();
}
