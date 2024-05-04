import {h, ref} from '../../lib/guide-mini-vue.esm.js'
import Child from './Child.js'
// 在 render 中使用 proxy 调用 emit 函数
// 也可以直接使用 this
// 验证 proxy 的实现逻辑
const App = {
  name: "App",
  setup() {
    const msg = ref('123')
    const count = ref(1)
    window.msg = msg
    const changeChildProps = () => {
      msg.value = '456'
    }
    const changeCount = () => {
      count.value++
    }
    return {
      count,
      msg,
      changeCount,
      changeChildProps
    }
  },
  render() {
    return h("div", {}, [
      h("div", {}, `count: ${this.count}`),
      h(
        "button",
        {
          onClick: this.changeChildProps,
        },
        "change child props"
      ),
      h(Child, {
        msg: this.msg,
      }),
      h('button', {
        onClick: this.changeCount,
      }, 'change self count')
    ]);
  }
}
export default App