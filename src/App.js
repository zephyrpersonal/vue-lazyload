import Vue from 'vue/dist/vue'
import LazyLoad from './directives/lazyload'

const ImgList = Vue.extend({
  data() {
    return {
      links: new Array(100).fill('https://picsum.photos/200/50?random')
    }
  },
  methods: {
    add() {
      this.links = this.links.concat(this.links)
    }
  },
  directives: {
    'lazy-load': new LazyLoad()
  },
  template: `
    <div>
      <button @click="add">add</button>
      <div class="image-list">
        <img v-lazy-load:src="link + index" :key="index" class="image-item" v-for="(link,index) in links" />
      </div>
    </div>
  `
})

new Vue({
  el: '#app',
  components: { ImgList },
  render: h => <ImgList />
}).$mount()
