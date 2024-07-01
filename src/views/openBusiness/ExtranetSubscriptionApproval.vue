<template>
  <div class="app-container" v-loading="table.loading">
    <el-form :model="formInline" ref="formInline" :inline="true">
      <el-form-item label="应用名称" prop="appName">
        <el-input v-model.trim="formInline.appName" clearable placeholder="请输入" @keyup.enter.native="onSubmit"></el-input>
      </el-form-item>
      <el-form-item label="应用编码" prop="appKey">
        <el-input v-model.trim="formInline.appKey" clearable placeholder="请输入" @keyup.enter.native="onSubmit"></el-input>
      </el-form-item>
      <el-form-item label="对接方案名称" prop="openBusinessName">
        <el-input v-model.trim="formInline.openBusinessName" clearable placeholder="请输入" @keyup.enter.native="onSubmit"></el-input>
      </el-form-item>
      <el-form-item label="对接方案编码" prop="unitCode">
        <el-input v-model.trim="formInline.unitCode" clearable placeholder="请输入" @keyup.enter.native="onSubmit"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="table.rowList">
      <el-table-column label="序号" type="index"></el-table-column>
      <el-table-column label="应用名称" prop="appName" align="center"></el-table-column>
      <el-table-column label="应用编码" prop="appKey" align="center"></el-table-column>
      <el-table-column label="对接方案名称" prop="openBusinessName" align="center"></el-table-column>
      <el-table-column label="对接方案编码" prop="unitCode" align="center"></el-table-column>
      <el-table-column label="申请时间" prop="orderTime" align="center"></el-table-column>
      <el-table-column label="当前进度" prop="status" align="center">
        <template slot-scope="{ row }">
          <span :class="judgeStatusColor(+row['status'])">{{ formatColumn(+row["status"]) }}</span>
          <span></span>
        </template>
      </el-table-column>
      <el-table-column label="审批工单号" prop="processInstanceNo" align="center"></el-table-column>
      <el-table-column label="当前处理人" prop="pin" align="center"></el-table-column>
    </el-table>

    <div class="paneFooter" v-show="table.rowList.length">
      <el-pagination
        background
        layout="prev, pager, next, jumper"
        :current-page.sync="pagination.page"
        :page-size="pagination.pageSize"
        :total="pagination.total"
        @current-change="getOpenBusinessData"
        @size-change="handleSizeChange"
      />
    </div>
  </div>
</template>

<script>
import request from "@/utils/request.js";
let searchInfo = {
  appName: "",
  openBusinessName: "",
  appKey: "",
  unitCode: ""
};
export default {
  name: "ExtranetSubscriptionApproval.",
  props: {
    active: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    active: {
      handler(newVal) {
        newVal && this.getOpenBusinessData();
      },
      immediate: true
    }
  },
  data() {
    return {
      formInline: {
        appName: "",
        openBusinessName: "",
        appKey: "",
        unitCode: ""
      },
      table: {
        rowList: [],
        loading: false,
        statusList: ["", "产品负责人审批中", "产品负责人审批不通过", "研发负责人审批中", "研发负责人审批不通过", "审批通过", "未知状态", "平台管理员审批中", "平台管理员审批不通过"],
        statusColorTable: ["", "primaryColor", "dangerColor", "primaryColor", "dangerColor", "successColor", "primaryColor", "successColor", "dangerColor"]
      },
      pagination: {
        page: 1,
        pageSize: 10,
        total: null
      }
    };
  },
  computed: {
    judgeStatusColor() {
      return status => this.table.statusColorTable[status];
    },
    formatColumn() {
      return value => this.table.statusList[value];
    }
  },
  methods: {
    toggleLoading() {
      this.table.loading = !this.table.loading;
    },
    getOpenBusinessData() {
      this.toggleLoading();
      request({
        url: "/biz/rest/bizOrder/queryBizOrder",
        method: "get",
        params: {
          appName: searchInfo.appName,
          openBusinessName: searchInfo.openBusinessName,
          appKey: searchInfo.appKey,
          unitCode: searchInfo.unitCode,
          page: this.pagination.page,
          pageSize: this.pagination.pageSize
        }
      })
        .then(response => {
          const { code, data, message } = response;
          if (+code === 20000) {
            const { rows, page, pageSize, total } = data || {};
            this.table.rowList = rows;
            this.pagination = Object.assign({}, this.pagination, { page, total });
          } else {
            this.$message.error({ message });
          }
          this.toggleLoading();
        })
        .catch(e => {
          console.log("getOpenBusinesssData 错误", e);
          this.toggleLoading();
        });
    },
    onSubmit() {
      this.pagination.page = 1;
      searchInfo = this.formInline;
      this.getOpenBusinessData();
    },
    handleSizeChange(newSize) {
      this.pagination.pageSize = newSize;
      this.pagination.page = 1;
      this.getOpenBusinessData();
    }
  }
};
</script>

<style lang="scss" scoped>
.paneFooter {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
.primaryColor {
  color: #3c6ef0;
}
.dangerColor {
  color: #e1251b;
}
.successColor {
  color: #26a872;
}
</style>