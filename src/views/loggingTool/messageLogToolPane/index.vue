<template>
  <div class="logging-tool-pane">
    <SearchForm
      ref="searchForm"
      :pageNumb.sync="currentPage"
      :pageSize="pageSize"
      :total.sync="total"
      :tableLoading.sync="tableLoading"
      :tableData.sync="tableData"
    />
    <TableList
      ref="tableList"
      :currentPage.sync="currentPage"
      :pageSize.sync="pageSize"
      :total.sync="total"
      :tableLoading="tableLoading"
      :tableData="tableData"
      :reloadTableData="() => $refs.searchForm.onClickSearchButton()"
    />
  </div>
</template>

<script>
import SearchForm from "@/views/loggingTool/messageLogToolPane/components/SearchForm.vue";
import TableList from "@/views/loggingTool/messageLogToolPane/components/TableList/index.vue";

export default {
  name: "MessageLogToolPane",
  components: { SearchForm, TableList },
  data() {
    return {
      // 日志表格
      tableLoading: false,
      tableData: [],
      // 分页器
      currentPage: 1,
      pageSize: 10,
      total: 0,
    };
  },
};
</script>

<style lang="scss" scoped>
</style>
