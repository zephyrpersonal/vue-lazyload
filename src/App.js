import Vue from 'vue/dist/vue'
import LazyLoad from './directives/lazyload'

const ImgList = Vue.extend({
  data() {
    return {
      links: new Array(100).fill('https://static1.squarespace.com/static/526a8a82e4b07233cf88d715/t/526d3712e4b0d55c33ac8705/1382889235791/handy.jpg?format=1000w')
    }
  },
  directives: {
    'lazy-load': new LazyLoad(Vue)
  },
  template: `
    <div class="image-list">
      <img v-lazy-load:src="link" :key="index" class="image-item" v-for="(link,index) in links" />
    </div>
  `
})

new Vue({
  el: '#app',
  components: { ImgList },
  render: h => <ImgList />
}).$mount()
