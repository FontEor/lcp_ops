<template>
  <el-form
    class="search-form"
    ref="searchForm"
    :model="searchFormData"
    :rules="searchFormRules"
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
        :span="8"
      >
        <el-form-item :prop="prop" :label="label">
          <template v-if="prop === 'appKey'">
            <el-input
              v-model="searchFormData[prop]"
              :placeholder="placeholder"
              :clearable="true"
              style="width: 100%"
              @input="onInputAppKey"
            ></el-input>
          </template>

          <template v-else-if="prop === 'dockingScheme'">
            <el-select
              v-model="searchFormData[prop]"
              :placeholder="placeholder"
              :clearable="true"
              :filterable="true"
              value-key="id"
              style="width: 100%"
              @change="onChangeDockingScheme"
            >
              <el-option
                v-for="{ id, code, name, hasUat } in dockingSchemeOptionList"
                :key="id"
                :value="{ id, code, name, hasUat }"
                :label="name"
              ></el-option>
            </el-select>
          </template>

          <template v-if="prop === 'uri'">
            <el-select
              v-model="searchFormData[prop]"
              :placeholder="placeholder"
              :clearable="true"
              :filterable="true"
              style="width: 100%"
            >
              <el-option
                v-for="{ apiUrl, id } in uriOptionList"
                :key="id"
                :value="apiUrl"
                :label="apiUrl"
              ></el-option>
            </el-select>
          </template>

          <template v-else-if="prop === 'timeRange'">
            <el-radio-group
              v-model="searchFormData[prop]"
              size="mini"
              style="width: 100%"
            >
              <el-radio-button
                v-for="item in timeRangeRadioLabelList"
                :key="item"
                :label="item"
              ></el-radio-button>
            </el-radio-group>
          </template>

          <template v-else-if="prop === 'env'">
            <el-select
              v-model="searchFormData[prop]"
              :placeholder="placeholder"
              style="width: 100%"
            >
              <el-option
                v-for="{ value, label } in envOptionList"
                :key="value"
                :value="value"
                :label="label"
              ></el-option>
            </el-select>
          </template>

          <template v-else-if="prop === 'status'">
            <el-select
              v-model="searchFormData[prop]"
              clearable
              :placeholder="placeholder"
              style="width: 100%"
            >
              <el-option
                v-for="{ value, label } in statusOptionList"
                :key="value"
                :value="value"
                :label="label"
              ></el-option>
            </el-select>
          </template>

          <template v-else-if="prop === 'requestParameter'">
            <el-input
              v-model="searchFormData[prop]"
              :placeholder="placeholder"
              :clearable="true"
              style="width: 100%"
            ></el-input>
          </template>

          <template v-else-if="prop === 'responseParameter'">
            <el-input
              v-model="searchFormData[prop]"
              :placeholder="placeholder"
              :clearable="true"
              style="width: 100%"
            ></el-input>
          </template>

          <template v-else-if="prop === 'statusCode'">
            <el-input
              v-model="searchFormData[prop]"
              :placeholder="placeholder"
              :clearable="true"
              style="width: 100%"
            ></el-input>
          </template>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-button
          type="primary"
          style="float: right; margin-bottom: 20px"
          @click="onClickSearchButton(1)"
          >查询</el-button
        >
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import lcp from "@/api/lcp/index";

