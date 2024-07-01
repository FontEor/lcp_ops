<template>
  <div class="commentAmount">
    <header class="header">
      <el-form :inline="true">
        <el-form-item label="网络类型">
          <el-select
            v-model="selectValue"
            @keyup.enter.native="requestTableData"
          >
            <el-option
              v-for="(option, index) in options"
              :key="index"
              :label="option.label"
              :value="option.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="网址">
          <el-input
            v-model="inputValue"
            @keyup.enter.native="requestTableData"
          ></el-input>
        </el-form-item>
        <el-button type="primary" @click="requestTableData">查 询</el-button>
      </el-form>
    </header>
    <main class="main">
      <el-table
        v-loading="table.loading"
        :data="table.data"
        @sort-change="sortChange"
      >
        <el-table-column type="index" label="序号" align="center">
        </el-table-column>
        <el-table-column
          v-for="(item, index) in table.itemList"
          :key="index"
          :label="item.label"
          :prop="item.prop"
          :sortable="item.sortable"
          :formatter="item.formatter"
          :width="item.width"
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
  name: "CommentAmount",
  data() {
    return {
      selectValue: null,
      options: [
        { label: "全部", value: null },
        { label: "内网", value: 0 },
        { label: "外网", value: 1 },
      ],
      inputValue: "",
      sortType: null,
      sortColumn: null,
      table: {
        loading: true,
        data: [],
        itemList: [
          { label: "网址", prop: "url" },
          {
            label: "点击有用数量",
            prop: "useful",
            sortable: "custom",
            width: "200",
          },
          {
            label: "点击没用数量",
            prop: "useless",
            sortable: "custom",
            width: "200",
          },
          {
            label: "网络类型",
            prop: "netWorkType",
            width: "200",
            formatter: (row, column) => {
              const typeTable = ["内网", "外网"];
              return typeTable[row[column.property]];
            },
          },
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
    requestTableData() {
      (async () => {
        this.table.loading = true;
        const netWorkType = this.selectValue;
        const url = this.inputValue;
        const sortType = this.sortType;
        const sortColumn = this.sortColumn;
        const pageNum = this.pagination.page;
        const pageSize = this.pagination.pageSize;
        const data = {
          netWorkType,
          url,
          sortType,
          sortColumn,
          pageNum,
          pageSize,
        };
        const response = await api.report
          .postEvaluationCountData(data)
          .catch((error) => {
            throw error;
          });
        const { list, total } = response.data;
        this.table.data = list;
        this.pagination.total = total;
        this.table.loading = false;
      })();
    },
    sortChange({ prop, order }) {
      const sortTypeTable = { descending: 0, ascending: 1 };
      const sortColumnTable = { useful: 0, useless: 1 };
      this.sortType = sortTypeTable[order];
      this.sortColumn = sortColumnTable[prop];
      this.requestTableData();
    },
  },
  mounted() {
    this.requestTableData();
  },
};
</script>

<style lang="scss" scoped>
.commentAmount {
  .header {
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