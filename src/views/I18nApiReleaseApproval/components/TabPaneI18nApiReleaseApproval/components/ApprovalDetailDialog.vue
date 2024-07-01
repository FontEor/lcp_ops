<template>
  <!-- 参考 src/views/apiManagementAudit/ApprovalDetailDialog.vue -->
  <el-dialog
    title="详情"
    :visible.sync="dialogVisible"
    width="70%"
    :before-close="handleClose"
  >
    <el-tabs v-model="activeTabId" @tab-click="handleChangeTab">
      <el-tab-pane
        class="tab-pane"
        v-for="item in tabList"
        :label="item.name"
        :key="item.id"
        :name="String(item.id)"
      >
        <p class="title">{{ detailInfo.name }}（{{ detailInfo.cnName }}）</p>
        <p class="des">{{ detailInfo.remark }}</p>
        <template>
          <p class="item-title">请求参数</p>
          <el-table
            :data="detailInfo.inParamList"
            row-key="id"
            border
            default-expand-all
            :tree-props="{ children: 'children' }"
          >
            <el-table-column prop="name" label="名称"> </el-table-column>
            <el-table-column prop="type" label="类型"> </el-table-column>
            <el-table-column prop="required" label="是否必选">
              <template slot-scope="{ row }">
                {{
                  (+row.required === 1 && "是") || (+row.required === 0 && "否")
                }}
              </template>
            </el-table-column>
            <el-table-column prop="exampleValue" label="示例值">
            </el-table-column>
            <el-table-column prop="remark" label="描述"> </el-table-column>
          </el-table>
        </template>
        <template>
          <p class="item-title">响应参数</p>
          <el-table
            :data="detailInfo.outParamList"
            row-key="id"
            border
            default-expand-all
            :tree-props="{ children: 'children' }"
          >
            <el-table-column prop="name" label="名称"> </el-table-column>
            <el-table-column prop="type" label="类型"> </el-table-column>
            <el-table-column prop="exampleValue" label="示例值">
            </el-table-column>
            <el-table-column prop="remark" label="描述"> </el-table-column>
          </el-table>
        </template>
        <template>
          <p class="item-title">错误码</p>
          <el-table :data="detailInfo.errorCodeList" row-key="id" border>
            <el-table-column prop="errorCode" label="错误码"> </el-table-column>
            <el-table-column prop="errorMsg" label="错误信息">
            </el-table-column>
          </el-table>
        </template>
        <template>
          <p class="item-title">JSF方法配置</p>
          <div class="config-content">
            <p class="config-item">
              异常类型白名单：{{ configInfo.whiteExcps }}
            </p>
            <p class="config-item">
              异常类型白名单生效范围：{{ configInfo.effRange }}
            </p>
          </div>
        </template>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script>
import lopOpenApidepot from "@/api/lopOpenApidepot/index";

export default {
  name: "ApprovalDetailDialog",
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    rowInfo: {
      type: Object,
      default: () => {},
    },
    site: {
      type: String,
    },
  },
  components: {},
  watch: {
    dialogVisible: {
      async handler(newVal) {
        this.tabList = [];
        this.detailInfo = {};
        this.activeTabId = "";
        if (newVal) {
          this.queryPendingMethodList();
        }
      },
      immediate: true,
    },
  },
  computed: {
    configInfo() {
      const configObj = JSON.parse(this.detailInfo.config || "{}");
      const whiteExcps =
        (configObj.respRules &&
          Object.keys(configObj.respRules.whiteExcps || {}).join(",")) ||
        "";
      let effRange = "";
      const effRangeList =
        (configObj.effRange && Object.keys(configObj.effRange)) || [];
      if (effRangeList.length === 1 && effRangeList[0] === "effAll") {
        effRange = "全部生效";
      } else {
        effRange = effRangeList.join(",");
      }
      return {
        whiteExcps,
        effRange,
      };
    },
  },
  data() {
    return {
      tabList: [
        // {
        //   id: 0,
        //   name: "aa"
        // }
      ],
      activeTabId: "",
      detailInfo: {},
    };
  },
  methods: {
    queryPendingMethodList() {
      const params = [{ qualifiedName: this.rowInfo.qualifiedName }];
      const { site } = this;
      lopOpenApidepot.PublicApiPublishAudit.queryPendingMethodListI18n(
        params,
        site
      )
        .then((response) => {
          const { code, data } = response || {};
          if (+code === 20000) {
            if (!data || !data.length) {
              this.$message({
                type: "warning",
                message: "详情为空",
              });
              return;
            }
            this.tabList = data;
            this.activeTabId = (data.length && String(data[0]["id"])) || "";
            this.activeTabId && this.handleChangeTab();
          } else {
            this.$message.error({ message: "请求失败" });
          }
        })
        .catch((err) => {
          this.$message.error({ message: err });
        });
    },
    handleChangeTab() {
      // this.detailInfo = {};
      const params = [{ id: +this.activeTabId }];
      const { site } = this;
      lopOpenApidepot.PublicApiPublishAudit.queryPendingMethodApiDocI18n(
        params,
        site
      )
        .then((response) => {
          console.log("response", response);
          const { code, message, data } = response;
          if (+code === 20000) {
            this.detailInfo = data;
          } else {
            this.$message.error({ message });
          }
        })
        .catch((err) => {
          this.$message.error({ message: err });
        });
    },
    handleClose() {
      this.$emit("update:dialogVisible", false);
    },
  },
  mounted() {},
};
</script>
<style lang="scss" scoped>
.title {
  font-size: 16px;
  font-weight: bold;
  padding-bottom: 12px;
}
.item-title {
  font-size: 16px;
  display: flex;
  align-items: center;
  margin: 16px 0;
  &::before {
    content: "";
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #3c6ef0;
    margin-right: 12px;
  }
}
.tab-pane {
  height: 600px;
  overflow: scroll;
}
.config-content {
  padding-left: 12px;
  .config-item {
    padding: 2px 0;
  }
}
</style>