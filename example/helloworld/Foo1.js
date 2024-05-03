import {h, inject, renderSlots, getCurrentInstance} from '../../lib/guide-mini-vue.esm.js'
/*
 */
const Foo = {
  name: 'foo1',
  render() {
    const foo = h('p', {}, 'foo')
    const color = h('p', {}, this.color + this.name)
    //Foo.vnode.children
    //console.log(this.$slots)
    //具名插槽 元素和位置
    //作用域插槽
    const age = 19
    return h('div', {}, [
      //renderSlots(this.$slots, 'header', {
      //  age
      //}),
      foo, color,
      //renderSlots(this.$slots, 'body')
    ])
  },
  setup() {
    //console.log(getCurrentInstance())
    const color = inject('color')
    const name = inject('name', 'guocheng')
    return {
      color,
      name
    }
  }
}

export default Foo