<template>
  <div class="table-list">
    <el-table v-loading="tableLoading" :data="tableData">
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column
        v-for="{
          prop,
          label,
          minWidth,
          content,
          showOverflowTooltip,
        } in tableColumnList"
        :key="prop"
        :prop="prop"
        :label="label"
        :min-width="minWidth"
        :show-overflow-tooltip="showOverflowTooltip"
      >
        <template #header>
          <span>{{ label }}</span>
          <template v-if="content">
            <el-tooltip effect="dark" placement="top" style="margin-left: 4px">
              <template #content>
                <template v-if="judgeContentIsArray(content)">
                  <p v-for="contentItem in content" :key="contentItem">
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
          <template v-if="['docTypeSub'].includes(prop)">
            <span>{{ formatTableColumnDocTypeSubText(row[prop]) }}</span>
          </template>
          <template v-else-if="['createTime'].includes(prop)">
            <span>{{ formatTableColumnCreateTimeText(row[prop]) }}</span>
          </template>
          <template v-else-if="['whetherHelp'].includes(prop)">
            <span>{{ formatTableColumnWhetherHelpText(row[prop]) }}</span>
          </template>
          <template v-else-if="['questionCause'].includes(prop)">
            <span>{{ formatTableColumnQuestionCauseText(row[prop]) }}</span>
          </template>
          <template v-else-if="['handleStatus'].includes(prop)">
            <span>{{
              formatTableColumnHandleStatusText(row[prop], row["whetherHelp"])
            }}</span>
          </template>
          <template v-else-if="['handleUser'].includes(prop)">
            <span>{{
              formatTableColumnHandleUser(row[prop], row["whetherHelp"])
            }}</span>
          </template>
          <template v-else>
            <span>{{ row[prop] || "-" }}</span>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="80" fixed="right">
        <template #header>
          <span>操作</span>
        </template>
        <template #default="scope">
          <slot name="actionColumn" v-bind="scope">
          </slot>
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
    queryDataType: {
      type: Number,
      validator: function (value) {
        return [1, 2].includes(value);
      },
    },
    tableLoading: { type: Boolean, required: true },
    tableData: { type: Array, required: true },
  },
  data() {
    return {};
  },
  computed: {
    tableColumnList() {
      const dockingSchemeDocumentTableColumnList = [
        { label: "对接方案名称", prop: "unitName", minWidth: "180" },
        { label: "文档类型", prop: "docTypeSub", minWidth: "120" },
        { label: "文档标题", prop: "title", minWidth: "200" },
        { label: "评价时间", prop: "createTime", minWidth: "160" },
        {
          label: "评价人",
          prop: "createUser",
          minWidth: "160",
          content: [
            "客户已登录，为开放平台账号pin；",
            "客户未登录，则为ip地址。",
          ],
        },
        { label: "是否有帮助", prop: "whetherHelp", minWidth: "100" },
        { label: "问题原因", prop: "questionCause", minWidth: "100" },
        {
          label: "问题描述",
          prop: "questionDesc",
          minWidth: "200",
          showOverflowTooltip: true,
        },
        { label: "处理状态", prop: "handleStatus", minWidth: "100" },
        { label: "处理人", prop: "handleUser", minWidth: "120" },
      ];
      const platformDocumentTableColumnList = [
        { label: "文档标题", prop: "title", minWidth: "200" },
        { label: "评价时间", prop: "createTime", minWidth: "160" },
        {
          label: "评价人",
          prop: "createUser",
          minWidth: "160",
          content: [
            "客户已登录，为开放平台账号pin；",
            "客户未登录，则为ip地址。",
          ],
        },
        { label: "是否有帮助", prop: "whetherHelp", minWidth: "100" },
        { label: "问题原因", prop: "questionCause", minWidth: "100" },
        {
          label: "问题描述",
          prop: "questionDesc",
          minWidth: "200",
          showOverflowTooltip: true,
        },
        { label: "处理状态", prop: "handleStatus", minWidth: "100" },
        { label: "处理人", prop: "handleUser", minWidth: "120" },
      ];
      const hashMap = new Map()
        .set(1, dockingSchemeDocumentTableColumnList)
        .set(2, platformDocumentTableColumnList);
      const { queryDataType } = this;
      return hashMap.get(queryDataType) || [];
    },
  },
  methods: {
    judgeContentIsArray(content) {
      return Array.isArray(content);
    },
    formatTableColumnDocTypeSubText(value) {
      const hashMap = new Map()
        .set(1, "API文档")
        .set(2, "业务介绍")
        .set(3, "开发说明")
        .set(4, "联调指南")
        .set(5, "常见问题")
        .set(6, "消息文档");
      return hashMap.get(value) || "-";
    },
    formatTableColumnCreateTimeText(value) {
      return value ? this.$dayjs(value).format("YYYY-MM-DD HH:mm:ss") : "-";
    },
    formatTableColumnWhetherHelpText(value) {
      const hashMap = new Map().set(0, "无帮助").set(1, "有帮助");
      return hashMap.get(value) || "-";
    },
    formatTableColumnQuestionCauseText(value) {
      const hashMap = new Map()
        .set(1, "内容不详细")
        .set(2, "文档更新不及时")
        .set(3, "内容有误")
        .set(4, "视觉体验差")
        .set(5, "其他");
      return hashMap.get(value) || "-";
    },
    formatTableColumnHandleStatusText(value, whetherHelp) {
      // 后端处理更合适
      if (whetherHelp === 1) {
        return "-";
      }
      const hashMap = new Map()
        .set(0, "评价待处理")
        .set(1, "评价已处理")
        .set(2, "挂起")
        .set(3, "评价不合理");
      return hashMap.get(value) || "-";
    },
    formatTableColumnHandleUser(handleUser, whetherHelp) {
      if (whetherHelp === 1) {
        return "-";
      }
      return handleUser;
    },
  },
};
</script>

<style lang="scss" scoped>
// .table-list {
// }
</style>
