import {h, ref} from '../../lib/guide-mini-vue.esm.js'

const App = {
  setup() {
    const count = ref(0)
    const onClick = () => {
      count.value++
    }
    const props = ref({
      foo: 'foo',
      bar: 'bar'
    })
    //值更新
    const onChangePropsDemo1 = () => {
      props.value.foo = 'new-foo'
    }
    //值变成undefined
    const onChangePropsDemo2 = () => {
      props.value.foo = undefined
    }
    //值没了
    const onChangePropsDemo3 = () => {
      props.value = {
        foo: 'foo',
      }
    }
    return {
      count,
      props,
      onClick,
      onChangePropsDemo1,
      onChangePropsDemo2,
      onChangePropsDemo3,
    }
  },
  render() {
    return h(
      'div',
      {
        id: 'box',
        ...this.props//一定要使用变量
      },
      [
        //读数据,触发get函数,依赖收集
        h('div', {}, 'count:' + this.count),
        h(
          'button',
          {
            onClick: this.onClick
          },
          'click'
        ),

        h(
          'button',
          {
            onClick: this.onChangePropsDemo1
          },
          '值更新'
        ),

        h(
          'button',
          {
            onClick: this.onChangePropsDemo2
          },
          '值变成undefined'
        ),

        h(
          'button',
          {
            onClick: this.onChangePropsDemo3
          },
          'bar值没了'
        ),
      ]
    )
  }
}
export default App