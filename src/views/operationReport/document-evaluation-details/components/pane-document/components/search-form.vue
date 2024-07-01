<template>
  <el-form :model="formModel" class="search-form" @keyup.enter.native="$emit('keyupEnter')">
    <el-row style="display: flex; flex-wrap: wrap">
      <el-col v-for="{ label, prop, placeholder, multiple } in formItemList" :key="prop" :span="8">
        <el-form-item :prop="prop" label-width="100px">
          <template #label>
            <span>{{ label }}</span>
          </template>
          <template v-if="['unitIdList'].includes(prop)">
            <el-cascader
              v-model="formModel[prop]"
              :options="unitIdListCascaderOptionList"
              :props="unitIdListCascaderProps"
              :placeholder="placeholder"
              :show-all-levels="false"
              :clearable="true"
              style="width: 100%"
            />
          </template>
          <template v-else-if="['evaluationTimeList'].includes(prop)">
            <el-date-picker
              v-model="formModel[prop]"
              :picker-options="pickerOptions"
              :default-time="['00:00:00', '23:59:59']"
              :clearable="true"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="timestamp"
              style="width: 100%"
            />
          </template>
          <template v-else>
            <el-select v-model="formModel[prop]" :placeholder="placeholder" :multiple="multiple || false" :clearable="true" style="width: 100%">
              <el-option v-for="{ label, value } in selectOptionList[prop]" :key="value" :label="label" :value="value" />
            </el-select>
          </template>
        </el-form-item>
      </el-col>
      <el-col :span="buttonColumnSpan">
        <el-row type="flex" justify="end">
          <el-form-item>
            <el-button type="primary" @click="$emit('keyupEnter')">查询</el-button>
            <el-button type="primary" :loading="exportStatementButtonLoading" @click="onClickExportStatementButton">导出报表</el-button>
          </el-form-item>
        </el-row>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import lcp from "@/api/lcp/index";
import { debounce } from "lodash";

