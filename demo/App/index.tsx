import { FC, useState, useRef, useEffect } from "react";
import { Global, css } from "@emotion/react";
import normalize from "normalize.css";

import useDimensions from "../../src";
import { root, container } from "./styles";

const WrappedComp = () => {
  const { ref, width, height } = useDimensions<HTMLDivElement>();

  return (
    <div
      style={{ width: "300px", height: "300px", background: "red" }}
      ref={ref}
    >
      {width} x {height}
    </div>
  );
};

const App: FC = () => {
  // const ref = useRef(null);
  const [show, setShow] = useState(true);
  /* const {
    ref,
    width,
    height,
    observe,
    unobserve,
  } = useDimensions<HTMLDivElement>({ ref }); */

  /* useEffect(() => {
    unobserve();
    observe();
  }, [observe, unobserve]);

  const setRef = (el: any) => {
    if (el) observe(el);
  }; */

  return (
    <div>
      <Global
        styles={css`
          ${normalize}
          ${root}
        `}
      />
      <div css={container}>
        <button type="button" onClick={() => setShow(!show)}>
          Toggle
        </button>
        {show && <WrappedComp />}
      </div>
    </div>
  );
};

export default App;
