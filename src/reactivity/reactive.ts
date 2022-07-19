import { mutableHandlers, readonlyHandlers } from "./baseHandler"

export function reactive(raw) {
  return createActionObject(raw, mutableHandlers)
}
export function readonly(raw) {
  return createActionObject(raw, readonlyHandlers)
}

function createActionObject(raw: any, baseHandler) {
  return new Proxy(raw, baseHandler)
}
