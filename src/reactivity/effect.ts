import { extend } from "../shared";

class ReactiveEffect {
  private _fn: any;
  deps = [];
  active = true
  onStop?: () => void
  constructor(fn: any, public scheduler?: Function | undefined) {
    this._fn = fn
    this.scheduler = scheduler
  }
  run() {
    activeEffect = this
    return this._fn()
  }
  stop() {
    if (this.active) {
      cleanupEffect(this)
      if (this.onStop) {
        this.onStop()
      }
      this.active = false
    }
  }
}
function cleanupEffect(effect) {
  effect.deps.forEach((dep: any) => {
    dep.delete(effect)
  })
}
// 存储副作用函数的桶
const targetMap = new Map()
export function track(target, key) {
  // target -> key -> dep
  // 根据 target 从 桶 中取得 depsMap, 它也是一个 Map 类型：key --> effects
  let depsMap = targetMap.get(target)
  // 如果不存在 depsMap，新建一个 Map 并与 target 关联
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }
  // 再根据 key 从 depsMap 中取得 effects，它是一个 Set 类型，里边存储着所有与当前 key 相关联的副作用函数：effect
  let deps = depsMap.get(key)
  if (!deps) {
    deps = new Set()
    depsMap.set(key, deps)
  }

  // 如果没有 activeEffect 直接 ruturn 如果单纯只是 get 操作，不会触发 trigger 所以 activeEffect 为 undefined 
  if (!activeEffect) return
  // 将当前激活的副作用函数添加到 桶 中
  deps.add(activeEffect)
  activeEffect.
    deps.push(deps)
}
export function trigger(target, key) {
  // 根据 target 从 桶 中取得 depsMap， 它是 key --> effects
  const depsMap = targetMap.get(target)
  // 根据 key 取得所有副作用函数 effects
  const deps = depsMap.get(key)

  for (const effect of deps) {
    if (effect.scheduler) {
      effect.scheduler()
    } else {
      effect.run()
    }
  }
}

// 用一个全局变量存储被注册的effect副作用函数
let activeEffect;
// effect 函数用于注册副作用函数
export function effect(fn, options: any = {}) {
  const _effect = new ReactiveEffect(fn, options.scheduler)
  // options
  // Object.assign(_effect, options)
  // extend
  extend(_effect, options)
  // _effect.onStop = options.onStop
  _effect.run()
  const runner: any = _effect.run.bind(_effect)
  runner.effect = _effect
  return runner
}
export function stop(runner) {
  runner.effect.stop()
}