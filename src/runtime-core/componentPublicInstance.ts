const publicPropertiesMap = {
  //访问组件的$el,$slots,$props,就直接访问组件实例上的属性
  $el: (i) => i.vnode.el,
  $slots: (i) => i.slots,
  $props: (i) => i.props
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