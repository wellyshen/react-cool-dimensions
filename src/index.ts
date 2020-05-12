import { RefObject, useState, useRef, useEffect, useCallback } from "react";

// FIXME: use correct URL
export const observerErr =
  "💡react-cool-dimensions: the browser doesn't support Resize Observer, please use polyfill: https://github.com/wellyshen/react-cool-dimensions#TBD";

interface Event {
  currentBreakpoint?: string;
  width?: number;
  height?: number;
  entry?: ResizeObserverEntry;
  observe?: () => void;
  unobserve?: () => void;
}
interface OnResize {
  (event?: Event): void;
}
type Breakpoints = { [key: string]: number };
interface Options {
  breakpoints?: Breakpoints;
  onResize?: OnResize;
}
interface Return {
  readonly currentBreakpoint?: string;
  readonly width: number;
  readonly height: number;
  readonly entry?: ResizeObserverEntry;
  readonly observe: () => void;
  readonly unobserve: () => void;
}
interface State {
  currentBreakpoint?: string;
  width: number;
  height: number;
  entry?: ResizeObserverEntry;
}

const getCurrentBreakpoint = (bps: Breakpoints, w: number): string => {
  let curBp = "";
  let max = 0;

  Object.keys(bps).forEach((key: string) => {
    const val = bps[key];

    if (w >= val && val > max) {
      curBp = key;
      max = val;
    }
  });

  return curBp;
};

const useDimensions = (
  ref: RefObject<HTMLElement>,
  { breakpoints, onResize }: Options = {}
): Return => {
  const [state, setState] = useState<State>({ width: 0, height: 0 });
  const prevSizeRef = useRef<{ width?: number; height?: number }>({});
  const prevCurrentBreakpointRef = useRef<string>();
  const isObservingRef = useRef<boolean>(false);
  const observerRef = useRef<ResizeObserver>(null);
  const onResizeRef = useRef<OnResize>(null);

  useEffect(() => {
    onResizeRef.current = onResize;
  }, [onResize]);

  const observe = useCallback((): void => {
    if (isObservingRef.current || !observerRef.current) return;

    observerRef.current.observe(ref.current);
    isObservingRef.current = true;
  }, [ref]);

  const unobserve = useCallback((): void => {
    if (!isObservingRef.current || !observerRef.current) return;

    observerRef.current.disconnect();
    isObservingRef.current = false;
  }, []);

  useEffect(() => {
    if (!ref || !ref.current) return (): void => null;

    if (!("ResizeObserver" in window) || !("ResizeObserverEntry" in window)) {
      console.error(observerErr);
      return (): void => null;
    }

    // eslint-disable-next-line compat/compat
    observerRef.current = new ResizeObserver(([entry]) => {
      const { contentBoxSize, contentRect } = entry;
      const width = contentBoxSize
        ? contentBoxSize.inlineSize
        : contentRect.width;
      const height = contentBoxSize
        ? contentBoxSize.blockSize
        : contentRect.height;

      if (
        width === prevSizeRef.current.width &&
        height === prevSizeRef.current.height
      )
        return;

      prevSizeRef.current = { width, height };

      const e = { width, height, entry, observe, unobserve };
      let currentBreakpoint = breakpoints ? "" : undefined;

      if (onResizeRef.current) {
        if (breakpoints) {
          currentBreakpoint = getCurrentBreakpoint(breakpoints, width);

          if (currentBreakpoint !== prevCurrentBreakpointRef.current) {
            onResizeRef.current({ ...e, currentBreakpoint });
            prevCurrentBreakpointRef.current = currentBreakpoint;
          }
        } else {
          onResizeRef.current(e);
        }
      }

      setState({ currentBreakpoint, width, height, entry });
    });

    observe();

    return (): void => {
      unobserve();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, JSON.stringify(breakpoints), observe, unobserve]);

  return { ...state, observe, unobserve };
};

export default useDimensions;
