import {h} from '../../lib/guide-mini-vue.esm.js'

const Foo = {
  //props: ['name'],
  render() {
    //接收的props可以通过this访问
    //props 是shallowReadonly
    return h('div', {}, 'foo:' + this.name)
  },
  setup(props) {
    console.log(props)
  }
}

export default Foo