import {createVNode} from "./vnode";

//生成vnode
export function h(type, props?, children?) {
  return createVNode(type, props, children)
}