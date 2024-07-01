<template>
  <div class="customer-connection-details-pane">
    <SearchForm :searchFormData="searchFormData" @keyupEnter="onKeyupEnterSearchForm" />
    <TableList :tableLoading="tableLoading" :tableData.sync="tableData">
      <template #actionColumn="{ row }">
        <el-button type="text" @click="onClickMarkingButton(row)">打标</el-button>
      </template>
      <Pagination :currentPage.sync="pageNum" :pageSize.sync="pageSize" :total.sync="total" :reloadTableData="handleQueryDockingPeriodList" />
    </TableList>
    <MarkingDialog :markingDialogVisible.sync="markingDialogVisible" :currentRowData="currentRowData" @close="handleQueryDockingPeriodList" />
  </div>
</template>

<script>
import SearchForm from "@/views/operationReport/customerConnectionDetails/customerConnectionDetailsPane/components/SearchForm.vue";
import TableList from "@/views/operationReport/customerConnectionDetails/customerConnectionDetailsPane/components/TableList.vue";
import Pagination from "@/components/Pagination.vue";
import MarkingDialog from "@/views/operationReport/customerConnectionDetails/customerConnectionDetailsPane/components/MarkingDialog.vue";
import lcp from "@/api/lcp/index";

export default {
  name: "CustomerConnectionDetailsPane",
  components: { SearchForm, TableList, Pagination, MarkingDialog },
  data() {
    return {
      searchFormData: {
        onlineStatus: 0,
        approveTimeList: [],
        onlineTimeList: [],
        unitIdList: [],
        companyName: "",
        firstCallActualTimeList: []
      },
      tableLoading: true,
      tableData: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      markingDialogVisible: false,
      currentRowData: {}
    };
  },
  methods: {
    // 客户对接明细-查询客户对接明细列表数据
    async queryDockingPeriodList() {
      const { pageNum, pageSize } = this;
      const { onlineStatus, approveTimeList, onlineTimeList, companyName, firstCallActualTimeList } = this.searchFormData;
      const [approveStartTime, approveEndTime] = approveTimeList || [];
      const [onlineStartTime, onlineEndTime] = onlineTimeList || [];
      const [firstCallActualStartTime, firstCallActualEndTime] = firstCallActualTimeList || [];
      let { unitIdList } = this.searchFormData;
      unitIdList = unitIdList.map(item => parseInt(item));
      const data = {
        pageNum,
        pageSize,
        onlineStatus,
        approveStartTime,
        approveEndTime,
        onlineStartTime,
        onlineEndTime,
        unitIdList,
        companyName,
        firstCallActualStartTime,
        firstCallActualEndTime
      };
      return await lcp.platform.rest.dockingPeriod.queryDockingPeriodList(data).catch(error => {
        throw new Error(`queryDockingPeriodList, ${error}`);
      });
    },

    async onKeyupEnterSearchForm() {
      await this.handleQueryDockingPeriodList(1).catch(error => {
        throw new Error(`onKeyupEnterSearchForm, ${error}`);
      });
    },
    async handleQueryDockingPeriodList(pageNum = 0) {
      this.pageNum = pageNum || this.pageNum;
      this.tableLoading = true;
      const {
        data: { list = [], total = 0 }
      } = await this.queryDockingPeriodList().catch(error => {
        throw new Error(`handleQueryDockingPeriodList, ${error}`);
      });
      this.tableData = list instanceof Array ? list : [];
      this.total = total || 0;
      this.tableLoading = false;
    },
    onClickMarkingButton(row) {
      const { bizOrderId, tagName, tagRemark } = row;
      const id = bizOrderId;
      const tagCode = tagName;
      this.markingDialogVisible = true;
      this.$nextTick(() => {
        this.currentRowData = { id, tagCode, tagRemark };
      });
    }
  },
  async created() {
    await this.handleQueryDockingPeriodList().catch(error => {
      throw new Error(`created, ${error}`);
    });
  }
};
</script>

<style lang="scss" scoped>
</style>
