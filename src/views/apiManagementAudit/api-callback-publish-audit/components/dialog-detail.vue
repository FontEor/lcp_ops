<template>
  <el-dialog
    :visible="dialogVisible"
    :close-on-click-modal="false"
    title="详情"
    width="1200px"
    top="10vh"
    ref="dialogDetailRef"
    class="dialog-detail"
    @open="onOpenDialog"
    @opened="onOpenedDialog"
    @close="onCloseDialog"
  >
    <div v-loading="dialogLoading" class="dialog-detail__content">
      <p class="content__title">{{ name }}{{ cnName ? `（${cnName}）` : "" }}</p>
      <p class="content__remark">{{ remark }}</p>

      <template>
        <p class="content__item-title">安全配置</p>
        <el-table :data="pluginConfigTableData" :span-method="pluginConfigTableSpanMethod" border hide-empty-img>
          <el-table-column prop="pluginCode" label="配置项" width="200px">
            <template #default="{row}">
              <span :class="{ 'update-color': tableColumnPluginCodeUpdateColorClassNameVisible }">
                {{ formatTableColumnPluginCodeText(row["pluginCode"]) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="pluginConfig" label="配置明细">
            <template #default="{row:{pluginConfig},$index}">
              <el-row v-if="($index + 1) % 3 === 1">
                <el-col :class="{ 'update-color': tableColumnCiphertextUpdateColorClassNameVisible }" :span="3">
                  加解密内容
                </el-col>

                <el-col :class="{ 'update-color': tableColumnCiphertextIsReqEncryptUpdateColorClassNameVisible }" :span="4">
                  请求报文加密：{{ formatTableColumnCiphertextText(pluginConfig, "ciphertextIsReqEncrypt") }}
                </el-col>
                <el-col :class="{ 'update-color': tableColumnCiphertextIsRespDecryptUpdateColorClassNameVisible }" :span="17">
                  响应报文解密：{{ formatTableColumnCiphertextText(pluginConfig, "ciphertextIsRespDecrypt") }}
                </el-col>
              </el-row>

              <el-row v-else-if="($index + 1) % 3 === 2">
                <el-col :class="{ 'update-color': tableColumnCipherAlgorithmUpdateColorClassNameVisible }" :span="3">
                  加密算法
                </el-col>

                <el-col :class="{ 'update-color': tableColumnCipherAlgorithmNameUpdateColorClassNameVisible }" :span="4"> 算法名称：{{ pluginConfig["cipherAlgorithmName"] || "" }} </el-col>
                <el-col :class="{ 'update-color': tableColumnCipherAlgorithmModeUpdateColorClassNameVisible }" :span="4"> 加密模式：{{ pluginConfig["cipherAlgorithmMode"] || "" }} </el-col>
                <el-col :class="{ 'update-color': tableColumnCipherAlgorithmBlockSizeUpdateColorClassNameVisible }" :span="4">
                  加密块位数：{{ pluginConfig["cipherAlgorithmBlockSize"] || "" }}
                </el-col>
                <el-col :class="{ 'update-color': tableColumnCipherAlgorithmKeySizeUpdateColorClassNameVisible }" :span="4"> 密钥位数：{{ pluginConfig["cipherAlgorithmKeySize"] || "" }} </el-col>
                <el-col :class="{ 'update-color': tableColumnCipherAlgorithmPaddingModeUpdateColorClassNameVisible }" :span="5">
                  填充模式：{{ pluginConfig["cipherAlgorithmPaddingMode"] || "" }}
                </el-col>
              </el-row>

              <el-row v-else-if="($index + 1) % 3 === 0">
                <el-col :class="{ 'update-color': tableColumnCipherSourceUpdateColorClassNameVisible }" :span="3">
                  密码来源
                </el-col>

                <el-col :class="{ 'update-color': tableColumnCipherSourceTypeUpdateColorClassNameVisible }" :span="4"> 密文来源：{{ formatTableColumnCipherSourceTypeText(pluginConfig) }} </el-col>
                <el-col :class="{ 'update-color': tableColumnCipherSourceNameUpdateColorClassNameVisible }" :span="17"> 密文字段名：{{ pluginConfig["cipherSourceName"] || "" }} </el-col>
              </el-row>
            </template>
          </el-table-column>
        </el-table>
      </template>

      <template>
        <p class="content__item-title">请求参数</p>
        <el-table :data="inParamList" row-key="id" border hide-empty-img default-expand-all>
          <el-table-column prop="name" label="名称" />
          <el-table-column prop="type" label="类型" />
          <el-table-column prop="required" label="是否必选">
            <template #default="{ row:{required} }">
              {{ formatTableColumnRequiredText(required) }}
            </template>
          </el-table-column>
          <el-table-column prop="exampleValue" label="示例值" />
          <el-table-column prop="remark" label="描述" />
        </el-table>
      </template>
      <template>
        <p class="content__item-title">响应参数</p>
        <el-table :data="outParamList" row-key="id" border hide-empty-img default-expand-all>
          <el-table-column prop="name" label="名称" />
          <el-table-column prop="type" label="类型" />
          <el-table-column prop="exampleValue" label="示例值" />
          <el-table-column prop="remark" label="描述" />
        </el-table>
      </template>
      <template>
        <p class="content__item-title">错误码</p>
        <el-table :data="errorCodeList" row-key="id" border hide-empty-img>
          <el-table-column prop="errorCode" label="错误码" width="200" />
          <el-table-column prop="errorMsg" label="错误信息" />
          <el-table-column prop="solution" label="处理建议" />
        </el-table>
      </template>
    </div>
  </el-dialog>
</template>

<script>
import gw from "@/api/gw/index";

export default {
  name: "DialogDetail",
  props: { dialogVisible: { type: Boolean, required: true }, row: { type: Object, required: true } },
  data() {
    return {
      dialogLoading: false,
      name: "",
      cnName: "",
      remark: "",
      inParamList: [],
      outParamList: [],
      errorCodeList: [],
      pluginConfig: {},
      pluginConfigTableData: [],
      updateConfigList: []
    };
  },
  computed: {
    tableColumnPluginCodeUpdateColorClassNameVisible() {
      const { updateConfigList } = this;
      return updateConfigList.length > 0;
    },

    tableColumnCiphertextIsReqEncryptUpdateColorClassNameVisible() {
      const { updateConfigList } = this;
      return updateConfigList.includes("ciphertextIsReqEncrypt");
    },
    tableColumnCiphertextIsRespDecryptUpdateColorClassNameVisible() {
      const { updateConfigList } = this;
      return updateConfigList.includes("ciphertextIsRespDecrypt");
    },
    tableColumnCiphertextUpdateColorClassNameVisible() {
      const { tableColumnCiphertextIsReqEncryptUpdateColorClassNameVisible, tableColumnCiphertextIsRespDecryptUpdateColorClassNameVisible } = this;
      return tableColumnCiphertextIsReqEncryptUpdateColorClassNameVisible || tableColumnCiphertextIsRespDecryptUpdateColorClassNameVisible;
    },

    tableColumnCipherAlgorithmNameUpdateColorClassNameVisible() {
      const { updateConfigList } = this;
      return updateConfigList.includes("cipherAlgorithmName");
    },
    tableColumnCipherAlgorithmModeUpdateColorClassNameVisible() {
      const { updateConfigList } = this;
      return updateConfigList.includes("cipherAlgorithmMode");
    },
    tableColumnCipherAlgorithmBlockSizeUpdateColorClassNameVisible() {
      const { updateConfigList } = this;
      return updateConfigList.includes("cipherAlgorithmBlockSize");
    },
    tableColumnCipherAlgorithmKeySizeUpdateColorClassNameVisible() {
      const { updateConfigList } = this;
      return updateConfigList.includes("cipherAlgorithmKeySize");
    },
    tableColumnCipherAlgorithmPaddingModeUpdateColorClassNameVisible() {
      const { updateConfigList } = this;
      return updateConfigList.includes("cipherAlgorithmPaddingMode");
    },
    tableColumnCipherAlgorithmUpdateColorClassNameVisible() {
      const {
        tableColumnCipherAlgorithmNameUpdateColorClassNameVisible,
        tableColumnCipherAlgorithmModeUpdateColorClassNameVisible,
        tableColumnCipherAlgorithmBlockSizeUpdateColorClassNameVisible,
        tableColumnCipherAlgorithmKeySizeUpdateColorClassNameVisible,
        tableColumnCipherAlgorithmPaddingModeUpdateColorClassNameVisible
      } = this;
      return (
        tableColumnCipherAlgorithmNameUpdateColorClassNameVisible ||
        tableColumnCipherAlgorithmModeUpdateColorClassNameVisible ||
        tableColumnCipherAlgorithmBlockSizeUpdateColorClassNameVisible ||
        tableColumnCipherAlgorithmKeySizeUpdateColorClassNameVisible ||
        tableColumnCipherAlgorithmPaddingModeUpdateColorClassNameVisible
      );
    },

    tableColumnCipherSourceTypeUpdateColorClassNameVisible() {
      const { updateConfigList } = this;
      return updateConfigList.includes("cipherSourceType");
    },
    tableColumnCipherSourceNameUpdateColorClassNameVisible() {
      const { updateConfigList } = this;
      return updateConfigList.includes("cipherSourceName");
    },
    tableColumnCipherSourceUpdateColorClassNameVisible() {
      const { tableColumnCipherSourceTypeUpdateColorClassNameVisible, tableColumnCipherSourceNameUpdateColorClassNameVisible } = this;
      return tableColumnCipherSourceTypeUpdateColorClassNameVisible || tableColumnCipherSourceNameUpdateColorClassNameVisible;
    }
  },
  methods: {
    async queryPendingApiDetails() {
      const { apiId, outerDomainId } = this.row;
      const data = [{ apiId, outerDomainId }];
      return await gw.OuterDomainApiService.queryPendingApiDetails(data);
    },

    async handleQueryPendingApiDetails() {
      const {
        data: { name, cnName, remark, inParamList, outParamList, errorCodeList, pluginConfig, updateConfigList, pluginCode }
      } = await this.queryPendingApiDetails().catch(error => {
        console.error("handleQueryPendingApiDetails");
        throw error;
      });
      this.name = name || "";
      this.cnName = cnName || "";
      this.remark = remark || "";
      this.inParamList = Array.isArray(inParamList) ? inParamList : [];
      this.outParamList = Array.isArray(outParamList) ? outParamList : [];
      this.errorCodeList = Array.isArray(errorCodeList) ? errorCodeList : [];
      this.updateConfigList = Array.isArray(updateConfigList) ? updateConfigList : [];
      this.pluginConfig = pluginConfig || {};
      this.pluginConfigTableData = pluginConfig
        ? [
            { pluginCode, pluginConfig },
            { pluginCode, pluginConfig },
            { pluginCode, pluginConfig }
          ]
        : [];
    },

    pluginConfigTableSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex !== 0) {
        return;
      }
      if (rowIndex % 3 !== 0) {
        return [0, 0];
      }
      return [3, 1];
    },
    formatTableColumnPluginCodeText(value) {
      const hashMap = new Map().set("out-cipher", "传输加密：平台通用加密");
      return hashMap.get(value) || "";
    },
    formatTableColumnCiphertextText(pluginConfig, prop) {
      const value = pluginConfig[prop];
      if (typeof value !== "boolean") {
        return "";
      }
      return value ? "开" : "关";
    },
    formatTableColumnCipherSourceTypeText(pluginConfig) {
      const hashMap = new Map().set(1, "HTTP请求头").set(2, "URL参数");
      return hashMap.get(pluginConfig["cipherSourceType"]) || "";
    },
    formatTableColumnRequiredText(value) {
      const hashMap = new Map().set(0, "否").set(1, "是");
      return hashMap.get(Number(value)) || "";
    },

    async onOpenDialog() {
      this.dialogLoading = true;
      await this.handleQueryPendingApiDetails().catch(error => {
        console.error("onOpenDialog");
        throw error;
      });
      this.dialogLoading = false;
    },
    onOpenedDialog() {
      const top = 0;
      this.$refs["dialogDetailRef"].$el.querySelector(".el-dialog__body").scrollTo({ top });
    },
    onCloseDialog() {
      this.$emit("update:dialogVisible", false);
    }
  }
};
</script>

<style lang="scss" scoped>
.dialog-detail {
  /deep/ .el-dialog__body {
    max-height: 72vh;
  }

  .dialog-detail__content {
    .content__title {
      padding-bottom: 12px;
      font-size: 16px;
      font-weight: bold;
    }

    .content__item-title {
      margin: 16px 0;
      display: flex;
      align-items: center;
      font-size: 16px;

      &::before {
        margin-right: 12px;
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #3c6ef0;
        content: "";
      }
    }

    .el-table {
      .update-color {
        color: #26a872;
      }
    }
  }
}
</style>
