<template>
  <div class="message-release-review">
    <el-input
      v-model="topic"
      placeholder="输入消息TOPIC、消息名称"
      :clearable="true"
      style="width: 320px"
    ></el-input>
    <el-button
      type="primary"
      icon="el-icon-search"
      style="margin: 0 0 20px 10px"
      @click="reloadTableData(1)"
      >查询</el-button
    >

    <!-- 列表 -->
    <el-table :data="tableData">
      <el-table-column type="index" label="序号" />
      <el-table-column prop="topic" label="消息TOPIC" />
      <el-table-column prop="cnName" label="消息名称" />
      <el-table-column prop="publisher" label="申请人" />
      <el-table-column prop="publishTime" label="申请时间">
        <template slot-scope="scope">{{
          formatTime(scope.row.publishTime)
        }}</template>
      </el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">{{
          formatStatus(scope.row.status)
        }}</template>
      </el-table-column>
      <el-table-column prop="checker" label="审核人" />
      <el-table-column prop="checkTime" label="审核时间">
        <template slot-scope="scope">{{
          formatTime(scope.row.checkTime)
        }}</template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{ row }">
          <el-button type="text" @click="handleDetail(row)">详情</el-button>
          <el-button
            v-if="row.status === 0 || row.status === 1"
            type="text"
            @click="handleApproval(row)"
            >审批</el-button
          >
          <el-button v-else type="text" @click="checkApprovalOpinion(row)"
            >审批意见</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 详情 -->
    <el-dialog
      class="dialog-detail"
      title="详情"
      v-if="dialogDetailVisible"
      :visible.sync="dialogDetailVisible"
      width="70%"
    >
      <h1 class="dialog-detail-title">
        {{ messageDetail.topic }}({{ messageDetail.cnName }})
      </h1>
      <p class="dialog-detail-desc">{{ messageDetail.remark }}</p>
      <h2 class="action-tip">消息属性</h2>
      <el-table
        :data="messageDocTable"
        max-height="560"
        :tree-props="{ children: 'children' }"
        :hide-empty-img="true"
        :default-expand-all="false"
        row-key="id"
        stripe
      >
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="type" label="类型" />
        <el-table-column prop="required" label="是否必选">
          <template slot-scope="scope">{{
            formatRequired(scope.row.required)
          }}</template>
        </el-table-column>
        <el-table-column prop="exampleValue" label="示例值" />
        <el-table-column prop="remark" label="描述" />
      </el-table>
    </el-dialog>

    <!-- 审批 -->
    <el-dialog
      title="审批"
      :visible.sync="dialogApprovalVisible"
      @closed="handleCloseApproval"
      width="30%"
    >
      <el-input
        v-model="checkReason"
        type="textarea"
        :rows="6"
        placeholder="请填写审批意见"
      ></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogApprovalVisible = false">取消</el-button>
        <el-button type="primary" @click="handleApprovalDecision(3)"
          >驳回</el-button
        >
        <el-button type="primary" @click="handleApprovalDecision(2)"
          >通过</el-button
        >
      </span>
    </el-dialog>

    <!-- 审批意见 -->
    <el-dialog
      title="审批意见"
      :visible.sync="dialogApprovalOpinionVisible"
      width="30%"
    >
      <span>{{ checkReasonDisplay }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogApprovalOpinionVisible = false"
          >关闭</el-button
        >
      </span>
    </el-dialog>

    <!-- 分页 -->
    <Pagination
      :currentPage.sync="pageNumb"
      :pageSize.sync="pageSize"
      :total.sync="total"
      :reloadTableData="reloadTableData"
    />
  </div>
</template>

<script>
import gw from "@/api/gw/index";
import parseTime from "@/utils/parseTime";
import Pagination from "@/components/Pagination.vue";

export default {
  name: "InterfaceSearchTable",
  components: { Pagination },
  data() {
    return {
      dialogDetailVisible: false,
      dialogApprovalVisible: false,
      dialogApprovalOpinionVisible: false,
      topic: "",
      checkReason: "",
      checkReasonDisplay: "",
      tableData: [],
      messageDocTable: [],
      pageNumb: 1,
      pageSize: 10,
      total: 0,
      currentData: {},
      messageDetail: {},
    };
  },
  mounted() {
    this.reloadTableData();
  },
  methods: {
    formatTime(time) {
      return parseTime.timeInTable(time) || "-";
    },
    // status枚举
    formatStatus(status) {
      const hashMapStatus = ["初始化", "待审批", "通过", "驳回"];
      return hashMapStatus[status];
    },
    formatRequired(required) {
      const hashMap = { 0: "否", 1: "是" };
      return hashMap[required] || "";
    },
    async reloadTableData(page = 0) {
      this.pageNumb = page || this.pageNumb;
      const response = await this.searchMessageLog().catch((error) => {
        this.tableData = [];
        this.pageSize = 10;
        this.total = 0;
        throw new Error(`reloadTableData, ${error}`);
      });
      this.tableData = response.data.list;
      this.total = response.data.total;
    },
    // 查询消息列表数据
    async searchMessageLog() {
      // 接口要求topic和cnName传相同值
      const topic = this.topic;
      const cnName = this.topic;
      const pageSize = this.pageSize;
      const pageNumb = this.pageNumb;
      const data = [
        { pageSize, pageNumb },
        { topic, cnName },
      ];
      return await gw.messagePlatformApproveService
        .searchMessageLog(data)
        .catch((error) => {
          throw new Error(`searchMessageLog, ${error}`);
        });
    },
    // 详情
    async handleDetail(row) {
      this.dialogDetailVisible = true;
      const data = { topic: row.topic };
      const response = await gw.messagePlatformApproveService
        .queryDoc([data])
        .catch((error) => {
          this.messageDocTable = [];
          this.messageDetail.topic = null;
          this.messageDetail.cnName = null;
          this.messageDetail.remark = null;
          throw new Error("queryDoc", error);
        });
      this.messageDocTable = response.data.paramList;
      this.messageDetail.topic = response.data.topic;
      this.messageDetail.cnName = response.data.cnName;
      this.messageDetail.remark = response.data.remark;
    },
    // 审批意见
    checkApprovalOpinion(row) {
      this.checkReasonDisplay = row.checkReason;
      this.dialogApprovalOpinionVisible = true;
    },
    // 审批
    handleApproval(row) {
      this.dialogApprovalVisible = true;
      this.currentData = row;
    },
    // 关闭审批弹窗操作
    handleCloseApproval() {
      this.checkReason = "";
    },
    // 审批接口
    async handleApprovalDecision(status) {
      if (!this.checkReason) {
        this.$message.error("请填写审批意见");
      } else {
        const { topic, version } = this.currentData;
        const checkReason = this.checkReason;
        const data = {
          topic,
          version,
          status,
          checkReason,
        };
        const response = await gw.messagePlatformApproveService
          .approvePublish([data])
          .catch((error) => {
            this.$message.error(error.message);
            throw new Error(`approvePublish, ${error}`);
          });
        this.dialogApprovalVisible = false;
        this.reloadTableData();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.message-release-review {
  .dialog-detail {
    ::v-deep .el-dialog__body {
      min-height: 700px;
      overflow: auto;
    }
    .dialog-detail-title {
      font-size: 20px;
      color: #333;
      line-height: 30px;
    }
    .dialog-detail-desc {
      padding-top: 5px;
      color: #666;
      font-size: 14px;
      line-height: 24px;
      white-space: pre-wrap;
    }
    .action-tip {
      font-size: 16px;
      padding: 20px 12px;
      position: relative;
      &::before {
        content: "";
        position: absolute;
        top: 50%;
        left: 0;
        margin-top: -2px;
        width: 4px;
        height: 4px;
        background: #3c6ef0;
        border-radius: 50%;
      }
    }
  }
}
</style>