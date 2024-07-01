<template>
  <div class="table-list">
    <el-table v-loading="tableLoading" :data="tableData">
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column
        v-for="{ prop, label, minWidth } in tableList"
        :key="prop"
        :prop="prop"
        :label="label"
        :min-width="minWidth"
      ></el-table-column>
      <el-table-column label="操作" width="140" fixed="right">
        <template #default="scope">
          <slot name="actionColumn" v-bind="scope"></slot>
        </template>
      </el-table-column>
    </el-table>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "TableList",
  props: {
    tableLoading: { type: Boolean, required: true },
    tableData: { type: Array, required: true },
  },
  data() {
    return {
      tableList: [
        {
          label: "团队名称",
          prop: "name",
          minWidth: "120",
        },
        {
          label: "团队编码",
          prop: "code",
          minWidth: "120",
        },
        { label: "团队管理员ERP", prop: "managerPin", minWidth: "120" },
        { label: "更新人", prop: "updateUser", minWidth: "100" },
        { label: "更新时间", prop: "updateTime", minWidth: "160" },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
.table-list {
}
</style>