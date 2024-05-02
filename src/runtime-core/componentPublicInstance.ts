const publicPropertiesMap = {
  $el: (i) => i.vnode.el,
  $slots: (i) => i.slots
}
//将setup数据挂到render this上
export const publicInstanceProxyHandlers = {
  get({_: instance}, key) {
    //setupState props
    const {setupState, props} = instance
    const hasOwn = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key)
    if (hasOwn(setupState, key)) {
      return setupState[key]
    } else if (hasOwn(props, key)) {
      return props[key]
    }
    //key == $el
    //if(key === '$el') {
    //  return instance.vnode.el
    //} ⬇️
    const publicGetter = publicPropertiesMap[key]
    if (publicGetter) {
      return publicGetter(instance)
    }
    //$data; setup -> options data

  }
}