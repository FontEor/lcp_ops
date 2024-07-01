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
      label-width="120px"
      :model="detailDrawerFormData"
    >
      <el-form-item
        v-for="{ prop, label } in drawerData"
        :key="prop"
        :prop="prop"
        :label="label | formatFormItemLabel"
      >
        <template v-if="prop === 'receiveType'">
          <span>{{ detailDrawerFormData[prop] | formatReceiveType }}</span>
        </template>
        <template v-if="prop === 'appKey'">
          <span>{{ detailDrawerFormData[prop] | formatFormItemText }}</span>
        </template>
        <template v-else-if="prop === 'requestHeaders'">
          <span style="font-size: 0.5rem">{{
            detailDrawerFormData[prop] | formatFormItemText
          }}</span>
        </template>
        <template v-else-if="prop === 'urlArgs'">
          <span style="font-size: 0.5rem">{{
            detailDrawerFormData[prop] | formatFormItemText
          }}</span>
        </template>
        <template v-else-if="prop === 'requestParam'">
          <span style="font-size: 0.5rem">{{
            detailDrawerFormData[prop] | formatFormItemText
          }}</span>
        </template>
        <template v-else-if="prop === 'responseHeaders'">
          <span style="font-size: 0.5rem">{{
            detailDrawerFormData[prop] | formatFormItemText
          }}</span>
        </template>
        <template v-else-if="prop === 'responseParam'">
          <span style="font-size: 0.5rem">{{
            detailDrawerFormData[prop] | formatFormItemText
          }}</span>
        </template>
        <template v-else-if="prop === 'errorMessage'">
          <span>
            {{ detailDrawerFormData[prop] | formatFormItemText }}
          </span>
        </template>
        <template v-else-if="prop === 'pin'">
          <span>{{ detailDrawerFormData[prop] | formatFormItemText }}</span>
        </template>
        <template v-else-if="prop === 'callbackUrl'">
          <span>
            {{ detailDrawerFormData[prop] | formatFormItemText }}
          </span>
        </template>
        <template v-else-if="prop === 'status'">
          <span>
            {{ detailDrawerFormData[prop] | formatFormItemText }}
          </span>
        </template>
        <template v-else-if="prop === 'clientIp'">
          <span>
            {{ detailDrawerFormData[prop] | formatFormItemText }}
          </span>
        </template>
        <template v-else-if="prop === 'consuming'">
          <span>
            {{ detailDrawerFormData[prop] | formatFormItemText }}
          </span>
        </template>
        <template v-else-if="prop === 'traceId'">
          <span>
            {{ detailDrawerFormData[prop] | formatFormItemText }}
          </span>
        </template>
        <el-tooltip
          v-if="detailDrawerFormData[prop] && prop !== 'receiveType'"
          effect="dark"
          placement="top"
          :content="label | formatFormItemToolTipContent"
        >
          <el-button type="text" @click="handleClickCopyButton(prop, label)">
            <i class="el-icon-document-copy" />
          </el-button>
        </el-tooltip>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<script>
export default {
  name: "DetailDrawer",
  filters: {
    formatReceiveType(value) {
      return value === "1" ? "http" : "websocket";
    },
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
      drawerList: [
        { prop: "receiveType", label: "推送方式" }, //1
        { prop: "appKey", label: "AppKey" }, //1
        { prop: "requestHeaders", label: "请求headers" }, //v-if=http
        { prop: "urlArgs", label: "请求urlArgs" }, //v-if=http
        { prop: "requestParam", label: "请求报文" }, //1
        { prop: "responseHeaders", label: "响应headers" }, //v-if=http
        { prop: "responseParam", label: "响应报文" }, //v-if=http
        { prop: "errorMessage", label: "异常信息" }, //1
        { prop: "clientIp", label: "ip地址" }, //v-if=websocket
        { prop: "pin", label: "pin" }, //1
        { prop: "callbackUrl", label: "回调地址" }, //v-if=http
        { prop: "status", label: "状态码" }, //v-if=http
        { prop: "consuming", label: "耗时时间(ms)" }, //1
        { prop: "traceId", label: "traceId" }, //1
      ],
      drawerData: [],
    };
  },
  computed: {
    computeDetailDrawerFormData() {},
  },
  watch: {
    //f318c06f78a84354b51332b0b48fdd1e
    visible() {
      if (this.detailDrawerFormData["receiveType"] === "1") {
        this.drawerData = this.drawerList.filter(
          (item) => item.prop !== "clientIp"
        );
      } else {
        const httpList = [
          "requestHeaders",
          "urlArgs",
          "responseHeaders",
          "responseParam",
          "callbackUrl",
          "status",
        ];
        this.drawerData = this.drawerList.filter(
          (item) => !httpList.includes(item.prop)
        );
      }
    },
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
