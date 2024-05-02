import {h} from '../../lib/guide-mini-vue.esm.js'
import Foo from './Foo.js'

window.self = null
const App = {
  components: {
    Foo,
  },
  //template
  render() {
    window.self = this
    //ui
    return h('div', {
        id: 'box', class: ['c1', 'c2'], onClick() {
          //console.log('click')
        }, onMouseDown() {
          //console.log('onMouseDown')
        }
      }, // this.$el, setupState, this.$data
      //'hi,' + this.msg
      //[h('p', {class: 'p1'}, 'hi p1'), h('p', {class: 'p2'}, 'hi p2')]
      [h('div', {}, 'hi' + this.msg), h(Foo, {
        name: 'guocheng',
        onAdd(v) {
          console.log('onAdd', v)
        },
        onAddFoo(a, b) {
          console.log(a, b)
        }
      })]
    );
  },
  setup() {
    //composition api
    return {
      msg: 'mini-vue~~'
    }
  }
}
export default App;