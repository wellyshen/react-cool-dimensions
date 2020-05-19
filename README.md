# React Cool Dimensions

A React [hook](https://reactjs.org/docs/hooks-custom.html#using-a-custom-hook) that measure an element's size and handle [responsive components](#responsive-components) with highly-performant way, using [ResizeObserver](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver). Try it you will 👍🏻 it!

❤️ it? ⭐️ it on [GitHub](https://github.com/wellyshen/react-cool-dimensions/stargazers) or [Tweet](https://twitter.com/intent/tweet?text=With%20@react-cool-dimensions,%20I%20can%20build%20a%20performant%20web%20app.%20Thanks,%20@Welly%20Shen%20🤩) about it.

[![build status](https://img.shields.io/travis/wellyshen/react-cool-dimensions/master?style=flat-square)](https://travis-ci.org/wellyshen/react-cool-dimensions)
[![coverage status](https://img.shields.io/coveralls/github/wellyshen/react-cool-dimensions?style=flat-square)](https://coveralls.io/github/wellyshen/react-cool-dimensions?branch=master)
[![npm version](https://img.shields.io/npm/v/react-cool-dimensions?style=flat-square)](https://www.npmjs.com/package/react-cool-dimensions)
[![npm downloads](https://img.shields.io/npm/dm/react-cool-dimensions?style=flat-square)](https://www.npmtrends.com/react-cool-dimensions)
[![npm downloads](https://img.shields.io/npm/dt/react-cool-dimensions?style=flat-square)](https://www.npmtrends.com/react-cool-dimensions)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/react-cool-dimensions?style=flat-square)](https://bundlephobia.com/result?p=react-cool-dimensions)
[![MIT licensed](https://img.shields.io/github/license/wellyshen/react-cool-dimensions?style=flat-square)](https://raw.githubusercontent.com/wellyshen/react-cool-dimensions/master/LICENSE)
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange?style=flat-square)](#contributors-)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square)](https://github.com/wellyshen/react-cool-dimensions/blob/master/CONTRIBUTING.md)
[![Twitter URL](https://img.shields.io/twitter/url?style=social&url=https%3A%2F%2Fgithub.com%2Fwellyshen%2Freact-cool-dimensions)](https://twitter.com/intent/tweet?text=With%20@react-cool-dimensions,%20I%20can%20build%20a%20performant%20web%20app.%20Thanks,%20@Welly%20Shen%20🤩)

![demo](https://user-images.githubusercontent.com/21308003/82219976-9eddf080-9950-11ea-8ca8-cb6cab41222b.gif)

⚡️ Try yourself: https://react-cool-dimensions.netlify.app

## Features

- 🚀 Measures element's size with highly-performant way, using [ResizeObserver](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver).
- 🎣 Easy to use, based on React [hook](https://reactjs.org/docs/hooks-custom.html#using-a-custom-hook).
- 🔮 Easy to handle [responsive components](#responsive-components), provides an alternative solution to the [container queries](https://wicg.github.io/container-queries) problem.
- 🎛 Super flexible [API](#api) design to cover most cases for you.
- 📜 Supports [TypeScript](https://www.typescriptlang.org) type definition.
- 🗄️ Server-side rendering compatibility.
- 🦠 Tiny size ([~ 1.5KB gzipped](https://bundlephobia.com/result?p=react-cool-dimensions)). No external dependencies, aside for the `react`.

## Requirement

To use `react-cool-dimensions`, you must use `react@16.8.0` or greater which includes hooks.

## Installation

This package is distributed via [npm](https://www.npmjs.com/package/react-cool-dimensions).

```sh
$ yarn add react-cool-dimensions
# or
$ npm install --save react-cool-dimensions
```

## Usage

`react-cool-dimensions` has a flexible [API](#api) design, it can cover simple to complex use cases for you. Here are some example to show you how does it work.

> ⚠️ [Most modern browsers support ResizeObserver natively](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver). You can also use [polyfill](#resizeobserver-polyfill) for full browser support.

### Basic Use Case

To report the size of an element by the `width` and `height` states. Please note, it reports the [content rectangle](https://developers.google.com/web/updates/2016/10/resizeobserver#what_is_being_reported) of the element.

```js
import React, { useRef } from "react";
import useDimensions from "react-cool-dimensions";

const App = () => {
  const ref = useRef();
  const { width, height, entry, unobserve, observe } = useDimensions(ref, {
    onResize: ({ width, height, entry, unobserve, observe }) => {
      // Triggered whenever the size of the target is changed
    },
  });

  return (
    <div ref={ref}>
      Hi! My width is {width}px and height is {height}px
    </div>
  );
};
```

### Responsive Components

We have [media queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries) but those are based on the browser viewport not individual elements. In some case, we'd like to style components based on the width of a containing element rather than the browser viewport. To meet this demand there's a [proposal](https://wicg.github.io/container-queries) for **container queries**, but it still doesn't exist today...

No worries, `react-cool-dimensions` provides an alternative solution for us! We can activate the **responsive mode** by the `breakpoints` option. It's a width-based solution, once it's activated we can easily apply different styles to a component according to the `currentBreakpoint` state. The overall concept as below.

```js
import React, { useRef } from "react";
import useDimensions from "react-cool-dimensions";

const App = () => {
  const ref = useRef();
  const { currentBreakpoint } = useDimensions(ref, {
    // The "currentBreakpoint" will be the object key based on the target's width
    // for instance, 0px - 319px (currentBreakpoint = xs), 320px - 479px (currentBreakpoint = sm) and so on
    breakpoints: { xs: 0, sm: 320, md: 480, lg: 640 },
    onResize: ({ currentBreakpoint }) => {
      // Now the event callback will be triggered when breakpoint is changed
      // we can also access the "currentBreakpoint" here
    },
  });

  return (
    <div class={`card ${currentBreakpoint}`} ref={ref}>
      <div class="card-header">I'm 😎</div>
      <div class="card-body">I'm 👕</div>
      <div class="card-footer">I'm 👟</div>
    </div>
  );
};
```

> Note: If the `breakpoints` option isn't set or there's on the defined breakpoint (object key) for a range of width. The `currentBreakpoint` will be empty string;

## Performance Optimization

The `onResize` event will be triggered whenever the size of the target element is changed. We can reduce the frequency of the event callback by activating the [responsive mode](#responsive-components) or implementing our own throttled/debounced function as below.

```js
import _ from "lodash";

const { width, height } = useDimensions(ref, {
  onResize: _.throttle(() => {
    // Triggered once per every 500 milliseconds
  }, 500),
});
```

## API

```js
const returnObj = useDimensions(ref: RefObject<HTMLElement>, options?: object);
```

### Return object

It's returned with the following properties.

| Key                 | Type     | Default | Description                                                                                                                                                                          |
| ------------------- | -------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `width`             | number   |         | The width of the target element in pixel, based on the [content rectangle](https://developers.google.com/web/updates/2016/10/resizeobserver#what_is_being_reported) of the element.  |
| `height`            | number   |         | The height of the target element in pixel, based on the [content rectangle](https://developers.google.com/web/updates/2016/10/resizeobserver#what_is_being_reported) of the element. |
| `currentBreakpoint` | string   |         | Indicates the current breakpoint of the [responsive components](#responsive-components).                                                                                             |
| `entry`             | object   |         | The [ResizeObserverEntry](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserverEntry) of the target element.                                                               |
| `unobserve`         | function |         | To stop observing the target element.                                                                                                                                                |
| `observe`           | function |         | To re-start observing the target element once it's stopped observing.                                                                                                                |

### Parameters

You must pass the `ref` to use this hook. The options provides the following configurations and event callback for you.

| Key           | Type           | Default | Description                                                                                                                                                                                   |
| ------------- | -------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `breakpoints` | object         |         | Activates the responsive mode for [responsive components](#responsive-components) or [performance optimization](#performance-optimization).                                                   |
| `onResize`    | function       |         | It's invoked whenever the size of the target element is changed. But in [responsive mode](#responsive-components), it's invoked based on the changing of the breakpoint rather than the size. |
| `polyfill`    | ResizeObserver |         | It's used for [injecting a polyfill](#resizeobserver-polyfill).                                                                                                                               |

## ResizeObserver Polyfill

[ResizeObserver has good support amongst browsers](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver), but it's not universal. You'll need to use polyfill for browsers that don't support it. Polyfills is something you should do consciously at the application level. Therefore `react-cool-dimensions` doesn't include it.

We recommend using [resize-observer-polyfill](https://github.com/que-etc/resize-observer-polyfill):

```sh
$ yarn add resize-observer-polyfill
# or
$ npm install --save resize-observer-polyfill
```

Then inject it by the `polyfill` option:

```js
import ResizeObserver from "resize-observer-polyfill";

const { width, height } = useDimensions(ref, { polyfill: ResizeObserver });
```

Or pollute the `window` object:

```js
import ResizeObserver from "resize-observer-polyfill";

if (!window.ResizeObserver) window.ResizeObserver = ResizeObserver;
```

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://wellyshen.com"><img src="https://avatars1.githubusercontent.com/u/21308003?v=4" width="100px;" alt=""/><br /><sub><b>Welly</b></sub></a><br /><a href="https://github.com/wellyshen/react-cool-dimensions/commits?author=wellyshen" title="Code">💻</a> <a href="https://github.com/wellyshen/react-cool-dimensions/commits?author=wellyshen" title="Documentation">📖</a> <a href="#maintenance-wellyshen" title="Maintenance">🚧</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
