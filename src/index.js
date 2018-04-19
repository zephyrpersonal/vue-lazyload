import { LazyLoad } from './lazyload'

export default {
  install(Vue, options = {}) {
    const lazyload = new LazyLoad(Vue, options)

    Vue.directive('lazy-load', {
      bind: lazyload.bind,
      unbind: lazyload.remove,
      update: lazyload.update
    })
  }
}
