import { ReactiveEffect } from "./effect"

class ComputedRefImpl {
  private _getter: any
  private _dirty: boolean = true
  private _value: any
  private _effect: ReactiveEffect
  constructor(getter) {
    this._getter = getter
    this._effect = new ReactiveEffect(getter, () => {
      if (!this._dirty) {
        this._dirty = true
      }
    })
  }

  get value() {
    // get
    // 下次调用 get value -> 设置 dirty true
    // 当依赖的响应式对象的值发生变化的时候 将 dirty 设置为 true
    // effect 收集依赖
    if (this._dirty) {
      this._dirty = false
      this._value = this._effect.run()
    }
    return this._value
  }
}


export function computed(getter) {
  return new ComputedRefImpl(getter)
}