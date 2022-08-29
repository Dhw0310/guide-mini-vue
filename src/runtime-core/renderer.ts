import { createComponentInstance, setupComponent } from "./component"

export function render(vnode, container) {
  // 调用 patch 方法
  patch(vnode, container)
}
function patch(vnode: any, container: any) {
  // 去处理组件
  // TODO 判断vnode 是不是一个 element
  // 是 element 那么就应该处理 element
  // 思考题： 如何去区分是 element 还是 component 类型呢？
  // console.log(vnode)
  // element 是 type 为 string 类似于 div
  // component 是 type 为 object
  if (typeof vnode.type === 'string') {
    debugger
    processElement(vnode, container);
  } else {
    processComponent(vnode, container)
  }
}

function processElement(vnode: any, container: any) {
  mountElement(vnode, container)
}

function mountElement(vnode, container) {
  const el = document.createElement(vnode.type)
  const { children } = vnode
  if (typeof children === 'string') {
    el.textContent = children
  } else if (Array.isArray(children)) {
    mountChildren(vnode, el)
  }

  const props = vnode.props
  for (const prop of props) {
    const val = props[prop]
    el.setAttribute(prop, val)
  }
  container.appendChild(el)
}

function mountChildren(vnode: any, container: any) {
  vnode.children.forEach(v => {
    patch(v, container)
  })
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