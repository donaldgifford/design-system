import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@donaldgifford/design-system/components/sheet";
import type { ReactNode } from "react";

interface DetailSheetLayoutProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string | undefined;
  children: ReactNode;
}

/**
 * The side sheet a detail view renders in: a title, a description line,
 * and a scrolling body. What opens it (a URL parameter, say) is the
 * caller's.
 */
export function DetailSheetLayout({
  open,
  onOpenChange,
  title,
  description,
  children,
}: DetailSheetLayoutProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent data-slot="detail-sheet" className="w-full sm:max-w-(--sheet-width-wide)">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description ?? ""}</SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-(--sheet-padding) pb-(--sheet-padding)">
          {children}
        </div>
      </SheetContent>
    </Sheet>
  );
}
