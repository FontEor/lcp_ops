<template>
  <el-main>
    <el-row :gutter="20" style="margin-bottom: 15px">
      <el-col :span="12">
        <el-date-picker
          id="endWeekNo"
          v-model="queryCondition.startTime"
          format="yyyy 第 WW 周"
          type="week"
          placeholder="选择周"
          :picker-options="{ firstDayOfWeek: 5 }"
        />
        <span class="date-picker_gap">至</span>
        <el-date-picker
          id="endWeekNo"
          v-model="queryCondition.endTime"
          type="week"
          format="yyyy 第 WW 周"
          placeholder="选择周"
          :picker-options="{ firstDayOfWeek: 5 }"
        />
        <el-button
          type="primary"
          style="margin-left: 15px"
          @click="getChartsDate"
          >查询</el-button
        >
      </el-col>
    </el-row>
    <!-- API健康度优/良/差周趋势图 -->
    <api-health-week-trend
      class="echarts-increment"
      :week-nos="apiHealthData.weekNos"
      :excellentTotal="apiHealthData.excellentTotal"
      :goodTotal="apiHealthData.goodTotal"
      :poorTotal="apiHealthData.poorTotal"
    />
    <!--问题API各个打标字段的周趋势图-->
    <question-api-week-trend
      class="echarts-increment"
      :week-nos="apiHealthData.weekNos"
      :notCallTotal="apiHealthData.notCallTotal"
      :notRuntimeUserTotal="apiHealthData.notRuntimeUserTotal"
      :notManagerUserTotal="apiHealthData.notManagerUserTotal"
      :notOwnerTotal="apiHealthData.notOwnerTotal"
      :redundantTotal="apiHealthData.redundantTotal"
      :tp99OverFlagTotal="apiHealthData.tp99OverFlagTotal"
      :alarmFlagTotal="apiHealthData.alarmFlagTotal"
      :errorFlagTotal="apiHealthData.errorFlagTotal"
      :byteErrorFlagTotal="apiHealthData.byteErrorFlagTotal"
      :crawlerRiskFlagTotal="apiHealthData.crawlerRiskFlagTotal"
      :approvedIdentityFlagTotal="apiHealthData.approvedIdentityFlagTotal"
    />
  </el-main>
</template>
<script>
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import ApiHealthWeekTrend from "./ApiHealthWeekTrend";
import QuestionApiWeekTrend from "./QuestionApiWeekTrend";
import gwSmartLog from "@/api/gwSmartLog/index";

