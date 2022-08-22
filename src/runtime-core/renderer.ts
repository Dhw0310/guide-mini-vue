import { createComponentInstance, setupComponent } from "./component"

export function render(vnode, container) {
  // 调用 patch 方法
  patch(vnode, container)
}
function patch(vnode: any, container: any) {
  // 去处理组件

  processComponent(vnode, container)
}
function processComponent(vnode: any, container: any) {
  mountComponent(vnode, container)
}
function mountComponent(vnode: any, container: any) {
  // 创建组件实例
  const instance = createComponentInstance(vnode)

  setupComponent(instance)

  setupRenderEffect(instance, container)
}

function setupRenderEffect(instance: any, container: any) {
  const subTree = instance.render()
  // vnode -> patch
  // vnode -> element -> mountElement
  patch(subTree, container)
}