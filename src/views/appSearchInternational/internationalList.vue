<template>
  <div>
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
          <el-form-item label="公司名称">
            <el-input
              v-model.trim="formInline.companyName"
              placeholder="请输入公司名称"
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
          <el-table-column label="公司名称" align="center" prop="companyName" />
          <el-table-column label="创建人" align="center" prop="createUser" />
          <el-table-column
            label="创建时间"
            align="center"
            prop="createTime"
            :formatter="formatTime"
          />
        </el-table>
        <div v-if="appSearchTable.length !== 0" class="pagination-wrap">
          <el-pagination
            background
            layout="prev, pager, next, jumper"
            :current-page.sync="page"
            :page-size="pageSize"
            :total="total"
            @current-change="handleCurrentChange"
          />
        </div>
  </div>
</template>

<script>
import api from "@/api/index";
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
        companyName: "",
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
      page: 1,
      pageSize: 10,
      total: 100,
    };
  },
  mounted() {
      this.getList();
  },
  methods: {
    getList() {
      const params = {
        type: this.type,
        name: this.formInline.name,
        companyName: this.formInline.companyName,
        code: this.formInline.code,
        pageNumb: this.page,
        pageSize: this.pageSize,
      }
      api.application.queryAppInfoList(params)
      .then(res => {
        this.appSearchTable = res.data.list || [];
        this.total = res.data.total;
      })
      .catch(e => {
        console.log(e)
      })
      
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
      this.page = 1;
      this.getList()
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getList();
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
