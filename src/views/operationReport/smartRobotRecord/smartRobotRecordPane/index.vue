<template>
  <div class="smart-robot-record-pane">
    <SearchForm :searchFormData="searchFormData" @keyupEnter="onKeyupEnterSearchForm" />
    <TableList :tableLoading="tableLoading" :tableData.sync="tableData">
      <Pagination :currentPage.sync="pageNumb" :pageSize.sync="pageSize" :total.sync="total" :reloadTableData="handleQueryList" />
    </TableList>
  </div>
</template>

<script>
import SearchForm from "@/views/operationReport/smartRobotRecord/smartRobotRecordPane/components/SearchForm.vue";
import TableList from "@/views/operationReport/smartRobotRecord/smartRobotRecordPane/components/TableList.vue";
import Pagination from "@/components/Pagination.vue";
import lcp from "@/api/lcp/index";

export default {
  name: "SmartRobotRecordPane",
  components: { SearchForm, TableList, Pagination },
  data() {
    return {
      searchFormData: {
        keyWord: "",
        questionTimeList: [],
        remarkStatus: [],
        remarkReason: [],
        answerSource: undefined
      },
      tableLoading: true,
      tableData: [],
      pageNumb: 1,
      pageSize: 10,
      total: 0,
      markingDialogVisible: false,
      currentRowData: {},
    };
  },
  methods: {
    // 智能助手记录
    async queryList() {
      const { pageNumb, pageSize } = this;
      let { keyWord, questionTimeList, remarkStatus, remarkReason, answerSource } = this.searchFormData;
      const [startTime, endTime] = questionTimeList || [];
      answerSource = typeof answerSource === "number" ? answerSource : undefined;
      remarkStatus = remarkStatus.length > 0 ? remarkStatus : undefined;
      remarkReason = remarkReason.length > 0 ? remarkReason : undefined;

      const data = {
        pageNumb,
        pageSize,
        keyWord,
        startTime,
        endTime,
        answerSource,
        remarkStatus,
        remarkReason,
      };
      return await lcp.platform.rest.smartRobotRecord.queryList(data).catch(error => {
        throw new Error(`queryList, ${error}`);
      });
    },

    async onKeyupEnterSearchForm() {
      await this.handleQueryList(1).catch(error => {
        throw new Error(`onKeyupEnterSearchForm, ${error}`);
      });
    },
    async handleQueryList(pageNumb = 0) {
      this.pageNumb = pageNumb || this.pageNumb;
      this.tableLoading = true;
      const {
        data: { list = [], total = 0 }
      } = await this.queryList().catch(error => {
        throw new Error(`handleQueryList, ${error}`);
      });
      this.tableData = list instanceof Array ? list : [];
      this.total = total || 0;
      this.tableLoading = false;
    },
  },
  async created() {
    await this.handleQueryList().catch(error => {
      throw new Error(`created, ${error}`);
    });
  }
};
</script>

<style lang="scss" scoped>
</style>
