const publicPropertiesMap = {
  $el: (i) => i.vnode.el
}
//将setup数据挂到render this上
export const publicInstanceProxyHandlers = {
  get({_: instance}, key) {
    //setupState
    if (key in instance.setupState) {
      return instance.setupState[key]
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