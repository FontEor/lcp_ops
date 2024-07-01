<template>
  <!-- 参考 src/views/apiManagementAudit/PublicApiPublishAudit.vue -->
  <div class="tab-pane-i18n-api-release-approval app-container">
    <div class="search-wrap">
      <span class="label">JSF接口名</span>
      <el-input
        class="search-input"
        v-model="jsfName"
        clearable
        placeholder="请输入JSF接口名、中文名称"
      ></el-input>
      <el-select v-model="site">
        <el-option
          v-for="{ label, value } in siteList"
          :key="value"
          :label="label"
          :value="value"
        />
      </el-select>
      <el-button
        type="primary"
        size="small"
        icon="el-icon-search"
        @click="handlerSearch"
        >查询</el-button
      >
    </div>

    <el-table :data="tableData">
      <el-table-column type="index" label="序号" width="50" />
      <el-table-column prop="qualifiedName" label="JSF接口名" />
      <el-table-column prop="cnName" label="中文名称" />
      <el-table-column prop="reason" label="发布原因" />
      <el-table-column prop="applier" label="申请人" />
      <el-table-column prop="createTime" label="申请时间" width="100%">
        <template slot-scope="{ row }">{{
          formateTime(row.createTime)
        }}</template>
      </el-table-column>
      <el-table-column prop="approveStatus" label="状态">
        <template slot-scope="{ row }">{{
          statusText(row && row.approveStatus)
        }}</template>
      </el-table-column>
      <el-table-column prop="approver" label="审核人" width="100%">
      </el-table-column>
      <el-table-column prop="updateTime" label="审核时间" width="100%">
        <template slot-scope="{ row }">{{
          formateTime(row.updateTime)
        }}</template>
      </el-table-column>
      <el-table-column label="操作" width="100%">
        <template slot-scope="{ row }">
          <el-button type="text" @click="handleDetail(row)">详情</el-button>
          <el-button
            type="text"
            v-if="+row.approveStatus === 0"
            @click="handleApproval(row)"
            >审批</el-button
          >
          <el-button
            type="text"
            v-if="+row.approveStatus === 1 || +row.approveStatus === 3"
            @click="handleApprovalMessage(row)"
            >审批意见</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      class="pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageInfo.pageIndex"
      :page-sizes="[10, 20, 30, 50]"
      :page-size="pageInfo.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pageInfo.total"
    >
    </el-pagination>

    <ApprovalDialog
      :dialogVisible.sync="approvalDialogVisible"
      :rowInfo="rowInfo"
      :site="site"
      @updateList="getTableData"
    />
    <ApprovalDetailDialog
      :dialogVisible.sync="approvalDetailDialogVisible"
      :rowInfo="rowInfo"
      :site="site"
    />
  </div>
</template>

<script>
import lopOpenApidepot from "@/api/lopOpenApidepot/index";
import ApprovalDialog from "./components/ApprovalDialog.vue";
import ApprovalDetailDialog from "./components/ApprovalDetailDialog.vue";
import parseTimeNew from "@/utils/parseTime.js";

const statusMap = {
  0: "待审核",
  1: "通过",
  3: "驳回",
};

export default {
  name: "TabPaneI18nApiReleaseApproval",
  components: {
    ApprovalDialog,
    ApprovalDetailDialog,
  },
  data() {
    return {
      site: "us",
      siteList: [
        { label: "美国站", value: "us" },
        { label: "欧洲站", value: "eu" },
      ],

      jsfName: "",
      searchKeyWord: "",
      tableData: [],
      pageInfo: {
        pageSize: 10,
        pageIndex: 1,
        total: 0,
      },
      approvalDialogVisible: false,
      rowInfo: {},
      approvalDetailDialogVisible: false,
    };
  },
  computed: {
    statusText() {
      return (status) => statusMap[+status];
    },
    formateTime() {
      return (time) => parseTimeNew.timeInTable(time);
    },
  },
  mounted() {
    this.getTableData();
  },
  methods: {
    handlerSearch() {
      this.pageInfo.pageIndex = 1;
      this.searchKeyWord = this.jsfName;
      this.getTableData();
    },
    handleSizeChange(pageSize) {
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageSize = pageSize;
      this.getTableData();
    },
    handleCurrentChange(pageIndex) {
      this.pageInfo.pageIndex = pageIndex;
      this.getTableData();
    },
    handleDetail(row) {
      this.approvalDetailDialogVisible = true;
      this.rowInfo = row;
    },
    handleApproval(row) {
      this.approvalDialogVisible = true;
      this.rowInfo = row;
    },
    handleApprovalMessage(row) {
      this.$alert(`${row.approveComment}`, "审批意见", {
        confirmButtonText: "关闭",
      });
    },
    getTableData() {
      const params = [
        {
          page: this.pageInfo.pageIndex,
          pageSize: this.pageInfo.pageSize,
        },
        {
          searchKeyWord: this.searchKeyWord,
        },
      ];
      const { site } = this;
      lopOpenApidepot.PublicApiPublishAudit.queryPendingApiI18n(params, site)
        .then((response) => {
          const { code, message, data } = response;
          if (+code === 20000) {
            const { page, pageSize, total, rows } = data || {};
            this.pageInfo = {
              pageSize,
              pageIndex: page,
              total,
            };
            this.tableData = Array.isArray(rows) ? rows : [];
          } else {
            this.$message.error({ message });
          }
        })
        .catch((err) => {
          this.$message.error({ message: err });
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.search-wrap {
  display: flex;
  align-items: center;
  margin-bottom: 30px;

  .search-input {
    width: 25%;
  }
}

.pagination {
  text-align: right;
  padding-top: 20px;
}
</style>