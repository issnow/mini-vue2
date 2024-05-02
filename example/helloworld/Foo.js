import {h} from '../../lib/guide-mini-vue.esm.js'
/*
1.实现props
2.实现emit
 */
const Foo = {
  //props: ['name'],
  render() {
    const btn = h('button', {
      onClick: this.emitAdd
    }, 'emitAdd')
    const foo = h('p', {}, 'foo')

    //接收的props可以通过this访问
    //props 是shallowReadonly
    //return h('div', {}, 'foo:' + this.name)

    return h('div', {}, [btn, foo])
  },
  setup(props, {emit}) {
    console.log(props)
    const emitAdd = () => {
      console.log('emit add')
      emit('add', 123)
      emit('add-foo', 2, 3)
    }
    return {
      emitAdd
    }
  }
}

export default Foo