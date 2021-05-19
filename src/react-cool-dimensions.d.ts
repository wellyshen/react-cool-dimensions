declare module "react-cool-dimensions" {
  // Types from @types/resize-observer-browser
  interface ResizeObserverSize {
    readonly inlineSize: number;
    readonly blockSize: number;
  }

  interface ResizeObserverEntry {
    readonly target: Element;
    readonly contentRect: DOMRectReadOnly;
    readonly borderBoxSize: ResizeObserverSize;
    readonly contentBoxSize: ResizeObserverSize;
  }

  // Hook types
  export interface Event<T extends HTMLElement | null = HTMLElement> {
    readonly currentBreakpoint: string;
    readonly width: number;
    readonly height: number;
    readonly entry: ResizeObserverEntry;
    observe: (element?: T | null) => void;
    unobserve: () => void;
  }

  export interface State {
    readonly currentBreakpoint: string;
    readonly width: number;
    readonly height: number;
    readonly entry?: ResizeObserverEntry;
  }

  export interface ShouldUpdate {
    (state: State): boolean;
  }

  export interface OnResize<T extends HTMLElement | null = HTMLElement> {
    (event: Event<T>): void;
  }

  export interface Options<T extends HTMLElement | null = HTMLElement> {
    useBorderBoxSize?: boolean;
    breakpoints?: Record<string, number>;
    updateOnBreakpointChange?: boolean;
    shouldUpdate?: ShouldUpdate;
    onResize?: OnResize<T>;
    polyfill?: any;
  }

  export interface Return<T extends HTMLElement | null>
    extends Omit<Event<T>, "entry"> {
    entry?: ResizeObserverEntry;
  }

  function useDimensions<T extends HTMLElement | null = HTMLElement>(
    options?: Options<T>
  ): Return<T>;

  export default useDimensions;
}
