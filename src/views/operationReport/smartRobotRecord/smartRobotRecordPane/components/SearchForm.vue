<template>
  <el-form
    :model="searchFormData"
    class="search-form"
    @keyup.enter.native="$emit('keyupEnter')"
  >
    <el-row style="display: flex; flex-wrap: wrap">
      <el-col
        v-for="{ label, prop, placeholder, multiple } in formItemList"
        :key="prop"
        :span="8"
      >
        <el-form-item :prop="prop" label-width="120px">
          <template #label>
            <span>{{ label }}</span>
          </template>
          <template v-if="['remarkStatus','remarkReason', 'answerSource'].includes(prop)">
            <el-select
              v-model="searchFormData[prop]"
              :placeholder="placeholder"
              :multiple="multiple || false" :clearable="true"
              style="width: 100%"
            >
              <el-option
                v-for="{ label, value } in selectOptionList[prop]"
                :key="value"
                :label="label"
                :value="value"
              />
            </el-select>
          </template>
          <template
            v-else-if="
              [
                'questionTimeList',
              ].includes(prop)
            "
          >
            <el-date-picker
              v-model="searchFormData[prop]"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="timestamp"
              :clearable="true"
              :default-time="['00:00:00', '23:59:59']"
            />
          </template>
          <template v-else>
            <el-input
              v-model="searchFormData[prop]"
              :clearable="true"
              :placeholder="placeholder"
              style="width: 100%"
            />
          </template>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-row type="flex" justify="end">
          <el-form-item>
            <el-button type="primary" @click="$emit('keyupEnter')"
              >查询</el-button
            >
            <!-- <el-button
              type="primary"
              :loading="exportStatementButtonLoading"
              @click="onClickExportStatementButton"
              >导出报表</el-button
            > -->
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
      formItemList: [
        {
          label: "问题关键词",
          prop: "keyWord",
          placeholder: "请输入问题关键词",
        },
        { label: "提问时间", prop: "questionTimeList" },
        {
          label: "评价状态",
          prop: "remarkStatus",
          placeholder: "请选择评价状态",
          multiple: true
        },
        {
          label: "问题原因",
          prop: "remarkReason",
          placeholder: "请选择问题原因",
          multiple: true
        },
        {
          label: "答案来源",
          prop: "answerSource",
          placeholder: "请选择答案来源",
        },
      ],
      selectOptionList: {
        remarkStatus: [
          { label: "未评价", value: 0 },
          { label: "点赞", value: 1 },
          { label: "点踩", value: 2 },
        ],
        remarkReason: [
          { label: "答非所问", value: 1 },
          { label: "回答不详细", value: 2 },
          { label: "没有找到我想问的问题", value: 3 },
          { label: "问题列表中我问的问题不够靠前", value: 4 },
        ],
        answerSource: [
          { label: "常见问题列表", value: 1 },
          { label: "常见问题", value: 2 },
          { label: "系统兜底", value: 3 },
        ],
      },
      
      exportStatementDebounceTimer: null,
      exportStatementButtonLoading: false,
    };
  },
  methods: {
    // 导出对接周期
    async exportDockingPeriod() {
      let {
        keyWord,
        answerSource,
        remarkStatus,
        remarkReason,
        questionTimeList
      } = this.searchFormData;
      
      const [startTime, endTime] = questionTimeList || [];
      answerSource = typeof answerSource === "number" ? answerSource : undefined;
      remarkStatus = remarkStatus.length > 0 ? remarkStatus : undefined;
      remarkReason = remarkReason.length > 0 ? remarkReason : undefined;
      const data = {
        keyWord,
        startTime,
        endTime,
        answerSource,
        remarkStatus,
        remarkReason,
      };
      return await lcp.platform.rest.dockingPeriod
        .exportDockingPeriod(data)
        .catch((error) => {
          throw new Error(`exportDockingPeriod, ${error}`);
        });
    },

    async handleExportDockingPeriod() {
      const { data } = await this.exportDockingPeriod().catch((error) => {
        throw new Error(`handleExportDockingPeriod, ${error}`);
      });
      const url = URL.createObjectURL(new Blob([data], { type: "text/csv" }));
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `智能助手记录_${this.$dayjs().format(
        "YYYY-MM-DD"
      )}.csv`;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);
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
  },

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