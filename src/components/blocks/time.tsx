import { ToggleGroup, ToggleGroupItem } from "@donaldgifford/design-system/components/toggle-group";
import {
  formatTime,
  isZone,
  otherZone,
  readZone,
  type TimeStyle,
  writeZone,
  ZONE_STORAGE_KEY,
  type Zone,
} from "@donaldgifford/design-system/lib/time";
import { cn } from "@donaldgifford/design-system/lib/utils";
import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from "react";

interface TimeZoneContextValue {
  zone: Zone;
  setZone: (zone: Zone) => void;
}

const TimeZoneContext = createContext<TimeZoneContextValue>({ zone: "local", setZone: () => {} });

interface TimeZoneProviderProps {
  children: ReactNode;
  /** The zone to start in; omitted, the stored choice, else local. */
  initial?: Zone | undefined;
  /** The localStorage key the choice is kept under. */
  storageKey?: string | undefined;
}

/**
 * Holds the local / UTC choice for everything under it and keeps it in
 * localStorage. Without a provider every Time renders local.
 */
export function TimeZoneProvider({
  children,
  initial,
  storageKey = ZONE_STORAGE_KEY,
}: TimeZoneProviderProps) {
  const [zone, setZoneState] = useState<Zone>(() => initial ?? readZone(storageKey));
  const setZone = useCallback(
    (next: Zone) => {
      setZoneState(next);
      writeZone(next, storageKey);
    },
    [storageKey],
  );
  const value = useMemo(() => ({ zone, setZone }), [zone, setZone]);
  return <TimeZoneContext.Provider value={value}>{children}</TimeZoneContext.Provider>;
}

/** The zone in force and its setter. */
export function useTimeZone(): TimeZoneContextValue {
  return useContext(TimeZoneContext);
}

interface TimeProps {
  /** An RFC 3339 time; one with no zone designator is read as UTC. */
  iso: string | undefined;
  style?: TimeStyle | undefined;
  className?: string | undefined;
}

/**
 * A timestamp in the chosen zone, with the other zone in its title, so
 * hovering answers "and in UTC?" without the toggle. A relative time's
 * title is the absolute one.
 */
export function Time({ iso, style = "datetime", className }: TimeProps) {
  const { zone } = useTimeZone();
  if (!iso) {
    return (
      <span data-slot="time" className={cn("text-muted-foreground", className)}>
        —
      </span>
    );
  }
  const other = otherZone(zone);
  const title =
    style === "relative"
      ? formatTime(iso, { zone })
      : `${formatTime(iso, { zone: other })} ${other === "utc" ? "UTC" : "local"}`;
  return (
    <time
      data-slot="time"
      dateTime={iso}
      title={title}
      className={cn("font-mono tabular-nums", className)}
    >
      {formatTime(iso, { zone, style })}
    </time>
  );
}

/** The local / UTC switch, usually in the top bar. */
export function TimeZoneToggle({ className }: { className?: string }) {
  const { zone, setZone } = useTimeZone();
  return (
    <ToggleGroup
      data-slot="time-zone-toggle"
      aria-label="Time zone"
      variant="outline"
      size="sm"
      spacing={0}
      value={[zone]}
      onValueChange={(next) => {
        // Pressing the pressed zone would clear the group; one zone is always in force.
        const picked = next[0];
        if (isZone(picked)) setZone(picked);
      }}
      className={className}
    >
      <ToggleGroupItem value="local">Local</ToggleGroupItem>
      <ToggleGroupItem value="utc">UTC</ToggleGroupItem>
    </ToggleGroup>
  );
}
