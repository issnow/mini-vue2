export function createVNode(type, props?, children?) {
  const vnode = {
    type,
    props,
    //'aa'; [h(), h()]
    children,
    el:null
  }
  return vnode
}