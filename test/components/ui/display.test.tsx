import { describe, expect, test } from "bun:test";
import { Alert, AlertDescription, AlertTitle } from "@donaldgifford/design-system/components/alert";
import { Avatar, AvatarFallback } from "@donaldgifford/design-system/components/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@donaldgifford/design-system/components/popover";
import { Toggle } from "@donaldgifford/design-system/components/toggle";
import { ToggleGroup, ToggleGroupItem } from "@donaldgifford/design-system/components/toggle-group";
import { expectNoA11yViolations } from "@test/axe";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("Alert", () => {
  test.each(["default", "destructive", "success", "warning", "info"] as const)(
    "the %s alert is an alert with a title and description",
    async (variant) => {
      const { container } = render(
        <main>
          <Alert variant={variant}>
            <AlertTitle>Quota near</AlertTitle>
            <AlertDescription>30 of 32 vCPU in use.</AlertDescription>
          </Alert>
        </main>,
      );
      const alert = screen.getByRole("alert");
      expect(alert).toHaveTextContent("Quota near");
      expect(alert).toHaveTextContent("30 of 32 vCPU in use.");
      await expectNoA11yViolations(container);
    },
  );
});

describe("Avatar", () => {
  test("shows the fallback initials without an image", async () => {
    const { container } = render(
      <main>
        <Avatar size="sm">
          <AvatarFallback>DG</AvatarFallback>
        </Avatar>
      </main>,
    );
    expect(await screen.findByText("DG")).toBeInTheDocument();
    expect(container.querySelector('[data-slot="avatar"]')).toHaveAttribute("data-size", "sm");
    await expectNoA11yViolations(container);
  });
});

describe("Popover", () => {
  test("opens from its trigger, closes on Escape, and returns focus", async () => {
    const user = userEvent.setup();
    render(
      <Popover>
        <PopoverTrigger>Filters</PopoverTrigger>
        <PopoverContent aria-label="Filters">Only failed</PopoverContent>
      </Popover>,
    );
    const trigger = screen.getByRole("button", { name: "Filters" });
    await user.click(trigger);
    const popup = await screen.findByRole("dialog", { name: "Filters" });
    expect(popup).toHaveTextContent("Only failed");
    await expectNoA11yViolations(popup);
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(trigger).toHaveFocus();
  });
});

describe("Toggle and ToggleGroup", () => {
  test("a toggle is a pressed button", async () => {
    const user = userEvent.setup();
    render(<Toggle aria-label="Bold">B</Toggle>);
    const toggle = screen.getByRole("button", { name: "Bold" });
    expect(toggle).toHaveAttribute("aria-pressed", "false");
    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-pressed", "true");
  });

  test("a group presses one item at a time", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <main>
        <ToggleGroup defaultValue={["day"]} aria-label="Range">
          <ToggleGroupItem value="day">Day</ToggleGroupItem>
          <ToggleGroupItem value="week">Week</ToggleGroupItem>
        </ToggleGroup>
      </main>,
    );
    const day = screen.getByRole("button", { name: "Day" });
    const week = screen.getByRole("button", { name: "Week" });
    expect(day).toHaveAttribute("aria-pressed", "true");
    await user.click(week);
    expect(week).toHaveAttribute("aria-pressed", "true");
    expect(day).toHaveAttribute("aria-pressed", "false");
    await expectNoA11yViolations(container);
  });

  test("a vertical group stacks and moves focus with the down arrow", async () => {
    const user = userEvent.setup();
    render(
      <ToggleGroup orientation="vertical" aria-label="Range">
        <ToggleGroupItem value="day">Day</ToggleGroupItem>
        <ToggleGroupItem value="week">Week</ToggleGroupItem>
      </ToggleGroup>,
    );
    const group = screen.getByRole("group", { name: "Range" });
    expect(group).toHaveAttribute("data-orientation", "vertical");
    expect(group.className).toContain("data-[orientation=vertical]:flex-col");
    await user.click(screen.getByRole("button", { name: "Day" }));
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("button", { name: "Week" })).toHaveFocus();
  });
});
