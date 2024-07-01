<template>
  <el-form :model="searchFormData" class="search-form" :rules="rules">
    <el-row style="display: flex; flex-wrap: wrap">
      <el-col v-for="{ label, prop, placeholder, className } in formItemList" :key="prop" :span="8">
        <el-form-item :prop="prop" label-width="120px" :class="className">
          <template #label>
            <span>{{ label }}</span>
          </template>
          <template v-if="prop === 'dockingScheme'">
            <el-select v-model="searchFormData[prop]" :placeholder="placeholder" :clearable="true" :filterable="true"
              value-key="id" style="width: 100%" @change="onChangeDockingScheme">
              <el-option v-for="{ id, code, name } in dockingSchemeOptionList" :key="id" :value="{ id, code, name }"
                :label="name"></el-option>
            </el-select>
          </template>

          <template v-else-if="prop === 'apiUrlScheme'">
            <el-select v-model="searchFormData[prop]" :placeholder="placeholder" :clearable="true" :filterable="true"
              value-key="id" style="width: 100%">
              <el-option v-for="item in uriOptionList" :key="item.id" :value="item" :label="item.apiUrl"></el-option>
            </el-select>
          </template>

          <template v-else-if="prop === 'questionTimeList'">
            <el-date-picker v-model="searchFormData[prop]" type="daterange" start-placeholder="开始日期" range-separator="至"
              end-placeholder="结束日期" value-format="yyyy-MM-dd" format="yyyy-MM-dd">
            </el-date-picker>
          </template>

          <template v-else>
            <el-input v-model="searchFormData[prop]" :clearable="true" :placeholder="placeholder" style="width: 100%" />
          </template>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-row type="flex" justify="end">
          <el-form-item>
            <el-button type="primary" @click="$emit('keyupEnter')">查询</el-button>
            <el-button type="primary" :loading="exportStatementButtonLoading"
              @click="onClickExportStatementButton">导出报表</el-button>
            <el-tooltip effect="dark" placement="top" style="margin-left:6px;">
              <template #content>
                <p>导出报表是异步操作，下载链接将发到您的邮箱，请您关注邮箱通知</p>
              </template>
              <i class="el-icon-help" />
            </el-tooltip>
          </el-form-item>
        </el-row>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import lcp from "@/api/lcp/index";

export default {
  name: "SearchForm",
  props: {
    searchFormData: { type: Object, required: true },
  },
  data() {
    return {
      rules: {
        questionTimeList: [
          { required: true, message: '请选择日期', trigger: 'change' },
        ],
      },
      formItemList: [
        { label: "日期", prop: "questionTimeList", required: true },
        {
          label: "appKey",
          prop: "appKey",
          placeholder: "请输入appKey",
        },
        {
          label: "pin",
          prop: "pin",
          placeholder: "请输入pin",
        },
        {
          label: "对接方案",
          prop: "dockingScheme",
          placeholder: "请选择对接方案",
        },
        {
          label: "API的URL(path)",
          prop: "apiUrlScheme",
          placeholder: "请选择API的URL(path)",
        },
        {
          label: "物流网关接口名/EDI接口URL",
          prop: "gatewayUri",
          placeholder: "请输入物流网关接口名/EDI接口URL",
          className: 'lineHeight16'
        },
        {
          label: "社会信用代码",
          prop: "companyCode",
          placeholder: "请输入物流网关接口名/EDI接口URL",
        },
      ],

      dockingSchemeOptionList: [],
      uriOptionList: [],
      exportStatementDebounceTimer: null,
      exportStatementButtonLoading: false,
    };
  },
  methods: {
    // 导出对接周期
    async exportDockingPeriod() {
      let { questionTimeList, appKey, pin, dockingScheme, apiUrlScheme, gatewayUri, companyCode } = this.searchFormData;
      let [startTime, endTime] = questionTimeList;
      let bizUnitCode = dockingScheme.code;
      let apiUri = apiUrlScheme.apiUrl;
      startTime = new Date(startTime).getTime()
      endTime = new Date(endTime).getTime()
      const data = {
        startTime,
        endTime,
        appKey,
        pin,
        companyCode,
        bizUnitCode,
        apiUri,
        gatewayUri
      };
      return await lcp.statistics.rest.safetystatisticsExport(data)
        .catch((error) => {
          throw new Error(`exportDockingPeriod, ${error}`);
        });
    },

    async handleExportDockingPeriod() {
      const { data } = await this.exportDockingPeriod().catch((error) => {
        throw new Error(`handleExportDockingPeriod, ${error}`);
      });

      this.$alert('下载地址将发到您的邮箱，请您关注邮箱通知', '提示', {
        confirmButtonText: '确定',
        callback: action => {

        }
      });

    },

    onClickExportStatementButton() {
      clearTimeout(this.exportStatementDebounceTimer);
      this.exportStatementDebounceTimer = setTimeout(async () => {
        this.exportStatementButtonLoading = true;
        const loading = this.$loading({
          text: "报表生成中，请稍后",
          spinner: "el-icon-loading",
          background: "rgb(236, 241, 254)",
          customClass: "export-statement-loading",
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

    // 查询全量对接方案数据
    async handleSearchAllBizUnitList() {
      const { data } = await lcp.platform.rest.bizUnit.queryAllBizUnitList().catch((error) => {
        throw new Error(
          `handleSearchAllBizUnitList queryAllBizUnitList, ${error}`
        );
      });
      this.dockingSchemeOptionList = data || [];
    },


    // 查询API的URI列表操作
    async handleSearchUriOptionList() {
      const unitCode = this.searchFormData.dockingScheme.code;
      const params = { unitCode };
      const { data } = await lcp.platform.rest.bizApi.findOutCallInnerApiListByUnitCode(params).catch((error) => {
        throw new Error(
          `handleSearchUriOptionList fuzzyQueryCallBackApiList, ${error}`
        );
      });
      this.uriOptionList = data || [];
    },


    // 选择对接方案时，重置运行环境，API的URI，获取对应API的URI列表
    onChangeDockingScheme() {
      this.searchFormData.apiUrlScheme = {};
      this.handleSearchUriOptionList();
    },

  },

  created() {
    this.handleSearchAllBizUnitList();
  }

};
</script>

<style lang="scss">
.export-statement-loading {
  top: 50%;
  left: 50%;
  width: 360px;
  height: 180px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 2, 0.12);
  transform: translate(-50%, -50%);
}

.lineHeight16 {
  .el-form-item__label {
    line-height: 16px !important;

  }
}
</style>