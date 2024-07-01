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
              v-model.trim="searchFormData[prop]"
              :placeholder="placeholder"
              :clearable="true"
              style="width: 100%"
              @change="handleAppKeyBlur"
            ></el-input>
          </template>
          <template v-else-if="prop === 'unitCode'">
            <el-select
              v-model="searchFormData[prop]"
              :placeholder="placeholder"
              value-key="unitCode"
              style="width: 100%"
              collapse-tags
              multiple
              @change="handleUnitCodeBlur"
            >
              <el-option
                v-for="{ unitCode, unitName } in unitNameList"
                :key="unitCode"
                :value="unitCode"
                :label="unitName"
              ></el-option>
            </el-select>
          </template>
          <template v-if="prop === 'topic'">
            <el-select
              v-model="searchFormData[prop]"
              :placeholder="placeholder"
              :filterable="true"
              value-key="topic"
              style="width: 100%"
              collapse-tags
              multiple
              @change="handleTopicBlur"
            >
              <el-option
                v-for="item in topicCnNameList"
                :key="item.topic"
                :value="item.topic"
                :label="`${item.topic}(${item.messageCnName})`"
              ></el-option>
            </el-select>
          </template>
          <template v-else-if="prop === 'businessIdentifier'">
            <span slot="label">
              <span class="span-box">
                <span> 业务标识 </span>
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="业务标识是每条消息的唯一标识，不同业务线消息的业务标识不同，可联系业务线研发获取生成规则。"
                  placement="top"
                >
                  <i class="el-icon-help"></i>
                </el-tooltip>
              </span>
            </span>
            <el-input
              v-model.trim="searchFormData[prop]"
              :placeholder="placeholder"
              :clearable="true"
              style="width: 100%"
            ></el-input>
          </template>
          <template v-else-if="prop === 'timeRange'">
            <el-date-picker
              v-model="searchFormData[prop]"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right"
              :picker-options="pickerOptions"
              value-format="yyyy-MM-dd HH:mm:ss"
              :default-time="['00:00:00', '23:59:59']"
            >
            </el-date-picker>
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
          <template v-else-if="prop === 'requestParam'">
            <el-input
              v-model="searchFormData[prop]"
              :placeholder="placeholder"
              :clearable="true"
              style="width: 100%"
            ></el-input>
          </template>
          <template v-else-if="prop === 'responseParam'">
            <el-input
              v-model="searchFormData[prop]"
              :placeholder="placeholder"
              :clearable="true"
              style="width: 100%"
            ></el-input>
          </template>
          <template v-else-if="prop === 'traceId'">
            <el-input
              v-model="searchFormData[prop]"
              :placeholder="placeholder"
              :clearable="true"
              style="width: 70%"
            ></el-input>
            <el-button
              type="primary"
              style="float: right; margin-bottom: 20px"
              @click="onClickSearchButton(1)"
              >查询</el-button
            >
          </template>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import lcp from "@/api/lcp/index";
