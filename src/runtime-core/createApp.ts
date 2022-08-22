import { render } from "./renderer"
import { createVNode } from "./vnode"

// 接收根组件
export function createApp(rootComponent) {
  return {
    mount(rootContainer) {
      // 先转化 vnode
      // component -> vnode
      // 所有逻辑操作都会基于 vnode 做处理

      const vnode = createVNode(rootComponent)

      render(vnode, rootContainer)
    }
  }
}
