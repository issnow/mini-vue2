import {h, ref} from '../../lib/guide-mini-vue.esm.js'

const prevChildren = 'old-hello'
const nextChildren = 'new-hello'
export default {
  name: 'texttotext',
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