'use strict'

// eslint-disable-next-line no-underscore-dangle
exports.__esModule = true

// eslint-disable-next-line no-underscore-dangle
const _vue = require('vue')

// eslint-disable-next-line no-underscore-dangle
const _vue2 = _interopRequireDefault(_vue)

// eslint-disable-next-line no-underscore-dangle
const _dom = require('@lui/lui-ui/lib/utils/dom')

// eslint-disable-next-line no-underscore-dangle
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj } }

const nodeList = []
const ctx = '@@clickoutsideContext'

// eslint-disable-next-line no-void
let startClick = void 0
let seed = 0

// eslint-disable-next-line no-return-assign
!_vue2.default.prototype.$isServer && (0, _dom.on)(document, 'mousedown', e => startClick = e)

!_vue2.default.prototype.$isServer && (0, _dom.on)(document, 'mouseup', (e) => {
  nodeList.forEach(node => node[ctx].documentHandler(e, startClick))
})

function createDocumentHandler(el, binding, vnode) {
  // eslint-disable-next-line func-names
  return function() {
    // eslint-disable-next-line prefer-rest-params
    const mouseup = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}
    // eslint-disable-next-line prefer-rest-params
    const mousedown = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {}

    // eslint-disable-next-line max-len,no-mixed-operators
    if (!vnode || !vnode.context || !mouseup.target || !mousedown.target || el.contains(mouseup.target) || el.contains(mousedown.target) || el === mouseup.target || vnode.context.popperElm && (vnode.context.popperElm.contains(mouseup.target) || vnode.context.popperElm.contains(mousedown.target))) return

    if (binding.expression && el[ctx].methodName && vnode.context[el[ctx].methodName]) {
      vnode.context[el[ctx].methodName]()
    } else {
      el[ctx].bindingFn && el[ctx].bindingFn()
    }
  }
}

/**
 * v-clickoutside
 * @desc 点击元素外面才会触发的事件
 * @example
 * ```vue
 * <div v-element-clickoutside="handleClose">
 * ```
 */
exports.default = {
  bind: function bind(el, binding, vnode) {
    nodeList.push(el)
    // eslint-disable-next-line no-plusplus
    const id = seed++
    el[ctx] = {
      id,
      documentHandler: createDocumentHandler(el, binding, vnode),
      methodName: binding.expression,
      bindingFn: binding.value
    }
  },
  update: function update(el, binding, vnode) {
    el[ctx].documentHandler = createDocumentHandler(el, binding, vnode)
    el[ctx].methodName = binding.expression
    el[ctx].bindingFn = binding.value
  },
  unbind: function unbind(el) {
    const len = nodeList.length

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < len; i++) {
      if (nodeList[i][ctx].id === el[ctx].id) {
        nodeList.splice(i, 1)
        break
      }
    }
    delete el[ctx]
  }
}
