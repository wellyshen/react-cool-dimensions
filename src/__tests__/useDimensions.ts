import { renderHook, act } from "@testing-library/react-hooks";

import useDimensions, { Options, observerErr, borderBoxWarn } from "..";

describe("useDimensions", () => {
  const target = document.createElement("div");
  const renderHelper = (args: Options<HTMLDivElement> = {}) =>
    renderHook(() => useDimensions(args));

  interface Event {
    borderBoxSize?: { blockSize: number; inlineSize: number };
    contentBoxSize?: { blockSize: number; inlineSize: number };
    contentRect?: { width: number; height?: number };
  }

  let callback: (e: Event[]) => void;
  const observe = jest.fn();
  const disconnect = jest.fn();
  const mockResizeObserver = jest.fn((cb) => ({
    observe: () => {
      callback = cb;
      observe();
    },
    disconnect,
  }));

  const triggerObserverCb = (e: Event) => {
    callback([e]);
  };

  beforeEach(() => {
    jest.clearAllMocks();

    jest.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
      cb(0);
      return 0;
    });
  });

  beforeAll(() => {
    // @ts-expect-error
    global.ResizeObserver = mockResizeObserver;
    global.ResizeObserverEntry = jest.fn();
  });

  it("should not start observe if target isn't set", () => {
    const { result } = renderHelper();
    expect(observe).not.toHaveBeenCalled();

    result.current.observe();
    expect(observe).not.toHaveBeenCalled();
  });

  it("should return workable observe method", () => {
    const { result } = renderHelper();
    result.current.observe(target);
    expect(disconnect).toHaveBeenCalledTimes(1);
    expect(observe).toHaveBeenCalledTimes(1);

    result.current.observe();
    expect(observe).toHaveBeenCalledTimes(2);
  });

  it("should return workable unobserve method", () => {
    const { result } = renderHelper();
    result.current.unobserve();
    expect(disconnect).toHaveBeenCalledTimes(1);
  });

  it("should return width and height correctly", () => {
    const { result } = renderHelper();
    result.current.observe(target);

    expect(result.current.width).toBe(0);
    expect(result.current.height).toBe(0);

    const contentBoxSize = { blockSize: 100, inlineSize: 100 };
    act(() => triggerObserverCb({ contentBoxSize }));
    expect(result.current.width).toBe(contentBoxSize.blockSize);
    expect(result.current.height).toBe(contentBoxSize.inlineSize);

    const contentRect = { width: 100, height: 100 };
    act(() => triggerObserverCb({ contentRect }));
    expect(result.current.width).toBe(contentRect.width);
    expect(result.current.height).toBe(contentRect.height);
  });

  it("should use border-box size", () => {
    console.warn = jest.fn();
    let { result } = renderHelper({ useBorderBoxSize: true });
    result.current.observe(target);
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
    result = renderHelper({ useBorderBoxSize: true }).result;
    result.current.observe(target);
    const borderBoxSize = { blockSize: 110, inlineSize: 110 };
    act(() => triggerObserverCb({ contentBoxSize, borderBoxSize }));
    expect(console.warn).not.toHaveBeenCalledWith(borderBoxWarn);
    expect(result.current.width).toBe(borderBoxSize.blockSize);
    expect(result.current.height).toBe(borderBoxSize.inlineSize);
  });

  it("should return currentBreakpoint correctly", () => {
    let { result } = renderHelper();
    result.current.observe(target);
    expect(result.current.currentBreakpoint).toBe("");

    result = renderHelper({ breakpoints: { T1: 100 } }).result;
    result.current.observe(target);
    act(() => triggerObserverCb({ contentRect: { width: 0 } }));
    expect(result.current.currentBreakpoint).toBe("");
    act(() => triggerObserverCb({ contentRect: { width: 99 } }));
    expect(result.current.currentBreakpoint).toBe("");

    result = renderHelper({ breakpoints: { T0: 0, T1: 100 } }).result;
    result.current.observe(target);
    act(() => triggerObserverCb({ contentRect: { width: 0 } }));
    expect(result.current.currentBreakpoint).toBe("T0");
    act(() => triggerObserverCb({ contentRect: { width: 99 } }));
    expect(result.current.currentBreakpoint).toBe("T0");

    act(() => triggerObserverCb({ contentRect: { width: 100 } }));
    expect(result.current.currentBreakpoint).toBe("T1");
    act(() => triggerObserverCb({ contentRect: { width: 199 } }));
    expect(result.current.currentBreakpoint).toBe("T1");
  });

  it("should return entry correctly", () => {
    const { result } = renderHelper();
    result.current.observe(target);
    expect(result.current.entry).toBeUndefined();

    const e = { contentRect: { width: 100, height: 100 } };
    act(() => triggerObserverCb(e));
    expect(result.current.entry).toEqual(e);
  });

  it("should stop observe when un-mount", () => {
    const { unmount } = renderHelper();
    unmount();
    expect(disconnect).toHaveBeenCalledTimes(1);
  });

  it("should trigger onResize without breakpoints", () => {
    const onResize = jest.fn();
    const { result } = renderHelper({ onResize });
    result.current.observe(target);
    const contentRect = { width: 100, height: 100 };
    act(() => triggerObserverCb({ contentRect }));
    expect(onResize).toHaveBeenCalledWith({
      currentBreakpoint: "",
      width: contentRect.width,
      height: contentRect.height,
      entry: { contentRect },
      observe: expect.any(Function),
      unobserve: expect.any(Function),
    });
  });

  it("should trigger onResize with breakpoints", () => {
    const onResize = jest.fn();
    const { result } = renderHelper({
      breakpoints: { T0: 0, T1: 100 },
      onResize,
    });
    result.current.observe(target);
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
  });

  it("should update state on breakpoint changed", () => {
    const { result } = renderHelper({
      breakpoints: { T0: 100, T1: 200 },
      updateOnBreakpointChange: true,
    });
    result.current.observe(target);
    act(() => triggerObserverCb({ contentRect: { width: 50 } }));
    expect(result.current.width).toBe(0);
    act(() => triggerObserverCb({ contentRect: { width: 100 } }));
    expect(result.current.width).toBe(100);
  });

  it("should update state conditionally", () => {
    const { result } = renderHelper({
      shouldUpdate: ({ width }) => width > 300,
    });
    result.current.observe(target);
    act(() => triggerObserverCb({ contentRect: { width: 100 } }));
    expect(result.current.width).toBe(0);
    act(() => triggerObserverCb({ contentRect: { width: 400 } }));
    expect(result.current.width).toBe(400);
    act(() => triggerObserverCb({ contentRect: { width: 100 } }));
    expect(result.current.width).toBe(400);
  });

  it("should update state with conflict options", () => {
    let { result } = renderHelper({
      updateOnBreakpointChange: true,
    });
    result.current.observe(target);
    act(() => triggerObserverCb({ contentRect: { width: 50 } }));
    expect(result.current.width).toBe(50);

    result = renderHelper({
      breakpoints: { T0: 100, T1: 200 },
      updateOnBreakpointChange: true,
      shouldUpdate: ({ width }) => width > 300,
    }).result;
    result.current.observe(target);
    act(() => triggerObserverCb({ contentRect: { width: 100 } }));
    expect(result.current.width).toBe(0);
    act(() => triggerObserverCb({ contentRect: { width: 400 } }));
    expect(result.current.width).toBe(400);
  });

  it("should throw resize observer error", () => {
    console.error = jest.fn();

    renderHelper();
    expect(console.error).not.toHaveBeenCalled();

    // @ts-expect-error
    delete global.ResizeObserver;
    renderHelper({ polyfill: mockResizeObserver });
    expect(console.error).not.toHaveBeenCalled();

    renderHelper();
    expect(console.error).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledWith(observerErr);

    // @ts-expect-error
    global.ResizeObserver = mockResizeObserver;
    // @ts-expect-error
    delete global.ResizeObserverEntry;
    renderHelper();
    expect(console.error).toHaveBeenCalledTimes(2);
  });

  it("should use polyfill", () => {
    // @ts-expect-error
    delete global.ResizeObserver;
    // @ts-expect-error
    delete global.ResizeObserverEntry;
    const { result } = renderHelper({ polyfill: mockResizeObserver });
    result.current.observe(target);
    expect(observe).toHaveBeenCalledTimes(1);
  });
});
