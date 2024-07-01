<template>
  <el-dialog :visible="dialogVisible" :close-on-click-modal="false" title="审批意见" width="400px" class="dialog-approve-comment" @close="onCloseDialog">
    <pre class="dialog-approve-comment__content">{{ row.approveComment || "" }}</pre>
    <template #footer>
      <el-button type="primary" @click="onClickCloseButton">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script>
export default {
  name: "DialogApproveComment",
  props: { dialogVisible: { type: Boolean, required: true }, row: { type: Object, required: true } },
  methods: {
    onCloseDialog() {
      this.$emit("update:dialogVisible", false);
    },
    onClickCloseButton() {
      this.$emit("update:dialogVisible", false);
    }
  }
};
</script>

<style lang="scss" scoped>
.dialog-approve-comment {
  /deep/ .el-dialog__body {
    max-height: 320px;
  }

  .dialog-approve-comment__content {
    font-family: inherit;
  }
}
</style>
