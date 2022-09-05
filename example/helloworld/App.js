import { h } from '../../lib/guide-mini-vue.esm.js'
import { Foo } from './Foo.js'
window.self = null
export const App = {
  name: 'App',
  // 必须要写 render
  render () {
    window.self = this
    // return h('div', 'hi,' + this.msg)
    return h('div',
      {
        id: "root",
        class: ["red", "hard"],
        onClick () {
          console.log('click')
        }
      },
      // this.$el -> get root element
      // 'hi,' + this.msg
      [
        h("div", {}, "hi," + this.msg),
        h(Foo, {
          count: 1,
        }),
      ]
    )
    // return h('div',
    //   {
    //     id: 'root',
    //     class: ['red', 'hard']
    //   },
    //   [h("p", { class: "red" }, "hi"), h("p", { class: "blue" }, "mini-vue")]
    // )
  },

  setup () {
    return {
      msg: 'mini-vue-hahaha'
    }
  }
}