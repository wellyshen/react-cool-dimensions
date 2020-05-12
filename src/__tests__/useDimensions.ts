import { renderHook } from "@testing-library/react-hooks";

import useDimensions from "..";

describe("useLatest", () => {
  it("should ...", () => {
    renderHook(() => useDimensions({ current: document.createElement("div") }));
  });
});
