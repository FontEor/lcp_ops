<template>
  <div class="table-list">
    <el-table v-loading="tableLoading" :data="tableData">
      <el-table-column type="index" label="序号" width="50" />
      <el-table-column
        v-for="{ prop, label, minWidth } in tableList"
        :key="prop"
        :prop="prop"
        :label="label"
        :min-width="minWidth"
      >
        <template slot-scope="{ row, column: { property } }">
          <span v-if="property === 'startTime'">
            {{ row[property] | formatStartTimeText }}
          </span>
          <span v-else-if="property === 'latenciesRequest'">
            {{ row[property] | formatLatenciesRequestText }}
          </span>
          <span v-else>{{ row[property] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="80" fixed="right">
        <template slot-scope="{ row }">
          <el-button type="text" @click="onClickDetailButton(row)"
            >详情</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <Pagination
      :currentPage="currentPage"
      :pageSize="pageSize"
      :total="total"
      :reloadTableData="reloadTableData"
      @update:currentPage="($event) => $emit('update:currentPage', $event)"
      @update:pageSize="($event) => $emit('update:pageSize', $event)"
      @update:total="($event) => $emit('update:total', $event)"
    />

    <DetailDrawer
      :visible.sync="drawerVisible"
      :detailDrawerLoading="detailDrawerLoading"
      :detailDrawerFormData="detailDrawerFormData"
    />
  </div>
</template>

<script>
import Pagination from "@/components/Pagination.vue";
import DetailDrawer from "@/views/loggingTool/loggingToolPane/components/TableList/DetailDrawer.vue";
import lcp from "@/api/lcp/index";

export default {
  name: "TableList",
  components: { Pagination, DetailDrawer },
  props: {
    currentPage: { type: Number, required: true },
    pageSize: { type: Number, required: true },
    total: { type: Number, required: true },
    tableLoading: { type: Boolean, required: true },
    tableData: { type: Array, default: () => [] },
    reloadTableData: { type: Function, default: () => {} },
  },
  data() {
    return {
      tableList: [
        {
          label: "请求开始时间",
          prop: "startTime",
          minWidth: "150",
        },
        {
          label: "对接方案",
          prop: "unitName",
          minWidth: "120",
        },
        { label: "URI", prop: "requestUri", minWidth: "200" },
        { label: "请求状态", prop: "status", minWidth: "80" },
        { label: "状态码", prop: "errorCode", minWidth: "80" },
        { label: "异常信息", prop: "errorMsg", minWidth: "200" },
        {
          label: "请求耗时",
          prop: "latenciesRequest",
          minWidth: "80",
        },
      ],
      // 详情抽屉
      rowId: 0,
      drawerVisible: false,
      detailDrawerLoading: true,
      detailDrawerFormData: {},
    };
  },
  filters: {
    formatStartTimeText(startTime) {
      startTime = parseInt(startTime);
      const formatStartTime = new Date(startTime)
        .toLocaleString()
        .replaceAll("/", "-");
      return startTime ? formatStartTime : "-";
    },
    formatLatenciesRequestText(latenciesRequest) {
      latenciesRequest = parseFloat(latenciesRequest);
      const formatLatenciesRequest = latenciesRequest * 1000;
      return `${formatLatenciesRequest}ms`;
    },
  },
  methods: {
    // 点击详情按钮时，查询日志详情
    async onClickDetailButton(row) {
      this.rowId = row.id;
      this.drawerVisible = true;
      const { requestMethod, request, response, errorMsg, pin, callbackUrl } =
        row;
      Object.assign(this.detailDrawerFormData, {
        requestMethod,
        request,
        response,
        errorMsg,
        pin,
        callbackUrl,
      });
      this.detailDrawerLoading = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.table-list {
}
</style>