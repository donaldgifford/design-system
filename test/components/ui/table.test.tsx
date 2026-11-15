import { describe, expect, test } from "bun:test";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@donaldgifford/design-system/components/table";
import { expectNoA11yViolations } from "@test/axe";
import { render, screen } from "@testing-library/react";

describe("Table", () => {
  test("renders a real table inside a scroll container", async () => {
    const { container } = render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>State</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>prod-1</TableCell>
            <TableCell>READY</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    const table = screen.getByRole("table");
    expect(table.parentElement).toHaveAttribute("data-slot", "table-container");
    expect(screen.getAllByRole("columnheader")).toHaveLength(2);
    expect(screen.getByRole("cell", { name: "prod-1" })).toBeInTheDocument();
    await expectNoA11yViolations(container);
  });
});
