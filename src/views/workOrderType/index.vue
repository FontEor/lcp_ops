<template>
  <div class="commentStatistics">
    <div class="app-container">
      <el-tabs v-model="activeName">
        <el-tab-pane label="工单类型维护" name="first">
          <WorkOrderType v-if="activeName === 'first'"></WorkOrderType>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import WorkOrderType from "@/views/workOrderType/WorkOrderType.vue";

export default {
  name: "workOrderType",
  components: { WorkOrderType },
  data() {
    return {
      activeName: "first",
    };
  },
};
</script>

<style lang="scss" scoped>
</style>
