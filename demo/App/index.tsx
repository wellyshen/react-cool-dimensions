import React, { FC, useState, useRef } from "react";
import { Global, css } from "@emotion/core";
import normalize from "normalize.css";

import GitHubCorner from "../GitHubCorner";
import useDimensions from "../../src";
import { root, container, title, subtitle, frame, controller } from "./styles";

const defaultVal = 300;

const App: FC<{}> = () => {
  const [size, setSize] = useState<{ w: number; h: number }>({
    w: defaultVal,
    h: defaultVal,
  });
  const ref = useRef<HTMLDivElement>();
  const { width, height, entry, observe, unobserve } = useDimensions(ref, {
    onResize: ({
      width: w,
      height: h,
      entry: en,
      observe: ob,
      unobserve: unob,
    }) => {
      // console.log("LOG ===> onResize: ", w, h, en);
    },
  });

  // console.log("LOG ===> ", width, height, entry);

  const handleResize = (e: MouseEvent): void => {
    const { left: offsetX, top: offsetY } = ref.current.getBoundingClientRect();
    setSize({ w: e.pageX - offsetX, h: e.pageY - offsetY });
  };

  const handleMouseDown = (): void => {
    document.addEventListener("mousemove", handleResize);
    document.addEventListener("mouseup", () => {
      document.removeEventListener("mousemove", handleResize);
    });
  };

  return (
    <>
      <Global
        styles={css`
          ${normalize}
          ${root}
        `}
      />
      <div css={container}>
        <GitHubCorner url="https://github.com/wellyshen/react-cool-dimensions" />
        <h1 css={title}>React Cool Dimensions</h1>
        <p css={subtitle}>
          React hook to measure and monitor an element&apos;s size.
        </p>
        <div
          css={frame}
          style={{
            left: `${window.innerWidth / 2 - defaultVal / 2}px`,
            width: `${size.w}px`,
            height: `${size.h}px`,
          }}
          ref={ref}
        >
          {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
          <div css={controller} onMouseDown={handleMouseDown} />
        </div>
      </div>
    </>
  );
};

export default App;
