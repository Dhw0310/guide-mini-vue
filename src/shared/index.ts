export const extend = Object.assign

export const isObject = (value) => value !== null && typeof value === 'object'

export const hasChanged = (val, newValue) => {
  return !Object.is(val, newValue)
}