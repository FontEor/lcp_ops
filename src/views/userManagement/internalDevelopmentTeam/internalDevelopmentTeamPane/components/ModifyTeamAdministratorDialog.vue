<template>
  <el-dialog
    class="modify-team-administrator-dialog"
    title="修改团队管理员"
    :visible="modifyTeamAdministratorDialogVisible"
    :close-on-click-modal="false"
    @update:visible="
      ($event) => $emit('update:modifyTeamAdministratorDialogVisible', $event)
    "
    @close="modifyTeamAdministratorDialogFormData.erp = ''"
  >
    <el-form
      class="modify-team-administrator-dialog-form"
      :model="modifyTeamAdministratorDialogFormData"
      :rules="modifyTeamAdministratorDialogFormRules"
      ref="modifyTeamAdministratorDialogForm"
      label-width="auto"
    >
      <el-form-item label="管理员ERP账号" prop="erp">
        <el-input
          v-model.trim="modifyTeamAdministratorDialogFormData.erp"
          :clearable="true"
          placeholder="请输入管理员的ERP账号"
          style="width: 100%"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button
        @click="$emit('update:modifyTeamAdministratorDialogVisible', false)"
        >取 消</el-button
      >
      <el-button type="primary" @click="onClickSaveButton">保 存</el-button>
    </template>
  </el-dialog>
</template>

<script>
import lcp from "@/api/lcp/index";

export default {
  name: "ModifyTeamAdministratorDialog",
  props: {
    modifyTeamAdministratorDialogVisible: { type: Boolean, required: true },
    currentRowData: { type: Object, required: true },
  },
  data() {
    return {
      modifyTeamAdministratorDialogFormData: { erp: "" },
      modifyTeamAdministratorDialogFormRules: {
        erp: [{ required: true, message: "请输入管理员的ERP账号" }],
      },
    };
  },
  methods: {
    // 根据团队ID修改指定团队的管理员
    async updateSupplierManager() {
      const { supplierId } = this.currentRowData;
      const { erp } = this.modifyTeamAdministratorDialogFormData;
      const params = { supplierId, erp };
      return await lcp.supplier.user.rest
        .updateSupplierManager(params)
        .catch((error) => {
          throw new Error(`updateSupplierManager, ${error}`);
        });
    },

    async handleUpdateSupplierManager() {
      await this.updateSupplierManager().catch((error) => {
        throw new Error(`handleUpdateSupplierManager, ${error}`);
      });
    },

    onClickSaveButton() {
      this.$refs.modifyTeamAdministratorDialogForm
        .validate()
        .then(async () => {
          await this.handleUpdateSupplierManager().catch((error) => {
            throw new Error(`onClickSaveButton, ${error}`);
          });
          this.$message.success("操作成功！");
          this.$emit("update:modifyTeamAdministratorDialogVisible", false);
          this.$emit("close");
        })
        .catch(() => {});
    },
  },
};
</script>

<style lang="scss" scoped>
.modify-team-administrator-dialog {
  .modify-team-administrator-dialog-form {
    margin: 0 auto;
    width: 400px;
  }
}
</style>