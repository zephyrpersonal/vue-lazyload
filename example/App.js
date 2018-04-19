import Vue from 'vue/dist/vue'
import LazyLoad from '../bundle'
import { random } from 'lodash'

Vue.use(LazyLoad, {
  loading: 'https://media2.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif',
  onLoadClassName: 'loaded'
})

const ImgList = Vue.extend({
  data() {
    return {
      links: new Array(20).fill('https://picsum.photos/200/256?random').map((link, index) => link + random(0, 1000))
    }
  },
  methods: {
    add() {
      this.links = this.links.concat(this.links)
    },
    shuffle() {
      this.links = this.links.map(link => link.replace(/random(\d+)/, 'random' + random(0, 1000)))
    }
  },
  template: `
    <div>
      <h1>DEMO</h1>
      <div>
        <button @click="shuffle">shuffle</button>
      </div>
      <div class="image-list">
        <div class="image-item" :key="index" v-for="(link,index) in links">
          <img v-lazy-load:src="link" />
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
