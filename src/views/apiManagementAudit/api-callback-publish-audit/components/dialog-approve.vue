<template>
  <el-dialog :visible="dialogVisible" :close-on-click-modal="false" title="审批" width="800px" class="dialog-approve" @close="onCloseDialog">
    <el-input v-model="comments" :rows="5" type="textarea" placeholder="请填写审批意见"></el-input>
    <template #footer>
      <el-button @click="onClickCancelButton">取消</el-button>
      <el-button :loading="rejectButtonLoading" :disabled="rejectButtonDisabled" type="primary" @click="onClickRejectButton">驳回</el-button>
      <el-button :loading="passButtonLoading" :disabled="passButtonDisabled" type="primary" @click="onClickPassButton">通过</el-button>
    </template>
  </el-dialog>
</template>

<script>
import gw from "@/api/gw/index";
import { debounce } from "lodash";

export default {
  name: "DialogApprove",
  props: { dialogVisible: { type: Boolean, required: true }, row: { type: Object, required: true } },
  data() {
    return { comments: "", status: 0, rejectButtonLoading: false, rejectButtonDisabled: false, passButtonLoading: false, passButtonDisabled: false };
  },
  methods: {
    async outerApiAuditEnd() {
      const { apiId } = this.row;
      const { status, comments } = this;
      const data = [apiId, status, comments];
      return await gw.OuterDomainApiService.outerApiAuditEnd(data);
    },

    async handleOuterApiAuditEnd() {
      await this.outerApiAuditEnd().catch(error => {
        console.error("handleOuterApiAuditEnd");
        throw error;
      });
      this.$message.success("操作成功");
    },

    onCloseDialog() {
      this.comments = "";
      this.status = 0;
      this.$emit("update:dialogVisible", false);
      this.$emit("close");
    },
    onClickCancelButton() {
      this.$emit("update:dialogVisible", false);
    },
    onClickRejectButton: debounce(async function() {
      const { comments } = this;
      if (!comments) {
        this.$message.warning("请填写审批意见");
        return;
      }
      this.rejectButtonLoading = true;
      this.passButtonDisabled = true;
      this.status = 3;
      await this.handleOuterApiAuditEnd().catch(error => {
        this.rejectButtonLoading = false;
        this.passButtonDisabled = false;
        console.error("onClickRejectButton");
        throw error;
      });
      this.rejectButtonLoading = false;
      this.passButtonDisabled = false;
      this.$emit("update:dialogVisible", false);
    }, 300),
    onClickPassButton: debounce(async function() {
      this.passButtonLoading = true;
      this.rejectButtonDisabled = true;
      this.status = 1;
      await this.handleOuterApiAuditEnd().catch(error => {
        this.passButtonLoading = false;
        this.rejectButtonDisabled = false;
        console.error("onClickRejectButton");
        throw error;
      });
      this.passButtonLoading = false;
      this.rejectButtonDisabled = false;
      this.$emit("update:dialogVisible", false);
    }, 300)
  }
};
</script>

<style lang="scss" scoped>
.dialog-approve {
  /deep/ .el-dialog__body {
    max-height: 320px;
  }
}
</style>
