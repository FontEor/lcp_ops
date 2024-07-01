<template>
  <div class="search-form">
    <el-form label-width="auto">
      <el-row
        :gutter="16"
        type="flex"
        justify="end"
        style="flex-wrap: wrap; flex-direction: row"
      >
        <el-col :span="8">
          <el-form-item label="工单单号">
            <el-input
              v-model="workOrderNumber"
              placeholder="输入工单单号"
              clearable
              style="width: 100%"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="提交时间">
            <el-date-picker
              clearable
              v-model="timeValue"
              type="datetimerange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
              style="width: 100%"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="工单类型">
            <el-cascader
              clearable
              v-model="ticketTypeVal"
              :options="workOrderTypeOptions"
              :props="cateListProps"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="工单状态">
            <el-select
              v-model="status"
              placeholder="请选择工单状态"
              clearable
              style="width: 100%"
            >
              <el-option
                v-for="item in ticketStatusList"
                :key="item.val"
                :value="item.val"
                :label="item.description"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="关键词">
            <el-input
              v-model="queryLike"
              placeholder="根据问题或回复的关键词查询工单"
              clearable
              style="width: 100%"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="是否解决">
            <el-select v-model="whetherToSolve" clearable style="width: 100%">
              <el-option
                v-for="item in solveList"
                :key="item.val"
                :value="item.val"
                :label="item.description"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row
        :gutter="16"
        type="flex"
        justify="space-between"
        style="flex-wrap: wrap; flex-direction: row"
      >
        <el-col :span="8">
          <el-form-item label="关单人">
            <el-select v-model="closeDirectType" clearable style="width: 100%">
              <el-option
                v-for="item in closeLister"
                :key="item.val"
                :value="item.val"
                :label="item.description"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <div style="float: right">
            <el-button type="primary" @click="getWorkOrderRecordData"
              >查 询</el-button
            >
            <el-button
              type="primary"
              :loading="exportStatementButtonLoading"
              @click="onClickExportStatementButton"
              >导出报表</el-button
            >
          </div>
        </el-col>
      </el-row>
    </el-form>
    <el-table :data="tableData" :show-tooltip-when-overflow="true" height="500">
      <el-table-column
        width="190"
        label="工单单号"
        prop="workOrderNumber"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="工单类型"
        prop="workOrderTypeName"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="问题描述" prop="workOrderContent">
        <template slot-scope="scope">
          <el-tooltip placement="top">
            <div slot="content">
              <div v-if="scope.row.appKey">
                {{ "APPKEY:" + scope.row.appKey }}
              </div>
              <div v-if="scope.row.orderNumberInfo">
                {{ "单号信息:" + scope.row.orderNumberInfo }}
              </div>
              <div v-if="scope.row.msgApiInfo">
                {{ "API/消息:" + scope.row.msgApiInfo }}
              </div>
              <div v-if="scope.row.workOrderContent">
                {{ "问题描述:" + scope.row.workOrderContent }}
              </div>
            </div>
            <div class="oneLine">
              <div v-if="scope.row.appKey">
                {{ "APPKEY:" + scope.row.appKey }}
              </div>
              <div v-if="scope.row.orderNumberInfo">
                {{ "单号信息:" + scope.row.orderNumberInfo }}
              </div>
              <div v-if="scope.row.msgApiInfo">
                {{ "API/消息:" + scope.row.msgApiInfo }}
              </div>
              <div v-if="scope.row.workOrderContent">
                {{ "问题描述:" + scope.row.workOrderContent }}
              </div>
            </div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        width="160"
        label="提交时间"
        prop="createTime"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          {{ formatTime(scope.row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column width="80" label="工单状态" prop="status">
        <template slot-scope="scope">
          {{ formatStatus(scope.row.status) }}
        </template>
      </el-table-column>
      <el-table-column width="70" label="关单人" prop="closeDirectType">
        <template slot-scope="scope">
          {{ formatCloseDirectType(scope.row.closeDirectType) }}
        </template>
      </el-table-column>
      <el-table-column
        width="110"
        label="提交人用户名"
        prop="createUser"
        :show-overflow-tooltip="true"
      />
      <el-table-column width="80" label="是否解决" prop="whetherToSolve">
        <template slot-scope="scope">
          {{ formatwhetherToSolveStatus(scope.row.whetherToSolve) }}
        </template>
      </el-table-column>
      <el-table-column width="80" label="质量评价" prop="qualityScore">
        <template slot-scope="scope">
          {{ formatScore(scope.row.qualityScore) }}
        </template>
      </el-table-column>
      <el-table-column width="80" label="时效评价" prop="agingScore">
        <template slot-scope="scope">
          {{ formatScore(scope.row.agingScore) }}
        </template>
      </el-table-column>
      <el-table-column
        width="80"
        label="服务评价"
        prop="evaluation"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          {{ scope.row.evaluation || "-" }}
        </template>
      </el-table-column>
      <el-table-column width="100" prop="responseTime">
        <template slot="header">
          <span>响应时效</span>
          <el-tooltip
            class="item"
            effect="dark"
            content="IT首次回复工单时间减去客户工单创建时间，保留2位小数(h)"
            placement="top"
            style="
              width: 16px;
              height: 16px;
              padding-top: 5px;
              padding-left: 3px;
            "
          >
            <el-image
              style="width: 0.75rem; height: 0.75rem"
              fit="fill"
              :src="questionMark"
            ></el-image>
          </el-tooltip>
        </template>
        <template slot-scope="scope">
          <span v-if="scope.row.responseTime">
            {{ scope.row.responseTime + "h" }}
          </span>
          <span v-else>{{ "-" }}</span>
        </template>
      </el-table-column>
      <el-table-column
        width="100"
        label="解决时效"
        icon="el-icon-edit"
        prop="solveTime"
      >
        <template slot="header">
          <span>解决时效</span>
          <el-tooltip
            class="item"
            effect="dark"
            content="关单前IT最后一次回复工单时间减去客户工单创建时间，保留2位小数(h)"
            placement="top"
            style="
              width: 16px;
              height: 16px;
              padding-top: 5px;
              padding-left: 3px;
            "
          >
            <el-image
              style="width: 0.75rem; height: 0.75rem"
              fit="fill"
              :src="questionMark"
            ></el-image>
          </el-tooltip>
        </template>
        <template slot-scope="scope">
          <span v-if="scope.row.solveTime">
            {{ scope.row.solveTime + "h" }}
          </span>
          <span v-else>{{ "-" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="left" width="60px">
        <template slot-scope="scope">
          <el-button-group>
            <el-button
              size="mini"
              type="text"
              @click="getWorkOrderDetaildData(scope.row)"
            >
              详情
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      :currentPage.sync="pagination.page"
      :pageSize.sync="pagination.pageSize"
      :total.sync="pagination.total"
      :reloadTableData="getWorkOrderRecordData"
    />
    <!-- 详情 -->
    <el-dialog
      title="工单沟通详情"
      :close-on-click-modal="false"
      :visible.sync="dialogDetail"
      center
    >
      <el-timeline style="height: 35rem">
        <el-timeline-item
          v-for="(item, index) in timeLineListData"
          :key="index"
          :timestamp="`${item.createUser}   ${item.createTime}`"
          placement="top"
        >
          <el-card>
            <p>{{ item.workOrderContent }}</p>
            <div v-if="item.orderNumberInfo && index === 0">
              <span>单号信息：</span>{{ item.orderNumberInfo }}
            </div>
            <div v-if="item.appKey && index === 0">
              <span>APPKEY：</span>{{ item.appKey }}
            </div>
            <div v-if="item.msgApiInfo && index === 0">
              <span>API/消息：</span>{{ item.msgApiInfo }}
            </div>
            <div v-if="item.appendices.length">
              <span>附件：</span>
              <i
                class="el-icon-link"
                v-for="(att, attindex) in item.appendices"
                :key="attindex"
              >
                <a
                  :href="
                    `${headerHttp}` +
                    '/_file/download/getDownloader?name=' +
                    `${encodeURIComponent(att.attName)}` +
                    '&url=' +
                    `${encodeURIComponent(att.attUrl)}`
                  "
                  download
                  target="_blank"
                  >{{ att.attName }}</a
                >
              </i>
            </div>
          </el-card>
        </el-timeline-item>
      </el-timeline>
      <div slot="footer" class="dialog-footer" style="text-align: right">
        <el-button type="primary" @click="dialogDetail = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import lcp from "@/api/lcp/index";
import parseTime from "@/utils/parseTime";
import Pagination from "@/components/Pagination.vue";
import {
  solveList,
  ticketStatusList,
  closeLister,
  pickerOptions,
  closeDirectTypeStatus,
  workOrderStatus,
  whetherToSolveStatus,
  scoreStatus,
  cateListProps,
  pagination,
} from "./workOrder";
export default {
  name: "WorkOrderRecode",
  components: {
    Pagination,
  },
  data() {
    return {
      pickerOptions,
      timeValue: ["", ""],
      ticketTypeVal: [],
      ticketStatusList,
      solveList,
      closeLister,
      closeDirectType: "全部",
      exportStatementDebounceTimer: null,
      exportStatementButtonLoading: false,
      questionMark: require("@/assets/img/framework/questionMark.png"),
      timeLineListData: [],
      workOrderNumber: "", //工单单号,
      queryLike: "", //关键字
      status: "全部", //工单状态
      whetherToSolve: "全部", //是否解决
      closeDirectType: "全部", //关单人
      workOrderTypeOptions: [],
      tableData: [],
      dialogDetail: false,
      closeDirectTypeStatus,
      workOrderStatus,
      whetherToSolveStatus,
      scoreStatus,
      cateListProps,
      pagination,
      headerHttp: window.env.getDownloadFile,
    };
  },
  mounted() {
    this.getWorkOrderRecordData();
    this.queryWorkOrderTypedData();
  },
  methods: {
    //获取工单记录列表数据
    async getWorkOrderRecordData() {
      const data = {
        workOrderNumber: this.workOrderNumber,
        startTime: this.timeValue
          ? new Date(this.timeValue[0]).getTime()
          : null,
        endTime: this.timeValue ? new Date(this.timeValue[1]).getTime() : null,
        workOrderTypeCode: this.ticketTypeVal.length
          ? this.ticketTypeVal[this.ticketTypeVal.length - 1]
          : "",
        status: this.status === "全部" ? "" : this.status,
        queryLike: this.queryLike,
        whetherToSolve:
          this.whetherToSolve === "全部" ? "" : this.whetherToSolve,
        closeDirectType:
          this.closeDirectType === "全部" ? "" : this.closeDirectType,
        pageSize: this.pagination.pageSize,
        pageNumb: this.pagination.page,
      };
      await lcp.workOrder.workOrderRecord
        .getWorkOrderRecordData(data)
        .then((res) => {
          if (res.code === 20000) {
            this.tableData = res.data.list;
            this.pagination.total = res.data.total;
          }
        })
        .catch((error) => {
          throw new Error(`getWorkOrderRecordData, ${error}`);
        });
    },
    //工单详情
    async getWorkOrderDetaildData(row) {
      const params = {
        workOrderNumber: row.workOrderNumber,
      };
      await lcp.workOrder.workOrderRecord
        .getWorkOrderDetaildData(params)
        .then((res) => {
          if (res.code == 20000) {
            this.timeLineListData = res.data;
            this.dialogDetail = true;
          }
        })
        .catch((error) => {
          throw new Error(`getWorkOrderDetaildData, ${error}`);
        });
    },
    //获取工单类型数据
    async queryWorkOrderTypedData() {
      await lcp.workOrder.workOrderType
        .queryWorkOrderTypeList()
        .then((res) => {
          if (res.code === 20000) {
            this.workOrderTypeOptions = res.data;
          }
        })
        .catch((error) => {
          throw new Error(`queryWorkOrderTypeList, ${error}`);
        });
    },
    //返回数据格式化
    formatStatus(index) {
      return this.workOrderStatus[index] || "-";
    },
    formatwhetherToSolveStatus(index) {
      return this.whetherToSolveStatus[index] || "-";
    },
    formatTime(time) {
      return parseTime.timeInTable(time) || "-";
    },
    formatCloseDirectType(index) {
      return this.closeDirectTypeStatus[index] || "-";
    },
    formatScore(index) {
      return this.scoreStatus[index] || "-";
    },

    // 导出工单记录明细
    onClickExportStatementButton() {
      clearTimeout(this.exportStatementDebounceTimer);
      this.exportStatementDebounceTimer = setTimeout(async () => {
        this.exportStatementButtonLoading = true;
        const loading = this.$loading({
          text: "报表生成中，请稍后",
          spinner: "el-icon-loading",
          background: "rgb(236, 241, 254)",
          customClass: "export-work-order-record-loading",
        });
        await this.handleExportDockingPeriod().catch((error) => {
          this.exportStatementButtonLoading = false;
          throw new Error(`onClickExportStatementButton, ${error}`);
        });
        this.exportStatementButtonLoading = false;
        setTimeout(() => {
          loading.close();
        }, 1000);
      }, 300);
    },
    async handleExportDockingPeriod() {
      const { data } = await this.exportDockingPeriod().catch((error) => {
        throw new Error(`handleExportDockingPeriod, ${error}`);
      });
      const url = URL.createObjectURL(new Blob([data], { type: "text/csv" }));
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `工单记录_${this.$dayjs().format(
        "YYYY-MM-DD HH:mm:ss"
      )}.csv`;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);
    },
    async exportDockingPeriod() {
      const data = {
        workOrderNumber: this.workOrderNumber,
        startTime: this.timeValue
          ? new Date(this.timeValue[0]).getTime()
          : null,
        endTime: this.timeValue ? new Date(this.timeValue[1]).getTime() : null,
        workOrderTypeCode: this.ticketTypeVal.length
          ? this.ticketTypeVal[this.ticketTypeVal.length - 1]
          : "",
        status: this.status === "全部" ? "" : this.status,
        queryLike: this.queryLike,
        whetherToSolve:
          this.whetherToSolve === "全部" ? "" : this.whetherToSolve,
        closeDirectType:
          this.closeDirectType === "全部" ? "" : this.closeDirectType,
      };
      return await lcp.workOrder.workOrderRecord
        .exportWorkOrderRecord(data)
        .catch((error) => {
          throw new Error(`exportDockingPeriod, ${error}`);
        });
    },
  },
};
</script>

<style lang="scss">
.export-work-order-record-loading {
  top: 50%;
  left: 50%;
  width: 360px;
  height: 180px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 2, 0.12);
  transform: translate(-50%, -50%);
}
.oneLine {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
