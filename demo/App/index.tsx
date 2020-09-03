import React, { FC, useState } from "react";
import { Global, css } from "@emotion/core";
import normalize from "normalize.css";

import GitHubCorner from "../GitHubCorner";
import useDimensions from "../../src";
import {
  root,
  container,
  title,
  subtitle,
  frame,
  bp,
  controller,
} from "./styles";

const App: FC = () => {
  const [size, setSize] = useState<{ w: number; h: number }>({
    w: 250,
    h: 300,
  });
  const { ref, currentBreakpoint, width, height } = useDimensions<
    HTMLDivElement
  >({
    breakpoints: { XS: 0, SM: 100, MD: 200, LG: 300, XL: 400 },
  });

  const resize = (x: number, y: number) => {
    if (!ref.current) return;
    const { left: offsetX, top: offsetY } = ref.current.getBoundingClientRect();
    setSize({ w: x - offsetX, h: y - offsetY });
  };

  const handleMouseMove = (e: MouseEvent) => {
    e.preventDefault();
    resize(e.pageX, e.pageY);
  };

  const handleTouchMove = (e: TouchEvent) => {
    resize(e.touches[0].pageX, e.touches[0].pageY);
  };

  const handleDragStart = () => {
    if (typeof window.ontouchstart === "undefined") {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener(
        "mouseup",
        () => {
          document.removeEventListener("mousemove", handleMouseMove);
        },
        { once: true }
      );
    } else {
      document.addEventListener("touchmove", handleTouchMove);
      document.addEventListener(
        "touchend",
        () => {
          document.removeEventListener("touchmove", handleTouchMove);
        },
        { once: true }
      );
    }
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
        <h1 css={title}>REACT COOL DIMENSIONS</h1>
        <p css={subtitle}>
          React hook to measure an element&apos;s size and handle responsive
          components.
        </p>
        <div
          css={frame}
          style={{ width: `${size.w}px`, height: `${size.h}px` }}
          ref={ref}
        >
          <div css={bp}>{currentBreakpoint}</div>
          <div>
            {Math.floor(width)} x {Math.floor(height)}
          </div>
          {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
          <div
            css={controller}
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
          />
        </div>
      </div>
    </>
  );
};

export default App;
