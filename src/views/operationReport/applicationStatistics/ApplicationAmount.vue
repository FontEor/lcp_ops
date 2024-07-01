<template>
  <div class="applicationAmount">
    <header class="header">
      <div class="data-picker-wrapper">
        <el-date-picker
          v-model="timeRange"
          type="daterange"
          start-placeholder="开始日期"
          range-separator="至"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
          :picker-options="pickerOptions"
          @change="requestChartData"
        >
        </el-date-picker>
      </div>
    </header>
    <main class="main">
      <CardChart
        v-loading="amount.loading"
        title="总数统计"
        :timeRange="timeRange"
        :legendData="amount.legendData"
        :xAxisData="amount.xAxisData"
        :seriesData="amount.seriesData"
      ></CardChart>
      <CardChart
        v-loading="newAndAvg.loading"
        title="新增与平均"
        :timeRange="timeRange"
        :legendData="newAndAvg.legendData"
        :xAxisData="newAndAvg.xAxisData"
        :seriesData="newAndAvg.seriesData"
        :colorData="newAndAvg.colorData"
        :opacityData="newAndAvg.opacityData"
      ></CardChart>
    </main>
  </div>
</template>

<script>
import CardChart from "@/components/CardChart.vue";
import api from "@/api/index";

export default {
  name: "ApplicationAmount",
  components: { CardChart },
  data() {
    return {
      timeRange: [],
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setDate(start.getDate() - 6);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setMonth(start.getMonth() - 1);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setMonth(start.getMonth() - 3);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      amount: {
        loading: true,
        legendData: [],
      },
      newAndAvg: {
        loading: true,
        legendData: [],
        colorData: ["#779AF5", "#67C29C"],
        opacityData: [0, 0],
      },
    };
  },
  methods: {
    initTimeRange() {
      const today = Date.now();
      const days = -6;
      const xDays = today + 1000 * 60 * 60 * 24 * days;
      // 格式化时间戳 yyyy-MM-dd
      function formatTime(timeStamp) {
        const timeArray = new Date(timeStamp).toLocaleDateString().split("/");
        return timeArray
          .map((item) => (item.length > 1 ? item : `0${item}`))
          .join("-");
      }
      const todayValue = formatTime(today);
      const xDaysValue = formatTime(xDays);
      this.timeRange = [xDaysValue, todayValue];
    },
    requestChartData() {
      this.amount.loading = true;
      this.newAndAvg.loading = true;
      const startTime = this.timeRange[0];
      const endTime = this.timeRange[1];
      const params = { startTime, endTime };
      (async () => {
        const response = await api.report
          .getFindAppTotalData(params)
          .catch((error) => {
            throw error;
          });
        const { legend, category, series } = response.data;
        this.amount.legendData = legend;
        this.amount.xAxisData = category;
        // series.name对应legend
        const seriesData = [];
        series &&
          series.length > 0 &&
          series.forEach((item) => {
            const index = legend.indexOf(item.name);
            seriesData.splice(index, 1, item.data);
          });
        this.amount.seriesData = seriesData;
        this.amount.loading = false;
      })();
      (async () => {
        const response = await api.report
          .getFindAppNewAndAverageData(params)
          .catch((error) => {
            throw error;
          });
        const { legend, category, series } = response.data;
        this.newAndAvg.legendData = legend;
        this.newAndAvg.xAxisData = category;
        // series.name对应legend
        const seriesData = [];
        series &&
          series.length > 0 &&
          series.forEach((item) => {
            const index = legend.indexOf(item.name);
            seriesData.splice(index, 1, item.data);
          });
        this.newAndAvg.seriesData = seriesData;
        this.newAndAvg.loading = false;
      })();
    },
  },
  mounted() {
    this.initTimeRange();
    this.requestChartData();
  },
};
</script>

<style lang="scss" scoped>
.applicationAmount {
  .data-picker-wrapper {
    width: 25%;
  }
  .main {
    display: flex;
  }
}
</style>