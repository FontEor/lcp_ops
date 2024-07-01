<template>
  <div class="table-list">
    <el-table v-loading="tableLoading" :data="tableData">
      <el-table-column v-for="{ prop, label, minWidth, width, content } in tableColumnList" :key="prop" :prop="prop"
        :label="label" :min-width="minWidth" :width="width">
        <template #header>
          <span>{{ label }}</span>
          <template v-if="content">
            <el-tooltip effect="dark" placement="top" style="margin-left: 4px">
              <template #content>
                <template v-if="judgeInstanceOfArray(content)">
                  <p v-for="(contentItem, index) in content" :key="index">{{ contentItem }}</p>
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
          <template>
            <span>{{ row[prop] }}</span>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <slot></slot>
  </div>
</template>

<script>
import MarkdownPreview from "@/components/MarkdownPreview/index.vue";

export default {
  name: "TableList",
  props: {
    tableLoading: { type: Boolean, required: true },
    tableData: { type: Array, required: true }
  },
  components: { MarkdownPreview },

  data() {
    return {
      tableColumnList: [
        { label: "日期", prop: "startDate", width: "110" },
        { label: "对接方案", prop: "bizUnitName", minWidth: "120" },
        { label: "对接方案编码", prop: "bizUnitCode", minWidth: "120" },
        { label: "api的URL(path)", prop: "apiUri", minWidth: "120" },
        { label: "物流网关接口名/EDI接口的URL", prop: "gatewayUri", minWidth: "120" },
        { label: "社会信用代码", prop: "companyCode", minWidth: "120" },
        { label: "企业名称", prop: "companyName", minWidth: "120" },
        { label: "EDI商家英文名称", prop: "ediName", minWidth: "120" },
        { label: "appKey", prop: "appKey", minWidth: "120" },
        { label: "应用名称", prop: "appName", minWidth: "120" },
        { label: "应用类型", prop: "appType", minWidth: "120" },
        { label: "pin", prop: "pin", minWidth: "120" },
        { label: "调用量", prop: "callVolume", minWidth: "120" },
      ]
    };
  },

  methods: {
    judgeInstanceOfArray(content) {
      return content instanceof Array;
    },
  }
};
</script>
