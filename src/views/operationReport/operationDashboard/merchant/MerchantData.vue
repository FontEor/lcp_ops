<template>
  <el-main>
    <!--  数据概览  -->
    <el-row :gutter="20" class="simpleDescList">
      <el-row>
        <el-col :span="6">
          <div>
            <span class="count"
              >商家总量：{{ merchantSimpleDescData.total }}</span
            >
            <span class="desc">累计从物流开放平台、EDI下单的商家数量</span>
          </div>
        </el-col>
        <el-col :span="6">
          <div>
            <span class="count"
              >EDI商家数量：{{ merchantSimpleDescData.edi }}</span
            >
            <span class="desc">累计从EDI下单的商家数量</span>
          </div>
        </el-col>
        <el-col :span="6">
          <div>
            <span class="count"
              >非EDI商家量：{{ merchantSimpleDescData.cloud }}</span
            >
            <span class="desc">累计从物流开放平台下单的商家数量</span>
          </div>
        </el-col>
      </el-row>
    </el-row>
    <el-divider />
    <!--    商家周平均量柱状图-->

    <el-row :gutter="20" style="margin-bottom: 15px">
      <el-col :span="12">
        <el-date-picker
          v-model="queryCondition.startTime"
          type="week"
          format="yyyy 第 WW 周"
          placeholder="选择周"
          :picker-options="{ firstDayOfWeek: 5 }"
        />
        <span>至</span>
        <el-date-picker
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
    <el-row>
      <el-col v-if="hasData" :span="24">
        <MerchantWeekAverageCount
          :week-nos="merchantChartData.weekNos"
          :cloud-data="merchantChartData.cloudData"
          :edi-data="merchantChartData.ediData"
        />
      </el-col>
    </el-row>
  </el-main>
</template>

<script>
import MerchantWeekAverageCount from "./MerchantWeekAverageCount";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import gwSmartLog from "@/api/gwSmartLog/index";

export default {
  name: "MerchantData",
  components: { MerchantWeekAverageCount },
  data() {
    return {
      queryCondition: {
        startTime: "",
        endTime: "",
      },
      merchantSimpleDescData: {
        total: 0,
        cloud: 0,
        edi: 0,
      },
      merchantChartData: {
        weekNos: [],
        cloudData: [],
        ediData: [],
      },
      timer: "",
      dayjs: null,
      hasData: false,
    };
  },
  mounted() {
    this.initDayJs();
    this.getMerchantSimpleDescData();
    this.initQueryCondition();
    try {
      this.getMerchantChartData();
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
      this.dealTime(1);
      console.log("check start");
      if (!this.checkDateRange()) {
        return false;
      }
      try {
        this.getMerchantChartData();
      } catch (e) {
        this.dealTime(-1);
        return;
      }
      this.dealTime(-1);
    },
    getWeekNos() {
      let startTimeStamp =
        this.queryCondition.startTime.getTime() - 24 * 60 * 60 * 1000;
      const endTimestamp =
        this.queryCondition.endTime.getTime() + 24 * 60 * 60 * 1000 * 6 - 1;
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
    getMerchantSimpleDescData() {
      const params = [];
      params[0] = new Date(this.queryCondition.startTime).getTime();
      params[1] = new Date(this.queryCondition.endTime).getTime();
      gwSmartLog.merchant
        .getMerchantSimpleDescData()
        .then((data) => {
          this.merchantSimpleDescData.cloud = data.data.cloud;
          this.merchantSimpleDescData.edi = data.data.edi;
          this.merchantSimpleDescData.total =
            this.merchantSimpleDescData.cloud + this.merchantSimpleDescData.edi;
        })
        .catch((error) => {
          this.$message.error(error.msg);
        });
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
    getMerchantChartData() {
      const params = [];
      params[0] = new Date(this.queryCondition.startTime).getTime();
      params[1] = new Date(this.queryCondition.endTime).getTime();
      gwSmartLog.merchant
        .getMerchantChartData(params)
        .then((data) => {
          this.merchantChartData.ediData = data.data.ediData;
          this.merchantChartData.cloudData = data.data.cloudData;
          this.hasData = true;
          this.merchantChartData.weekNos = this.getWeekNos();
        })
        .catch((error) => {
          this.hasData = false;
          this.$message.error(error.msg);
        });
    },
    // 取最近7周时间范围[5.....5
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
    initDayJs() {
      dayjs.extend(weekOfYear);
      this.dayjs = dayjs;
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
</style>
