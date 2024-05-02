import {ShapeFlags} from "../shared/shapeFlags";

//将组件或元素转成vnode
export function createVNode(type, props?, children?) {
  const vnode = {
    type,
    props,
    children,//'aa'; [h(), h()]
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
  if(vnode.shapeFlag & ShapeFlags.stateful_component) {
    if(typeof children === 'object') {
      vnode.shapeFlag |= ShapeFlags.slot_children
    }
  }
  return vnode
}

//设置vnode的flag
function getShapeFlag(type) {
  return typeof type === 'string' ? ShapeFlags.element : ShapeFlags.stateful_component
}