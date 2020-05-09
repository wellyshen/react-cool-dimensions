import React, { FC } from "react";
import { Global, css } from "@emotion/core";
import normalize from "normalize.css";

import GitHubCorner from "../GitHubCorner";
import { root, container, title, subtitle } from "./styles";

const App: FC<{}> = () => {
  // ...

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
      </div>
    </>
  );
};

export default App;
