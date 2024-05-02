import {mutableHandler, readonlyHandler, shallowReadonlyHandler} from "./baseHandlers";
import {isObject} from "../shared";

export const enum ReactiveFlag {
  IS_REACTIVE = '__v_isreactive', IS_READONLY = '__v_isreadonly'
}

export function reactive(raw) {
  return createActiveObject(raw, mutableHandler)
}

export function readonly(raw) {
  return createActiveObject(raw, readonlyHandler);
}

export function shallowReadonly(raw) {
  return createActiveObject(raw, shallowReadonlyHandler);
}

export function isReactive(raw) {
  return !!raw[ReactiveFlag.IS_REACTIVE]
}


export function isReadonly(raw) {
  return !!raw[ReactiveFlag.IS_READONLY]
}

function createActiveObject(raw, handler) {
  if(!isObject(raw)) {
    console.warn(raw+"必须是一个对象")
    return raw
  }
  return new Proxy(raw, handler);
}