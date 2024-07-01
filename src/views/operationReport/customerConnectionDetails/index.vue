<template>
  <div class="customer-connection-details app-container">
    <el-tabs v-model="active">
      <el-tab-pane label="客户对接明细" name="customerConnectionDetails">
        <CustomerConnectionDetailsPane
          v-if="active === 'customerConnectionDetails'"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import CustomerConnectionDetailsPane from "@/views/operationReport/customerConnectionDetails/customerConnectionDetailsPane/index.vue";

export default {
  name: "CustomerConnectionDetails",
  components: { CustomerConnectionDetailsPane },
  data() {
    return { active: "customerConnectionDetails" };
  },
};
</script>

<style lang="scss" scoped>
</style>
