import {createComponentInstance, setupComponent} from "./component";

export function render(vnode, container) {
  //patch
  patch(vnode, container)
}

function patch(vnode, container) {
  //去处理组件
  //判断是不是element类型
  processElement();
  processComponent(vnode, container)
}
function processElement() {

}
function processComponent(vnode, container) {
  mountComponent(vnode, container)
}

function mountComponent(vnode, container) {
  const instance = createComponentInstance(vnode)
  setupComponent(instance)
  setupRenderEffect(instance, container)
}

function setupRenderEffect(instance, container) {
  const substree = instance.render()
  //vnode -> patch
  //vnode -> element -> mountElement
  patch(substree, container)
}