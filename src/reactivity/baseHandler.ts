import { extend, isObject } from "../shared/index"
import { track, trigger } from "./effect"
import { reactive, ReactiveFlags, readonly } from "./reactive"

const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)
const shallowReadonlyGet = createGetter(true, true)

function createGetter(isReadonly = false, shallow = false) {
  return function get(target, key) {
    const res = Reflect.get(target, key)

    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly
    }
    // 如果是isShallow状态，直接返回结果
    if (shallow) {
      return res
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
  set(target, key) {
    console.warn(`key :"${String(key)}" set 失败，因为 target 是 readonly 类型`,
      target)
    return true
  }
}

export const shallowReadonlyHandlers = extend({}, readonlyHandlers, {
  get: shallowReadonlyGet
})