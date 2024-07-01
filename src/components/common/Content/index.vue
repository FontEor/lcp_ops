<template>
  <section class="app-main">
    <el-scrollbar wrap-class="scrollbar-wrapper" style="height:100%;">
      <transition name="fade-transform" mode="out-in">
        <keep-alive :max="maxPageNumber" :include="keepAliveComponents">
          <router-view v-if="isRouterAlive" :key="key" />
        </keep-alive>
      </transition>
    </el-scrollbar>
  </section>
</template>

<script>
import { SappModule } from '@/store/modules/app'

export default {
  name: 'AppMain',
  computed: {
    key() {
      return this.$route.path
    },
    maxPageNumber() {
      return SappModule.maxPageNumber
    },
    isRouterAlive() {
      return SappModule.isRouterAlive
    },
    keepAliveComponents() {
      return SappModule.keepAliveComponents
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/variables.scss";
/* fix css style bug in open el-dialog */
/deep/ .lui-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
