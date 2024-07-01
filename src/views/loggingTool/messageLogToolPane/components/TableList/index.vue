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
        <template slot="header" v-if="prop === 'pushStatus'"
          >推送状态
          <el-tooltip
            class="item"
            effect="dark"
            content="http接收方式，成功代表客户接收消息并返回状态码200，否则失败；websocket接收方式，成功代表消息从网关成功发出，否则失败。"
            placement="top"
          >
            <i class="el-icon-help"></i>
          </el-tooltip>
        </template>
        <template slot-scope="{ row, column: { property } }">
          <span v-if="property === 'receiveType'">
            {{ row[property] == 1 ? "http" : "websocket" }}
          </span>
          <span v-else-if="property === 'messageCnName'">
            {{ `${row["topic"]}(${row[property]})` }}
          </span>
          <span v-else>{{ row[property] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100" fixed="right">
        <template slot-scope="{ row }">
          <el-button type="text" @click="onClickDetailButton(row)"
            >详情</el-button
          >
          <el-button type="text" @click="onClickRetweet(row)">重推</el-button>
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

    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <span
        >重推后，开放平台将重新触发一条相同推送至客户，请确认是否重推？</span
      >
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleRetweet">确 认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { SappModule } from "@/store/modules/app";
import Pagination from "@/components/Pagination.vue";
import DetailDrawer from "@/views/loggingTool/messageLogToolPane/components/TableList/DetailDrawer.vue";
import lcp from "@/api/lcp/index";
export default {
  name: "TableList",
  components: { Pagination, DetailDrawer },
  props: {
    currentPage: { type: Number, required: true },
    pageSize: { type: Number, required: true },
    total: { type: Number, required: true },
    tableLoading: { type: Boolean, required: true },
    tableData: {
      type: Array,
      default: () => [],
    },
    reloadTableData: { type: Function, default: () => {} },
  },
  data() {
    return {
      tableList: [
        {
          label: "请求开始时间",
          prop: "beginTime",
          minWidth: "150",
        },
        {
          label: "对接方案",
          prop: "unitName",
          minWidth: "120",
        },
        { label: "对接方案编码", prop: "unitCode", minWidth: "80" },
        { label: "消息名称", prop: "messageCnName", minWidth: "200" },
        { label: "业务标识", prop: "businessIdentifier", minWidth: "200" },
        { label: "接收方式", prop: "receiveType", minWidth: "100" },
        {
          label: "推送状态",
          prop: "pushStatus",
          minWidth: "80",
        },
      ],
      // 详情抽屉
      rowId: 0,
      drawerVisible: false,
      detailDrawerLoading: true,
      detailDrawerFormData: {},
      dialogVisible: false,
      traceId: "",
    };
  },
  filters: {},
  methods: {
    // 点击详情按钮时，查询日志详情
    async onClickDetailButton(row) {
      const params = {
        env: SappModule.env,
      };
      const { data } = await lcp.platform.rest.loggingTool
        .queryLogToolMsgDetails({
          replacements: {
            traceId: row.traceId,
          },
          params,
        })
        .catch((error) => {
          throw new Error(`queryLogToolMsgDetails, ${error}`);
        });
      Object.assign(this.detailDrawerFormData, data);
      this.drawerVisible = true;
      this.detailDrawerLoading = false;
    },
    //重推
    onClickRetweet(row) {
      this.dialogVisible = true;
      this.traceId = row.traceId;
    },
    async handleRetweet() {
      const params = {
        env: SappModule.env,
      };
      const replacements = {
        traceId: this.traceId,
      };
      const { code, message } = await lcp.platform.rest.loggingTool
        .queryLogToolMsgRetryPush(params,replacements)
        .catch((error) => {
          throw new Error(`queryLogToolMsgRetryPush, ${error}`);
        });
      this.dialogVisible = false;
      this.$message(message);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
