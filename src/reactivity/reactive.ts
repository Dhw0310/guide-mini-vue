import { mutableHandlers, readonlyHandlers } from "./baseHandler"

export const enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive',
  IS_READONLY = '__v_isReadonly',
}

export function reactive(raw) {
  return createActionObject(raw, mutableHandlers)
}
export function readonly(raw) {
  return createActionObject(raw, readonlyHandlers)
}
export function isReadonly(value) {
  return !!value[ReactiveFlags.IS_READONLY]
}
export function isReactive(value) {
  return !!value[ReactiveFlags.IS_REACTIVE]
}
function createActionObject(raw: any, baseHandler) {
  return new Proxy(raw, baseHandler)
}
