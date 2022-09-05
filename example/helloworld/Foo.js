import { h } from '../../lib/guide-mini-vue.esm.js'
export const Foo = {
  setup (props) {
    // 假设props中有count props.count
    console.log(props)
    // props 不可变 shallowReadonly
    props.count++
    console.log(props);
  },
  render () {
    return h("div", {}, "foo: " + this.count)
  }
}