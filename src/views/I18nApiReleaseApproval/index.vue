<template>
  <div class="i18n-api-release-approval app-container">
    <el-tabs v-model="activeNameTab">
      <el-tab-pane label="国际API发布审批" name="I18nApiReleaseApproval">
        <TabPaneI18nApiReleaseApproval
          v-if="activeNameTab === 'I18nApiReleaseApproval'"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import TabPaneI18nApiReleaseApproval from "./components/TabPaneI18nApiReleaseApproval/index.vue";

export default {
  name: "I18nApiReleaseApproval",
  components: { TabPaneI18nApiReleaseApproval },
  data() {
    return {
      activeNameTab: "I18nApiReleaseApproval",
    };
  },
};
</script>

<style lang="scss" scoped>
</style>