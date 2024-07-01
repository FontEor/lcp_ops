<template>
  <div class="apiStatistics">
    <div class="app-container">
      <el-tabs v-model="activeName">
        <el-tab-pane label="API数量" name="first">
          <ApiAmount v-if="activeName === 'first'"></ApiAmount>
        </el-tab-pane>
        <el-tab-pane label="API申请数量" name="second">
          <ApiApplyAmount v-if="activeName === 'second'"></ApiApplyAmount>
        </el-tab-pane>
        <el-tab-pane label="API调用量" name="third">
          <ApiCallAmount v-if="activeName === 'third'"></ApiCallAmount>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import ApiAmount from "@/views/operationReport/apiStatistics/ApiAmount.vue";
import ApiApplyAmount from "@/views/operationReport/apiStatistics/ApiApplyAmount.vue";
import ApiCallAmount from "@/views/operationReport/apiStatistics/ApiCallAmount.vue";

export default {
  name: "ApiStatistics",
  components: { ApiAmount, ApiApplyAmount, ApiCallAmount },
  data() {
    return {
      activeName: "first",
    };
  },
};
</script>

<style lang="scss" scoped>
</style>