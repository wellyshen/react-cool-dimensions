import React, { FC, useState, useRef } from "react";
import { Global, css } from "@emotion/core";
import normalize from "normalize.css";

import GitHubCorner from "../GitHubCorner";
import useDimensions from "../../src";
import {
  root,
  container,
  title,
  subtitle,
  sizeInfo,
  frame,
  card,
  cardMD,
  cardLG,
  image,
  text,
  controller,
} from "./styles";

const defaultW = 230;
const defaultH = 330;

const App: FC<{}> = () => {
  const [size, setSize] = useState<{ w: number; h: number }>({
    w: defaultW,
    h: defaultH,
  });
  const ref = useRef<HTMLDivElement>();
  const { currentBreakpoint, width, height } = useDimensions(ref, {
    breakpoints: { SM: 100, MD: 300, LG: 500 },
  });

  const resize = (x: number, y: number): void => {
    const { left: offsetX, top: offsetY } = ref.current.getBoundingClientRect();
    let w = x - offsetX;
    let h = y - offsetY;
    if (w < defaultW) w = defaultW;
    if (h < defaultH) h = defaultH;

    setSize({ w, h });
  };

  const handleMouseMove = (e: MouseEvent): void => {
    e.preventDefault();
    resize(e.pageX, e.pageY);
  };

  const handleTouchMove = (e: TouchEvent): void => {
    resize(e.touches[0].pageX, e.touches[0].pageY);
  };

  const handleDragStart = (): void => {
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
        "touchmove",
        () => {
          document.removeEventListener("mousemove", handleTouchMove);
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
        <h1 css={title}>React Cool Dimensions</h1>
        <p css={subtitle}>
          React hook to measure an element&apos;s size and handle responsive
          components.
        </p>
        <div css={sizeInfo}>
          {Math.round(width)} x {Math.round(height)} · {currentBreakpoint}
        </div>
        <div
          css={frame}
          style={{ width: `${size.w}px`, height: `${size.h}px` }}
          ref={ref}
        >
          <div
            css={[
              card,
              currentBreakpoint !== "SM" && cardMD,
              currentBreakpoint === "LG" && cardLG,
            ]}
          >
            <div css={image}>
              <img
                src="https://raw.githubusercontent.com/wellyshen/react-cool-dimensions/master/demo/static/site_assets/og_image.png"
                alt="react-cool-dimensions"
              />
            </div>
            <div css={text}>
              <div>
                A React hook that measure an element&apos;s size and handle
                responsive components with highly-performant way, using
                ResizeObserver.
              </div>
              {/* eslint-disable-next-line jsx-a11y/accessible-emoji */}
              <div>😎 🤩 🥳 🤪 🤓</div>
            </div>
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
