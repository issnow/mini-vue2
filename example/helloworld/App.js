import {h} from '../../lib/guide-mini.vue.esm'

export const App = {
  //template
  render() {
    //ui
    return h('div', 'hi,' + this.msg);
  },
  setup() {
    //composition api
    return {
      msg: 'mini-vue'
    }
  }
}