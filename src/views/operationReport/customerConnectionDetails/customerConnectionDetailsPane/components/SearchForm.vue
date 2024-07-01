<template>
  <el-form
    :model="searchFormData"
    class="search-form"
    @keyup.enter.native="$emit('keyupEnter')"
  >
    <el-row style="display: flex; flex-wrap: wrap">
      <el-col
        v-for="{ label, prop, placeholder, content } in formItemList"
        :key="prop"
        :span="8"
      >
        <el-form-item :prop="prop" label-width="120px">
          <template #label>
            <span>{{ label }}</span>
            <template v-if="content">
              <el-tooltip
                effect="dark"
                placement="top"
                style="margin-left: 4px"
              >
                <template #content>
                  <template v-if="judgeInstanceOfArray(content)">
                    <p v-for="(contentItem, index) in content" :key="index">
                      {{ contentItem }}
                    </p>
                  </template>
                  <template v-else>
                    <p>{{ content }}</p>
                  </template>
                </template>
                <i class="el-icon-help" />
              </el-tooltip>
            </template>
          </template>
          <template v-if="['onlineStatus'].includes(prop)">
            <el-select
              v-model="searchFormData[prop]"
              :placeholder="placeholder"
              style="width: 100%"
            >
              <el-option
                v-for="{ label, value } in onlineStatusOptionList"
                :key="value"
                :label="label"
                :value="value"
              />
            </el-select>
          </template>
          <template
            v-else-if="
              [
                'approveTimeList',
                'onlineTimeList',
                'firstCallActualTimeList',
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
          <template v-else-if="['unitIdList'].includes(prop)">
            <el-cascader
              v-model="searchFormData[prop]"
              :options="unitIdListCascaderOptionList"
              :props="unitIdListCascaderProps"
              :show-all-levels="false"
              :clearable="true"
              style="width: 100%"
            />
          </template>
          <template v-else>
            <el-input
              v-model.trim="searchFormData[prop]"
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
            <el-button
              type="primary"
              :loading="exportStatementButtonLoading"
              @click="onClickExportStatementButton"
              >导出报表</el-button
            >
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
      unitIdListCascaderOptionList: [],
      formItemList: [
        {
          label: "数据展示范围",
          prop: "onlineStatus",
          content: [
            "“已订阅”：展示已订阅的对接方案的数据；",
            "“已上线”：仅展示已上线的对接方案的数据。",
          ],
        },
        { label: "方案订阅时间", prop: "approveTimeList" },
        { label: "方案上线时间", prop: "onlineTimeList" },
        {
          label: "对接方案",
          prop: "unitIdList",
          placeholder: "请选择对接方案",
        },
        {
          label: "公司名称",
          prop: "companyName",
          placeholder: "请选择输入公司名称",
        },
        { label: "首次连续7天调用大于10次", prop: "firstCallActualTimeList" },
      ],
      onlineStatusOptionList: [
        { label: "已上线", value: 2 },
        { label: "已订阅", value: 0 },
      ],
      unitIdListCascaderProps: {
        multiple: true,
        emitPath: false,
        value: "id",
        label: "name",
        children: "bizUnitList",
      },
      exportStatementDebounceTimer: null,
      exportStatementButtonLoading: false,
    };
  },
  methods: {
    // 获取分类下的所有对接方案
    async getClassifiedBizUnit() {
      return await lcp.platform.rest.bizUnit
        .getClassifiedBizUnit()
        .catch((error) => {
          throw new Error(`getClassifiedBizUnit, ${error}`);
        });
    },
    // 导出对接周期
    async exportDockingPeriod() {
      const {
        onlineStatus,
        approveTimeList,
        onlineTimeList,
        unitIdList,
        companyName,
        firstCallActualTimeList,
      } = this.searchFormData;
      const [approveStartTime, approveEndTime] = approveTimeList || [];
      const [onlineStartTime, onlineEndTime] = onlineTimeList || [];
      const [firstCallActualStartTime, firstCallActualEndTime] =
        firstCallActualTimeList || [];
      const data = {
        onlineStatus,
        approveStartTime,
        approveEndTime,
        onlineStartTime,
        onlineEndTime,
        unitIdList,
        companyName,
        firstCallActualStartTime,
        firstCallActualEndTime,
      };
      return await lcp.platform.rest.dockingPeriod
        .exportDockingPeriod(data)
        .catch((error) => {
          throw new Error(`exportDockingPeriod, ${error}`);
        });
    },

    async handleGetClassifiedBizUnit() {
      const { data } = await this.getClassifiedBizUnit().catch((error) => {
        throw new Error(`handleGetClassifiedBizUnit, ${error}`);
      });
      this.unitIdListCascaderOptionList =
        data instanceof Array
          ? data.map((item, index) => {
              let { bizUnitList } = item;
              bizUnitList = bizUnitList.map((bizUnitItem) => {
                const { id } = bizUnitItem;
                return { ...bizUnitItem, id: String(id) };
              });
              return { ...item, id: String(-index), bizUnitList };
            })
          : [];
    },
    async handleExportDockingPeriod() {
      const { data } = await this.exportDockingPeriod().catch((error) => {
        throw new Error(`handleExportDockingPeriod, ${error}`);
      });
      const url = URL.createObjectURL(new Blob([data], { type: "text/csv" }));
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `客户对接明细_${this.$dayjs().format(
        "YYYY-MM-DD"
      )}.csv`;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);
    },
    judgeInstanceOfArray(content) {
      return content instanceof Array;
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
  watch: {
    "$route.query": {
      immediate: true,
      handler(newValue) {
        if (newValue.startTime) {
          const { startTime, endTime } = newValue;
          this.searchFormData.onlineTimeList = [startTime, endTime];
          this.searchFormData.unitIdList = newValue.unitIdList;
          this.searchFormData.onlineStatus = 2;
          this.$emit("keyupEnter");
          this.$router.push({ query: {} });
        }
      },
    },
  },
  async created() {
    await this.handleGetClassifiedBizUnit().catch((error) => {
      throw new Error(`created, ${error}`);
    });
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