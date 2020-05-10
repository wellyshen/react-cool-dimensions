import React, { FC, useState, useRef } from "react";
import { Global, css } from "@emotion/core";
import normalize from "normalize.css";

import GitHubCorner from "../GitHubCorner";
import useDimensions from "../../src";
import { root, container, title, subtitle, box, dot } from "./styles";

const App: FC<{}> = () => {
  const [size, setSize] = useState<{ w: number; h: number }>({
    w: 300,
    h: 300,
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
    console.log("LOG ===> move");
    /* setSize({
      w: e.pageX - ref.current.getBoundingClientRect().left + 100,
      h: e.pageY - ref.current.getBoundingClientRect().top + 100,
    }); */
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>): void => {
    e.target.addEventListener("mousemove", handleResize);
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>): void => {
    console.log("UP!");
    e.target.removeEventListener("mousemove", handleResize);
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
          css={box}
          style={{ width: `${size.w}px`, height: `${size.h}px` }}
          ref={ref}
        >
          {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
          <div
            css={dot}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
          />
        </div>
      </div>
    </>
  );
};

export default App;
