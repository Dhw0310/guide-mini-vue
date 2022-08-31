import { h } from '../../lib/guide-mini-vue.esm.js'
window.self = null
export const App = {
  // render
  render () {
    window.self = this
    console.log(this)
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
      'hi,' + this.msg
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