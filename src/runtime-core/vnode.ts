import {ShapeFlags} from "../shared/shapeFlags";

export const Fragment = Symbol('Fragment');
export const Text = Symbol('Text');

//将组件或元素转成vnode
export function createVNode(type, props?, children?) {
  const vnode = {
    type,
    props,
    children,//'aa'; [h(), h()]
    //当前节点的容器元素
    el: null,
    //表示当前vnode的类型以及children的类型
    shapeFlag: getShapeFlag(type)
  }
  //children
  if (typeof children === 'string') {
    vnode.shapeFlag |= ShapeFlags.text_children
  } else if (Array.isArray(children)) {
    vnode.shapeFlag |= ShapeFlags.array_children
  }

  //处理组件无插槽
  if (vnode.shapeFlag & ShapeFlags.stateful_component) {
    if (typeof children === 'object') {
      vnode.shapeFlag |= ShapeFlags.slot_children
    }
  }
  return vnode
}

//设置vnode的flag
function getShapeFlag(type) {
  return typeof type === 'string' ? ShapeFlags.element : ShapeFlags.stateful_component
}

export function createTextVNode(text) {
  return createVNode(Text, {}, text)
}