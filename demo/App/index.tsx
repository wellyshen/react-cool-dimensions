import { FC } from "react";
import { Global, css } from "@emotion/react";
import normalize from "normalize.css";

import GitHubCorner from "../GitHubCorner";
import useDimensions from "../../src";
import { root, container, title, subtitle, frame, bp } from "./styles";

const App: FC = () => {
  const { observe, currentBreakpoint, width, height } =
    useDimensions<HTMLDivElement>({
      breakpoints: { XS: 0, SM: 100, MD: 200, LG: 300, XL: 400 },
    });

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
        <div css={frame} style={{ resize: "both" }} ref={observe}>
          <div css={bp}>{currentBreakpoint}</div>
          <div>
            {Math.floor(width)} x {Math.floor(height)}
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
