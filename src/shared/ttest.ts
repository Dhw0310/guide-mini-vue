const ShapeFlags = {
  element: 0,
  stateful_component: 0,
  text_children: 0,
  array_children: 0
}

// vnode -> stateful_component ->
// 1. 可以设置 修改
// ShapeFlags.stateful_component = 1
// ShapeFlags.array_children = 1



// 2. 查找 
// if(ShapeFlags.element)
// if(ShapeFlags.stateful_component)


// 不够高效 使用位运算解决
// 0000
// 0001 element
// 0010 stateful_component
// 0100 text_children
// 1000 array_children


// 既是 stateful_compoennt 又是 array_children
// 1010

// | 两位都为0才为0  修改
// & 两位都为1才为1  查找

