import { describe, expect, test } from "bun:test";
import {
  floorPercent,
  formatPercent,
  heatOpacity,
  shareText,
} from "@donaldgifford/design-system/lib/percent";

describe("percent", () => {
  test("floorPercent floors to one decimal and is null on an empty denominator", () => {
    expect(floorPercent(2999, 3000)).toBe(99.9);
    expect(floorPercent(1, 3)).toBe(33.3);
    expect(floorPercent(5, 5)).toBe(100);
    expect(floorPercent(1, 0)).toBeNull();
  });

  test("formatPercent prints one decimal, and no data for a null", () => {
    expect(formatPercent(87)).toBe("87.0%");
    expect(formatPercent(null)).toBe("no data");
    expect(formatPercent(undefined)).toBe("no data");
  });

  test("shareText prints a whole share bare", () => {
    expect(shareText(1, 4)).toBe("25%");
    expect(shareText(11, 40)).toBe("27.5%");
    expect(shareText(0, 0)).toBe("0%");
  });

  test("heatOpacity is nothing for zero, then 8% to 50%", () => {
    expect(heatOpacity(0, 10)).toBe(0);
    expect(heatOpacity(3, 0)).toBe(0);
    expect(heatOpacity(1, 1000)).toBe(0.08);
    expect(heatOpacity(5, 10)).toBe(0.29);
    expect(heatOpacity(10, 10)).toBe(0.5);
    expect(heatOpacity(20, 10)).toBe(0.5);
  });
});
