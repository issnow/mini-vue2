import {track, trigger} from "./effect";
import {reactive, ReactiveFlag, readonly} from "./reactive";
//@ts-ignore
import {extend, isObject} from "../shared";

const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)
const shallowReadonlyGet = createGetter(true, true)

function createGetter(readOnly: boolean = false, shallow = false) {
  return function get(target, key) {
    if (key === ReactiveFlag.IS_REACTIVE) {
      return !readOnly
    } else if (key === ReactiveFlag.IS_READONLY) {
      return readOnly
    }
    const res = Reflect.get(target, key)

    if (shallow) {
      return res
    }

    //看看res是不是object
    if (isObject(res)) {
      return readOnly ? readonly(res) : reactive(res)
    }

    //依赖收集
    if (!readOnly) {
      track(target, key)
    }
    return res
  }
}


function createSetter() {
  return (target, key, value) => {
    const res = Reflect.set(target, key, value)
    //触发依赖
    trigger(target, key);
    return res
  }
}

export const mutableHandler = {
  get,
  set
};
export const readonlyHandler = {
  get: readonlyGet,
  set(target, key, value) {
    return true
  }
};
export const shallowReadonlyHandler = extend({}, readonlyHandler, {get: shallowReadonlyGet})
