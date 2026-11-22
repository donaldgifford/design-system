import { useCallback, useMemo, useState } from "react";

interface TreeOpen {
  /** Whether the branch with this key is open. */
  isOpen: (key: string) => boolean;
  /** Open or close a branch by hand. It holds until the active key changes. */
  setOpen: (key: string, open: boolean) => void;
  /** `open` and `onOpenChange` for the row with this key, to spread on it. */
  item: (key: string) => { open: boolean; onOpenChange: (open: boolean) => void };
}

interface Overrides {
  /** The active keys these overrides were made under. */
  under: string;
  byKey: ReadonlyMap<string, boolean>;
}

const none: ReadonlyMap<string, boolean> = new Map();

/**
 * Which branches of a tree are open, by the usual rule: the branch that
 * holds the current page is open, a toggle by hand overrides that, and
 * the overrides are dropped when the current page moves to another
 * branch.
 *
 * `activeKey` is the key of the branch that holds the current page, or
 * every such key when branches nest (the branch, its parent, and so on).
 * Keys are the app's own: a document type, a folder's path.
 *
 * ```tsx
 * const tree = useTreeOpen(currentType);
 * <ShellSidebarTreeItem label="design" {...tree.item("design")}>…</ShellSidebarTreeItem>
 * ```
 */
export function useTreeOpen(activeKey: string | readonly string[] | undefined): TreeOpen {
  const active = useMemo(
    () => (activeKey === undefined ? [] : typeof activeKey === "string" ? [activeKey] : activeKey),
    [activeKey],
  );
  // A string that changes when the set of active keys does, whatever array holds them.
  const under = JSON.stringify(active);
  const [overrides, setOverrides] = useState<Overrides>({ under, byKey: none });
  // Reset during render, not in an effect, so the first frame after a move
  // is already right and a later return to this branch starts clean.
  if (overrides.under !== under) setOverrides({ under, byKey: none });
  const byKey = overrides.under === under ? overrides.byKey : none;

  const isOpen = useCallback(
    (key: string) => byKey.get(key) ?? active.includes(key),
    [byKey, active],
  );
  const setOpen = useCallback(
    (key: string, open: boolean) => {
      setOverrides((prev) => {
        const next = new Map(prev.under === under ? prev.byKey : none);
        next.set(key, open);
        return { under, byKey: next };
      });
    },
    [under],
  );
  const item = useCallback(
    (key: string) => ({
      open: isOpen(key),
      onOpenChange: (open: boolean) => setOpen(key, open),
    }),
    [isOpen, setOpen],
  );

  return { isOpen, setOpen, item };
}
