import { describe, expect, test } from "bun:test";
import { Marked } from "@donaldgifford/design-system/blocks/marked";
import { expectNoA11yViolations } from "@test/axe";
import { render } from "@testing-library/react";

/** Every element under the container, by tag. */
function tags(container: Element): string[] {
  return [...container.querySelectorAll("p *")].map((element) => element.tagName);
}

describe("Marked", () => {
  test("draws each marked run as a mark and the rest as text", async () => {
    const { container } = render(
      <main>
        <p>
          <Marked text="the <em>shell</em> in repo-guardian's <em>look</em>" />
        </p>
      </main>,
    );
    expect(container.querySelector("p")).toHaveTextContent("the shell in repo-guardian's look");
    const marks = [...container.querySelectorAll("mark")];
    expect(marks.map((mark) => mark.textContent)).toEqual(["shell", "look"]);
    expect(marks[0]).toHaveAttribute("data-slot", "marked");
    await expectNoA11yViolations(container);
  });

  const hostile = [
    '<script>alert(1)</script><em>hit</em><img src=x onerror="alert(1)">',
    '<em><a href="javascript:alert(1)">hit</a></em>',
    '<em onclick="alert(1)">hit</em>',
    "&lt;b&gt;<em>hit</em>&lt;/b&gt; <iframe src=x></iframe>",
    "<em><em><em>hit</em>",
  ];

  test.each(hostile)("renders no element but mark for %s", (text) => {
    const { container } = render(
      <p>
        <Marked text={text} />
      </p>,
    );
    expect(tags(container).filter((tag) => tag !== "MARK")).toEqual([]);
    // The markup that was not a marker is on the page as the characters it is.
    expect(container.querySelector("p")?.textContent).toBe(text.replace(/<\/?em>/g, ""));
  });

  test("puts className on the marks", () => {
    const { container } = render(
      <p>
        <Marked text="<em>hit</em>" className="font-medium" />
      </p>,
    );
    expect(container.querySelector("mark")?.className).toContain("font-medium");
  });
});
