import { describe, expect, mock, test } from "bun:test";
import { Checkbox } from "@donaldgifford/design-system/components/checkbox";
import { Label } from "@donaldgifford/design-system/components/label";
import { RadioGroup, RadioGroupItem } from "@donaldgifford/design-system/components/radio-group";
import { Switch } from "@donaldgifford/design-system/components/switch";
import { Textarea } from "@donaldgifford/design-system/components/textarea";
import { expectNoA11yViolations } from "@test/axe";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("Label and Textarea", () => {
  test("a label names its textarea, which takes typing", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <main>
        <Label htmlFor="reason">Reason</Label>
        <Textarea id="reason" />
      </main>,
    );
    const textarea = screen.getByRole("textbox", { name: "Reason" });
    expect(textarea).toHaveAttribute("data-slot", "textarea");
    await user.type(textarea, "rotate keys");
    expect(textarea).toHaveValue("rotate keys");
    expect(screen.getByText("Reason")).toHaveAttribute("data-slot", "label");
    await expectNoA11yViolations(container);
  });
});

describe("Checkbox", () => {
  test("toggles from a click and the space bar, and reports the change", async () => {
    const user = userEvent.setup();
    const onCheckedChange = mock((_checked: boolean) => {});
    const { container } = render(
      <main>
        <Checkbox aria-label="Notify me" onCheckedChange={onCheckedChange} />
      </main>,
    );
    const checkbox = screen.getByRole("checkbox", { name: "Notify me" });
    expect(checkbox).toHaveAttribute("aria-checked", "false");
    await user.click(checkbox);
    expect(checkbox).toHaveAttribute("aria-checked", "true");
    await user.keyboard(" ");
    expect(checkbox).toHaveAttribute("aria-checked", "false");
    expect(onCheckedChange.mock.calls.map((call) => call[0])).toEqual([true, false]);
    await expectNoA11yViolations(container);
  });
});

describe("RadioGroup", () => {
  test("arrow keys move the choice", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <main>
        <RadioGroup defaultValue="small" aria-label="Profile">
          <RadioGroupItem value="small" aria-label="small" />
          <RadioGroupItem value="large" aria-label="large" />
        </RadioGroup>
      </main>,
    );
    expect(screen.getByRole("radiogroup", { name: "Profile" })).toBeInTheDocument();
    const small = screen.getByRole("radio", { name: "small" });
    expect(small).toHaveAttribute("aria-checked", "true");
    await user.tab();
    expect(small).toHaveFocus();
    await user.keyboard("{ArrowDown}");
    const large = screen.getByRole("radio", { name: "large" });
    expect(large).toHaveFocus();
    expect(large).toHaveAttribute("aria-checked", "true");
    await expectNoA11yViolations(container);
  });
});

describe("Switch", () => {
  test("is a switch that flips on click", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <main>
        <Switch aria-label="Auto-stop" size="sm" />
      </main>,
    );
    const toggle = screen.getByRole("switch", { name: "Auto-stop" });
    expect(toggle).toHaveAttribute("data-size", "sm");
    expect(toggle).toHaveAttribute("aria-checked", "false");
    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-checked", "true");
    await expectNoA11yViolations(container);
  });
});
