const revealImage = element => {
  element.el.display = 'none'
  element.el.src = element.src
  element.el.display = 'block'
}

const elOffsetDoc = el => {
  let offsetParent = el.offsetParent
  let offsetTop = el.offsetTop
  while (offsetParent) {
    offsetTop += offsetParent.offsetTop
    offsetParent = offsetParent.offsetParent
  }
  return offsetTop
}

export default class LazyLoad {
  constructor(Vue) {
    this.elements = []
    this.windowHeight = window.innerHeight
    this.scrollY = -1

    return this.directive(Vue)
  }

  directive(Vue) {
    window.addEventListener('scroll', this.onScroll.bind(this), { passive: true })
    window.addEventListener('resize', this.onResize.bind(this), { passive: true })
    const elements = this.elements
    return {
      bind(el, bindings) {},
      inserted(el, bindings, vnode) {
        Vue.nextTick(() => {
          elements.push({
            src: bindings.value,
            offsetTop: elOffsetDoc(el),
            el
          })
        })
      },
      update(el, bindings) {
        if (bindings.oldValue !== bindings.value) {
          console.log(bindings.value)
        }
      }
    }
  }

  onScroll(e) {
    if (!this.elements.length) return
    requestAnimationFrame(() => {
      this.scrollY = window.pageYOffset
      this.refreshEls()
    })
  }

  onResize(e) {}

  isElInView(element) {
    return this.windowHeight + this.scrollY >= element.offsetTop && element.offsetTop >= this.scrollY
  }

  refreshEls() {
    for (let i = this.elements.length; i--; i >= 0) {
      if (this.isElInView(this.elements[i])) {
        revealImage(this.elements[i])
        this.elements.splice(i, 1)
      }
    }
  }
}
