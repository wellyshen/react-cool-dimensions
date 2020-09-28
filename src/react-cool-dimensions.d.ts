declare module "react-cool-dimensions" {
  import { RefObject } from "react";

  // Types from @types/resize-observer-browser
  interface ResizeObserverSize {
    inlineSize: number;
    blockSize: number;
  }

  interface ResizeObserverEntry {
    readonly target: Element;
    readonly contentRect: DOMRectReadOnly;
    readonly borderBoxSize: ResizeObserverSize;
    readonly contentBoxSize: ResizeObserverSize;
  }

  // Hook types
  export interface Event {
    currentBreakpoint: string;
    width: number;
    height: number;
    entry: ResizeObserverEntry;
    observe: () => void;
    unobserve: () => void;
  }

  export interface OnResize {
    (event: Event): void;
  }

  interface Options<T> {
    ref?: RefObject<T>;
    useBorderBoxSize?: boolean;
    breakpoints?: { [key: string]: number };
    onResize?: OnResize;
    polyfill?: any;
  }

  interface Return<T> extends Omit<Event, "entry"> {
    ref: RefObject<T>;
    entry?: ResizeObserverEntry;
  }

  const useDimensions: <T extends HTMLElement>(
    options?: Options<T>
  ) => Return<T>;

  export default useDimensions;
}
