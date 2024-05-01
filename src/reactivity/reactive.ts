import {mutableHandler, readonlyHandler, shallowReadonlyHandler} from "./baseHandlers";

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
  return new Proxy(raw, handler);
}