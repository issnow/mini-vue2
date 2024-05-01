import {createComponentInstance, setupComponent} from "./component";
//@ts-ignore
import {isObject} from "../shared";

export function render(vnode, container) {
  //patch
  patch(vnode, container)
}

function patch(vnode, container) {
  //去处理组件
  //判断是不是element类型
  if (typeof vnode.type === "string") {
    processElement(vnode, container);
  } else if (isObject(vnode.type)) {
    processComponent(vnode, container)
  }
}

function processElement(vnode, container) {
  //mount
  mountElement(vnode, container)
  //update
}

function processComponent(vnode, container) {
  mountComponent(vnode, container)
}

function mountElement(vnode, container) {
  //element
  const el = vnode.el = document.createElement(vnode.type)
  const {props, children} = vnode
  if (typeof children === 'string') {
    el.textContent = children
  } else if (Array.isArray(children)) {
    mountChildren(children, el)
  }
  for (let prop in props) {
    el.setAttribute(prop, props[prop])
  }
  container.appendChild(el)
}

function mountChildren(children, container) {
  for (let node of children) {
    patch(node, container)
  }
}

function mountComponent(vnode, container) {
  const instance = createComponentInstance(vnode)
  setupComponent(instance)
  setupRenderEffect(instance, vnode, container)
}

function setupRenderEffect(instance, vnode, container) {
  const {proxy} = instance
  const substree = instance.render.call(proxy)

  //vnode -> patch
  //vnode -> element -> mountElement
  patch(substree, container)
  //element mount之后
  vnode.el = substree.el
}