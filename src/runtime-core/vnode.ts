export function createVNode(type, props?, children?) {
  const vnode = {
    type,
    props,
    //'aa'; [h(), h()]
    children
  }
  return vnode
}