import {h, createTextVNode, getCurrentInstance} from '../../lib/guide-mini-vue.esm.js'
import Foo from './Foo1.js'
/*
1.实现slot功能
 */

window.self = null
const App = {
  name: "App1",
  render() {
    window.self = this
    const app = h('div', {}, "App")

    //slot就是children
    //const foo = h(Foo, {}, [h('p', {}, 'slot1'),h('p', {}, 'slot2')])
    //const foo = h(Foo, {}, h('p', {}, 'slot1'))

    //将slot变成对象形式
    const foo = h(Foo, {}, {
      header: ({age}) => [h('p', {}, 'header' + age), createTextVNode('hello world')],
      body: () => h('p', {}, 'body')
    })

    return h('div', {}, [app, foo])
  },
  setup() {
    const instance = getCurrentInstance()
    console.log('instance', instance)
    return {}
  }
}
export default App;