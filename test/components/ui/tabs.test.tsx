import { describe, expect, test } from "bun:test";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@donaldgifford/design-system/components/tabs";
import { expectNoA11yViolations } from "@test/axe";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("Tabs", () => {
  test("shows the default tab and switches on click", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">Overview body</TabsContent>
        <TabsContent value="events">Events body</TabsContent>
      </Tabs>,
    );
    expect(screen.getByRole("tab", { name: "Overview" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("Overview body")).toBeVisible();
    expect(screen.queryByText("Events body")).toBeNull();
    await user.click(screen.getByRole("tab", { name: "Events" }));
    expect(screen.getByRole("tab", { name: "Events" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("Events body")).toBeVisible();
    await expectNoA11yViolations(container);
  });
});
