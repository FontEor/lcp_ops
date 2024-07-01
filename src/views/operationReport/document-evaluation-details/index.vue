<template>
  <article class="document-evaluation-details app-container">
    <el-tabs v-model="active">
      <el-tab-pane v-for="{ label, name, queryDataType } in tabPaneList" :key="name" :label="label" :name="name">
        <PaneDocument v-if="active === name" :queryDataType="queryDataType" />
      </el-tab-pane>
    </el-tabs>
  </article>
</template>

<script>
import PaneDocument from "./components/pane-document/index.vue";

export default {
  name: "DocumentEvaluationDetails",
  components: { PaneDocument },
  data() {
    return {
      active: "DockingSchemeDocument",
      tabPaneList: [
        { label: "对接方案文档", name: "DockingSchemeDocument", queryDataType: 1 },
        { label: "平台文档", name: "PlatformDocument", queryDataType: 2 }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
// .document-evaluation-details {
// }
</style>
