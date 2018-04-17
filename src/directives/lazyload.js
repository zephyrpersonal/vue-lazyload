import Vue from 'vue'

const revealImage = element => {
  element.el.display = 'none'
  element.el.src = element.src
  element.el.display = 'block'
}

export default class LazyLoad {
  constructor() {
    this.elements = []
    this.windowHeight = window.innerHeight
    this.scrollY = -1

    return this.directive()
  }

  directive() {
    window.addEventListener('scroll', this.onScroll.bind(this), { passive: true })
    window.addEventListener('resize', this.onResize.bind(this), { passive: true })

    return {
      bind(el, bindings) {},
      inserted: (el, bindings) => {
        Vue.nextTick(() => {
          let element = {
            el,
            src: bindings.value,
            clientRect: el.getBoundingClientRect()
          }
          if (this.isElInView(element)) {
            revealImage(element)
            element = null
            return
          }
          this.elements.push(element)
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
    const offsetTop = element.clientRect.top
    return this.windowHeight + this.scrollY >= offsetTop && offsetTop >= this.scrollY
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
