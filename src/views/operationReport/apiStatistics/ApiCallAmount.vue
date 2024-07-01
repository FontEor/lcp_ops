<template>
  <div class="apiCallAmount">
    <header class="header">
      <div class="data-picker-wrapper">
        <el-date-picker
          v-model="timeRange"
          type="daterange"
          start-placeholder="开始日期"
          range-separator="至"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
          :picker-options="pickerOptions"
          @change="requestTableData"
        >
        </el-date-picker>
      </div>
      <div class="input-wrapper">
        <span class="input-label">API名称</span>
        <el-input
          v-model="qualifiedName"
          placeholder="请输入API名称"
          @keyup.enter.native="requestTableData"
        ></el-input>
      </div>
      <el-button type="primary" @click="requestTableData">查 询</el-button>
    </header>
    <main class="main">
      <el-table v-loading="table.loading" :data="table.data">
        <el-table-column type="index" label="序号" align="center">
        </el-table-column>
        <el-table-column
          v-for="(item, index) in table.itemList"
          :key="index"
          :label="item.label"
          :prop="item.prop"
          align="center"
        >
        </el-table-column>
      </el-table>
      <el-pagination
        v-show="pagination.total"
        :current-page.sync="pagination.page"
        :page-size.sync="pagination.pageSize"
        :total="pagination.total"
        layout="prev, pager, next, jumper"
        background
        @current-change="requestTableData"
        @size-change="requestTableData"
      ></el-pagination>
    </main>
  </div>
</template>

<script>
import api from "@/api/index";

export default {
  name: "ApiCallAmount",
  data() {
    return {
      timeRange: [],
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setDate(start.getDate() - 6);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setMonth(start.getMonth() - 1);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setMonth(start.getMonth() - 3);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      qualifiedName: "",
      table: {
        loading: true,
        data: [],
        itemList: [
          { label: "API名称", prop: "qualifiedName" },
          { label: "API中文名", prop: "cnName" },
          { label: "所属租户", prop: "supplierName" },
          { label: "调用量", prop: "callNum" },
          { label: "被申请次数", prop: "applyNum" },
          { label: "方法数量", prop: "methodNum" },
          { label: "发布时间", prop: "createTime" },
        ],
      },
      pagination: {
        page: 1,
        pageSize: 10,
        total: 0,
      },
    };
  },
  methods: {
    initTimeRange() {
      const today = Date.now();
      const days = -6;
      const xDays = today + 1000 * 60 * 60 * 24 * days;
      // 格式化时间戳 yyyy-MM-dd
      function formatTime(timeStamp) {
        const timeArray = new Date(timeStamp).toLocaleDateString().split("/");
        return timeArray
          .map((item) => (item.length > 1 ? item : `0${item}`))
          .join("-");
      }
      const todayValue = formatTime(today);
      const xDaysValue = formatTime(xDays);
      this.timeRange = [xDaysValue, todayValue];
    },
    requestTableData() {
      (async () => {
        this.table.loading = true;
        const startTime = this.timeRange[0];
        const endTime = this.timeRange[1];
        const qualifiedName = this.qualifiedName;
        const page = this.pagination.page;
        const pageSize = this.pagination.pageSize;
        const params = { startTime, endTime, qualifiedName, page, pageSize };
        const response = await api.report
          .getFindApiApplyListData(params)
          .catch((error) => {
            throw error;
          });
        const { rows, total } = response.data;
        this.table.data = rows;
        this.pagination.total = total;
        this.table.loading = false;
      })();
    },
  },
  mounted() {
    this.initTimeRange();
    this.requestTableData();
  },
};
</script>

<style lang="scss" scoped>
.apiCallAmount {
  .header {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    .data-picker-wrapper {
      margin-right: 16px;
      width: 25%;
    }
    .input-wrapper {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-right: 16px;
      .input-label {
        width: 80px;
        margin-right: 8px;
      }
    }
  }

  .main {
    .el-pagination {
      margin-top: 8px;
      display: flex;
      justify-content: center;
    }
  }
}
</style>