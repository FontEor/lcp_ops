<template>
  <div class="customerStatistics">
    <div class="app-container">
      <el-tabs v-model="activeName">
        <el-tab-pane label="客户数量" name="first">
          <CustomerAmount v-if="activeName === 'first'"></CustomerAmount>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import CustomerAmount from "@/views/operationReport/customerStatistics/CustomerAmount.vue";

export default {
  name: "CustomerStatistics",
  components: { CustomerAmount },
  data() {
    return {
      activeName: "first",
    };
  },
};
</script>

<style lang="scss" scoped>
</style>