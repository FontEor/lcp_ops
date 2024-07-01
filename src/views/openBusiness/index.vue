<template>
  <div class="app-container">
    <el-tabs v-model="activeComponentName" @tab-click="handleChangeTab">
      <el-tab-pane label="外网方案订阅审批" name="ExtranetSubscriptionApproval">
        <ExtranetSubscriptionApproval :active="activeComponentName === 'ExtranetSubscriptionApproval'" />
      </el-tab-pane>
      <el-tab-pane label="内调外API订阅审批" name="ApiApproval">
        <ApiApproval :active="activeComponentName === 'ApiApproval'" />
      </el-tab-pane>
      <el-tab-pane label="内网方案发布审批" name="IntranetSubscriptionApproval">
        <IntranetSubscriptionApproval :active="activeComponentName === 'IntranetSubscriptionApproval'" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import request from "@/utils/request.js";
import ExtranetSubscriptionApproval from "./ExtranetSubscriptionApproval.vue";
import IntranetSubscriptionApproval from "./IntranetSubscriptionApproval.vue";
import ApiApproval from "./ApiApproval.vue";
export default {
  name: "OpenBusiness",
  components: {
    ExtranetSubscriptionApproval,
    IntranetSubscriptionApproval,
    ApiApproval
  },
  data() {
    return {
      activeComponentName: "ExtranetSubscriptionApproval"
    };
  },
  methods: {
    handleChangeTab(comName) {}
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
.paneFooter {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
.primaryColor {
  color: #3c6ef0;
}
.dangerColor {
  color: #e1251b;
}
.successColor {
  color: #26a872;
}
</style>