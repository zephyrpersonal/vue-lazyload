export class LazyElement {
  constructor(el, bindings) {
    this.el = el
    this.bindings = bindings
    this.state = 'loading'
  }

  preloadImage = resolve => {
    const image = new Image()
    image.src = this.bindings.value
    image.onload = () => {
      resolve(image)
    }
  }

  render = () => {
    this.preloadImage(image => {
      this.el.setAttribute('src', image.src)
      this.state = 'loaded'
    })
  }

  isElInView = () => {
    const rect = this.el.getBoundingClientRect()
    return (rect.top > 0 && rect.top < window.innerHeight) || (rect.top < 0 && rect.top > -rect.height)
  }

  destroy = () => {
    this.el = null
    this.bindings = null
  }
}

export class LazyLoad {
  constructor(Vue) {
    window.addEventListener('scroll', this.onScroll, { passive: true })
    window.addEventListener('resize', this.onResize, { passive: true })
    this.vue = Vue
  }

  queue = []
  windowHeight = window.innerHeight
  scrollY = -1

  onResize = e => {
    requestAnimationFrame(() => {
      this.windowHeight = window.innerHeight
      this.batchRender()
    })
  }

  onScroll = e => {
    requestAnimationFrame(() => {
      this.scrollY = window.pageYOffset
      this.batchRender()
    })
  }

  batchRender = () => {
    if (!this.queue.length) return
    for (let i = this.queue.length; i--; i >= 0) {
      if (this.queue[i].state === 'loading' && this.queue[i].isElInView()) {
        this.queue[i].render()
      }
    }
  }

  bind = (el, bindings, vNode) => {
    el.setAttribute('src', 'https://media2.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif')
    el.$lazyEl = new LazyElement(el, bindings)
    this.vue.nextTick(() => {
      if (el.$lazyEl.isElInView()) return el.$lazyEl.render()
      this.queue.push(el.$lazyEl)
    })
  }

  update = (el, bindings, vNode, oldNode) => {
    if (bindings.oldValue !== bindings.value) {
      el.$lazyEl.bindings.value = bindings.value
      el.$lazyEl.state = 'loading'
      el.setAttribute('src', 'https://media2.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif')

      if (el.$lazyEl.isElInView()) return el.$lazyEl.render()
    }
  }

  remove = el => {
    el.$lazyEl.destroy()
    el.$lazyEl = null
  }
}
