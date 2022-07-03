class ReactiveEffect {
  private _fn: any;
  constructor(fn: any, public scheduler?: Function | undefined) {
    this._fn = fn
    this.scheduler = scheduler
  }
  run() {
    activeEffect = this
    return this._fn()
  }
}

const targetMap = new Map()
export function track(target, key) {
  // target -> key -> dep
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }

  let dep = depsMap.get(key)
  if (!dep) {
    dep = new Set()
    depsMap.set(key, dep)
  }

  dep.add(activeEffect)
}
export function trigger(target, key) {
  const depsMap = targetMap.get(target)
  const dep = depsMap.get(key)

  for (const effect of dep) {
    if (effect.sheduler) {
      effect.scheduler()
    } else {
      effect.run()
    }
  }
}
type eddectOptions = {
  scheduler?: Function
}
let activeEffect;
export function effect(fn, options: eddectOptions = {}) {
  const _effect = new ReactiveEffect(fn, options.scheduler)
  _effect.run()
  const runner = _effect.run.bind(_effect)
  return runner
}