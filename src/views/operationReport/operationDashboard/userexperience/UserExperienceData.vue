<template>
  <el-main class="user-experience-data">
    <el-row :gutter="20" style="margin-bottom: 15px">
      <el-col :span="24">
        <el-date-picker
          v-model="queryCondition.startTime"
          type="week"
          format="yyyy 第 WW 周"
          placeholder="选择周"
          :picker-options="{ firstDayOfWeek: 5 }"
        />
        <span> 至 </span>
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
    <el-row type="flex" justify="end">
      <el-col :span="12">
        <el-row>
          <el-col v-if="requestResultStatus.userAmountStatus" :span="24">
            <UserJoinUp
              :week-nos="userJoinUpChartData.weekNos"
              :user-amount="userJoinUpChartData.userAmount"
            />
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="12">
        <el-row>
          <el-col v-if="requestResultStatus.npsStatus" :span="24">
            <Nps :week-nos="npsChartData.weekNos" :nps="npsChartData.nps" />
          </el-col>
        </el-row>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="12">
        <UserSatisfaction
          v-if="
            userSatisfactionData.category &&
            userSatisfactionData.category.length > 0
          "
          :category="userSatisfactionData.category"
          :legend="userSatisfactionData.legend"
          :series="userSatisfactionData.series"
        />
      </el-col>
    </el-row>
  </el-main>
</template>

<script>
import Nps from "./Nps";
import UserJoinUp from "./UserJoinUp";
import UserSatisfaction from "@/views/operationReport/operationDashboard/userexperience/userSatisfactionChart.vue";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import gwSmartLog from "@/api/gwSmartLog/index";
import lcp from "@/api/lcp/index";

export default {
  components: { UserJoinUp, Nps, UserSatisfaction },
  data() {
    return {
      queryCondition: {
        startTime: "",
        endTime: "",
        temp: "",
      },
      userJoinUpChartData: {
        weekNos: [],
        userAmount: [],
      },
      npsChartData: {
        weekNos: [],
        nps: [],
      },
      userSatisfactionData: {
        category: [],
        legend: [],
        series: [],
      },
      dayjs: null,
      requestResultStatus: {
        userAmountStatus: false,
        npsStatus: false,
      },
    };
  },

  methods: {
    // 根据时间查询用户满意度图表数据
    async queryData() {
      let { startTime, endTime } = this.queryCondition;
      startTime = startTime
        ? new Date(startTime.getTime())
            .toLocaleDateString("US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })
            .replaceAll("/", "-")
        : undefined;
      endTime = endTime
        ? new Date(endTime.getTime())
            .toLocaleDateString("US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })
            .replaceAll("/", "-")
        : undefined;
      const type = 1;
      const params = { startTime, endTime, type };
      return await lcp.platform.rest.userSatisfaction.queryData(params);
    },

    // 查询用户满意度图标操作
    async handleSearchUserSatisfactionChart() {
      const {
        data: { category, legend, series },
      } = await this.queryData().catch((error) => {
        throw new Error(
          `handleSearchUserSatisfactionChart queryData, ${error}`
        );
      });
      Object.assign(this.userSatisfactionData, { category, legend, series });
    },
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
    async getChartsDate() {
      this.dealTime(1);
      if (!this.checkDateRange()) {
        return;
      }

      try {
        this.getNpsChartData();
        this.getUserJoinUpChartData();
        await this.handleSearchUserSatisfactionChart().catch((error) => {
          throw new Error(`getChartsDate, ${error}`);
        });
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
    getNpsChartData() {
      const params = [];
      params[0] = new Date(this.queryCondition.startTime).getTime();
      params[1] = new Date(this.queryCondition.endTime).getTime();
      gwSmartLog.nps
        .queryKanbanData(params)
        .then((data) => {
          this.requestResultStatus.npsStatus = true;
          this.npsChartData.nps = data.data;
          this.npsChartData.weekNos = this.getWeekNos();
        })
        .catch((e) => {
          this.requestResultStatus.npsStatus = false;
          this.$message.error(e.msg);
        });
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
    getUserJoinUpChartData() {
      const params = [];
      params[0] = new Date(this.queryCondition.startTime).getTime();
      params[1] = new Date(this.queryCondition.endTime).getTime();
      gwSmartLog.cycle
        .searchUserJoinUp(params)
        .then((data) => {
          this.requestResultStatus.userAmountStatus = true;
          this.userJoinUpChartData.userAmount = data.data.userAmount;
          this.userJoinUpChartData.weekNos = this.getWeekNos();
        })
        .catch((e) => {
          this.requestResultStatus.userAmountStatus = false;
          this.$message.error(e.msg);
        });
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
      if (params[1] <= params[0]) {
        this.$message.warning("请输入正确的时间范围!");
        return false;
      }
      return true;
    },
  },
  async mounted() {
    this.initDayJs();
    this.initQueryCondition();
    try {
      this.getNpsChartData();
      this.getUserJoinUpChartData();
      await this.handleSearchUserSatisfactionChart().catch((error) => {
        throw new Error(`mounted, ${error}`);
      });
    } catch (e) {
      this.dealEndTime();
      return;
    }
    this.dealEndTime();
  },
};
</script>

<style lang="scss" scoped>
.line {
  text-align: center;
  height: 32px;
  line-height: 32px;
}
</style>
