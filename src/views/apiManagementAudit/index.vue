<template>
  <div class="app-container">
    <el-tabs v-model="activeName">
      <el-tab-pane label="开放API发布审核" name="PublicApiPublishAudit">
        <PublicApiPublishAudit v-if="activeName === 'PublicApiPublishAudit'" />
      </el-tab-pane>
      <el-tab-pane label="消息发布审核" name="MessageReleaseReview">
        <MessageReleaseReview v-if="activeName === 'MessageReleaseReview'" />
      </el-tab-pane>
      <el-tab-pane label="回传API发布审核" name="ApiCallbackPublishAudit">
        <ApiCallbackPublishAudit v-if="activeName === 'ApiCallbackPublishAudit'" />
      </el-tab-pane>
      <el-tab-pane label="非健康API申诉审核" name="ApiAppealManagement">
        <ApiAppealManagement v-if="activeName === 'ApiAppealManagement'" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import PublicApiPublishAudit from "./PublicApiPublishAudit.vue";
import MessageReleaseReview from "@/views/apiManagementAudit/MessageReleaseReview/index.vue";
import ApiCallbackPublishAudit from "./api-callback-publish-audit/index.vue";
import ApiAppealManagement from "../apiAppeal/index.vue";

export default {
  name: "apiManagementAudit",
  components: {
    PublicApiPublishAudit,
    MessageReleaseReview,
    ApiCallbackPublishAudit,
    ApiAppealManagement
  },
  data() {
    return {
      activeName: "PublicApiPublishAudit"
    };
  }
};
</script>
