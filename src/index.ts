import { RefObject, useState, useRef, useEffect, useCallback } from "react";

export const observerErr =
  "💡 react-cool-dimensions: the browser doesn't support Resize Observer, please use polyfill: https://github.com/wellyshen/react-cool-dimensions#resizeobserver-polyfill";
export const borderBoxWarn =
  "💡 react-cool-dimensions: the browser doesn't support border-box size, fallback to content-box size. Please see: https://github.com/wellyshen/react-cool-dimensions#border-box-size-measurement";

interface State {
  currentBreakpoint: string;
  width: number;
  height: number;
  entry?: ResizeObserverEntry;
}
interface Event<T> extends State {
  entry: ResizeObserverEntry;
  observe: (element?: T) => void;
  unobserve: () => void;
}
interface OnResize<T> {
  (event: Event<T>): void;
}
interface ShouldUpdate {
  (state: State): boolean;
}
type Breakpoints = Record<string, number>;
export interface Options<T> {
  ref?: RefObject<T>;
  useBorderBoxSize?: boolean;
  breakpoints?: Breakpoints;
  updateOnBreakpointChange?: boolean;
  shouldUpdate?: ShouldUpdate;
  onResize?: OnResize<T>;
  polyfill?: any;
}
interface Return<T> extends Omit<Event<T>, "entry"> {
  ref: RefObject<T>;
  entry?: ResizeObserverEntry;
}

const getCurrentBreakpoint = (bps: Breakpoints, w: number): string => {
  let curBp = "";
  let max = -1;

  Object.keys(bps).forEach((key: string) => {
    const val = bps[key];

    if (w >= val && val > max) {
      curBp = key;
      max = val;
    }
  });

  return curBp;
};

const useDimensions = <T extends HTMLElement>({
  ref: refOpt,
  useBorderBoxSize = false,
  breakpoints,
  updateOnBreakpointChange = false,
  shouldUpdate,
  onResize,
  polyfill,
}: Options<T> = {}): Return<T> => {
  const [state, setState] = useState<State>({
    currentBreakpoint: "",
    width: 0,
    height: 0,
  });
  const prevSizeRef = useRef<{ width?: number; height?: number }>({});
  const prevBreakpointRef = useRef<string>();
  const observerRef = useRef<ResizeObserver | null>(null);
  const onResizeRef = useRef<OnResize<T> | null>(null);
  const shouldUpdateRef = useRef<ShouldUpdate | null>(null);
  const warnedRef = useRef<boolean>(false);
  const refVar = useRef<T>(null);
  let ref = useRef<T | null>(refVar?.current);
  ref = refOpt || ref;

  useEffect(() => {
    if (onResize) onResizeRef.current = onResize;
  }, [onResize]);

  useEffect(() => {
    if (shouldUpdate) shouldUpdateRef.current = shouldUpdate;
  }, [shouldUpdate]);

  const observe = useCallback(
    (element?: T) => {
      if (element) ref.current = element;
      if (observerRef.current && ref.current)
        observerRef.current.observe(ref.current as HTMLElement);
    },
    [ref]
  );

  const unobserve = useCallback(() => {
    if (observerRef.current) observerRef.current.disconnect();
  }, []);

  useEffect(() => {
    if (!ref.current) return () => null;
    if (
      (!("ResizeObserver" in window) || !("ResizeObserverEntry" in window)) &&
      !polyfill
    ) {
      console.error(observerErr);
      return () => null;
    }

    // eslint-disable-next-line compat/compat
    observerRef.current = new (window.ResizeObserver || polyfill)(([entry]) => {
      const { contentBoxSize, borderBoxSize, contentRect } = entry;

      let boxSize = contentBoxSize;
      if (useBorderBoxSize) {
        if (borderBoxSize) {
          boxSize = borderBoxSize;
        } else if (!warnedRef.current) {
          console.warn(borderBoxWarn);
          warnedRef.current = true;
        }
      }
      // @juggle/resize-observer polyfill has different data structure
      boxSize = Array.isArray(boxSize) ? boxSize[0] : boxSize;

      // @ts-expect-error
      const width = boxSize ? boxSize.inlineSize : contentRect.width;
      // @ts-expect-error
      const height = boxSize ? boxSize.blockSize : contentRect.height;

      if (
        width === prevSizeRef.current.width &&
        height === prevSizeRef.current.height
      )
        return;

      prevSizeRef.current = { width, height };

      const e = {
        currentBreakpoint: "",
        width,
        height,
        entry,
        observe,
        unobserve,
      };

      if (breakpoints) {
        e.currentBreakpoint = getCurrentBreakpoint(breakpoints, width);

        if (e.currentBreakpoint !== prevBreakpointRef.current) {
          if (onResizeRef.current) onResizeRef.current(e);
          prevBreakpointRef.current = e.currentBreakpoint;
        }
      } else if (onResizeRef.current) {
        onResizeRef.current(e);
      }

      const next = {
        currentBreakpoint: e.currentBreakpoint,
        width,
        height,
        entry,
      };

      if (shouldUpdateRef.current && !shouldUpdateRef.current(next)) return;

      if (!shouldUpdateRef.current && breakpoints && updateOnBreakpointChange) {
        setState((prev) =>
          prev.currentBreakpoint !== next.currentBreakpoint ? next : prev
        );
        return;
      }

      setState(next);
    });

    observe();

    return () => unobserve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(breakpoints),
    useBorderBoxSize,
    observe,
    unobserve,
    updateOnBreakpointChange,
  ]);

  return { ref, ...state, observe, unobserve };
};

export default useDimensions;
