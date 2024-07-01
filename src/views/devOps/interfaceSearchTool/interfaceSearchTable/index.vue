<template>
  <div>
    <!-- 查询表单 -->
    <el-form
      class="search-form"
      ref="searchForm"
      :model="searchFormData"
      label-width="auto"
    >
      <el-row
        :gutter="16"
        type="flex"
        justify="end"
        style="flex-wrap: wrap; flex-direction: row"
      >
        <el-col
          v-for="{ prop, label, placeholder } in searchFormList"
          :key="prop"
          :span="5"
        >
          <el-form-item :prop="prop" :label="label">
            <template>
              <el-input
                v-model="searchFormData[prop]"
                :placeholder="placeholder"
                :clearable="true"
                style="width: 100%"
              ></el-input>
            </template>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-button
            type="primary"
            style="float: left; margin-bottom: 20px"
            @click="reloadTableData(1)"
            >查询</el-button
          >
        </el-col>
      </el-row>
    </el-form>

    <!-- 列表 -->
    <el-table v-loading="isLoading" :data="tableData">
      <el-table-column type="index" label="序号" />
      <el-table-column prop="name" label="API名称" />
      <el-table-column prop="interfaceName" min-width="140" label="接口名" />
      <el-table-column prop="methodName" label="JSF方法名" />
      <el-table-column prop="uri" label="接口的URL" />
      <el-table-column prop="unitCode" label="对接方案编码" />
      <el-table-column prop="owner" label="API负责人" />
      <el-table-column prop="deptName" label="API所属部门" />
    </el-table>

    <!-- 分页 -->
    <Pagination
      :currentPage.sync="pageNumb"
      :pageSize.sync="pageSize"
      :total.sync="total"
      :reloadTableData="reloadTableData"
    />
  </div>
</template>

<script>
import lcp from "@/api/lcp/index";
import Pagination from "@/components/Pagination.vue";

export default {
  name: "InterfaceSearchTable",
  components: { Pagination },
  data() {
    return {
      isLoading: false,
      searchFormData: {
        unitCode: "",
        apiUrl: "",
        interfaceName: "",
        interfaceMethod: "",
      },
      searchFormList: [
        {
          label: "对接方案编码",
          prop: "unitCode",
          placeholder: "请输入对接方案编码",
        },
        {
          label: "接口的URL",
          prop: "apiUrl",
          placeholder: "请输入接口的URL",
        },
        {
          label: "JSF接口名",
          prop: "interfaceName",
          placeholder: "请输入JSF接口名",
        },
        {
          label: "JSF方法名",
          prop: "interfaceMethod",
          placeholder: "请输入JSF方法名",
        },
      ],
      tableData: [],
      pageNumb: 1,
      pageSize: 10,
      total: 0,
    };
  },
  methods: {
    async reloadTableData(page = 0) {
      this.isLoading = true;
      this.pageNumb = page || this.pageNumb;
      const response = await this.queryApiInfoList().catch((error) => {
        this.isLoading = false;
        this.tableData = [];
        this.pageSize = 10;
        this.total = 0;
        throw new Error(`reloadTableData, ${error}`);
      });
      this.isLoading = false;
      this.tableData = response.data.list;
      this.total = response.data.total;
    },
    // 查询日志表格数据
    async queryApiInfoList() {
      const { pageNumb, pageSize } = this;
      const { unitCode, apiUrl, interfaceName, interfaceMethod } =
        this.searchFormData;
      const data = {
        pageNumb,
        pageSize,
        unitCode,
        apiUrl,
        interfaceName,
        interfaceMethod,
      };
      return await lcp.platform.rest.bizApi
        .queryApiInfoList(data)
        .catch((error) => {
          throw new Error(`queryApiInfoList, ${error}`);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>