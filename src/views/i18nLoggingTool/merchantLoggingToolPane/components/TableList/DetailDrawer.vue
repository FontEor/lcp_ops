<template>
  <el-drawer
    class="detail-drawer"
    size="708px"
    title="日志详情"
    :visible="visible"
    :modal="false"
    @close="$emit('update:visible', false)"
  >
    <el-form
      v-loading="detailDrawerLoading"
      class="detail-drawer-form"
      label-width="90px"
      :model="detailDrawerFormData"
    >
      <el-form-item
        v-for="{ prop, label } in formList"
        :key="prop"
        :prop="prop"
        :label="label | formatFormItemLabel"
      >
        <template v-if="prop === 'requestMethod'">
          <span>{{ detailDrawerFormData[prop] | formatFormItemText }}</span>
        </template>
        <template v-else-if="prop === 'pin'">
          <span>{{ detailDrawerFormData[prop] | formatFormItemText }}</span>
        </template>
        <template v-else>
          <span v-if="prop === 'exceptionMessage'">
            {{ detailDrawerFormData[prop] | formatFormItemText }}
          </span>
          <span v-else class="form-json-text">
            {{ detailDrawerFormData[prop] | formatFormItemText }}
          </span>
          <el-tooltip
            v-if="detailDrawerFormData[prop]"
            effect="dark"
            placement="top"
            :content="label | formatFormItemToolTipContent"
          >
            <el-button type="text" @click="handleClickCopyButton(prop, label)">
              <i class="el-icon-document-copy" />
            </el-button>
          </el-tooltip>
        </template>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<script>
export default {
  name: "DetailDrawer",
  filters: {
    formatFormItemLabel(label) {
      return `${label}：` || "";
    },
    formatFormItemText(value) {
      return value || "-";
    },
    formatFormItemToolTipContent(label) {
      return `复制${label || ""}`;
    },
  },
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    detailDrawerLoading: {
      type: Boolean,
      required: true,
    },
    detailDrawerFormData: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      formList: [
        { prop: "requestMethod", label: "请求方法" },
        { prop: "pin", label: "Pin" },
        { prop: "request", label: "请求报文" },
        { prop: "response", label: "响应报文" },
        { prop: "exceptionMessage", label: "异常描述" },
      ],
    };
  },
  methods: {
    handleClickCopyButton(prop, label) {
      const elInput = document.createElement("input");
      elInput.value = this.detailDrawerFormData[prop] || "";
      document.body.appendChild(elInput);
      elInput.select();
      if (document.execCommand("Copy") === true) {
        this.$message.success(`已成功复制${label || ""}`);
      } else {
        this.$message.error(`复制${label || ""}失败`);
      }
      elInput.remove();
    },
  },
};
</script>

<style lang="scss" scoped>
.detail-drawer {
  /deep/.el-drawer__header {
    margin-bottom: 6px;
    font-size: 16px;
    font-weight: 500;
  }

  /deep/ .el-drawer__body {
    padding: 8px;
    overflow: auto;

    .detail-drawer-form {
      padding-top: 20px;
      border-top: 1px solid #dee0e3;
      .form-json-text {
        word-break: break-all;
      }
    }
  }
}
</style>
