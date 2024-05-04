import {publicInstanceProxyHandlers} from "./componentPublicInstance";
import {initProps} from "./componentProps";
import {shallowReadonly} from "../reactivity/reactive";
import {emit} from "./componentEmit";
import {initSlots} from "./componentSlots";
import {proxyRefs} from "../reactivity";
/*
1.只有组件才有组件实例
每个元素有对应的vnode
 */

//生成组件实例
export function createComponentInstance(vnode, parent) {
  console.log("parent", parent)
  const instance = {
    vnode,
    //对于组件来说type就是大对象,对于元素来说,type就是字符串,例'div'
    type: vnode.type,
    setupState: {},
    render: '',
    proxy: '',
    //mount update两阶段
    isMounted: true,
    props: {},
    slots: {},
    emit: () => {
    },
    provides: parent ? parent.provides : {},
    parent,
    //children节点
    subtree: {},
    next: null,//下次更新的虚拟节点
  }
  instance.emit = emit.bind(null, instance) as any
  return instance
}

//组件添加props、slots,处理setup函数
export function setupComponent(instance) {
  //initProps
  initProps(instance, instance.vnode.props)
  //initSlots
  initSlots(instance, instance.vnode.children)
  setupStatefulComponent(instance)
}

//处理有状态组件setup
function setupStatefulComponent(instance) {
  const Component = instance.type
  instance.proxy = new Proxy(
    {_: instance}, publicInstanceProxyHandlers)
  const {setup} = Component
  if (setup) {
    setCurrentInstance(instance)
    // function则是render函数 Object则是状态
    //将props传入
    const setupRes = setup(shallowReadonly(instance.props), {
      emit: instance.emit
    })
    setCurrentInstance(null)
    handleSetupResult(instance, setupRes)
  }
}

//处理setup的返回值,并存入instance
function handleSetupResult(instance, setupres) {
  // function则是render函数 Object则是状态
  // todo function
  if (typeof setupres === 'object') {
    //可以直接在template中使用数据,而不是.value获取
    instance.setupState = proxyRefs(setupres)
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

let currentInstance = null

export function getCurrentInstance() {
  return currentInstance
}

export function setCurrentInstance(instance) {
  currentInstance = instance
}