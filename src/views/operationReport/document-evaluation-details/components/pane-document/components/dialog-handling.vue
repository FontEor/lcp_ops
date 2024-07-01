<template>
  <el-dialog :visible="dialogVisible" :close-on-click-modal="false" title="评价处理" width="480px" class="dialog-handling" @close="onCloseDialog">
    <el-form class="dialog-handling__form" :model="formModel" :rules="formRules" ref="form" label-width="100px">
      <el-form-item v-for="{ label, prop, placeholder } in formItemList" :key="prop" :label="label" :prop="prop">
        <template v-if="['handleStatus'].includes(prop)">
          <el-select v-model="formModel[prop]" :placeholder="placeholder" :clearable="true" style="width: 100%">
            <el-option v-for="{ label, value } in handleStatusOptionList" :key="value" :label="label" :value="value" />
          </el-select>
        </template>
        <template v-else-if="['userExplain'].includes(prop)">
          <el-input v-model.trim="formModel[prop]" :placeholder="placeholder" :rows="3" maxlength="200" show-word-limit clearable type="textarea" resize="none" style="width: 100%" />
        </template>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="onClickCancelButton">取消</el-button>
      <el-button :loading="confirmButtonLoading" type="primary" @click="onClickConfirmButton">确定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import lcp from "@/api/lcp/index";
import { debounce } from "lodash";

export default {
  name: "DialogHandling",
  props: {
    dialogVisible: { type: Boolean, required: true },
    formModel: { type: Object, required: true }
  },
  data() {
    return {
      formRules: { handleStatus: [], userExplain: [] },
      formItemList: [
        { label: "处理状态", prop: "handleStatus", placeholder: "请选择处理状态" },
        { label: "说明", prop: "userExplain", placeholder: "备注处理原因" }
      ],
      handleStatusOptionList: [
        { label: "评价待处理", value: 0 },
        { label: "评价已处理", value: 1 },
        { label: "挂起", value: 2 },
        { label: "评价不合理", value: 3 }
      ],
      confirmButtonLoading: false
    };
  },
  methods: {
    // 处理文档评价接口
    async updateEvaluateHelp() {
      const { id, handleStatus, userExplain } = this.formModel;
      const data = { id, handleStatus, userExplain };
      return await lcp.platform.rest.evaluate.updateEvaluateHelp(data).catch(error => {
        console.error("updateEvaluateHelp");
        throw error;
      });
    },

    // 处理文档评价接口调用
    async handleUpdateEvaluateHelp() {
      await this.updateEvaluateHelp().catch(error => {
        console.error("handleUpdateEvaluateHelp");
        throw error;
      });
    },

    onCloseDialog() {
      this.$refs.form.resetFields();
      this.$emit("update:dialogVisible", false);
    },
    onClickCancelButton() {
      this.onCloseDialog();
    },
    onClickConfirmButton: debounce(async function() {
      await this.$refs.form.validate().catch(() => {
        throw new Error("未通过表单校验");
      });
      await this.handleUpdateEvaluateHelp().catch(error => {
        throw new Error(`onClickConfirmButton, ${error}`);
      });
      this.$message.success("操作成功！");
      this.onCloseDialog();
      this.$emit("submit");
    }, 300)
  }
};
</script>

<style lang="scss" scoped>
.dialog-handling {
  .dialog-handling__form {
    margin: 0 auto;
    width: 400px;
  }
}
</style>
