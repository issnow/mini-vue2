import {getCurrentInstance} from "./component";

export function provide(key, value) {
  const current: any = getCurrentInstance()
  if (current) {
    let {provides} = current
    const parentProvides = current.parent?.provides
    //console.log('parentProvides', parentProvides)
    // init
    // 这里要解决一个问题
    // 当父级 key 和 爷爷级别的 key 重复的时候，对于子组件来讲，需要取最近的父级别组件的值
    // 那这里的解决方案就是利用原型链来解决
    // provides 初始化的时候是在 createComponent 时处理的，当时是直接把 parent.provides 赋值给组件的 provides 的
    // 所以，如果说这里发现 provides 和 parentProvides 相等的话，那么就说明是第一次做 provide(对于当前组件来讲)
    // 我们就可以把 parent.provides 作为 currentInstance.provides 的原型重新赋值
    // 至于为什么不在 createComponent 的时候做这个处理，可能的好处是在这里初始化的话，是有个懒执行的效果（优化点，只有需要的时候在初始化）
    console.log(JSON.stringify(provides))
    if(provides === parentProvides) {
      provides = current.provides = Object.create(parentProvides)
    }
    provides[key] = value
  }
}

export function inject(key, defaultValue) {
  const current: any = getCurrentInstance()
  if (current) {
    let parentProvides = current.parent?.provides
    if (key in parentProvides) {
      return parentProvides[key]
    } else if (defaultValue) {
      return defaultValue
    }
  }
}