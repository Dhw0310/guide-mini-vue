export const extend = Object.assign

export const isObject = (value) => value !== null && typeof value === 'object'

export const hasChanged = (val, newValue) => {
  return !Object.is(val, newValue)
}
export const hasOwn = (val, key) => Object.prototype.hasOwnProperty.call(val, key)

export const camelize = (str: string) => {
  return str.replace(/-(\w)/g, (_, c) => {
    return c ? c.toLocaleUpperCase() : ''
  })
}
export const capitalize = (str: string) => {
  return str.charAt(0).toLocaleUpperCase() + str.slice(1)
}
export const toHandlerkey = (str: string) => {
  return str ? 'on' + capitalize(str) : ''
}