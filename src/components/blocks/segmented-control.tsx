import { Tabs, TabsList, TabsTrigger } from "@donaldgifford/design-system/components/tabs";
import type { ReactNode } from "react";

export interface SegmentOption<V extends string> {
  value: V;
  label: ReactNode;
}

export interface SegmentedControlProps<V extends string> {
  options: readonly SegmentOption<V>[];
  value: V;
  onValueChange: (value: V) => void;
  /** The accessible name: what the control chooses. */
  label: string;
  className?: string | undefined;
}

/**
 * A choice between a few views of the same data: a range, a grouping, a
 * unit. It is the `Tabs` list with no panels, so one segment is in the
 * Tab order and the arrow keys, Home and End move the selection. It is
 * controlled; binding the value to a URL is the app's.
 */
export function SegmentedControl<V extends string>({
  options,
  value,
  onValueChange,
  label,
  className,
}: SegmentedControlProps<V>) {
  return (
    <Tabs className="contents" value={value} onValueChange={(next) => onValueChange(next as V)}>
      <TabsList data-slot="segmented-control" aria-label={label} className={className}>
        {options.map((option) => (
          <TabsTrigger key={option.value} value={option.value}>
            {option.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
