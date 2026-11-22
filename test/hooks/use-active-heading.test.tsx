import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { useActiveHeading } from "@donaldgifford/design-system/hooks/use-active-heading";
import { act, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";

/** The observers the hook has made, so a test can report what is in view. */
let observers: FakeObserver[] = [];

class FakeObserver {
  observed: Element[] = [];
  disconnected = false;
  constructor(
    private readonly callback: IntersectionObserverCallback,
    readonly options?: IntersectionObserverInit,
  ) {
    observers.push(this);
  }
  observe(element: Element) {
    this.observed.push(element);
  }
  disconnect() {
    this.disconnected = true;
  }
  /** Reports headings entering (true) or leaving (false) the band. */
  report(changes: Record<string, boolean>) {
    const entries = Object.entries(changes).map(([id, isIntersecting]) => ({
      target: document.getElementById(id) as Element,
      isIntersecting,
    }));
    this.callback(
      entries as unknown as IntersectionObserverEntry[],
      this as unknown as IntersectionObserver,
    );
  }
}

const original = globalThis.IntersectionObserver;

beforeEach(() => {
  observers = [];
  globalThis.IntersectionObserver = FakeObserver as unknown as typeof IntersectionObserver;
});

afterEach(() => {
  globalThis.IntersectionObserver = original;
});

function Page({ ids, rootMargin }: { ids: string[]; rootMargin?: string }) {
  const active = useActiveHeading(ids, rootMargin === undefined ? {} : { rootMargin });
  return (
    <>
      <output>{active ?? "none"}</output>
      {["a", "b", "c"].map((id) => (
        <h2 key={id} id={id}>
          {id}
        </h2>
      ))}
    </>
  );
}

const latest = () => observers.at(-1) as FakeObserver;

describe("useActiveHeading", () => {
  test("observes the headings it is given that exist", () => {
    render(<Page ids={["a", "b", "missing"]} />);
    expect(observers).toHaveLength(1);
    expect(latest().observed.map((element) => element.id)).toEqual(["a", "b"]);
    expect(latest().options?.rootMargin).toBe("0px 0px -66% 0px");
    expect(screen.getByRole("status")).toHaveTextContent("none");
  });

  test("the active heading is the first in view, in the order given", () => {
    render(<Page ids={["a", "b", "c"]} />);
    act(() => latest().report({ c: true, b: true }));
    expect(screen.getByRole("status")).toHaveTextContent("b");
    act(() => latest().report({ a: true }));
    expect(screen.getByRole("status")).toHaveTextContent("a");
    act(() => latest().report({ a: false, b: false }));
    expect(screen.getByRole("status")).toHaveTextContent("c");
  });

  test("between headings it stays the last one that was in view", () => {
    render(<Page ids={["a", "b", "c"]} />);
    act(() => latest().report({ b: true }));
    act(() => latest().report({ b: false }));
    expect(screen.getByRole("status")).toHaveTextContent("b");
  });

  test("the same ids in a new array do not re-observe; new ids do", () => {
    const { rerender, unmount } = render(<Page ids={["a", "b"]} />);
    rerender(<Page ids={["a", "b"]} />);
    expect(observers).toHaveLength(1);
    rerender(<Page ids={["a", "b", "c"]} />);
    expect(observers).toHaveLength(2);
    expect(observers[0]?.disconnected).toBe(true);
    unmount();
    expect(latest().disconnected).toBe(true);
  });

  test("takes a root margin", () => {
    render(<Page ids={["a"]} rootMargin="-64px 0px -50% 0px" />);
    expect(latest().options?.rootMargin).toBe("-64px 0px -50% 0px");
  });

  test("renders on the server, and where there is no observer", () => {
    expect(renderToString(<Page ids={["a"]} />)).toContain("none");
    globalThis.IntersectionObserver = undefined as unknown as typeof IntersectionObserver;
    render(<Page ids={["a"]} />);
    expect(screen.getByRole("status")).toHaveTextContent("none");
  });
});
