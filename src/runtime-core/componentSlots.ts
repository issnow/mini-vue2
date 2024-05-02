//把slots,其实就是子组件的children,挂载到子组件的slots属性上
import {ShapeFlags} from "../shared/shapeFlags";

export function initSlots(instance, children) {
  const {vnode} = instance;
  //当前组件有slot才处理
  if (vnode.shapeFlag & ShapeFlags.slot_children) {
    //instance.slots = Array.isArray(children) ? children : [children];
    const slots = {}
    for (const key in children) {
      const value = children[key];
      slots[key] = (props)=>normalizeSlotValue(value(props))
    }
    instance.slots = slots;
  }
}

function normalizeSlotValue(value) {
  return Array.isArray(value) ? value : [value];
}