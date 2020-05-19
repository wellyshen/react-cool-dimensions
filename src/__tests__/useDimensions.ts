import { RefObject } from "react";
import { renderHook, act } from "@testing-library/react-hooks";

import useDimensions, { Options, Return as Current, observerErr } from "..";

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

  let callback: Function;
  const observe = jest.fn();
  const disconnect = jest.fn();
  const mockResizeObserver = jest.fn((cb) => ({
    observe: (): void => {
      callback = cb;
      observe();
    },
    disconnect,
  }));

  interface Event {
    contentBoxSize?: { blockSize: number; inlineSize: number };
    contentRect?: { width: number; height?: number };
  }

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

  it("should trigger onResize", () => {
    const onResize = jest.fn((e) => {
      // e.unobserve();
      // e.observe();
    });
    renderHelper({ onResize });
    const defaultEvent = {
      currentBreakpoint: "",
      observe: expect.any(Function),
      unobserve: expect.any(Function),
    };
    const contentRect = { width: 100, height: 100 };
    act(() => {
      triggerObserverCb({ contentRect });
      // triggerObserverCb({ isIntersecting, boundingClientRect });
    });
    expect(onResize).toHaveBeenCalledWith({
      ...defaultEvent,
      width: contentRect.width,
      height: contentRect.height,
      entry: { contentRect },
    });
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
    expect(console.error).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledWith(observerErr);

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
    expect(observe).toHaveBeenCalledTimes(12);
  });
});
