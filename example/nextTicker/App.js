import {h, ref, nextTick,getCurrentInstance} from "../../lib/guide-mini-vue.esm.js";
import NextTicker from "./NextTicker.js";

export default {
  name: "App",
  setup() {
    const ins = getCurrentInstance()
    const count = ref(1)
    const onClick = () => {
      for (let i = 0; i < 100; i++) {
        count.value = i
      }
      debugger
      console.log(ins);
      nextTick(()=>{
        console.log(ins);
      })
    }

    return {
      count,
      onClick
    }
  },

  render() {
    return h("div", {tId: 1}, [
      h("p", {}, "主页" + this.count),
      h('button', {
        onClick: this.onClick
      }, 'click'),
      h(NextTicker)
    ]);
  },
};
