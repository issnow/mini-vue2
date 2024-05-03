import {createReaderer} from '../runtime-core'

export function createElement(type) {
  return document.createElement(type)
}

export function patchProp(el, prop, prevVal, nextVal) {
  //onclick -> click
  const isOn = (key) => /^on[A-Z]/.test(key)
  if (isOn(prop)) {
    const event = prop.substring(2).toLowerCase()
    el.addEventListener(event, nextVal)
  } else {
    if (nextVal === undefined || nextVal === null) {
      el.removeAttribute(prop)
    } else {
      el.setAttribute(prop, nextVal)
    }
  }
}

export function insert(el, container) {
  container.appendChild(el)
}

export const renderer: any = createReaderer({
  createElement,
  patchProp,
  insert
})

export function createApp(...arr) {
  return renderer.createApp(...arr)
}

export * from '../runtime-core'
