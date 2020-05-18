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
  page,
  pageMD,
  pageLG,
  content,
  banner,
  cardWrapper,
  card,
  controller,
} from "./styles";

const App: FC<{}> = () => {
  const [size, setSize] = useState<{ w: number; h: number }>({
    w: 250,
    h: 300,
  });
  const ref = useRef<HTMLDivElement>();
  const { currentBreakpoint, width, height } = useDimensions(ref, {
    breakpoints: { SM: 0, MD: 300, LG: 600 },
  });

  const resize = (x: number, y: number): void => {
    const { left: offsetX, top: offsetY } = ref.current.getBoundingClientRect();
    setSize({ w: x - offsetX, h: y - offsetY });
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

  const renderCards = (num: number): JSX.Element[] => {
    const cards = [];

    while (cards.length < num) {
      cards.push(
        <div key={cards.length} css={card}>
          <div />
          <div>
            <div />
            <div />
            <div />
          </div>
        </div>
      );
    }

    return cards;
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
          css={[
            page,
            currentBreakpoint !== "SM" && pageMD,
            currentBreakpoint === "LG" && pageLG,
          ]}
          style={{ width: `${size.w}px`, height: `${size.h}px` }}
          ref={ref}
        >
          <div css={content}>
            <div css={banner} />
            <div css={cardWrapper}>{renderCards(3)}</div>
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
