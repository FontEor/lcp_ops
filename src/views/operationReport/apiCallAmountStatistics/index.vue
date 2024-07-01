<template>
  <div class="app-container">
    <el-tabs v-model="active">
      <el-tab-pane label="API调用量统计" name="apiCallAmountStatistics">
        <ApiCallAmountStatisticsPane v-if="active === 'apiCallAmountStatistics'" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import ApiCallAmountStatisticsPane from "@/views/operationReport/apiCallAmountStatistics/apiCallAmountStatisticsPane/index.vue";

export default {
  name: "apiCallAmountStatistics",
  components: { ApiCallAmountStatisticsPane },
  data() {
    return { active: "apiCallAmountStatistics" };
  },
};
</script>

<style lang="scss" scoped></style>
