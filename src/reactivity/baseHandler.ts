import { isObject } from "../shared"
import { track, trigger } from "./effect"
import { reactive, ReactiveFlags, readonly } from "./reactive"

const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)
function createGetter(isReadonly = false) {
  return function get(target, key) {
    const res = Reflect.get(target, key)

    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly
    }

    // 看看 res 是不是 object 是的话再调用 reactive 并 return 出去
    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res)
    }
    if (!isReadonly) {

      // TODO 收集依赖
      track(target, key)
    }
    return res
  }
}
function createSetter() {
  return function set(target, key, value) {

    const res = Reflect.set(target, key, value)

    // TODO 触发依赖
    trigger(target, key)
    return res
  }
}
export const mutableHandlers = {
  get,
  set
}


export const readonlyHandlers = {
  get: readonlyGet,
  set(target, key, value) {
    console.warn(`key :"${String(key)}" set 失败，因为 target 是 readonly 类型`,
      target)
    return true
  }
}