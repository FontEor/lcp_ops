<template>
  <div :class="[classObj,themeName]" @mousedown="closeContextMenu">
    <navbar />
    <sidebar class="sidebar-container" />
    <template>
      <div v-if="showTab" class="main-container">
        <div class="tabs-wrt">
          <div class="content-tabs">
            <el-tabs
              v-if="showCommonView"
              ref="topTabs"
              v-model="editableTabsValue"
              type="card"
              @tab-click="tabClick"
              @tab-remove="removeTab"
            >
              <el-tab-pane
                v-for="(item) in editableTabs"
                :key="item.name"
                :label="item.title"
                :name="item.name"
                :closable="item.name !== 'Home'"
              />
            </el-tabs>
          </div>
          <div class="content-wrapper">
            <div slot="content">
              <app-main />
            </div>
          </div>
        </div>
      </div>
      <div v-else class="main-container">
        <app-main />
      </div>
    </template>
    <div class="footer-container"></div>
    <!-- tab右键菜单 -->
    <ContextMenu :context-menu-info="contextMenuInfo" />
  </div>
</template>

<script>
import { SappModule } from '@/store/modules/app'
import { Navbar, Sidebar, AppMain, ContextMenu } from '@/components/common'

export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain,
    ContextMenu
  },
  data() {
    return {
      contextMenuInfo: {
        bShow: false, // 是否展示右键菜单
        event: null
      }
    }
  },
  computed: {//所依赖的数据改变时，才会更新
    sidebar() {
      return !SappModule.sidebar
    },
    showCommonView() {
      return SappModule.showCommonView
    },
    themeName() {
      return `theme-${SappModule.themeColor}`
    },
    showTab() {
      return SappModule.showTab
    },
    classObj() {
      return {
        hideSidebarAll: !SappModule.sidebar.showSidebar,
        hideSidebar: !SappModule.sidebar.opened,
        hideNavbar: !SappModule.showCommonView,
        hideTabs: !SappModule.showTab
      }
    },
    editableTabs() {
      return SappModule.editableTabs
    },
    editableTabsValue: {
      get() {
        return SappModule.editableTabsValue
      },
      set(name) {
      }
    }
  },
  watch: {
    $route: {
      immediate: true,
      handler(newValue, oldValue) {
        // 添加页面
        if (this.editableTabsValue !== newValue.path) {
          // 支持首次加载首页
          SappModule.addTab({
            title: newValue.meta.title,
            name: newValue.name,
            content: newValue.path,
            params: newValue.params,
            query: newValue.query
          })
        }
      }
    }
  },
  mounted() {
    if (this.$refs && this.$refs.topTabs) {
      // 为tab项添加右键菜单功能
      this.$refs.topTabs.$el.addEventListener('contextmenu', (e) => {
        if (/^tab-[\w|/|-]+$/.test(e.target.id)) {
          this.contextmenuHandler(e)
        }
      }, false)
    }
  },
  methods: {
    tabClick(e) {
      // 读取store中路由参数
      const item = SappModule.editableTabs[e.index]
      this.$router.push({ name: item.name, params: item.params, query: item.query }).catch(err => err)
    },

    removeTab(e) {
      SappModule.removeTab(e)
      const current = SappModule.currentTab
      this.$router.replace({ name: current.name, params: current.params, query: current.query }).catch(err => err)
    },

    contextmenuHandler(e) {
      e.preventDefault()
      this.contextMenuInfo.bShow = true
      this.contextMenuInfo.event = e
    },
    // 鼠标按下时，关闭tab右键菜单
    closeContextMenu(e) {
      if (!e.target.getAttribute('contextmenu-item') && this.contextMenuInfo.bShow) {
        this.contextMenuInfo.bShow = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/assets/styles/variables.scss";

  .app-wrapper {
    &:after {
      content: "";
      display: table;
      clear: both;
    }
    position: relative;
    height: 100%;
    width: 100%;
  }
  .tabs-wrt{
    .content-wrapper {
      background: #ffffff;
    }
  }
  .jdwl-admin-red .content-tabs,
  .content-tabs {
    /deep/ .el-tabs {
      .el-tabs__header {
        border-bottom: 0;
        margin-bottom: 0;
        user-select: none;
        .el-tabs__nav-wrap {
          margin-bottom: 0;
          &.is-scrollable {
            padding: 0 38px;
          }
          .el-tabs__nav-next, .el-tabs__nav-prev {
            background: #ffffff;
            line-height: 30px;
            top: 5px;
            bottom: 5px;
            width: 30px;
            text-align: center;
            border-radius: 5px;
          }
        }
      }
      .el-tabs__nav {
        border: none;
      }
      .el-tabs__item:focus.is-active.is-focus:not(:active) {
        box-shadow: none;
      }
      .el-tabs__item {
        background: #e9e9e9;
        margin-right: 5px;
        border: none;
        border-radius: 5px 5px 0 0;
        font-weight: normal;
        &.is-active {
          background: #ffffff;
        }
      }
    }
  }
</style>