export default {
  name: "SearchForm",
  props: {
    pageNumb: { type: Number, required: true },
    pageSize: { type: Number, required: true },
    total: { type: Number, required: true },
    tableLoading: { type: Boolean, required: true },
    tableData: { type: Array, default: () => [] },
  },
  data() {
    return {
      searchFormData: {
        appKey: "",
        dockingScheme: {},
        uri: "",
        timeRange: "15分钟",
        env: "prod",
        status: "",
        requestParameter: "",
        responseParameter: "",
        statusCode: "",
      },
      searchFormList: [
        { label: "AppKey", prop: "appKey", placeholder: "请输入AppKey" },
        {
          label: "对接方案",
          prop: "dockingScheme",
          placeholder: "请选择对接方案",
        },
        {
          label: "API的URI",
          prop: "uri",
          placeholder: "如：/query/estimatedfreights",
        },
        { label: "时间范围", prop: "timeRange" },
        { label: "运行环境", prop: "env", placeholder: "请选择运行环境" },
        { label: "请求状态", prop: "status", placeholder: "请选择请求状态" },
        {
          label: "请求参数",
          prop: "requestParameter",
          placeholder: "请输入请求参数",
        },
        {
          label: "响应参数",
          prop: "responseParameter",
          placeholder: "请输入响应参数",
        },
        { label: "状态码", prop: "statusCode", placeholder: "请输入状态码" },
      ],
      searchFormRules: {
        appKey: [{ required: true, message: "请输入AppKey" }],
      },
      appKeyDebounceTimer: null,
      dockingSchemeOptionList: [],
      uriOptionList: [],
      timeRangeRadioLabelList: ["15分钟", "1小时", "1天", "5天", "7天"],
      envOptionList: [{ value: "prod", label: "线上环境" }],
      statusOptionList: [
        { value: "Succeed", label: "成功" },
        { value: "Failed", label: "失败" },
      ],
    };
  },
  mounted() {
    this.handleSearchAllBizUnitList();
  },
  methods: {
    // 查询运维端-日志工具-顶部表单的对接方案选择框选项列表全量数据
    async queryAllBizUnitList() {
      return await lcp.platform.rest.bizUnit.queryAllBizUnitList();
    },
    // 根据 AppKey 查询运维端-日志工具-顶部表单的对接方案选择框选项列表(有订阅关系数据)
    async queryApprovedRecordList() {
      const { appKey } = this.searchFormData;
      const params = { appKey };
      return await lcp.biz.rest.bizOrder.queryApprovedRecordList(params);
    },
    // 根据AppKey与对接方案ID查询URI列表
    async queryOuterBizOrderApiList() {
      const {
        appKey,
        dockingScheme: { id },
      } = this.searchFormData;
      const params = { appKey, unitId: id };
      return await lcp.platform.rest.bizApi.queryOuterBizOrderApiList(params);
    },
    // 查询日志表格数据
    async queryAppLogsList() {
      const hashMap = {
        "15分钟": 1000 * 60 * 15,
        "1小时": 1000 * 60 * 60,
        "1天": 1000 * 60 * 60 * 24,
        "5天": 1000 * 60 * 60 * 24 * 5,
        "7天": 1000 * 60 * 60 * 24 * 7,
      };
      const { pageNumb, pageSize } = this;
      const {
        appKey,
        dockingScheme,
        uri,
        timeRange,
        env,
        status,
        requestParameter,
        responseParameter,
        statusCode,
      } = this.searchFormData;
      const { code } = dockingScheme;
      const unitCode = code;
      const url = uri;
      const endTime = new Date().getTime();
      const startTime = endTime - hashMap[timeRange];
      const data = {
        pageNumb,
        pageSize,
        appKey,
        unitCode,
        url,
        startTime,
        endTime,
        env,
        status,
        requestParameter,
        responseParameter,
        statusCode,
      };
      return await lcp.platform.rest.loggingTool.queryAppLogsList(data);
    },
    // 查询全量对接方案数据
    async handleSearchAllBizUnitList() {
      const { data } = await this.queryAllBizUnitList().catch((error) => {
        throw new Error(
          `handleSearchAllBizUnitList queryAllBizUnitList, ${error}`
        );
      });
      this.dockingSchemeOptionList = data || [];
    },

    // 查询对接方案选项列表操作
    async handleSearchDockingSchemeOptionList() {
      const { data } = await this.queryApprovedRecordList().catch((error) => {
        throw new Error(
          `handleSearchDockingSchemeOptionList queryApprovedRecordList, ${error}`
        );
      });
      if (data.length > 0) {
        this.dockingSchemeOptionList = data;
      } else {
        this.handleSearchAllBizUnitList();
      }
    },
    // 查询API的URI列表操作
    async handleSearchUriOptionList() {
      const { data } = await this.queryOuterBizOrderApiList().catch((error) => {
        throw new Error(
          `handleSearchUriOptionList queryOuterBizOrderApiList, ${error}`
        );
      });
      this.uriOptionList = data || [];
    },
    // 输入AppKey时，重置对接方案、API的URI、运行环境，获取对应对接方案选项列表
    onInputAppKey(value) {
      clearTimeout(this.appKeyDebounceTimer);
      this.appKeyDebounceTimer = setTimeout(() => {
        this.searchFormData.dockingScheme = {};
        this.searchFormData.uri = "";
        this.searchFormData.env = "prod";
        this.envOptionList = [{ value: "prod", label: "线上环境" }];
        this.uriOptionList = [];
        if (value) {
          this.handleSearchDockingSchemeOptionList().catch((error) => {
            throw new Error(`onInputAppKey, ${error}`);
          });
          this.handleSearchUriOptionList().catch((error) => {
            throw new Error(`onInputAppKey, ${error}`);
          });
        } else {
          this.handleSearchAllBizUnitList();
        }
      }, 300);
    },
    // 选择对接方案时，重置API的URI、运行环境，获取对应API的URI选项列表
    onChangeDockingScheme({ hasUat }) {
      this.searchFormData.uri = "";
      this.searchFormData.env = "prod";
      this.envOptionList = hasUat
        ? [
            { value: "prod", label: "线上环境" },
            { value: "uat", label: "预发环境" },
          ]
        : [{ value: "prod", label: "线上环境" }];
      this.handleSearchUriOptionList().catch((error) => {
        throw new Error(`onChangeDockingScheme, ${error}`);
      });
    },
    // 查询表格数据操作
    async handleSearchTableData() {
      this.$emit("update:tableLoading", true);
      const {
        data: { total, list },
      } = await this.queryAppLogsList().catch((error) => {
        throw new Error(`handleSearchTableData queryAppLogsList, ${error}`);
      });
      this.$emit("update:total", total || 0);
      this.$emit("update:tableData", list || []);
      this.$emit("update:tableLoading", false);
    },
    // 点击查询按钮时，进行表单校验且在通过后查询日志表格数据
    onClickSearchButton(pageNumb = 0) {
      this.$refs.searchForm
        .validate()
        .then(async () => {
          pageNumb && this.$emit("update:pageNumb", pageNumb);
          await this.handleSearchTableData().catch((error) => {
            throw new Error(`onClickSearchButton, ${error}`);
          });
        })
        .catch(() => {});
    },
  },
};
</script>

<style lang="scss" scoped>
</style>