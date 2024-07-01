<template>
  <div class="navbar-logo-container">
    <router-link class="navbar-logo-link" to="/">
      <img src="@/assets/img/framework/jdl_logo.png" class="sidebar-logo">
      <span v-show="title" class="dep" />
      <h1 class="sidebar-title">{{ title }} </h1>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'NavbarLogo',
  data() {
    return {
      title: '开放平台运维端'
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/mixins.scss";
.navbar-logo-container{
  float:left;
  height: 100%;
  line-height: $navHeight;
  margin: 0 160px 0 20px;
  .navbar-logo-link{
    display: block;
    height: 100%;
  }
  .sidebar-logo{
    height: $logoHeight;
    vertical-align: middle;
  }
  .dep{
    display: inline-block;
    width: 1px;
    height: 20px;
    line-height: 20px;
    opacity: .6;
    @include themify() {
      background: themed('primary-color');
    }
    margin: 0 10px;
    vertical-align: middle;
  }
  .sidebar-title{
    display: inline-block;
    color: #fff;
    font: {
      family: -apple-system, "Noto Sans", "Helvetica Neue", Helvetica, "Nimbus Sans L", Arial, "Liberation Sans", "PingFang SC", "Hiragino Sans GB", "Noto Sans CJK SC", "Source Han Sans SC", "Source Han Sans CN", "Microsoft YaHei", "Wenquanyi Micro Hei", "WenQuanYi Zen Hei", "ST Heiti", SimHei, "WenQuanYi Zen Hei Sharp", sans-serif;
      size: 24px;
    }
    vertical-align: middle;
    letter-spacing: 3px;
  }
}
</style>
