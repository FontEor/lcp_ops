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
          <template v-if="['answerDetail'].includes(prop)">
            <el-tooltip placement="top" popper-class="smart-robot-table-tooltip">
              <div slot="content">
                <template v-if="handleAswerDetail((row[prop]))[0]">
                  <div
                    v-for="(item, index) in handleAswerDetail(row[prop])[1].slice(0,5)"
                    :key="index"
                  >
                    {{index+1}}. {{item.title}} 
                    <div>{{item.content}}</div>
                    <!-- <MarkdownPreview v-model="item.content" class="markdown-preview" /> -->
                  </div>
                </template>
                <template v-else>
                  <!-- <MarkdownPreview
                    v-model="handleAswerDetail((row[prop]))[1]"
                    class="markdown-preview"
                  /> -->
                  {{handleAswerDetail((row[prop]))[1]}}
                </template>
              </div>
              <div class="oneLine">
                <template v-if="handleAswerDetail((row[prop]))[0]">
                  <span
                    v-for="(item, index) in handleAswerDetail(row[prop])[1].slice(0,1)"
                    :key="index"
                  >{{index+1}}. {{item.title}}</span>
                </template>
                <template v-else>
                  <!-- <MarkdownPreview
                    v-model="handleAswerDetail((row[prop]))[1]"
                    class="markdown-preview"
                  /> -->
                  {{handleAswerDetail((row[prop]))[1]}}
                </template>
              </div>
            </el-tooltip>
          </template>
          <template v-else-if="['answerSource'].includes(prop)">
            <span>{{ row[prop] | formatAnswerSource }}</span>
          </template>
          <template v-else-if="['remarkStatus'].includes(prop)">
            <span>{{ row[prop] | formatRemarkStatus }}</span>
          </template>
          <template v-else-if="['remarkReason'].includes(prop)">
            <span>{{ row[prop] | formaRemarkReason }}</span>
          </template>
          <template v-else>
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
        {
          label: "提问人",
          prop: "createUser",
          minWidth: "100",
          content: [
            "客户已登录，为开放平台账号pin；",
            "客户未登录，则为ip地址。"
          ]
        },
        { label: "提问时间", prop: "createTime", minWidth: "120" },
        { label: "问题", prop: "question", minWidth: "140" },
        {
          label: "答案来源",
          prop: "answerSource",
          minWidth: "120",
          content: [
            "常见问题列表：客户的问题匹配到多个问题，智能助手为客户返回问题列表；",
            "常见问题：客户的问题仅匹配到一个问题，智能助手为客户直接把问题的答案返回给客户；",
            "系统兜底：当未匹配到客户的咨询时，按照固定的文案返回给客户。"
          ]
        },
        {
          label: "答案详情",
          prop: "answerDetail",
          minWidth: "180",
          content: [
            "回答类型为问题列表时，按顺序展示全部问题；",
            "回答类型为单个问题的回答时，展示问题的答案。"
          ]
        },
        { label: "评价状态", prop: "remarkStatus", minWidth: "100" },
        { label: "问题原因", prop: "remarkReason", minWidth: "120" },
        { label: "问题描述", prop: "remarkDetail", minWidth: "120" }
      ]
    };
  },

  filters: {
    formatAnswerSource(value) {
      const hashMap = new Map()
        .set(1, "常见问题列表")
        .set(2, "常见问题")
        .set(3, "系统兜底");
      return hashMap.get(value) || "";
    },

    formatRemarkStatus(value) {
      const hashMap = new Map()
        .set(0, "未评价")
        .set(1, "点赞")
        .set(2, "点踩");
      return hashMap.get(value) || "";
    },

    formaRemarkReason(value) {
      const hashMap = new Map()
        .set(1, "答非所问")
        .set(2, "回答不详细")
        .set(3, "没有找到我想问的问题")
        .set(4, "问题列表中我问的问题不够靠前");
      return hashMap.get(value) || "";
    }
  },
  methods: {
    judgeInstanceOfArray(content) {
      return content instanceof Array;
    },
    handleAswerDetail(str) {
      try {
        // 答案列表
        if (str.indexOf("businessType") != -1) {
          return [true, JSON.parse(str)];
          // 列表没数据 []
        } else if (JSON.parse(str).length === 0) {
          return [false, ''];
        } else {
          return [false, JSON.parse(str)];
        }
      } catch (e) {
        // 纯字符串转JSON.parse异常问
        return [false, str];
      }
    }
  }
};
</script>

<style lang="scss">
.smart-robot-table-tooltip{
  max-width: 80%;
}
.oneLine {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  .markdown-preview {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: #333;
    img {
      max-height: 40px;
    }
    * {
      display: inline;
    }
  }
}
</style>
