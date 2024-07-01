<template>
  <div class="api-callback-publish-audit">
    <el-form :model="formModel">
      <el-row style="display: flex; flex-wrap: wrap">
        <el-col :span="8">
          <el-form-item label="回传API所属分组编码" label-width="160px">
            <el-input v-model.trim="formModel.outerDomain" :clearable="true" placeholder="请输入回传API所属分组编码" style="width: 100%;" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="URL" label-width="60px">
            <el-input v-model.trim="formModel.url" :clearable="true" placeholder="请输入回传API的URL" style="width: 100%;" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="审批类型" label-width="80px">
            <el-select v-model="formModel.status" :clearable="true" placeholder="请选择审批类型">
              <el-option v-for="{ label, value } in statusOptionList" :key="value" :label="label" :value="value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" icon="el-icon-search" style="float: right;" @click="onClickFormSearchButton">查询</el-button>
        </el-col>
      </el-row>
    </el-form>

    <el-table v-loading="tableLoading" :data="tableData">
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column v-for="{ label, prop, minWidth } in tableColumnList" :key="prop" :label="label" :prop="prop" :min-width="minWidth">
        <template #default="{row}">
          <span v-if="['outerDomainName'].includes(prop)">
            {{ formatTableColumnOuterDomainNameText(row) }}
          </span>
          <span v-else-if="['approveStatus'].includes(prop)">
            {{ formatTableColumnApproveStatusText(row[prop]) }}
          </span>
          <span v-else-if="['createTime', 'updateTime'].includes(prop)">
            {{ formatTableColumnTimeText(row[prop]) }}
          </span>
          <span v-else>
            {{ row[prop] }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120" fixed="right">
        <template #default="{row}">
          <el-button type="text" @click="onClickTableColumnDetailButton(row)">详情</el-button>
          <el-button v-if="ApproveButtonVisible(row)" type="text" @click="onClickTableColumnApproveButton(row)">审批</el-button>
          <el-button v-else-if="ApproveCommentButtonVisible(row)" type="text" @click="onClickTableColumnApproveCommentButton(row)">审批意见</el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination :currentPage.sync="page" :pageSize.sync="pageSize" :total.sync="total" :reloadTableData="() => handleQueryPendingApiList()" />

    <DialogDetail :dialogVisible.sync="dialogDetailVisible" :row="row" />
    <DialogApprove :dialogVisible.sync="dialogApproveVisible" :row="row" @close="onCloseDialogApprove" />
    <DialogApproveComment :dialogVisible.sync="dialogApproveCommentVisible" :row="row" />
  </div>
</template>

<script>
import Pagination from "@/components/Pagination.vue";
import DialogDetail from "./components/dialog-detail.vue";
import DialogApprove from "./components/dialog-approve.vue";
import DialogApproveComment from "./components/dialog-approve-comment.vue";
import gw from "@/api/gw/index";

export default {
  name: "ApiCallbackPublishAudit",
  components: { Pagination, DialogDetail, DialogApprove, DialogApproveComment },
  data() {
    return {
      formModel: {
        outerDomain: "",
        url: "",
        status: ""
      },
      statusOptionList: [
        { label: "待审核", value: 0 },
        { label: "通过", value: 1 },
        { label: "驳回", value: 3 }
      ],

      tableLoading: false,
      tableData: [],
      tableColumnList: [
        { label: "回传API所属分组", prop: "outerDomainName", minWidth: "240" },
        { label: "URL", prop: "url", minWidth: "200" },
        { label: "发布原因", prop: "reason", minWidth: "160" },
        { label: "申请人", prop: "applier", minWidth: "120" },
        { label: "申请时间", prop: "createTime", minWidth: "160" },
        { label: "状态", prop: "approveStatus", minWidth: "100" },
        { label: "审核人", prop: "approver", minWidth: "120" },
        { label: "审核时间", prop: "updateTime", minWidth: "160" }
      ],

      page: 1,
      pageSize: 10,
      total: 0,

      row: {},
      dialogDetailVisible: false,
      dialogApproveVisible: false,
      dialogApproveCommentVisible: false
    };
  },
  methods: {
    async queryPendingApiList() {
      const { page, pageSize } = this;
      const { outerDomain, url } = this.formModel;
      let { status } = this.formModel;
      status = status === "" ? undefined : status;
      const data = [
        { page, pageSize },
        { outerDomain, url, status }
      ];
      return await gw.OuterDomainApiService.queryPendingApiList(data);
    },

    async handleQueryPendingApiList(page = 0) {
      this.tableLoading = true;
      this.page = page || this.page;
      const {
        data: { total, rows }
      } = await this.queryPendingApiList().catch(error => {
        console.error("handleQueryPendingApiList");
        throw error;
      });
      this.total = total || 0;
      this.tableData = Array.isArray(rows) ? rows : [];
      this.tableLoading = false;
    },

    formatTableColumnOuterDomainNameText(row) {
      const { outerDomainName, outerDomain } = row;
      return `${outerDomainName || ""} ${outerDomain ? `(${outerDomain})` : ""}`;
    },
    formatTableColumnApproveStatusText(value) {
      const hashMap = new Map()
        .set(0, "待审核")
        .set(1, "通过")
        .set(3, "驳回");
      return hashMap.get(value) || "";
    },
    formatTableColumnTimeText(value) {
      return value ? this.$dayjs(value).format("YYYY-MM-DD HH:mm:ss") : "";
    },
    ApproveButtonVisible(row) {
      const { approveStatus } = row;
      return approveStatus === 0;
    },
    ApproveCommentButtonVisible(row) {
      const { approveStatus } = row;
      const list = [1, 3];
      return list.includes(approveStatus);
    },

    async onClickFormSearchButton() {
      await this.handleQueryPendingApiList(1).catch(error => {
        console.error("onClickFormSearchButton");
        throw error;
      });
    },
    onClickTableColumnDetailButton(row) {
      this.row = row || {};
      this.dialogDetailVisible = true;
    },
    onClickTableColumnApproveButton(row) {
      this.row = row || {};
      this.dialogApproveVisible = true;
    },
    onClickTableColumnApproveCommentButton(row) {
      this.row = row || {};
      this.dialogApproveCommentVisible = true;
    },
    async onCloseDialogApprove() {
      await this.handleQueryPendingApiList().catch(error => {
        console.error("onCloseDialogApprove");
        throw error;
      });
    }
  },
  async created() {
    await this.onClickFormSearchButton().catch(error => {
      console.error("created");
      throw error;
    });
  }
};
</script>

<style lang="scss" scoped>
// .api-callback-publish-audit {
// }
</style>
