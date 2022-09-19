import { camelize, toHandlerkey } from "../shared/index"

export function emit(instance, event, ...args) {
  const { props } = instance
  console.log('emit' + event)
  // TPP 
  // 先写一个特定行为 -> 重构成通用行为
  // add -> Add add-foo-> addFoo

  const handlerName = toHandlerkey(camelize(event))
  const handle = props[handlerName]
  handle && handle(...args)
}