export default {
  name: "SearchForm",
  props: {
    queryDataType: {
      type: Number,
      validator: function(value) {
        return [1, 2].includes(value);
      }
    },
    formModel: { type: Object, required: true }
  },
  data() {
    return {
      unitIdListCascaderOptionList: [],
      unitIdListCascaderProps: {
        multiple: true,
        emitPath: false,
        value: "id",
        label: "name",
        children: "bizUnitList"
      },
      selectOptionList: {
        whetherHelp: [
          { label: "有帮助", value: 1 },
          { label: "无帮助", value: 0 }
        ],
        questionCauseList: [
          { label: "内容不详细", value: 1 },
          { label: "文档更新不及时", value: 2 },
          { label: "内容有误", value: 3 },
          { label: "视觉体验差", value: 4 },
          { label: "其他", value: 5 }
        ],
        handleStatusList: [
          { label: "评价待处理", value: 0 },
          { label: "评价已处理", value: 1 },
          { label: "挂起", value: 2 },
          { label: "评价不合理", value: 3 }
        ]
      },
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setDate(start.getDate() - 6);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setMonth(start.getMonth() - 1);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setMonth(start.getMonth() - 3);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      exportStatementButtonLoading: false
    };
  },
  computed: {
    formItemList() {
      const dockingSchemeDocumentFormItemList = [
        {
          label: "对接方案",
          prop: "unitIdList",
          placeholder: "请选择对接方案"
        },
        { label: "评价时间", prop: "evaluationTimeList" },
        {
          label: "是否有帮助",
          prop: "whetherHelp",
          placeholder: "请选择文档评价是否有帮助"
        },
        {
          label: "问题原因",
          prop: "questionCauseList",
          placeholder: "请选择问题原因",
          multiple: true
        },
        {
          label: "处理状态",
          prop: "handleStatusList",
          placeholder: "请选择评价处理状态",
          multiple: true
        }
      ];
      const platformDocumentFormItemList = [
        { label: "评价时间", prop: "evaluationTimeList" },
        {
          label: "是否有帮助",
          prop: "whetherHelp",
          placeholder: "请选择文档评价是否有帮助"
        },
        {
          label: "问题原因",
          prop: "questionCauseList",
          placeholder: "请选择问题原因",
          multiple: true
        },
        {
          label: "处理状态",
          prop: "handleStatusList",
          placeholder: "请选择评价处理状态",
          multiple: true
        }
      ];
      const hashMap = new Map().set(1, dockingSchemeDocumentFormItemList).set(2, platformDocumentFormItemList);
      const { queryDataType } = this;
      return hashMap.get(queryDataType) || [];
    },
    buttonColumnSpan() {
      const { queryDataType } = this;
      const hashMap = new Map().set(1, 8).set(2, 16);
      return hashMap.get(queryDataType) || 24;
    }
  },
  methods: {
    // 获取分类下的所有对接方案接口
    async getClassifiedBizUnit() {
      return await lcp.platform.rest.bizUnit.getClassifiedBizUnit();
    },
    // 根据文档类型导出文档评价明细报表接口
    async evaluateExport() {
      const { queryDataType } = this;
      const { evaluationTimeList } = this.formModel;
      let { whetherHelp, questionCauseList, handleStatusList } = this.formModel;
      whetherHelp = typeof whetherHelp === "number" ? whetherHelp : undefined;
      questionCauseList = questionCauseList.length > 0 ? questionCauseList : undefined;
      handleStatusList = handleStatusList.length > 0 ? handleStatusList : undefined;
      const [startTime, endTime] = evaluationTimeList || [];
      let { unitIdList } = this.formModel;
      unitIdList = unitIdList.length > 0 ? unitIdList.map(item => parseInt(item)) : undefined;
      const data = {
        queryDataType,
        unitIdList,
        startTime,
        endTime,
        whetherHelp,
        questionCauseList,
        handleStatusList
      };
      return await lcp.platform.rest.evaluate.export(data);
    },

    // 获取分类下的所有对接方案接口调用
    async handleGetClassifiedBizUnit() {
      const { data } = await this.getClassifiedBizUnit().catch(error => {
        console.error("handleGetClassifiedBizUnit");
        throw error;
      });
      this.unitIdListCascaderOptionList = Array.isArray(data)
        ? data.map((item, index) => {
            let { bizUnitList } = item;
            bizUnitList = bizUnitList.map(bizUnitItem => {
              const { id } = bizUnitItem;
              return { ...bizUnitItem, id: String(id) };
            });
            return { ...item, id: String(-index), bizUnitList };
          })
        : [];
    },
    // 根据文档类型导出文档评价明细报表接口调用
    async handleEvaluateExport() {
      const { data } = await this.evaluateExport().catch(error => {
        console.error("handleEvaluateExport");
        throw error;
      });
      const { queryDataType } = this;
      const hashMapQueryDataType = new Map().set(1, "对接方案文档").set(2, "平台文档");
      const url = URL.createObjectURL(new Blob([data], { type: "text/csv" }));
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${hashMapQueryDataType.get(queryDataType)}评价明细_${this.$dayjs().format("YYYY-MM-DD_HH_mm_ss")}.csv`;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);
    },

    onClickExportStatementButton: debounce(async function() {
      this.exportStatementButtonLoading = true;
      const loading = this.$loading({
        text: "报表生成中，请稍后",
        spinner: "el-icon-loading",
        background: "rgb(236, 241, 254)",
        customClass: "export-statement-loading"
      });
      await this.handleEvaluateExport().catch(error => {
        this.exportStatementButtonLoading = false;
        console.error("onClickExportStatementButton");
        throw error;
      });
      this.exportStatementButtonLoading = false;
      setTimeout(() => {
        loading.close();
      }, 1000);
    }, 300)
  },
  async created() {
    await this.handleGetClassifiedBizUnit().catch(error => {
      console.error("created");
      throw error;
    });
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
</style>

<style lang="scss" scoped>
// .search-form {
// }
</style>
