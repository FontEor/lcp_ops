<template>
  <div class="logging-tool app-container">
    <el-tabs v-model="active">
      <el-tab-pane name="merchantLoggingTool" label="商家调用日志">
        <MerchantLoggingToolPane v-if="active === 'merchantLoggingTool'" />
      </el-tab-pane>
      <el-tab-pane name="passBackLoggingTool" label="回传API日志">
        <LoggingToolPane v-if="active === 'passBackLoggingTool'" />
      </el-tab-pane>
      <el-tab-pane name="messageLogQueryTool" label="消息日志">
        <MessageLogToolPane v-if="active === 'messageLogQueryTool'" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import MerchantLoggingToolPane from "@/views/loggingTool/merchantLoggingToolPane/index.vue";
import LoggingToolPane from "@/views/loggingTool/loggingToolPane/index.vue";
import MessageLogToolPane from "@/views/loggingTool/messageLogToolPane/index.vue";

export default {
  name: "LoggingTool",
  components: { LoggingToolPane, MerchantLoggingToolPane, MessageLogToolPane },
  data() {
    return {
      active: "merchantLoggingTool",
    };
  },
};
</script>

<style lang="scss" scoped>
</style>
