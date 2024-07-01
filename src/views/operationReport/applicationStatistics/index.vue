<template>
  <div class="applicationStatistics">
    <div class="app-container">
      <el-tabs v-model="activeName">
        <el-tab-pane label="应用数量" name="first">
          <ApplicationAmount v-if="activeName === 'first'"></ApplicationAmount>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import ApplicationAmount from "@/views/operationReport/applicationStatistics/ApplicationAmount.vue";

export default {
  name: "ApplicationStatistics",
  components: { ApplicationAmount },
  data() {
    return {
      activeName: "first",
    };
  },
};
</script>

<style lang="scss" scoped>
</style>