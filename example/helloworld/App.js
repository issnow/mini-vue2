import {h} from '../../lib/guide-mini-vue.esm.js'

window.self = null
const App = {
  //template
  render() {
    window.self = this
    //ui
    return h('div', {
        id: 'box', class: ['c1', 'c2'], onClick() {
          console.log('click')
        }, onMouseDown() {
          console.log('onMouseDown')
        }
      }, // this.$el, setupState, this.$data
      'hi,' + this.msg
      //[h('p', {class: 'p1'}, 'hi p1'), h('p', {class: 'p2'}, 'hi p2')]
    );
  }, setup() {
    //composition api
    return {
      msg: 'mini-vue~~'
    }
  }
}
export default App;