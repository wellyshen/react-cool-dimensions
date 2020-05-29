import { RefObject } from "react";
import { renderHook, act } from "@testing-library/react-hooks";

import useDimensions, {
  Options,
  Return as Current,
  observerErr,
  borderBoxWarn,
} from "..";

describe("useDimensions", () => {
  interface Args extends Options {
    target?: RefObject<HTMLDivElement>;
  }

  const renderHelper = ({
    target = { current: document.createElement("div") },
    ...rest
  }: Args = {}): { current: Current } => {
    return renderHook(() => useDimensions(target, rest)).result;
  };

  interface Event {
    borderBoxSize?: { blockSize: number; inlineSize: number };
    contentBoxSize?: { blockSize: number; inlineSize: number };
    contentRect?: { width: number; height?: number };
  }

  let callback: (e: Event[]) => void;
  const observe = jest.fn();
  const disconnect = jest.fn();
  const mockResizeObserver = jest.fn((cb) => ({
    observe: (): void => {
      callback = cb;
      observe();
    },
    disconnect,
  }));

  const triggerObserverCb = (e: Event): void => {
    callback([e]);
  };

  beforeAll(() => {
    // @ts-ignore
    global.ResizeObserver = mockResizeObserver;
    // @ts-ignore
    global.ResizeObserverEntry = jest.fn();
  });

  it("should not start observe if the target isn't set", () => {
    renderHelper({ target: null });
    expect(observe).not.toHaveBeenCalled();
  });

  it("should return workable unobserve method", () => {
    const result = renderHelper();
    result.current.unobserve();
    expect(disconnect).toHaveBeenCalledTimes(1);
  });

  it("should return workable observe method", () => {
    const result = renderHelper();
    result.current.unobserve();
    result.current.observe();
    expect(observe).toHaveBeenCalledTimes(3);
  });

  it("should return width and height correctly", () => {
    const result = renderHelper();
    expect(result.current.width).toBe(0);
    expect(result.current.height).toBe(0);

    const contentBoxSize = { blockSize: 100, inlineSize: 100 };
    act(() => {
      triggerObserverCb({ contentBoxSize });
    });
    expect(result.current.width).toBe(contentBoxSize.blockSize);
    expect(result.current.height).toBe(contentBoxSize.inlineSize);

    const contentRect = { width: 100, height: 100 };
    act(() => {
      triggerObserverCb({ contentRect });
    });
    expect(result.current.width).toBe(contentRect.width);
    expect(result.current.height).toBe(contentRect.height);
  });

  it("should use border-box size", () => {
    console.warn = jest.fn();
    let result = renderHelper({ useBorderBoxSize: true });
    const contentBoxSize = { blockSize: 100, inlineSize: 100 };
    act(() => {
      triggerObserverCb({ contentBoxSize });
      triggerObserverCb({ contentBoxSize });
    });
    expect(console.warn).toHaveBeenCalledTimes(1);
    expect(console.warn).toHaveBeenCalledWith(borderBoxWarn);
    expect(result.current.width).toBe(contentBoxSize.blockSize);
    expect(result.current.height).toBe(contentBoxSize.inlineSize);

    console.warn = jest.fn();
    result = renderHelper({ useBorderBoxSize: true });
    const borderBoxSize = { blockSize: 110, inlineSize: 110 };
    act(() => {
      triggerObserverCb({ contentBoxSize, borderBoxSize });
    });
    expect(console.warn).not.toHaveBeenCalledWith(borderBoxWarn);
    expect(result.current.width).toBe(borderBoxSize.blockSize);
    expect(result.current.height).toBe(borderBoxSize.inlineSize);
  });

  it("should return currentBreakpoint correctly", () => {
    let result = renderHelper();
    expect(result.current.currentBreakpoint).toBe("");

    result = renderHelper({ breakpoints: { T1: 100 } });
    act(() => {
      triggerObserverCb({ contentRect: { width: 0 } });
    });
    expect(result.current.currentBreakpoint).toBe("");
    act(() => {
      triggerObserverCb({ contentRect: { width: 99 } });
    });
    expect(result.current.currentBreakpoint).toBe("");

    result = renderHelper({ breakpoints: { T0: 0, T1: 100 } });
    act(() => {
      triggerObserverCb({ contentRect: { width: 0 } });
    });
    expect(result.current.currentBreakpoint).toBe("T0");
    act(() => {
      triggerObserverCb({ contentRect: { width: 99 } });
    });
    expect(result.current.currentBreakpoint).toBe("T0");

    act(() => {
      triggerObserverCb({ contentRect: { width: 100 } });
    });
    expect(result.current.currentBreakpoint).toBe("T1");
    act(() => {
      triggerObserverCb({ contentRect: { width: 199 } });
    });
    expect(result.current.currentBreakpoint).toBe("T1");
  });

  it("should return entry correctly", () => {
    const result = renderHelper();
    expect(result.current.entry).toBeUndefined();

    const e = { contentRect: { width: 100, height: 100 } };
    act(() => {
      triggerObserverCb(e);
    });
    expect(result.current.entry).toStrictEqual(e);
  });

  it("should trigger onResize without breakpoints", () => {
    const onResize = jest.fn((e) => {
      e.unobserve();
      e.observe();
    });
    renderHelper({ onResize });
    const contentRect = { width: 100, height: 100 };
    act(() => {
      triggerObserverCb({ contentRect });
    });
    expect(onResize).toHaveBeenCalledWith({
      currentBreakpoint: "",
      width: contentRect.width,
      height: contentRect.height,
      entry: { contentRect },
      observe: expect.any(Function),
      unobserve: expect.any(Function),
    });
    expect(disconnect).toHaveBeenCalledTimes(11);
    expect(observe).toHaveBeenCalledTimes(12);
  });

  it("should trigger onResize with breakpoints", () => {
    const onResize = jest.fn((e) => {
      e.unobserve();
      e.observe();
    });
    renderHelper({ breakpoints: { T0: 0, T1: 100 }, onResize });
    const contentRect = { width: 50, height: 100 };
    act(() => {
      triggerObserverCb({ contentRect });
      triggerObserverCb({ contentRect });
    });
    expect(onResize).toHaveBeenCalledTimes(1);
    expect(onResize).toHaveBeenCalledWith({
      currentBreakpoint: "T0",
      width: contentRect.width,
      height: contentRect.height,
      entry: { contentRect },
      observe: expect.any(Function),
      unobserve: expect.any(Function),
    });
    expect(disconnect).toHaveBeenCalledTimes(13);
    expect(observe).toHaveBeenCalledTimes(14);
  });

  it("should throw resize observer error", () => {
    console.error = jest.fn();

    renderHelper();
    expect(console.error).not.toHaveBeenCalled();

    // @ts-ignore
    delete global.ResizeObserver;
    renderHelper({ polyfill: mockResizeObserver });
    expect(console.error).not.toHaveBeenCalled();

    renderHelper();
    // @ts-ignore
    global.ResizeObserver = mockResizeObserver;
    // @ts-ignore
    delete global.ResizeObserverEntry;
    renderHelper();

    expect(console.error).toHaveBeenCalledTimes(2);
    expect(console.error).toHaveBeenCalledWith(observerErr);
  });

  it("should use polyfill", () => {
    // @ts-ignore
    delete global.ResizeObserver;
    // @ts-ignore
    delete global.ResizeObserverEntry;
    renderHelper({ polyfill: mockResizeObserver });
    expect(observe).toHaveBeenCalledTimes(17);
  });
});
