export const extend = Object.assign

export function isObject(val) {
  return typeof val === 'object' && val !== null;
}

export const camelize = str => {
  return str.replace(/-(\w)/g, ($0, $1) => {
    return $1.toUpperCase()
  })
}
export const capitalize = str => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
export const toHandlerKey = str => {
  return str ? 'on' + capitalize(str) : ''
}