function createComponentInstance(vnode) {
    var component = {
        vnode: vnode,
        type: vnode.type
    };
    return component;
}
function setupComponent(instance) {
    // TODO
    // initProps()
    // initSlots()
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
    var Component = instance.type;
    var setup = Component.setup;
    if (setup) {
        // setup 返回函数或者对象
        var setupResult = setup();
        handleSetupResult(instance, setupResult);
    }
}
function handleSetupResult(instance, setupResult) {
    // TODO function
    // object
    if (typeof setupResult === 'object') {
        instance.setupState = setupResult;
    }
    finishComponentSetup(instance);
}
function finishComponentSetup(instance) {
    var Component = instance.type;
    if (Component.render) {
        instance.render = Component.render;
    }
}

function render(vnode, container) {
    // 调用 patch 方法
    patch(vnode, container);
}
function patch(vnode, container) {
    // 去处理组件
    // TODO 判断vnode 是不是一个 element
    // 是 element 那么就应该处理 element
    // 思考题： 如何去区分是 element 还是 component 类型呢？
    // console.log(vnode)
    // element 是 type 为 string 类似于 div
    // component 是 type 为 object
    if (typeof vnode.type === 'string') {
        debugger;
        processElement(vnode, container);
    }
    else {
        processComponent(vnode, container);
    }
}
function processElement(vnode, container) {
    mountElement(vnode, container);
}
function mountElement(vnode, container) {
    var el = document.createElement(vnode.type);
    var children = vnode.children;
    if (typeof children === 'string') {
        el.textContent = children;
    }
    else if (Array.isArray(children)) {
        mountChildren(vnode, el);
    }
    var props = vnode.props;
    for (var _i = 0, props_1 = props; _i < props_1.length; _i++) {
        var prop = props_1[_i];
        var val = props[prop];
        el.setAttribute(prop, val);
    }
    container.appendChild(el);
}
function mountChildren(vnode, container) {
    vnode.children.forEach(function (v) {
        patch(v, container);
    });
}
function processComponent(vnode, container) {
    mountComponent(vnode, container);
}
function mountComponent(vnode, container) {
    // 创建组件实例
    var instance = createComponentInstance(vnode);
    setupComponent(instance);
    setupRenderEffect(instance, container);
}
function setupRenderEffect(instance, container) {
    var subTree = instance.render();
    // vnode -> patch
    // vnode -> element -> mountElement
    patch(subTree, container);
}

function createVNode(type, props, children) {
    var vnode = {
        type: type,
        props: props,
        children: children
    };
    return vnode;
}

// 接收根组件
function createApp(rootComponent) {
    return {
        mount: function (rootContainer) {
            // 先转化 vnode
            // component -> vnode
            // 所有逻辑操作都会基于 vnode 做处理
            var vnode = createVNode(rootComponent);
            render(vnode, rootContainer);
        }
    };
}

function h(type, props, children) {
    return createVNode(type, props, children);
}

export { createApp, h };
