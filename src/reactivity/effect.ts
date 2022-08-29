import { extend } from "../shared/index";

// 用一个全局变量存储被注册的effect副作用函数
let activeEffect;
let shouldTrack;
export class ReactiveEffect {
  private _fn: any;
  deps = [];
  active = true
  onStop?: () => void
  constructor(fn: any, public scheduler?: Function | undefined) {
    this._fn = fn
    this.scheduler = scheduler
  }
  run() {
    if (!this.active) {
      return this._fn()
    }
    shouldTrack = true
    activeEffect = this
    const result = this._fn()
    // reset
    shouldTrack = false
    return result
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
  effect.deps.length = 0
}
// 存储副作用函数的桶
const targetMap = new Map()
export function track(target, key) {
  if (!isTracking()) return
  // target -> key -> dep
  // 根据 target 从 桶 中取得 depsMap, 它也是一个 Map 类型：key --> effects
  let depsMap = targetMap.get(target)
  // 如果不存在 depsMap，新建一个 Map 并与 target 关联
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }
  // 再根据 key 从 depsMap 中取得 effects，它是一个 Set 类型，里边存储着所有与当前 key 相关联的副作用函数：effect
  let dep = depsMap.get(key)
  if (!dep) {
    dep = new Set()
    depsMap.set(key, dep)
  }
  trackEffects(dep)
}
export function trackEffects(dep) {
  // 将当前激活的副作用函数添加到 桶 中
  // 如果已经在桶中了，不需要再添加
  if (dep.has(activeEffect)) return
  dep.add(activeEffect)
  activeEffect.
    deps.push(dep)
}
export function isTracking() {
  // 如果没有 activeEffect 直接 ruturn 如果单纯只是 get 操作，不会触发 trigger 所以 activeEffect 为 undefined 
  // if (!activeEffect) return
  // if (!shouldTrack) return
  return shouldTrack && activeEffect !== undefined
}
export function trigger(target, key) {
  // 根据 target 从 桶 中取得 depsMap， 它是 key --> effects
  const depsMap = targetMap.get(target)
  // 根据 key 取得所有副作用函数 effects
  const dep = depsMap.get(key)
  triggerEffects(dep)
}
export function triggerEffects(dep) {
  for (const effect of dep) {
    if (effect.scheduler) {
      effect.scheduler()
    } else {
      effect.run()
    }
  }
}


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