<template>
  <div class="internal-development-team-pane">
    <SearchForm
      :searchFormData.sync="searchFormData"
      @keyupEnter="onKeyupEnterSearchForm"
    />
    <TableList :tableLoading="tableLoading" :tableData.sync="tableData">
      <template #actionColumn="{ row }">
        <el-button
          type="text"
          @click="onClickModifyTeamAdministratorButton(row)"
          >修改团队管理员</el-button
        >
      </template>
      <Pagination
        :currentPage.sync="pageNumb"
        :pageSize.sync="pageSize"
        :total.sync="total"
        :reloadTableData="handleQuerySupplierList"
      />
    </TableList>
    <ModifyTeamAdministratorDialog
      :modifyTeamAdministratorDialogVisible.sync="
        modifyTeamAdministratorDialogVisible
      "
      :currentRowData="currentRowData"
      @close="handleQuerySupplierList"
    />
  </div>
</template>

<script>
import SearchForm from "@/views/userManagement/internalDevelopmentTeam/internalDevelopmentTeamPane/components/SearchForm.vue";
import TableList from "@/views/userManagement/internalDevelopmentTeam/internalDevelopmentTeamPane/components/TableList.vue";
import Pagination from "@/components/Pagination.vue";
import ModifyTeamAdministratorDialog from "@/views/userManagement/internalDevelopmentTeam/internalDevelopmentTeamPane/components/ModifyTeamAdministratorDialog.vue";
import lcp from "@/api/lcp/index";

export default {
  name: "InternalDevelopmentTeamPane",
  components: {
    SearchForm,
    TableList,
    Pagination,
    ModifyTeamAdministratorDialog,
  },
  data() {
    return {
      searchFormData: {
        name: "",
      },
      tableLoading: true,
      tableData: [],
      pageNumb: 1,
      pageSize: 10,
      total: 0,
      modifyTeamAdministratorDialogVisible: false,
      currentRowData: {},
    };
  },
  methods: {
    // 根据团队名称查询团队信息列表
    async querySupplierList() {
      const { name } = this.searchFormData;
      const { pageNumb, pageSize } = this;
      const params = { name, pageNumb, pageSize };
      return await lcp.supplier.user.rest
        .querySupplierList(params)
        .catch((error) => {
          throw new Error(`querySupplierList, ${error}`);
        });
    },

    async handleQuerySupplierList(pageNumb = 0) {
      this.pageNumb = pageNumb || this.pageNumb;
      this.tableLoading = true;
      const {
        data: { list = [], total = 0 },
      } = await this.querySupplierList().catch((error) => {
        throw new Error(`handleQuerySupplierList, ${error}`);
      });
      this.tableData = list instanceof Array ? list : [];
      this.total = total || 0;
      this.tableLoading = false;
    },

    async onKeyupEnterSearchForm() {
      await this.handleQuerySupplierList(1).catch((error) => {
        throw new Error(`onKeyupEnterSearchForm, ${error}`);
      });
    },
    onClickModifyTeamAdministratorButton(row) {
      const { id } = row;
      const supplierId = id;
      this.currentRowData = { supplierId };
      this.modifyTeamAdministratorDialogVisible = true;
    },
  },
  async created() {
    await this.handleQuerySupplierList().catch((error) => {
      throw new Error(`created, ${error}`);
    });
  },
};
</script>

<style lang="scss" scoped>
.internal-development-team-pane {
}
</style>