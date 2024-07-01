<template>
  <div class="table-list">
    <el-table v-loading="tableLoading" :data="tableData">
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column
        v-for="{ prop, label, minWidth, content } in tableColumnList"
        :key="prop"
        :prop="prop"
        :label="label"
        :min-width="minWidth"
      >
        <template #header>
          <span>{{ label }}</span>
          <template v-if="content">
            <el-tooltip effect="dark" placement="top" style="margin-left: 4px">
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
        <template #default="{ row }">
          <template v-if="['tagCode'].includes(prop)">
            <span>{{ row[prop] | formatTableColumnTagCodeText }}</span>
          </template>
          <template
            v-else-if="
              [
                'supplierCreateTime',
                'isvApproveFirstTime',
                'approveTime',
                'firstCallTime',
                'onlineTime',
                'firstCallActualTime',
              ].includes(prop)
            "
          >
            <span>{{ $dayjs | formatTableColumnDateTimeText(row[prop]) }}</span>
          </template>
          <template
            v-else-if="
              [
                'docUserSatisfactionDto',
                'funcUserSatisfactionDto',
                'answerUserSatisfactionDto',
              ].includes(prop)
            "
          >
            <span style="color: #e1251b">{{
              row[prop] | formatTableColumnSatisfactionScoreText
            }}</span>
            <span
              >，{{
                row[prop] | formatTableColumnSatisfactionContentText
              }}</span
            >
          </template>
          <template v-else-if="['appType'].includes(prop)">
            <span>{{ row[prop] | formatAppType }}</span>
          </template>
          <template v-else-if="['systemSource'].includes(prop)">
            <span>{{ row[prop] | formatSystemSource }}</span>
          </template>
          <template v-else>
            <span>{{ row[prop] }}</span>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="80" fixed="right">
        <template #header>
          <span>操作</span>
          <el-tooltip
            effect="dark"
            content="打标为“异常”，则数据不统计入对接周期看板"
            placement="top"
            style="margin-left: 4px"
          >
            <i class="el-icon-help" />
          </el-tooltip>
        </template>
        <template #default="scope">
          <slot name="actionColumn" v-bind="scope"></slot>
        </template>
      </el-table-column>
    </el-table>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "TableList",
  props: {
    tableLoading: { type: Boolean, required: true },
    tableData: { type: Array, required: true },
  },
  data() {
    return {
      tableColumnList: [
        { label: "标签", prop: "tagCode", minWidth: "60" },
        { label: "公司名称", prop: "companyName", minWidth: "120" },
        { label: "应用编码", prop: "appKey", minWidth: "120" },
        { label: "应用类别", prop: "appType", minWidth: "120" },
        { label: "应用来源", prop: "systemSource", minWidth: "120" },
        { label: "方案编码", prop: "unitCode", minWidth: "120" },
        { label: "方案名称", prop: "unitName", minWidth: "120" },
        { label: "注册时间", prop: "supplierCreateTime", minWidth: "110" },
        {
          label: "首个资质审核通过时间",
          prop: "isvApproveFirstTime",
          minWidth: "110",
        },
        {
          label: "方案订阅审批通过日期",
          prop: "approveTime",
          minWidth: "110",
        },
        { label: "首次调用时间", prop: "firstCallTime", minWidth: "110" },
        { label: "方案点击上线时间", prop: "onlineTime", minWidth: "110" },
        {
          label: "首次连续7天成功调用次数大于10",
          prop: "firstCallActualTime",
          minWidth: "110",
        },
        {
          label: "对接周期（天）",
          prop: "dockingPeriodTime",
          minWidth: "110",
          content: ["产品口径", "对接周期=点击方案上线时间-注册时间"],
        },
        { label: "文档描述", prop: "docUserSatisfactionDto", minWidth: "160" },
        { label: "平台功能", prop: "funcUserSatisfactionDto", minWidth: "160" },
        {
          label: "客服答疑",
          prop: "answerUserSatisfactionDto",
          minWidth: "160",
        },
      ],
    };
  },
  filters: {
    formatAppType(value) {
      const hashMap = new Map()
        .set(3, "ISV应用")
        .set(4, "商家自研应用")
        .set(5, "合作伙伴应用");
      return hashMap.get(value) || "";
    },
    formatSystemSource(value) {
      const hashMap = new Map()
        .set("jos", "JOS")
        .set("lcp", "开放平台");
      return hashMap.get(value) || "";
    },
    formatTableColumnTagCodeText(value) {
      const hashMap = new Map().set("01", "正常").set("02", "异常");
      return hashMap.get(value) || "";
    },
    formatTableColumnDateTimeText($dayjs, value) {
      return value ? $dayjs(value).format("YYYY-MM-DD") : "-";
    },
    formatTableColumnSatisfactionScoreText(satisfaction) {
      const { score } = satisfaction || {};
      return typeof score === "number" ? `${score}分` : "-分";
    },
    formatTableColumnSatisfactionContentText(satisfaction) {
      const { content } = satisfaction || {};
      return content || "-";
    },
  },
  methods: {
    judgeInstanceOfArray(content) {
      return content instanceof Array;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
