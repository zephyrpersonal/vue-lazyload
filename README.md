# Tiny Vue Image Lazyload

## Install

```bash
yarn add tiny-vue-img-lazyload
```

## Usage

```js
import Vue from 'vue'
import TinyVueImgLazyload from 'tiny-vue-img-lazyload'

Vue.use(TinyVueImgLazyload, {
  onLoadClassName: 'loaded' // when image loaded, the className will be attach to the dom
})
```

then in your vue component

```html
<img v-lazy-load:src="your-img-link" />
```

## Example

clone this repo and

```bash
yarn install
yarn run dev
```
