import {createComponentInstance, setupComponent} from "./component";
//@ts-ignore
import {ShapeFlags} from "../shared/shapeFlags";
import {Fragment, Text} from "./vnode";

//根据vnode和container渲染
export function render(vnode, container) {
  //patch
  patch(vnode, container)
}

function patch(vnode, container) {
  //去处理组件
  //shapeFlags vnode-> flag
  //string -> element
  //object -> 组件
  const {shapeFlag, type} = vnode

  //Fragment -> 只渲染children

  switch (type) {
    case Fragment:
      processFragment(vnode, container)
      break;
    case Text:
      processText(vnode, container)
      break;
    default:
      //判断是不是element类型
      if (shapeFlag & ShapeFlags.element) {
        processElement(vnode, container);
      } else if (shapeFlag & ShapeFlags.stateful_component) {
        processComponent(vnode, container)
      }
  }
}

function processFragment(vnode, container) {
  mountChildren(vnode.children, container)
}

function processText(vnode, container) {
  const text = vnode.el = document.createTextNode(vnode.children)
  container.appendChild(text)
}

//处理元素类型
function processElement(vnode, container) {
  //mount
  mountElement(vnode, container)
  //update
}

//处理组件类型
function processComponent(vnode, container) {
  mountComponent(vnode, container)
}

//元素类型-mount阶段,构建dom,添加文本和属性,递归处理children
function mountElement(vnode, container) {
  //element
  const el = vnode.el = document.createElement(vnode.type)
  const {props, children, shapeFlag} = vnode
  //children text 或者 array
  if (shapeFlag & ShapeFlags.text_children) {
    el.textContent = children
  } else if (shapeFlag & ShapeFlags.array_children) {
    mountChildren(children, el)
  }
  for (let prop in props) {
    //onclick -> click
    const isOn = (key) => /^on[A-Z]/.test(key)
    if (isOn(prop)) {
      const event = prop.substring(2).toLowerCase()
      el.addEventListener(event, props[prop])
    } else {
      el.setAttribute(prop, props[prop])
    }
  }
  container.appendChild(el)
}

function mountChildren(children, container) {
  for (let node of children) {
    patch(node, container)
  }
}

//组件类型-生成实例,处理数据
function mountComponent(vnode, container) {
  const instance = createComponentInstance(vnode)
  setupComponent(instance)
  setupRenderEffect(instance, vnode, container)
}

//主要递归处理render内容,也就是subtree
function setupRenderEffect(instance, vnode, container) {
  const {proxy} = instance
  const subtree = instance.render.call(proxy)

  //vnode -> patch
  //vnode -> element -> mountElement
  patch(subtree, container)
  //element mount之后
  vnode.el = subtree.el
}