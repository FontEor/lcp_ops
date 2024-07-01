<template>
  <div class="app-container">
    <el-tabs v-model="activeName">
      <el-tab-pane label="工单记录" name="first">
        <WorkOrderRecord v-if="activeName === 'first'"></WorkOrderRecord>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import WorkOrderRecord from "@/views/operationReport/workOrder/WorkOrderRecord";

export default {
  name: "workOrder",
  components: { WorkOrderRecord },
  data() {
    return {
      activeName: "first",
    };
  },
};
</script>

<style lang="scss" scoped>
</style>
