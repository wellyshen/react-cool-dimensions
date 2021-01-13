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
  export interface Event<T extends HTMLElement = HTMLElement> {
    currentBreakpoint: string;
    width: number;
    height: number;
    entry: ResizeObserverEntry;
    observe: (element?: T) => void;
    unobserve: () => void;
  }

  export interface OnResize<T extends HTMLElement = HTMLElement> {
    (event: Event<T>): void;
  }

  interface Options<T> {
    ref?: RefObject<T>;
    useBorderBoxSize?: boolean;
    breakpoints?: { [key: string]: number };
    onResize?: OnResize<T>;
    polyfill?: any;
  }

  interface Return<T> extends Omit<Event<T>, "entry"> {
    ref: RefObject<T>;
    entry?: ResizeObserverEntry;
  }

  function useDimensions<T extends HTMLElement = HTMLElement>(
    options?: Options<T>
  ): Return<T>;

  export default useDimensions;
}
