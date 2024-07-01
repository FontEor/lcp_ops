<template>
  <!-- 分页器组件 -->
  <el-pagination
    :background="true"
    :current-page="currentPage"
    :page-size="pageSize"
    :page-sizes="pageSizes"
    :total="total"
    layout="total, sizes, prev, pager, next, jumper"
    class="pagination"
    @current-change="handleCurrentChange"
    @size-change="handleSizeChange"
    @update:currentPage="updateCurrentPage"
    @update:pageSize="updatePageSize"
    @update:total="updateTotal"
  >
  </el-pagination>
</template>

<script>
export default {
  name: "Pagination",
  props: {
    currentPage: {
      type: Number,
      required: true,
    },
    pageSize: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      default: 0,
    },
    pageSizes: {
      type: Array,
      default: () => [10, 20, 30, 50],
    },
    reloadTableData: {
      type: Function,
      default: () => {},
    },
  },
  methods: {
    // 当前页数改变时
    handleCurrentChange(value) {
      this.$emit("update:currentPage", value);
      this.reloadTableData();
    },
    // 每页显示条目个数改变时
    handleSizeChange(value) {
      this.$emit("update:pageSize", value);
      this.reloadTableData();
    },

    // 当前页数更新时
    updateCurrentPage(event) {
      this.$emit("update:currentPage", event);
    },
    // 当前页数更新时
    updatePageSize(event) {
      this.$emit("update:pageSize", event);
    },
    // 总条目数更新时
    updateTotal(event) {
      this.$emit("update:total", event);
    },
  },
};
</script>

<style lang="scss" scoped>
.pagination {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 16px;
}
</style>