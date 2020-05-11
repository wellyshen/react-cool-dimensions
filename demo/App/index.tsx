import React, { FC, useState, useRef } from "react";
import { Global, css } from "@emotion/core";
import normalize from "normalize.css";

import GitHubCorner from "../GitHubCorner";
import useDimensions from "../../src";
import { root, container, title, subtitle, frame, controller } from "./styles";

const sz = 300;

const App: FC<{}> = () => {
  const [size, setSize] = useState<{ w: number; h: number }>({ w: sz, h: sz });
  const ref = useRef<HTMLDivElement>();
  const {
    breakpoint,
    width,
    height,
    entry,
    observe,
    unobserve,
  } = useDimensions(ref, {
    breakpoints: { T1: 300, T2: 100, T3: 200, T4: 400 },
    onResize: ({
      breakpoint: bp,
      width: w,
      height: h,
      entry: en,
      observe: ob,
      unobserve: unob,
    }) => {
      console.log("LOG ===> onResize: ", bp, w, h, en);
    },
  });

  // console.log("LOG ===> ", breakpoint, width, height, entry);

  const resize = (x: number, y: number): void => {
    const { left: offsetX, top: offsetY } = ref.current.getBoundingClientRect();
    setSize({ w: x - offsetX, h: y - offsetY });
  };

  const handleMouseMove = (e: MouseEvent): void => {
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
          React hook to measure and monitor an element&apos;s size.
        </p>
        <div
          css={frame}
          style={{
            left: `${window.innerWidth / 2 - sz / 2}px`,
            width: `${size.w}px`,
            height: `${size.h}px`,
          }}
          ref={ref}
        >
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
