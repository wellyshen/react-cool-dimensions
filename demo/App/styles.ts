import { css } from "@emotion/core";

import mq from "../utils/mq";

const { sm, md, lg } = mq;

export const root = css`
  body {
    font-family: "Open Sans", sans-serif;
  }
`;

export const container = css`
  display: flex;
  flex-direction: column;
  align-items: center;
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
  text-align: center;
`;

export const subtitle = css`
  margin: 0 0 2.5rem;
`;

export const sizeInfo = css`
  margin-bottom: 0.5rem;
  color: #777;
`;

export const frame = css`
  position: relative;
  border: 1px solid #777;
`;

export const image = css`
  img {
    width: 100%;
  }
`;

export const text = css`
  margin-top: 1rem;
  div:last-child {
    margin-top: 1rem;
    font-size: 1.25rem;
  }
`;

export const card = css`
  margin: 1rem;
  padding: 0.5rem;
  border: 1px solid #ccc;
`;

export const cardMD = css`
  display: flex;
  .css-${text.name} {
    margin-top: 0;
    padding-left: 1rem;
  }
`;

export const cardLG = css`
  display: flex;
  .css-${image.name} {
    flex: 4;
  }
  .css-${text.name} {
    flex: 6;
  }
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
