import { describe, expect, test } from "bun:test";
import { csvCell, csvTable, exportFilename, tableCsv } from "@donaldgifford/design-system/lib/csv";

describe("csvCell", () => {
  test("quotes commas, quotes, and line breaks", () => {
    expect(csvCell("plain")).toBe("plain");
    expect(csvCell("a,b")).toBe('"a,b"');
    expect(csvCell('say "hi"')).toBe('"say ""hi"""');
    expect(csvCell("two\nlines")).toBe('"two\nlines"');
  });

  test("renders empties and non-strings", () => {
    expect(csvCell(undefined)).toBe("");
    expect(csvCell(null)).toBe("");
    expect(csvCell(0)).toBe("0");
    expect(csvCell(false)).toBe("false");
  });

  test("defuses a cell a spreadsheet would run as a formula", () => {
    expect(csvCell("=SUM(A1:A9)")).toBe("'=SUM(A1:A9)");
    expect(csvCell("+1")).toBe("'+1");
    expect(csvCell("-1")).toBe("'-1");
    expect(csvCell("@cmd")).toBe("'@cmd");
    expect(csvCell('=HYPERLINK("x","y")')).toBe('"\'=HYPERLINK(""x"",""y"")"');
  });
});

describe("tables", () => {
  test("tableCsv joins rows with CRLF and ends with one", () => {
    expect(tableCsv(["a", "b"], [[1, "x,y"]])).toBe('a,b\r\n1,"x,y"\r\n');
  });

  test("csvTable maps items through the columns", () => {
    const columns = { head: ["Name", "Nodes"], row: (c: { n: string; k: number }) => [c.n, c.k] };
    expect(csvTable(columns, [{ n: "hub", k: 3 }])).toBe("Name,Nodes\r\nhub,3\r\n");
  });
});

describe("exportFilename", () => {
  const day = new Date("2026-03-14T12:00:00Z");

  test("names the page, the set filters, and the day", () => {
    expect(exportFilename("findings", { status: "failing", org: "", rule: undefined }, day)).toBe(
      "findings-status-failing-2026-03-14.csv",
    );
    expect(exportFilename("findings", {}, day)).toBe("findings-2026-03-14.csv");
  });

  test("reduces every part to a safe name", () => {
    expect(exportFilename("My Page", { repo: "../../etc/passwd" }, day)).toBe(
      "my_page-repo-.._.._etc_passwd-2026-03-14.csv",
    );
  });
});
