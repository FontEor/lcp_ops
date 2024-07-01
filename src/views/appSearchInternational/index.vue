<template>
  <div class="app-container">
    <el-tabs v-model="activeName">
      <el-tab-pane name="international" label="国际应用查询">
        <internationalList v-if="activeName === 'international'"></internationalList>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import internationalList from './internationalList.vue';

export default {
  name: "AppSearch",
  components: {
    internationalList
  },
  data() {
    return {
      activeName: "international",
    };
  },
  mounted() {
  }
};
</script>

<style lang="scss" scoped>
.pagination-wrap {
  margin-top: 20px;
  text-align: center;
}
::v-deep .cell {
  text-overflow: clip;
}
</style>
