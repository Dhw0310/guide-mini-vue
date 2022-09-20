import { isObject } from "../shared/index";
import { createComponentInstance, setupComponent } from "./component"
import { ShapeFlags } from "../shared/ShapeFlags";
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
  // ShapeFlags
  const { shapeFlag } = vnode
  if (shapeFlag & ShapeFlags.ELEMENT) {
    // debugger
    // vnode -> flag
    // element 类型
    processElement(vnode, container);
  } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
    // STATEFUL_COMPONENT 类型
    processComponent(vnode, container)
  }
}

function processElement(vnode: any, container: any) {
  mountElement(vnode, container)
}

function mountElement(vnode, container) {
  // vnode 是 element 即是 div
  const el = (vnode.el = document.createElement(vnode.type))
  const { children, shapeFlag } = vnode
  // children
  if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
    // TEXT_CHILDREN
    el.textContent = children
  } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
    // ARRAY_CHILDREN
    mountChildren(vnode, el)
  }
  // 组件 + children类型是 object
  if(shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
    if(typeof children === 'object') {
      vnode.shapeFlag |= ShapeFlags.SLOT_CHILDREN
    }
  }

  const props = vnode.props
  for (const key in props) {
    const val = props[key]
    const isOn = (key: string) => /^on[A-Z]/.test(key)
    if (isOn(key)) {
      const event = key.slice(2).toLowerCase()
      el.addEventListener(event, val)
    } else {
      el.setAttribute(key, val)
    }
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
function mountComponent(initialVNode: any, container: any) {
  // 创建组件实例
  const instance = createComponentInstance(initialVNode)

  setupComponent(instance)

  setupRenderEffect(instance, initialVNode, container)
}

function setupRenderEffect(instance: any, initialVNode, container: any) {
  const { proxy } = instance
  const subTree = instance.render.call(proxy)
  // vnode -> patch
  // vnode -> element -> mountElement
  patch(subTree, container)
  // console.log(subTree)

  // element -> vnode
  initialVNode.el = subTree.el
}