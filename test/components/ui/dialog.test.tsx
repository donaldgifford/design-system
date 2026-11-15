import { describe, expect, test } from "bun:test";
import { Button } from "@donaldgifford/design-system/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@donaldgifford/design-system/components/dialog";
import { expectNoA11yViolations } from "@test/axe";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("Dialog", () => {
  test("opens from its trigger with an accessible name and description", async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger render={<Button />}>Delete cluster</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete prod-1?</DialogTitle>
            <DialogDescription>This cannot be undone.</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>,
    );
    expect(screen.queryByRole("dialog")).toBeNull();
    await user.click(screen.getByRole("button", { name: "Delete cluster" }));
    const dialog = await screen.findByRole("dialog", { name: "Delete prod-1?" });
    expect(dialog).toHaveAccessibleDescription("This cannot be undone.");
    await expectNoA11yViolations(dialog);
    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
