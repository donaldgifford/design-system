import { Badge } from "@donaldgifford/design-system/components/badge";
import { cn } from "@donaldgifford/design-system/lib/utils";
import type { TablerIcon } from "@tabler/icons-react";
import type { ReactNode } from "react";

export interface TimelineTag {
  label: string;
  variant?: "default" | "secondary" | "outline" | "destructive" | "success" | "warning" | "info";
}

export interface TimelineItem {
  id: string;
  /** Who acted; initials become the avatar unless `icon` is set. */
  actor: string;
  /** "requested", "approved", "rotated": the verb between actor and object. */
  verb: string;
  object?: ReactNode;
  /** A line under the headline. */
  detail?: ReactNode;
  when: string;
  tags?: readonly TimelineTag[];
  icon?: TablerIcon;
  /** Tints the avatar: a decision, a failure, a system actor. */
  tone?: "neutral" | "success" | "destructive" | "info";
}

export interface ChangelogItem {
  id: string;
  date: string;
  title: string;
  detail?: ReactNode;
  tags?: readonly TimelineTag[];
}

const toneClass: Record<NonNullable<TimelineItem["tone"]>, string> = {
  neutral: "bg-muted text-foreground",
  success: "bg-success/15 text-success",
  destructive: "bg-destructive/15 text-destructive",
  info: "bg-info/15 text-info",
};

function initials(actor: string): string {
  return actor
    .split(/[\s@._-]+/)
    .filter((part) => part !== "")
    .slice(0, 2)
    .map((part) => part[0] ?? "")
    .join("")
    .toUpperCase();
}

function Tags({ tags }: { tags?: readonly TimelineTag[] }) {
  if (!tags || tags.length === 0) {
    return null;
  }
  return (
    <>
      {tags.map((tag) => (
        <Badge key={tag.label} variant={tag.variant ?? "secondary"}>
          {tag.label}
        </Badge>
      ))}
    </>
  );
}

interface TimelineProps {
  items: readonly TimelineItem[];
  className?: string;
}

/** An activity feed: who did what, when, with the evidence as tags. */
export function Timeline({ items, className }: TimelineProps) {
  return (
    <ol data-slot="timeline" className={cn("flex flex-col", className)}>
      {items.map((item, index) => {
        const Icon = item.icon;
        return (
          <li key={item.id} className="relative flex gap-3 pb-4 last:pb-0">
            {index < items.length - 1 ? (
              <span
                aria-hidden="true"
                className="absolute top-8 bottom-0 left-[15px] w-px bg-border"
              />
            ) : null}
            <span
              aria-hidden="true"
              className={cn(
                "relative z-10 inline-flex size-8 shrink-0 items-center justify-center rounded-pill font-semibold text-label",
                toneClass[item.tone ?? "neutral"],
              )}
            >
              {Icon ? <Icon className="size-4" /> : initials(item.actor)}
            </span>
            <div className="min-w-0 flex-1 pt-1.5">
              <div className="text-sm">
                <b className="font-semibold">{item.actor}</b>{" "}
                <span className="text-muted-foreground">{item.verb}</span>
                {item.object ? <> {item.object}</> : null}
              </div>
              {item.detail ? (
                <div className="mt-0.5 text-muted-foreground text-xs">{item.detail}</div>
              ) : null}
              <div className="mt-2 flex flex-wrap items-center gap-1.5 text-muted-foreground text-xs">
                <span>{item.when}</span>
                <Tags tags={item.tags} />
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

interface ChangelogProps {
  items: readonly ChangelogItem[];
  className?: string;
}

/** A dated list with markers on a rail: releases, product updates. */
export function Changelog({ items, className }: ChangelogProps) {
  return (
    <ol data-slot="changelog" className={cn("flex flex-col", className)}>
      {items.map((item, index) => (
        <li key={item.id} className="relative flex gap-3.5 pb-4 last:pb-0">
          {index < items.length - 1 ? (
            <span
              aria-hidden="true"
              className="absolute top-5 bottom-0 left-[calc(4.5rem+7px)] w-px bg-border"
            />
          ) : null}
          <span className="w-18 shrink-0 pt-1 text-right text-muted-foreground text-xs">
            {item.date}
          </span>
          <span
            aria-hidden="true"
            className={cn(
              "relative z-10 mt-1.5 size-3.5 shrink-0 rounded-pill border-[1.5px] border-muted-foreground/60 bg-card",
              index === 0 && "border-2 border-foreground",
            )}
          />
          <div className="min-w-0 flex-1 pt-0.5">
            <div className="font-semibold text-sm">{item.title}</div>
            {item.detail ? (
              <div className="mt-0.5 text-muted-foreground text-xs">{item.detail}</div>
            ) : null}
            {item.tags && item.tags.length > 0 ? (
              <div className="mt-2 flex flex-wrap gap-1.5">
                <Tags tags={item.tags} />
              </div>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
