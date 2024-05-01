export enum ShapeFlags {
  element = 0b0001,//vnode是元素
  stateful_component = 0b0010,//vnode是组件
  text_children = 0b0100,//vnode的children是一个字符串
  array_children = 0b1000,//vnode的children是数组,表示有多个子元素
}