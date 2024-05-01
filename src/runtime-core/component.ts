//生成组件实例
import {publicInstanceProxyHandlers} from "./componentPublicInstance";

export function createComponentInstance(vnode) {
  const component = {
    vnode,
    type: vnode.type,
    setupState: {},
    render: '',
    proxy: ''
  }
  return component
}

//处理组件setup
export function setupComponent(instance) {
  //initProps
  //initSlots
  setupStatefulComponent(instance)
}

//处理有状态组件setup
function setupStatefulComponent(instance) {
  const Component = instance.type
  instance.proxy = new Proxy(
    {_: instance}, publicInstanceProxyHandlers)
  const {setup} = Component
  if (setup) {
    // function则是render函数 Object则是状态
    const setupRes = setup()
    handleSetupResult(instance, setupRes)
  }
}

//处理setup的返回值,并存入instance
function handleSetupResult(instance, setupres) {
  // function则是render函数 Object则是状态
  // todo function
  if (typeof setupres === 'object') {
    instance.setupState = setupres
  }
  finishComponentSetup(instance)
}

//将组件的render函数存入instance中
function finishComponentSetup(instance) {
  const Component = instance.type
  if (Component.render) {
    instance.render = Component.render
  }
}