# <em><b>REACT COOL DIMENSIONS</b></em>

A React [hook](https://reactjs.org/docs/hooks-custom.html#using-a-custom-hook) that measure an element's size and handle [responsive components](#responsive-components) with highly-performant way, using [ResizeObserver](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver). Try it you will 👍🏻 it!

❤️ it? ⭐️ it on [GitHub](https://github.com/wellyshen/react-cool-dimensions/stargazers) or [Tweet](https://twitter.com/intent/tweet?text=With%20@react-cool-dimensions,%20I%20can%20build%20a%20performant%20web%20app.%20Thanks,%20@Welly%20Shen%20🤩) about it.

[![build status](https://img.shields.io/github/workflow/status/wellyshen/react-cool-dimensions/CI?style=flat-square)](https://github.com/wellyshen/react-cool-dimensions/actions?query=workflow%3ACI)
[![coverage status](https://img.shields.io/coveralls/github/wellyshen/react-cool-dimensions?style=flat-square)](https://coveralls.io/github/wellyshen/react-cool-dimensions?branch=master)
[![npm version](https://img.shields.io/npm/v/react-cool-dimensions?style=flat-square)](https://www.npmjs.com/package/react-cool-dimensions)
[![npm downloads](https://img.shields.io/npm/dm/react-cool-dimensions?style=flat-square)](https://www.npmtrends.com/react-cool-dimensions)
[![npm downloads](https://img.shields.io/npm/dt/react-cool-dimensions?style=flat-square)](https://www.npmtrends.com/react-cool-dimensions)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/react-cool-dimensions?style=flat-square)](https://bundlephobia.com/result?p=react-cool-dimensions)
[![MIT licensed](https://img.shields.io/github/license/wellyshen/react-cool-dimensions?style=flat-square)](https://raw.githubusercontent.com/wellyshen/react-cool-dimensions/master/LICENSE)
[![All Contributors](https://img.shields.io/badge/all_contributors-2-orange?style=flat-square)](#contributors-)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square)](https://github.com/wellyshen/react-cool-dimensions/blob/master/CONTRIBUTING.md)
[![Twitter URL](https://img.shields.io/twitter/url?style=social&url=https%3A%2F%2Fgithub.com%2Fwellyshen%2Freact-cool-dimensions)](https://twitter.com/intent/tweet?text=With%20@react-cool-dimensions,%20I%20can%20build%20a%20performant%20web%20app.%20Thanks,%20@Welly%20Shen%20🤩)

![demo](https://user-images.githubusercontent.com/21308003/91013915-0f18a400-e61b-11ea-9232-291284159cac.gif)

⚡️ Try yourself: https://react-cool-dimensions.netlify.app

## Features

- 🚀 Measures element's size with highly-performant way, using [ResizeObserver](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver).
- 🎣 Easy to use, based on React [hook](https://reactjs.org/docs/hooks-custom.html#using-a-custom-hook).
- 🍰 Easy to handle [responsive components](#responsive-components), provides an alternative solution to the [container queries](https://wicg.github.io/container-queries) problem.
- 📦 Supports [border-box size measurement](#border-box-size-measurement).
- 🎛 Super flexible [API](#api) design to cover most cases for you.
- 🙈 Supports [conditional component](#conditional-component).
- 🔩 Supports custom `refs` for [some reasons](#use-your-own-ref).
- 📜 Supports [TypeScript](https://www.typescriptlang.org) type definition.
- 🗄️ Server-side rendering compatibility.
- 🦠 Tiny size ([~ 1KB gzipped](https://bundlephobia.com/result?p=react-cool-dimensions)). No external dependencies, aside for the `react`.

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

`react-cool-dimensions` has a flexible [API](#api) design, it can cover simple to complex use cases for you. Here are some examples to show you how does it work.

> ⚠️ [Most modern browsers support ResizeObserver natively](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver). You can also use [polyfill](#resizeobserver-polyfill) for full browser support.

### Basic Use Case

To report the size of an element by the `width` and `height` states.

```js
import useDimensions from "react-cool-dimensions";

const App = () => {
  const { ref, width, height, entry, unobserve, observe } = useDimensions({
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
import useDimensions from "react-cool-dimensions";

const Card = () => {
  const { ref, currentBreakpoint } = useDimensions({
    // The "currentBreakpoint" will be the object key based on the target's width
    // for instance, 0px - 319px (currentBreakpoint = XS), 320px - 479px (currentBreakpoint = SM) and so on
    breakpoints: { XS: 0, SM: 320, MD: 480, LG: 640 },
    onlyUpdateOnBreakpointChange: true, // optional, will only trigger state-change on breakpoint-change
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

> Note: If the `breakpoints` option isn't set or there's no the defined breakpoint (object key) for a range of width. The `currentBreakpoint` will be empty string;

If you only wish for updates to trigger if a breakpoint has changed, you may set the option `onlyUpdateOnBreakpointChange` to true.

## Conditionally updating state

You may wish to update state only conditionally, for instance if only the width hash changed beyond for intance 50px, you may use the `customSetState`-option. It receives two arguments, the previous state, and the next state.

If you return the previous-state directly, no state-change is set.

This may be used to reduce unwanted rerenders.

## Border-box Size Measurement

By default, the hook reports the `width` and `height` based on the [content rectangle](https://developers.google.com/web/updates/2016/10/resizeobserver#what_is_being_reported) of the target element. We can include the padding and border for measuring by the `useBorderBoxSize` option. Please note, the `width` and `height` states are rely on the [ResizeObserverEntry.borderBoxSize](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserverEntry/borderBoxSize) but [it hasn't widely implemented by browsers](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserverEntry/borderBoxSize#Browser_compatibility) therefore we need to use [polyfill](#resizeobserver-polyfill) for this feature.

```js
import useDimensions from "react-cool-dimensions";
import { ResizeObserver } from "@juggle/resize-observer";

const App = () => {
  const { ref, width, height } = useDimensions({
    useBorderBoxSize: true, // Tell the hook to measure based on the border-box size, default is false
    polyfill: ResizeObserver, // Use polyfill to make this feature works on more browsers
  });

  return (
    <div
      style={{
        width: "100px",
        height: "100px",
        padding: "10px",
        border: "5px solid grey",
      }}
      ref={ref}
    >
      {/* Now the width and height will be: 100px + 10px + 5px = 115px */}
      Hi! My width is {width}px and height is {height}px
    </div>
  );
};
```

## Conditional Component

There're two ways to use `react-cool-dimensions` with a conditional component.

Option 1, we can lazily start observing via the `observe` method:

```js
import { useState } from "react";
import useDimensions from "react-cool-dimensions";

const App = () => {
  const [show, setShow] = useState(false);
  const { width, height, observe } = useDimensions();

  return (
    <>
      <button onClick={() => setShow(!show)}>Toggle</button>
      {show && (
        <div ref={observe}>
          Hi! My width is {width}px and height is {height}px
        </div>
      )}
    </>
  );
};
```

Option 2, wrap the hook into the conditional component:

```js
import { useState } from "react";
import useDimensions from "react-cool-dimensions";

const MyComponent = () => {
  const { ref, width, height } = useDimensions();

  return (
    <div ref={ref}>
      Hi! My width is {width}px and height is {height}px
    </div>
  );
};

const App = () => {
  const [show, setShow] = useState(false);

  return (
    <>
      <button onClick={() => setShow(!show)}>Toggle</button>
      {show && <MyComponent />}
    </>
  );
};
```

## Use Your Own `ref`

In case of you had a ref already or you want to share a ref for other purposes. You can pass in the ref instead of using the one provided by this hook.

```js
const ref = useRef();
const { width, height } = useDimensions({ ref });
```

## Performance Optimization

The `onResize` event will be triggered whenever the size of the target element is changed. We can reduce the frequency of the event callback by activating the [responsive mode](#responsive-components) or implementing our own throttled/debounced function as below.

```js
import _ from "lodash";

const { ref, width, height } = useDimensions({
  onResize: _.throttle(() => {
    // Triggered once per every 500 milliseconds
  }, 500),
});
```

## API

```js
const returnObj = useDimensions(options?: object);
```

### Return object

It's returned with the following properties.

| Key                 | Type     | Default | Description                                                                                                            |
| ------------------- | -------- | ------- | ---------------------------------------------------------------------------------------------------------------------- |
| `ref`               | object   |         | Used to set the target element for measuring.                                                                          |
| `width`             | number   |         | The width of the target element in pixel.                                                                              |
| `height`            | number   |         | The height of the target element in pixel.                                                                             |
| `currentBreakpoint` | string   |         | Indicates the current breakpoint of the [responsive components](#responsive-components).                               |
| `entry`             | object   |         | The [ResizeObserverEntry](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserverEntry) of the target element. |
| `unobserve`         | function |         | To stop observing the target element.                                                                                  |
| `observe`           | function |         | To [lazily start](#conditional-component) or re-start observing the target element once it's stopped observing.        |

### Parameter

The `options` provides the following configurations and event callback for you.

| Key                | Type           | Default | Description                                                                                                                                                                                   |
| ------------------ | -------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ref`              | object         |         | For [some reasons](#use-your-own-ref), you can pass in your own `ref` instead of using the built-in.                                                                                          |
| `breakpoints`      | object         |         | Activates the responsive mode for [responsive components](#responsive-components) or [performance optimization](#performance-optimization).                                                   |
| `useBorderBoxSize` | boolean        | `false` | Tells the hook to [measure the target element based on the border-box size](#border-box-size-measurement).                                                                                    |
| `onResize`         | function       |         | It's invoked whenever the size of the target element is changed. But in [responsive mode](#responsive-components), it's invoked based on the changing of the breakpoint rather than the size. |
| `polyfill`         | ResizeObserver |         | It's used for [injecting a polyfill](#resizeobserver-polyfill).                                                                                                                               |

## ResizeObserver Polyfill

[ResizeObserver has good support amongst browsers](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver), but it's not universal. You'll need to use polyfill for browsers that don't support it. Polyfills is something you should do consciously at the application level. Therefore `react-cool-dimensions` doesn't include it.

We recommend using [@juggle/resize-observer](https://github.com/juggle/resize-observer):

```sh
$ yarn add @juggle/resize-observer
# or
$ npm install --save @juggle/resize-observer
```

Then inject it by the `polyfill` option:

```js
import { ResizeObserver } from "@juggle/resize-observer";

const { width, height } = useDimensions(ref, { polyfill: ResizeObserver });
```

Or pollute the `window` object:

```js
import { ResizeObserver, ResizeObserverEntry } from "@juggle/resize-observer";

if (!("ResizeObserver" in window)) {
  window.ResizeObserver = ResizeObserver;
  // Only use it when you have this trouble: https://github.com/wellyshen/react-cool-dimensions/issues/45
  // window.ResizeObserverEntry = ResizeObserverEntry;
}
```

You could use dynamic imports to only load the file when the polyfill is required:

```js
(async () => {
  if (!("ResizeObserver" in window)) {
    const module = await import("@juggle/resize-observer");
    window.ResizeObserver = module.ResizeObserver;
    // Only use it when you have this trouble: https://github.com/wellyshen/react-cool-dimensions/issues/45
    // window.ResizeObserverEntry = module.ResizeObserverEntry;
  }
})();
```

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://wellyshen.com"><img src="https://avatars1.githubusercontent.com/u/21308003?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Welly</b></sub></a><br /><a href="https://github.com/wellyshen/react-cool-dimensions/commits?author=wellyshen" title="Code">💻</a> <a href="https://github.com/wellyshen/react-cool-dimensions/commits?author=wellyshen" title="Documentation">📖</a> <a href="#maintenance-wellyshen" title="Maintenance">🚧</a></td>
    <td align="center"><a href="http://www.runarkristoffersen.com"><img src="https://avatars.githubusercontent.com/u/5629981?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Runar Kristoffersen</b></sub></a><br /><a href="https://github.com/wellyshen/react-cool-dimensions/commits?author=runar-rkmedia" title="Documentation">📖</a> <a href="https://github.com/wellyshen/react-cool-dimensions/commits?author=runar-rkmedia" title="Tests">⚠️</a> <a href="https://github.com/wellyshen/react-cool-dimensions/commits?author=runar-rkmedia" title="Code">💻</a> <a href="#ideas-runar-rkmedia" title="Ideas, Planning, & Feedback">🤔</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
