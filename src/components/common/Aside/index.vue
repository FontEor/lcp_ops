<template>
  <div>
    <el-scrollbar wrap-class="scrollbar-wrapper" style="background-color: #fff">
      <el-menu
        :collapse="isCollapse"
        mode="vertical"
        router
        :default-active="$route.path"
        style="background-color: #fff;"
      >
        <sidebar-item
          v-for="route in routes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
    <hamburger :is-active="sidebar.opened" @toggleClick="toggleSideBar" />
  </div>
</template>

<script>
import Hamburger from '@/components/common/Hamburger/index.vue'
import { SappModule } from '@/store/modules/app'
import SidebarItem from './SidebarItem.vue'

export default {
  components: { SidebarItem, Hamburger },
  data() {
    return {}
  },
  computed: {
    sidebar() {
      return SappModule.sidebar
    },
    isCollapse() {
      return !SappModule.sidebar.opened
    },
    routes() {
      return SappModule.menus
    },
  },
  created() {},
  methods: {
    toggleSideBar() {
      SappModule.toggleSideBar()
    },
  },
  mounted() {
    console.log('SappModule.menus', SappModule.menus)
  },
}
</script>
<style lang="scss">
</style>