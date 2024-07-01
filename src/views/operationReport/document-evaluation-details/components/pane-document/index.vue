<template>
  <section class="pane-docking-scheme-document">
    <SearchForm :queryDataType="queryDataType" :formModel="searchFormModel" @keyupEnter="onKeyupEnterSearchForm" />
    <TableList :queryDataType="queryDataType" :tableLoading="tableLoading" :tableData.sync="tableData">
      <template #actionColumn="{ row }">
        <el-button type="text" v-if="!row['whetherHelp']" @click="onClickHandlingButton(row)">处理</el-button>
        <span v-else>-</span>
      </template>
      <Pagination :currentPage.sync="pageNum" :pageSize.sync="pageSize" :total.sync="total" :reloadTableData="handleQueryEvaluateHelpList" />
    </TableList>
    <DialogHanding :dialogVisible.sync="dialogHandingVisible" :formModel="dialogHandingFormModel" @submit="handleQueryEvaluateHelpList" />
  </section>
</template>

<script>
import SearchForm from "./components/search-form.vue";
import TableList from "./components/table-list.vue";
import Pagination from "@/components/Pagination.vue";
import DialogHanding from "./components/dialog-handling.vue";
import lcp from "@/api/lcp/index";

export default {
  name: "PaneDockingSchemeDocument",
  components: { SearchForm, TableList, Pagination, DialogHanding },
  props: {
    queryDataType: {
      type: Number,
      validator: function(value) {
        return [1, 2].includes(value);
      }
    }
  },
  data() {
    return {
      searchFormModel: {
        unitIdList: [],
        evaluationTimeList: [],
        whetherHelp: undefined,
        questionCauseList: [],
        handleStatusList: []
      },
      pageNum: 1,
      pageSize: 10,
      total: 0,
      tableLoading: false,
      tableData: [],
      dialogHandingVisible: false,
      dialogHandingFormModel: {}
    };
  },
  methods: {
    // 定义查询文档评价明细列表接口
    async queryEvaluateHelpList() {
      const { queryDataType, pageNum, pageSize } = this;
      const { evaluationTimeList } = this.searchFormModel;
      let { whetherHelp, questionCauseList, handleStatusList } = this.searchFormModel;
      whetherHelp = typeof whetherHelp === "number" ? whetherHelp : undefined;
      questionCauseList = questionCauseList.length > 0 ? questionCauseList : undefined;
      handleStatusList = handleStatusList.length > 0 ? handleStatusList : undefined;
      const [startTime, endTime] = evaluationTimeList || [];
      let { unitIdList } = this.searchFormModel;
      unitIdList = unitIdList.length > 0 ? unitIdList.map(item => parseInt(item)) : undefined;
      const data = {
        queryDataType,
        pageNum,
        pageSize,
        unitIdList,
        startTime,
        endTime,
        whetherHelp,
        questionCauseList,
        handleStatusList
      };
      return await lcp.platform.rest.evaluate.queryEvaluateHelpList(data);
    },

    // 查询文档评价明细列表接口调用
    async handleQueryEvaluateHelpList(pageNum = 0) {
      this.tableLoading = true;
      this.pageNum = pageNum || this.pageNum;
      const {
        data: { list = [], total = 0 }
      } = await this.queryEvaluateHelpList().catch(error => {
        console.error("handleQueryEvaluateHelpList");
        throw error;
      });
      this.tableData = Array.isArray(list) ? list : [];
      this.total = total || 0;
      this.tableLoading = false;
    },

    async onKeyupEnterSearchForm() {
      await this.handleQueryEvaluateHelpList(1).catch(error => {
        console.error("onKeyupEnterSearchForm");
        throw error;
      });
    },
    onClickHandlingButton(row) {
      const { id } = row;
      let { handleStatus, userExplain } = row;
      handleStatus = handleStatus || 0;
      userExplain = userExplain || "";
      this.dialogHandingFormModel = { id, handleStatus, userExplain };
      this.dialogHandingVisible = true;
    }
  },
  async created() {
    await this.onKeyupEnterSearchForm().catch(error => {
      console.error("created");
      throw error;
    });
  }
};
</script>

<style lang="scss" scoped>
// .pane-docking-scheme-document {
// }
</style>