import { SappModule } from "@/store/modules/app";
import { cloneDeep, intersectionWith } from "lodash";
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
        unitCode: [], //对接方案编码
        topic: [], //消息名称
        businessIdentifier: "",
        timeRange: "",
        env: 0,
        requestParam: "",
        responseParam: "",
        traceId: "",
      },
      searchFormList: [
        {
          label: "AppKey",
          prop: "appKey",
          placeholder: "请输入AppKey",
        },
        {
          label: "对接方案",
          prop: "unitCode",
          placeholder: "请选择对接方案",
        },
        {
          label: "消息名称",
          prop: "topic",
          placeholder: "如：eclp_back_so_lop_message(销售出库明细消息推送)",
        },
        {
          label: `业务标识`,
          prop: "businessIdentifier",
          placeholder: "咨询业务线研发获取业务标识规则",
        },
        { label: "时间范围", prop: "timeRange" },
        { label: "运行环境", prop: "env", placeholder: "请选择运行环境" },
        {
          label: "请求参数",
          prop: "requestParam",
          placeholder: "请输入请求参数中的关键词",
        },
        {
          label: "响应参数",
          prop: "responseParam",
          placeholder: "请输入响应参数中的关键词",
        },
        { label: "traceId", prop: "traceId", placeholder: "请输入traceId" },
      ],
      searchFormRules: {
        appKey: [{ required: true, message: "请输入AppKey" }],
      },
      unitNameList: [],
      topicCnNameList: [],
      envOptionList: [
        { value: 0, label: "线上环境" },
        { value: 1, label: "预发环境" },
      ],
      pickerOptions: {
        disabledDate(time) {
          const now = Date.now();
          const today = new Date();
          today.setHours(23, 59, 59, 999);
          const diff = (now - time.getTime()) / (24 * 60 * 60 * 1000);
          return diff > 10 || time.getTime() > today.getTime();
        },
        shortcuts: [
          {
            text: "最近一天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 0);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 2);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近七天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近十天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 9);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      unitCodeMapTopic: null,
      topicMapUnitCode: null,
      unitList: [],
      topicList: [],
      originDataList: [],
    };
  },
  mounted() {},
  methods: {
    // 根据AppKey查询对接方案名称列表和消息名称列表
    async queryMsgUnitByAppKey() {
      //f318c06f78a84354b51332b0b48fdd1e
      const { appKey } = this.searchFormData;
      const { data } = await lcp.platform.rest.loggingTool
        .queryMsgUnitByAppKey({
          replacements: {
            appKey: appKey,
          },
        })
        .catch((error) => {
          throw new Error(`queryMsgUnitByAppKey, ${error}`);
        });
      return data;
    },
    async handleAppKeyMapData() {
      const data = await this.queryMsgUnitByAppKey();
      this.originDataList = cloneDeep(data);
      if (data.length) {
        this.unitList = [];
        this.topicList = [];
        this.unitCodeMapTopic = data.reduce((acc, cur) => {
          if (!acc.has(cur.unitCode)) {
            acc.set(cur.unitCode, []);
          }
          acc
            .get(cur.unitCode)
            .push({ topic: cur.topic, messageCnName: cur.messageCnName });
          return acc;
        }, new Map());
        this.topicMapUnitCode = data.reduce((acc, cur) => {
          acc.set(cur.topic, {
            unitName: cur.unitName,
            unitCode: cur.unitCode,
          });
          return acc;
        }, new Map());
        const newArr = data.map((item) => ({
          unitName: item.unitName,
          unitCode: item.unitCode,
        }));
        newArr.forEach((item) => {
          const duplicate = this.unitList.find(
            (obj) => obj.unitCode === item.unitCode
          );
          if (!duplicate) {
            this.unitList.push(item);
          }
        });
        this.topicList = data.map((item) => ({
          topic: item.topic,
          messageCnName: item.messageCnName,
        }));
        this.unitNameList = cloneDeep(this.unitList);
        this.topicCnNameList = cloneDeep(this.topicList);
      }
    },
    //当输入appKey时请求对接方案和消息名称的数据
    handleAppKeyBlur() {
      this.searchFormData["unitCode"] = [];
      this.searchFormData["topic"] = [];
      this.unitNameList = [];
      this.topicCnNameList = [];
      if (this.searchFormData.appKey) {
        this.handleAppKeyMapData();
      }
    },
    //当输入appKey和选择了消息名称时，重新更改对接方案数据
    handleUnitCodeBlur() {
      if (this.searchFormData.unitCode.length) {
        this.topicCnNameList = [];
        this.searchFormData.unitCode.forEach((value) => {
          this.topicCnNameList = this.topicCnNameList.concat(
            this.unitCodeMapTopic.get(value)
          );
        });
        if (this.searchFormData.topic.length) {
          this.searchFormData.topic = this.searchFormData.topic.filter((item) =>
            this.topicCnNameList.some((item2) => item2.topic === item)
          );
        }
      } else {
        this.topicCnNameList = cloneDeep(this.topicList);
      }
    },
    //当输入appKey和选择了对接方案时，重新更改消息名称数据
    handleTopicBlur() {
      if (this.searchFormData.topic.length) {
        this.unitNameList = [];
        this.searchFormData.topic.forEach((value) => {
          const topicObj = this.topicMapUnitCode.get(value);
          if (
            !this.unitNameList.some((obj) => obj.unitCode === topicObj.unitCode)
          ) {
            this.unitNameList.push(topicObj);
          }
        });
        if (this.searchFormData.unitCode.length) {
          this.searchFormData.unitCode = this.searchFormData.unitCode.filter(
            (item) => this.unitNameList.some((item2) => item2.unitCode === item)
          );
        }
      } else {
        this.unitNameList = cloneDeep(this.unitList);
      }
    },
    //该方法暂未用到
    handleMsgInfoList() {
      const { appKey, unitCode, topic } = this.searchFormData;
      let messageInfoList = [];
      if (unitCode.length === 0 && topic.length === 0) {
        messageInfoList.push({ appKey });
      } else {
        const originUnitCodeList = this.originDataList.filter((obj) =>
          unitCode.includes(obj.unitCode)
        );
        const originTopicList = this.originDataList.filter((obj) =>
          topic.includes(obj.topic)
        );
        if (unitCode.length && topic.length) {
          messageInfoList = intersectionWith(
            originUnitCodeList,
            originTopicList
          );
        } else {
          messageInfoList = originUnitCodeList.length
            ? originUnitCodeList
            : originTopicList;
        }
      }
      return messageInfoList;
    },
    // 查询日志表格数据
    async queryCallBackList(pageNum) {
      const { pageNumb, pageSize } = this;
      const {
        appKey,
        topic,
        businessIdentifier,
        timeRange,
        env,
        requestParam,
        responseParam,
        traceId,
      } = this.searchFormData;
      SappModule.SET_ENV(env);
      const startTime = timeRange[0];
      const endTime = timeRange[1];
      const data = {
        appKey,
        topicList: topic,
        businessIdentifier,
        startTime,
        endTime,
        env,
        requestParam,
        responseParam,
        traceId,
      };
      if (this.searchFormData.unitCode.length && !topic.length) {
        data.topicList = this.topicCnNameList.map((obj) => obj.topic);
      }
      const params = { pageNum: pageNum ? pageNum : pageNumb, pageSize };
      return await lcp.platform.rest.loggingTool.queryLogToolMsgPage(
        data,
        params
      );
    },
    // 查询表格数据操作
    async handleSearchTableData(pageNum) {
      this.$emit("update:tableLoading", true);
      const {
        data: { total, list },
      } = await this.queryCallBackList(pageNum).catch((error) => {
        throw new Error(`handleSearchTableData queryCallBackList, ${error}`);
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
          await this.handleSearchTableData(pageNumb).catch((error) => {
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
