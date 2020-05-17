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
    currentBreakpoint?: string;
    width?: number;
    height?: number;
    entry?: ResizeObserverEntry;
    observe?: () => void;
    unobserve?: () => void;
  }

  export interface OnResize {
    (event?: Event): void;
  }

  interface Options {
    breakpoints?: { [key: string]: number };
    onResize?: OnResize;
    polyfill?: any;
  }

  interface Return {
    readonly currentBreakpoint: string;
    readonly width: number;
    readonly height: number;
    readonly entry?: ResizeObserverEntry;
    readonly observe: () => void;
    readonly unobserve: () => void;
  }

  const useDimensions: (
    ref: RefObject<HTMLElement>,
    options?: Options
  ) => Return;

  export default useDimensions;
}
