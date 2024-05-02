import {camelize, toHandlerKey} from "../shared/index";

export function emit(instance, event: any, ...arr) {
  //instance.props -> event
  // tpp开发,先去写一个特定的行为 -> 再重构
  const {props} = instance
  //add-foo -> addFoo
  //add -> Add
  const handlerName = toHandlerKey(camelize(event))
  const handler = props[handlerName]
  handler && handler(...arr)
}