import { css } from "@emotion/core";

import mq from "../utils/mq";

const { sm, md, lg } = mq;

export const root = css`
  body {
    font-family: "Open Sans", sans-serif;
  }
`;

export const container = css`
  text-align: center;
  padding: 5rem 5%;
  ${sm} {
    padding-left: 10%;
    padding-right: 10%;
  }
  ${md} {
    padding-left: 12.5%;
    padding-right: 12.5%;
  }
  ${lg} {
    padding-left: 15%;
    padding-right: 15%;
  }
`;

export const title = css`
  margin: 0 0 0.75rem;
`;

export const subtitle = css`
  margin: 0 0 2.5rem;
`;

export const frame = css`
  position: absolute;
  border: 1px solid #777;
`;

export const controller = css`
  position: absolute;
  right: -5px;
  bottom: -5px;
  width: 10px;
  height: 10px;
  background: #fff;
  border-radius: 50%;
  border: 1px solid #777;
  cursor: nwse-resize;
`;
