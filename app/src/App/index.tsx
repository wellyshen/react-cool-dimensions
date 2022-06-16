import type { FC } from "react";
import useDimensions from "react-cool-dimensions";

import GitHubCorner from "../GitHubCorner";
import styles from "./styles.module.scss";

const App: FC = () => {
  const { observe, currentBreakpoint, width, height } =
    useDimensions<HTMLDivElement>({
      breakpoints: { XS: 0, SM: 100, MD: 200, LG: 300, XL: 400 },
    });

  return (
    <div className={styles.container}>
      <GitHubCorner url="https://github.com/wellyshen/react-cool-dimensions" />
      <h1 className={styles.title}>REACT COOL DIMENSIONS</h1>
      <p className={styles.subtitle}>
        React hook to measure an element&apos;s size and handle responsive
        components.
      </p>
      <div className={styles.frame} style={{ resize: "both" }} ref={observe}>
        <div className={styles.bp}>{currentBreakpoint}</div>
        <div>
          {Math.floor(width)} x {Math.floor(height)}
        </div>
      </div>
    </div>
  );
};

export default App;
