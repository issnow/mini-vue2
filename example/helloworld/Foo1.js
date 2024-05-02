import {h, renderSlots, getCurrentInstance} from '../../lib/guide-mini-vue.esm.js'
/*
 */
const Foo = {
  name: 'foo1',
  render() {
    const foo = h('p', {}, 'foo')
    //Foo.vnode.children
    //console.log(this.$slots)
    //具名插槽 元素和位置
    //作用域插槽
    const age = 19
    return h('div', {}, [
      renderSlots(this.$slots, 'header', {
        age
      }),
      foo, renderSlots(this.$slots, 'body')])
  },
  setup() {
    console.log(getCurrentInstance())
    return {}
  }
}

export default Foo