export default {
  components: { ApiHealthWeekTrend, QuestionApiWeekTrend },
  data() {
    return {
      queryCondition: {
        startTime: "",
        endTime: "",
        eg: "",
      },
      apiHealthData: {
        weekNos: [],
        //优
        excellentTotal: [],
        //良
        goodTotal: [],
        //差
        poorTotal: [],
        //没有调用量
        notCallTotal: [],
        //没有运行时用户使用
        notRuntimeUserTotal: [],
        //没有管理端用户使用
        notManagerUserTotal: [],
        //没有负责人
        notOwnerTotal: [],
        //注册后长时间未发布
        redundantTotal: [],
        //性能差
        tp99OverFlagTotal: [],
        //触发告警
        alarmFlagTotal: [],
        //可用率低
        errorFlagTotal: [],
        //流量异常
        byteErrorFlagTotal: [],
        //爬虫风险
        crawlerRiskFlagTotal: [],
        //无身份认证
        approvedIdentityFlagTotal: [],
      },
      showApiHealthData: false,
    };
  },
  mounted() {
    this.initDayJs();
    this.initQueryCondition();
    try {
      this.queryApiHealthData();
    } catch (e) {
      this.dealEndTime();
      return;
    }
    this.dealEndTime();
  },
  methods: {
    dealEndTime() {
      this.queryCondition.endTime = new Date(
        new Date(this.queryCondition.endTime).getTime() +
          6 * 24 * 60 * 60 * 1000 * -1
      );
      this.queryCondition.startTime = new Date(
        new Date(this.queryCondition.startTime).getTime() +
          1 * 24 * 60 * 60 * 1000 * 1
      );
    },
    getChartsDate() {
      this.dealTime(1)
      if (!this.checkDateRange()) {
        return;
      }
      try {
        this.queryApiHealthData();
      } catch (e) {
        this.dealTime(-1)
        return;
      }
        this.dealTime(-1)
    },
    queryApiHealthData() {
      const params = [];
      params[0] = new Date(this.queryCondition.startTime).getTime();
      params[1] = new Date(this.queryCondition.endTime).getTime();
      if (params[1] <= params[0]) {
        this.$message.warning("请输入正确的时间范围!");
        return;
      }
      this.apiHealthData = this.$options.data().apiHealthData
      gwSmartLog.apiHealth.getAPIHealthDashboardData(
        params
      )
        .then((data) => {
          console.log("data", data);
          this.showApiHealthData = true;
          for (const assetApiChart of data.data) {
            this.apiHealthData.excellentTotal.push(
              assetApiChart.excellentApiCount
            );
            this.apiHealthData.goodTotal.push(assetApiChart.goodApiCount);
            this.apiHealthData.poorTotal.push(assetApiChart.poorApiCount);
            this.apiHealthData.notCallTotal.push(assetApiChart.notCallCount);
            this.apiHealthData.notRuntimeUserTotal.push(
              assetApiChart.notRuntimeUserCount
            );
            this.apiHealthData.notManagerUserTotal.push(
              assetApiChart.notManagerUserCount
            );
            this.apiHealthData.notOwnerTotal.push(assetApiChart.notOwnerCount);
            this.apiHealthData.redundantTotal.push(
              assetApiChart.redundantCount
            );
            this.apiHealthData.tp99OverFlagTotal.push(
              assetApiChart.tp99OverFlagCount
            );
            this.apiHealthData.alarmFlagTotal.push(
              assetApiChart.alarmFlagCount
            );
            this.apiHealthData.errorFlagTotal.push(
              assetApiChart.errorFlagCount
            );
            this.apiHealthData.byteErrorFlagTotal.push(
              assetApiChart.byteErrorFlagCount
            );
            this.apiHealthData.crawlerRiskFlagTotal.push(
              assetApiChart.crawlerRiskFlagCount
            );
            this.apiHealthData.approvedIdentityFlagTotal.push(
              assetApiChart.approvedIdentityFlagCount
            );
          }
        })
        .catch((error) => {
          this.showDeveloperData = false;
          this.$message.error(error.msg);
        });
      this.apiHealthData.weekNos = this.getWeekNos();
    },
    initQueryCondition() {
      const todayDate = new Date();
      const year = todayDate.getFullYear();
      const month = todayDate.getMonth() + 1;
      const day = todayDate.getDate();
      const str = year + "-" + month + "-" + day;
      const defaultDate = new Date(str);
      let week = defaultDate.getDay();
      if (week === 0) {
        week = 7;
      }

      const defaultEndTime =
        defaultDate.getTime() + (5 - week) * 24 * 60 * 60 * 1000;
      const defaultStartTime = defaultEndTime - 24 * 60 * 60 * 1000 * 7 * 7;
      this.queryCondition.startTime = new Date(defaultStartTime);
      this.queryCondition.endTime = new Date(defaultEndTime);
    },
    getWeekNos() {
      let startTimeStamp =
        this.queryCondition.startTime.getTime() - 24 * 60 * 60 * 1000;
      const endTimestamp =
        this.queryCondition.endTime.getTime() - 24 * 60 * 60 * 1000 * 6;
      const weekNos = [];
      while (startTimeStamp < endTimestamp) {
        const temp = new Date(startTimeStamp);
        const week = this.dayjs(temp).week() - 1;
        const year = temp.getFullYear();
        const weekNo = year + "年第 " + week + " 周";
        weekNos.push(weekNo);
        startTimeStamp += 24 * 60 * 60 * 1000 * 7;
      }
      return weekNos;
    },
    initDayJs() {
      dayjs.extend(weekOfYear);
      this.dayjs = dayjs;
    },
    dealTime(isEnd) {
      this.queryCondition.endTime = new Date(
        new Date(this.queryCondition.endTime).getTime() +
          6 * 24 * 60 * 60 * 1000 * isEnd
      );
      this.queryCondition.startTime = new Date(
        new Date(this.queryCondition.startTime).getTime() -
          24 * 60 * 60 * 1000 * isEnd
      );
    },
    checkDateRange() {
      const params = [];
      params[0] = new Date(this.queryCondition.startTime).getTime();
      params[1] = new Date(this.queryCondition.endTime).getTime();
      console.log(params);
      if (params[1] <= params[0]) {
        this.$message.warning("请输入正确的时间范围!");
        return false;
      }
      return true;
    },
  },
};
</script>

<style lang="scss" scoped>
.simpleDescList {
  margin-left: 0;
  margin-right: 0;
  margin-top: 0;
  margin-bottom: 0;
  padding-top: 0;
  padding-left: 0;
  padding-right: 0;

  .count {
    margin: 0;
    padding: 0;
    height: auto;
    margin-top: 20px;
    margin-bottom: 10px;
    width: 100%;
    font-size: larger;
    font-weight: bold;
    text-align: center;
    display: block;
  }

  .desc {
    margin: 0;
    padding: 0;
    height: auto;
    margin-top: 10px;
    margin-bottom: 10px;
    width: 100%;
    font-size: small;
    text-align: center;
    word-break: normal;
    display: block;
  }
}
.echarts-increment {
  margin-bottom: 15px;
}
.date-picker_gap {
  padding: 0 8px;
}
</style>
