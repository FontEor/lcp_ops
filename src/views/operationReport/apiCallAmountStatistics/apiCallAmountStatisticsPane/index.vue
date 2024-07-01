<template>
  <div class="api-call-amount-pane">
    <SearchForm :searchFormData="searchFormData" @keyupEnter="onKeyupEnterSearchForm" />
    <TableList :tableLoading="tableLoading" :tableData.sync="tableData">
      <Pagination :currentPage.sync="pageNumb" :pageSize.sync="pageSize" :total.sync="total"
        :reloadTableData="handleQueryList" />
    </TableList>
  </div>
</template>

<script>
import SearchForm from "@/views/operationReport/apiCallAmountStatistics/apiCallAmountStatisticsPane/components/SearchForm.vue";
import TableList from "@/views/operationReport/apiCallAmountStatistics/apiCallAmountStatisticsPane/components/TableList.vue";
import Pagination from "@/components/Pagination.vue";
import lcp from "@/api/lcp/index";

export default {
  name: "apiCallAmountStatisticsPane",
  components: { SearchForm, TableList, Pagination },
  data() {
    return {
      searchFormData: {
        appKey: "",
        pin: "",
        questionTimeList: [],
        dockingScheme: {},
        apiUrlScheme: {},
        gatewayUri: "",
        companyCode: ""
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
    // 
    async queryList() {

      const { pageNumb, pageSize } = this;
      let { questionTimeList, appKey, pin, dockingScheme, apiUrlScheme, gatewayUri, companyCode } = this.searchFormData;
      let [startTime, endTime] = questionTimeList;

      let bizUnitCode = dockingScheme.code;
      let apiUri = apiUrlScheme.apiUrl;


      startTime = new Date(startTime).getTime()
      endTime = new Date(endTime).getTime()

      const data = {
        pageNumb,
        pageSize,
        startTime,
        endTime,
        appKey,
        pin,
        companyCode,
        bizUnitCode,
        apiUri,
        gatewayUri
      };
      return await lcp.statistics.rest.findSafetyStatisticsList(data).catch(error => {
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

    initTimeRange() {
      const today = Date.now();
      const days = -31;
      const xDays = today + 1000 * 60 * 60 * 24 * days;
      const yesterDay = today + 1000 * 60 * 60 * 24 * -1;
      // 格式化时间戳 yyyy-MM-dd
      function formatTime(timeStamp) {
        const timeArray = new Date(timeStamp).toLocaleDateString().split("/");
        return timeArray
          .map((item) => (item.length > 1 ? item : `0${item}`))
          .join("-");
      }
      const yesterDayValue = formatTime(yesterDay);
      const xDaysValue = formatTime(xDays);
      this.searchFormData.questionTimeList = [xDaysValue, yesterDayValue];
    },
  },
  async created() {
    this.initTimeRange();
    await this.handleQueryList().catch(error => {
      throw new Error(`created, ${error}`);
    });

  }
};
</script>

<style lang="scss" scoped></style>
