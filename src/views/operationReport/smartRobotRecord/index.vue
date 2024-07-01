<template>
  <div class="smart-robot-record app-container">
    <el-tabs v-model="active">
      <el-tab-pane label="智能助手记录" name="smartRobotRecord">
        <SmartRobotRecordPane
          v-if="active === 'smartRobotRecord'"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import SmartRobotRecordPane from "@/views/operationReport/smartRobotRecord/smartRobotRecordPane/index.vue";

export default {
  name: "SmartRobotRecord",
  components: { SmartRobotRecordPane },
  data() {
    return { active: "smartRobotRecord" };
  },
};
</script>

<style lang="scss" scoped>
</style>
