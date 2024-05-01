import {h} from '../../lib/guide-mini-vue.esm.js'

const App = {
  //template
  render() {
    //ui
    return h(
      'div',
      {id: 'box', class: ['c1', 'c2']},
      //'hi,' + this.msg
      [h('p', {class: 'p1'}, 'hi p1'), h('p', {class: 'p2'}, 'hi p2')]
    );
  },
  setup() {
    //composition api
    return {
      msg: 'mini-vue'
    }
  }
}
export default App;