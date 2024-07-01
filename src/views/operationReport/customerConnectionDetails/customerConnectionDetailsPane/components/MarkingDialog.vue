<template>
  <el-dialog
    class="marking-dialog"
    title="对接方案打标"
    width="480px"
    :visible="markingDialogVisible"
    :close-on-click-modal="false"
    @update:visible="($event) => $emit('update:markingDialogVisible', $event)"
    @close="$refs.markingDialogForm.resetFields()"
  >
    <el-form
      class="marking-dialog-form"
      :model="currentRowData"
      :rules="markingDialogFormRules"
      ref="markingDialogForm"
      label-width="auto"
    >
      <el-form-item
        v-for="{ label, prop, placeholder } in formItemList"
        :key="prop"
        :label="label"
        :prop="prop"
      >
        <template v-if="['tagCode'].includes(prop)">
          <el-select
            v-model="currentRowData[prop]"
            :placeholder="placeholder"
            :clearable="true"
            style="width: 100%"
          >
            <el-option
              v-for="{ label, value } in tagCodeOptionList"
              :key="value"
              :label="label"
              :value="value"
            />
          </el-select>
        </template>
        <template v-else-if="['tagRemark'].includes(prop)">
          <el-input
            v-model.trim="currentRowData[prop]"
            :placeholder="placeholder"
            :clearable="true"
            :rows="2"
            type="textarea"
            resize="none"
            style="width: 100%"
          />
        </template>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="$emit('update:markingDialogVisible', false)"
        >取 消</el-button
      >
      <el-button type="primary" @click="onClickConfirmButton">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import lcp from "@/api/lcp/index";

export default {
  name: "MarkingDialog",
  props: {
    markingDialogVisible: { type: Boolean, required: true },
    currentRowData: { type: Object, required: true },
  },
  data() {
    return {
      markingDialogFormRules: { tagCode: [], tagRemark: [] },
      formItemList: [
        { label: "标签", prop: "tagCode", placeholder: "请选择" },
        { label: "说明", prop: "tagRemark", placeholder: "备注打标原因" },
      ],
      tagCodeOptionList: [
        { label: "正常", value: "01" },
        { label: "异常", value: "02" },
      ],
    };
  },
  methods: {
    // 对接周期打标
    async saveBizOrderTag() {
      const { id, tagCode, tagRemark } = this.currentRowData;
      const data = { id, tagCode, tagRemark };
      return await lcp.platform.rest.dockingPeriod
        .saveBizOrderTag(data)
        .catch((error) => {
          throw new Error(`saveBizOrderTag, ${error}`);
        });
    },

    async handleSaveBizOrderTag() {
      await this.saveBizOrderTag().catch((error) => {
        throw new Error(`handleSaveBizOrderTag, ${error}`);
      });
    },
    onClickConfirmButton() {
      this.$refs.markingDialogForm
        .validate()
        .then(async () => {
          await this.handleSaveBizOrderTag().catch((error) => {
            throw new Error(`onClickConfirmButton, ${error}`);
          });
          this.$message.success("操作成功！");
          this.$emit("update:markingDialogVisible", false);
          this.$emit("close");
        })
        .catch(() => {});
    },
  },
};
</script>

<style lang="scss" scoped>
.marking-dialog {
  .marking-dialog-form {
    margin: 0 auto;
    width: 400px;
  }
}
</style>