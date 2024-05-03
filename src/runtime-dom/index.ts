import {createReaderer} from '../runtime-core'
export function createElement(type){
  return document.createElement(type)
}
export function patchProp(el, prop, value){
  //onclick -> click
  const isOn = (key) => /^on[A-Z]/.test(key)
  if (isOn(prop)) {
    const event = prop.substring(2).toLowerCase()
    el.addEventListener(event, value)
  } else {
    //el.setAttribute(prop, props[prop])
  }
}
export function insert(el,container){
  container.appendChild(el)
}

export const renderer:any = createReaderer({
  createElement,
  patchProp,
  insert
})

export function createApp(...arr){
  return renderer.createApp(...arr)
}
export * from '../runtime-core'
