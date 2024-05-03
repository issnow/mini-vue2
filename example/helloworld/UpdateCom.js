import {h, ref} from '../../lib/guide-mini-vue.esm.js'

const App = {
  setup(){
    const count = ref(0)
    const onClick = ()=>{
      count.value++
    }
    return {
      count,
      onClick
    }
  },
  render(){
    return h(
      'div',
      {
        id:'box'
      },
      [
        //读数据,触发get函数,依赖收集
        h('div', {}, 'count:'+ this.count),
        h(
          'button',
          {
            onClick: this.onClick
          },
          'click'
        )
      ]
    )
  }
}
export default App