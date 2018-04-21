import raf from 'raf'

export class LazyElement {
  constructor(el, bindings, options) {
    this.el = el
    this.bindings = bindings
    this.options = options
    this.state = 'loading'
  }

  preloadImage(resolve) {
    let image = new Image()
    image.src = this.bindings.value
    image.onload = () => {
      resolve(image)
      image = null
    }
  }

  reset(newValue) {
    this.el.setAttribute('src', '')
    this.bindings.value = newValue
    this.el.classList.remove(this.options.onLoadClassName)
    this.state = 'loading'
    this.render()
  }

  render(cb = () => {}) {
    if (this.state === 'loaded') return cb(false)
    if (!this.isElInView()) return cb(false)
    this.preloadImage(image => {
      this.el.setAttribute('src', image.src)
      this.el.classList.add(this.options.onLoadClassName)
      this.state = 'loaded'
      cb(true)
    })
  }

  isElInView() {
    const rect = this.el.getBoundingClientRect()
    return (rect.top > 0 && rect.top < window.innerHeight) || (rect.top < 0 && rect.top > -rect.height)
  }

  destroy() {
    this.el = null
    this.bindings = null
  }
}

export class LazyLoad {
  constructor(Vue, options) {
    this.vue = Vue
    this.options = options
    this.detectWindowChange()
  }

  queue = []
  windowHeight = window.innerHeight
  windowWidth = window.innerWidth
  scrollY = -1

  detectWindowChange = () => {
    if (this.scrollY !== window.pageYOffset || this.windowHeight !== window.innerHeight || this.windowWidth !== window.innerWidth) {
      this.batchRender()
    }
    raf(this.detectWindowChange)
  }

  batchRender = () => {
    if (!this.queue.length) return
    for (let i = this.queue.length; i--; i >= 0) {
      this.queue[i].render()
    }
  }

  bind = (el, bindings, vNode) => {
    el.$lazyEl = new LazyElement(el, bindings, this.options)
    this.vue.nextTick(() => {
      el.$lazyEl.render(rendered => {
        if (!rendered) this.queue.push(el.$lazyEl)
      })
    })
  }

  update = (el, bindings, vNode, oldNode) => {
    if (bindings.oldValue !== bindings.value) {
      el.$lazyEl.reset(bindings.value)
    }
  }

  remove = el => {
    el.$lazyEl.destroy()
    el.$lazyEl = null
  }
}
