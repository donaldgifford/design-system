/** What a search result needs from `ListRow` and `Time`. */
import { describe, expect, mock, test } from "bun:test";
import { List, ListRow } from "@donaldgifford/design-system/blocks/list-row";
import { Time, TimeZoneProvider } from "@donaldgifford/design-system/blocks/time";
import { expectNoA11yViolations } from "@test/axe";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("ListRow as a search result", () => {
  test("shows an eyebrow over the title and a detail under it", async () => {
    const { container } = render(
      <main>
        <List>
          <ListRow
            eyebrow="docz · design"
            title="DESIGN-0026 · The shell in repo-guardian's look"
            detail="The site's chrome takes the package's tokens, light and dark."
          />
        </List>
      </main>,
    );
    const row = container.querySelector("[data-slot=list-row]") as HTMLElement;
    const [eyebrow, title, detail] = [...(row.querySelector(".min-w-0")?.children ?? [])];
    expect(eyebrow).toHaveAttribute("data-slot", "list-row-eyebrow");
    expect(eyebrow).toHaveTextContent("docz · design");
    expect(title).toHaveTextContent("DESIGN-0026");
    expect(detail).toHaveAttribute("data-slot", "list-row-detail");
    expect(detail?.className).toContain("line-clamp-2");
    // A tall row aligns its leading and trailing parts with the title.
    expect(row.className).toContain("items-start");
    await expectNoA11yViolations(container);
  });

  test("with render the title is the app's link, stretched over the row", async () => {
    const { container } = render(
      <main>
        <ListRow
          title="DESIGN-0026"
          render={<a href="/docz/design/DESIGN-0026" data-app-link="" />}
          trailing={<button type="button">Copy link</button>}
        />
      </main>,
    );
    const link = screen.getByRole("link", { name: "DESIGN-0026" });
    expect(link).toHaveAttribute("href", "/docz/design/DESIGN-0026");
    expect(link).toHaveAttribute("data-app-link");
    expect(link).toHaveAttribute("data-slot", "list-row-control");
    expect(link.className).toContain("after:absolute");
    expect(screen.queryByRole("button", { name: "DESIGN-0026" })).toBeNull();
    expect(screen.getByRole("button", { name: "Copy link" })).toBeInTheDocument();
    await expectNoA11yViolations(container);
  });

  test("with render, onClick is not used", async () => {
    const user = userEvent.setup();
    const onClick = mock(() => {});
    render(<ListRow title="DESIGN-0026" onClick={onClick} render={<a href="#design-0026" />} />);
    await user.click(screen.getByRole("link", { name: "DESIGN-0026" }));
    expect(onClick).not.toHaveBeenCalled();
  });

  test("a row with none of the new props renders as it did", () => {
    const { container } = render(<ListRow title="plain" subtitle="no action" />);
    const row = container.querySelector("[data-slot=list-row]") as HTMLElement;
    expect(row.querySelector("[data-slot=list-row-eyebrow]")).toBeNull();
    expect(row.querySelector("[data-slot=list-row-detail]")).toBeNull();
    expect(row.querySelector("[data-slot=list-row-control]")).toBeNull();
    expect(row.className).not.toContain("items-start");
    expect(row.querySelector(".min-w-0")?.children).toHaveLength(2);
  });
});

describe("Time, stacked", () => {
  test("is one time element with the date over the time", async () => {
    const { container } = render(
      <main>
        <TimeZoneProvider initial="utc">
          <Time iso="2026-03-04T09:05:59Z" style="stacked" />
        </TimeZoneProvider>
      </main>,
    );
    const times = container.querySelectorAll("time");
    expect(times).toHaveLength(1);
    const time = times[0] as HTMLElement;
    expect(time).toHaveAttribute("datetime", "2026-03-04T09:05:59Z");
    expect(time).toHaveAttribute("data-style", "stacked");
    expect([...time.children].map((line) => line.textContent)).toEqual(["2026-03-04", "09:05"]);
    expect(time.title).toMatch(/ local$/);
    await expectNoA11yViolations(container);
  });

  test("a missing time is still a dash", () => {
    render(<Time iso={undefined} style="stacked" />);
    expect(screen.getByText("—")).toBeInTheDocument();
  });
});
