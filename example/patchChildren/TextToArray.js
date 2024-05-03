import {h, ref} from '../../lib/guide-mini-vue.esm.js'

const prevChildren = 'hello'
const nextChildren = [h('div', {}, "A"), h('div', {}, "B"), h('div', {}, "C")]
export default {
  name: 'texttoArray',
  setup() {
    const isChange = ref(false)
    window.isChange = isChange
    return {
      isChange
    }
  },
  render() {
    const self = this
    return self.isChange === true ?
      h('div', {}, nextChildren) :
      h('div', {}, prevChildren)
  }
}