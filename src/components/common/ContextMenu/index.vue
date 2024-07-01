<template>
  <el-card
    v-show="contextMenuInfo.bShow"
    class="contextmenu"
    :style="{left: left + 'px',top: top + 'px'}"
    :body-style="{ padding: 0 }"
  >
    <ul>
      <li contextmenu-item="true" @click="menuHandler($event, 'refresh')">重新加载</li>
      <li contextmenu-item="true" @click="menuHandler($event, 'closeAll')">关闭所有</li>
      <li v-if="bShowCloseLeft" contextmenu-item="true" @click="menuHandler($event, 'closeLeft')">关闭左边</li>
      <li v-if="bShowCloseRight" contextmenu-item="true" @click="menuHandler($event, 'closeRight')">关闭右边</li>
      <li contextmenu-item="true" @click="menuHandler($event, 'closeOther')">关闭其他</li>
    </ul>
  </el-card>
</template>
<style lang="scss" rel="stylesheet/scss">
  .contextmenu {
    width: auto;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    li {
      padding: 4px 10px;
      font-size: 12px;
      color: #2c3e50;
      &:hover{
        background: #ecf1fe;
        cursor: pointer;
      }
    }
  }
</style>
<script type="text/babel">
import { SappModule } from '@/store/modules/app'

export default {
  name: 'ContextMenu',
  props: {
    contextMenuInfo: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  computed: {
    left() {
      if (!this.contextMenuInfo.event) return -100
      const { pageX, offsetX, target } = this.contextMenuInfo.event
      return pageX - offsetX + target.clientWidth - 30
    },
    top() {
      if (!this.contextMenuInfo.event) return -100
      const { pageY, offsetY, target } = this.contextMenuInfo.event
      return pageY - offsetY + target.clientHeight - 8
    },
    index() { // 通过dom获取点击的tab的序号
      if (!this.contextMenuInfo.event) return -1
      let ele = this.contextMenuInfo.event.target
      // IE is simplest and fastest
      if (ele.sourceIndex) {
        return ele.sourceIndex - ele.parentNode.sourceIndex - 1
      }
      // other browsers
      let i = 0
      ele = ele.previousElementSibling
      while (ele) {
        ele = ele.previousElementSibling
        i++
      }
      return i
    },
    bShowCloseLeft() {
      return this.index !== 0
    },
    bShowCloseRight() {
      return this.index !== SappModule.editableTabs.length - 1
    }
  },
  methods: {
    menuHandler(e, type) {
      e.stopPropagation()
      // 执行具体的操作
      this[type] && this[type](e)
      // 关闭菜单
      this.contextMenuInfo.bShow = false
      // 更新tab对应的内容
      const current = SappModule.currentTab
      this.$router.replace({ name: current.name, params: current.params, query: current.query }).catch(err => err)
    },
    refresh() { // 通过控制router-view和keep-alive控制刷新
      const name = this.contextMenuInfo.event.target.id.replace('tab-', '')
      SappModule.CANCEL_KEEP_ALIVE(name)
      SappModule.TOGGLE_ROUTER_ALIVE()
      this.$nextTick(() => {
        SappModule.TOGGLE_ROUTER_ALIVE()
      })
    },
    closeAll() {
      SappModule.removeAllTab()
    },
    closeLeft() {
      SappModule.removeAsideTab({ index: this.index, dir: 'left' })
    },
    closeRight() {
      SappModule.removeAsideTab({ index: this.index, dir: 'right' })
    },
    closeOther() {
      SappModule.removeOtherTab(this.index)
    }
  }
}
</script>
