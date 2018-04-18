import Vue from 'vue/dist/vue'
import LazyLoad from '../src/index'

Vue.use(LazyLoad)

const ImgList = Vue.extend({
  data() {
    return {
      links: new Array(20).fill('https://picsum.photos/200/256?random')
    }
  },
  methods: {
    add() {
      this.links = this.links.concat(this.links)
    }
  },
  template: `
    <div>
      <h1>DEMO</h1>
      <div class="image-list">
        <div class="image-item" :key="index" v-for="(link,index) in links">
          <img v-lazy-load:src="link + index"  />
        </div>
      </div>
    </div>
  `
})

new Vue({
  el: '#app',
  components: { ImgList },
  render: h => <ImgList />
}).$mount()
