<template>
  <!-- 卡片 -->
  <div class="lui-container">
    <h2 class="lui-tit">筛选方式</h2>
    <el-row :gutter="30">
      <el-col :xs="12" :sm="8" :md="6" :lg="4">
        <el-card shadow="always">
          地图筛选<i class="el-icon-location ico-card" />
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="8" :md="6" :lg="4">
        <el-card shadow="always">
          敬请期待<i class="el-icon-menu-circle ico-card" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script type="text/babel">
export default {
  name: 'Card',
  props: {
  },
  data() {
    return {
    }
  },

  mounted() {
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
// @import "~@/assets/styles/mixins.scss";
.ico-card{
  margin-left:10px;
  color:#666
  // @include font_color("main-color");
}
</style>
