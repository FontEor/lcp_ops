<template>
  <!-- 复制来源：src/views/appSearch/index.vue -->
  <div class="app-container">
    <el-tabs>
      <el-tab-pane label="应用信息">
        <el-form :model="formInline" :inline="true">
          <el-form-item label="应用类型">
            <el-select
              v-model="formInline.appTypeValue"
              placeholder="请选择应用类型"
              clearable
            >
              <el-option
                v-for="appType in formInline.appTypeList"
                :key="appType.value"
                :value="appType.value"
                :label="appType.label"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="应用名称">
            <el-input
              v-model.trim="formInline.name"
              placeholder="请输入应用名称关键字"
            />
          </el-form-item>
          <el-form-item label="应用编码">
            <el-input
              v-model.trim="formInline.code"
              placeholder="请输入应用编码"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="appSearchTable">
          <el-table-column label="序号" align="center" type="index" />
          <el-table-column label="应用名称" align="center" prop="name" />
          <el-table-column label="应用编码" align="center" prop="code" />
          <el-table-column
            label="应用类型"
            align="center"
            prop="type"
            :formatter="formatType"
          />
          <el-table-column
            label="应用状态"
            align="center"
            prop="status"
            :formatter="formatStatus"
          />
          <el-table-column label="创建人" align="center" prop="createUser" />
          <el-table-column
            label="创建时间"
            align="center"
            prop="createTime"
            :formatter="formatTime"
          />
          <el-table-column label="操作" align="center">
            <template slot-scope="{ row }">
              <el-button
                type="primary"
                size="mini"
                plain
                @click="handleUpdate(row)"
              >
                数据同步
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div v-if="appSearchTable.length !== 0" class="pagination-wrap">
          <el-pagination
            background
            layout="prev, pager, next, jumper"
            :current-page.sync="page"
            :page-size="pageSize"
            :total="total"
            @current-change="handleCurrentChange"
            @prev-click="prevClick"
            @next-click="nextClick"
          />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import request from "@/utils/request.js";

export default {
  name: "AppSearch",
  data() {
    return {
      formInline: {
        appTypeList: [
          { value: 1, label: "内网应用" },
          { value: 2, label: "外网应用" },
          { value: 3, label: "ISV应用" },
          { value: 4, label: "商家自研应用" },
          { value: 5, label: "合作伙伴应用" },
        ],
        appTypeValue: null,
        name: "",
        code: "",
      },
      appTypeDict: {
        1: "内网应用",
        2: "外网应用",
        3: "ISV应用",
        4: "商家自研应用",
        5: "合作伙伴应用",
      },
      appStatusDict: {
        1: "运行中",
        0: "未运行",
      },
      appSearchTable: [],
      type: 0,
      page: 0,
      pageSize: 10,
      total: 100,
    };
  },
  mounted() {
    const url = "/app/rest/queryAppList";
    request({
      url,
      method: "get",
      params: {},
    })
      .then((res) => {
        console.log(res);
        this.page = res.data.page;
        this.pageSize = res.data.pageSize;
        this.total = res.data.total;
        this.appSearchTable = res.data.rows;
      })
      .catch((e) => {
        console.log("应用查询请求错误", e);
      });
  },
  methods: {
    handleUpdate(val) {
      this.$confirm("确定要数据同步吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          const url = "/app/rest/syncAppToCloud";
          request({
            url,
            method: "get",
            params: {
              id: val.id,
            },
          })
            .then((res) => {
              // console.log(res);
              this.$message({
                type: "success",
                message: "同步成功!",
              });
            })
            .catch((e) => {
              console.log("数据同步错误", e);
            });
        })
        .catch((e) => {
          console.log("取消同步", e);
        });
    },
    formatStatus(row, column, cellValue, index) {
      return this.appStatusDict[cellValue];
    },
    formatType(row, column, cellValue, index) {
      return this.appTypeDict[cellValue];
    },
    formatTime(row, column, cellValue, index) {
      return cellValue.split(".")[0].replace("T", " ");
    },
    onSubmit() {
      this.type = this.formInline.appTypeValue || 0;
      const url = "/app/rest/queryAppList";
      request({
        url,
        method: "get",
        params: {
          type: this.type,
          name: this.formInline.name,
          code: this.formInline.code,
        },
      })
        .then((res) => {
          this.appSearchTable = res.data.rows;
          this.total = res.data.total;
          this.pageSize = res.data.pageSize;
          this.page = res.data.page;
        })
        .catch((e) => {
          console.log("按钮提交错误：", e);
        });
    },
    handleCurrentChange(val) {
      // console.log("/app/rest/queryAppList", val);
      const url = "/app/rest/queryAppList";
      request({
        url,
        method: "get",
        params: {
          type: this.type,
          page: val,
        },
      })
        .then((res) => {
          this.appSearchTable = res.data.rows;
          this.total = res.data.total;
          this.pageSize = res.data.pageSize;
          this.page = res.data.page;
        })
        .catch((e) => {
          console.log("改变当前页错误", e);
        });
    },
    prevClick() {
      const url = "/app/rest/queryAppList";
      request({
        url,
        method: "get",
        params: {
          type: this.type,
          rows: this.pageSize,
          page: this.page - 1,
        },
      })
        .then((res) => {
          this.appSearchTable = res.data.rows;
          this.total = res.data.total;
          this.pageSize = res.data.pageSize;
          this.page = res.data.page;
        })
        .catch((e) => {
          console.log("请求下一页错误", e);
        });
    },
    nextClick() {
      const url = "/app/rest/queryAppList";
      request({
        url,
        method: "get",
        params: {
          type: this.type,
          rows: this.pageSize,
          page: this.page + 1,
        },
      })
        .then((res) => {
          this.appSearchTable = res.data.rows;
          this.total = res.data.total;
          this.pageSize = res.data.pageSize;
          this.page = res.data.page;
        })
        .catch((e) => {
          console.log("请求下一页错误", e);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.pagination-wrap {
  margin-top: 20px;
  text-align: center;
}
::v-deep .cell {
  text-overflow: clip;
}
</style>
