<template>
  <div class="customerAmount">
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
    <aside class="aside">
      <el-card v-loading="cardLoading" shadow="always">
        <ul v-for="(item, index) in cardList" :key="index">
          <li class="card-title">{{ item.title }}</li>
          <li class="card-amount">{{ item.amount }}</li>
          <li class="card-increment">
            {{ formatCardIncrement(item.increment) }}
          </li>
        </ul>
      </el-card>
    </aside>
    <main class="main">
      <CardChart
        v-loading="extranetUser.loading"
        title="外网开发商"
        :timeRange="timeRange"
        :scale="400"
        :legendData="extranetUser.legendData"
        :xAxisData="extranetUser.xAxisData"
        :seriesData="extranetUser.seriesData"
        :colorData="extranetUser.colorData"
        :opacityData="extranetUser.opacityData"
      ></CardChart>
      <CardChart
        v-loading="intranetUser.loading"
        title="内网注册用户"
        :timeRange="timeRange"
        :scale="400"
        :legendData="intranetUser.legendData"
        :xAxisData="intranetUser.xAxisData"
        :seriesData="intranetUser.seriesData"
        :colorData="intranetUser.colorData"
        :opacityData="intranetUser.opacityData"
      ></CardChart>
    </main>
  </div>
</template>

<script>
import CardChart from "@/components/CardChart.vue";
import api from "@/api/index";

export default {
  name: "CustomerAmount",
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
      cardLoading: true,
      cardList: [
        { title: "外网开发商", amount: 0, increment: 0 },
        { title: "外网注册用户", amount: 0, increment: 0 },
        { title: "外网活跃开发商", amount: 0, increment: 0 },
        { title: "内网开发商", amount: 0, increment: 0 },
        { title: "内网注册用户", amount: 0, increment: 0 },
        { title: "内网活跃用户数", amount: 0, increment: 0 },
      ],
      extranetUser: {
        loading: true,
        legendData: [],
        colorData: ["#779AF5", "#67C29C"],
        opacityData: [0, 0],
      },
      intranetUser: {
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
      this.cardLoading = true;
      this.extranetUser.loading = true;
      this.intranetUser.loading = true;
      const startTime = this.timeRange[0];
      const endTime = this.timeRange[1];
      const params = { startTime, endTime };
      (async () => {
        const response = await api.report
          .getFindSupplierAndUserTotalData(params)
          .catch((error) => {
            throw error;
          });
        const {
          outSupplierTotal,
          outSupplierTotalPhrase,
          outUserTotal,
          outUserTotalPhrase,
          outSupplierActivityTotal,

          inSupplierTotal,
          inSupplierTotalPhrase,
          inUserTotal,
          inUserTotalPhrase,
          inUserActivityTotal,
        } = response.data;
        const cardTable = [
          { amount: outSupplierTotal, increment: outSupplierTotalPhrase },
          { amount: outUserTotal, increment: outUserTotalPhrase },
          { amount: outSupplierActivityTotal, increment: "-" },
          { amount: inSupplierTotal, increment: inSupplierTotalPhrase },
          { amount: inUserTotal, increment: inUserTotalPhrase },
          { amount: inUserActivityTotal, increment: "-" },
        ];
        this.cardList = this.cardList.map((item, index) => {
          const { title } = item;
          const amount = cardTable[index].amount;
          const increment = cardTable[index].increment;
          return { title, amount, increment };
        });
        this.cardLoading = false;
      })();
      (async () => {
        const response = await api.report
          .getFindOutSupplierNewAndAverageData(params)
          .catch((error) => {
            throw error;
          });
        const { legend, category, series } = response.data;
        this.extranetUser.legendData = legend;
        this.extranetUser.xAxisData = category;
        // series.name对应legend
        const seriesData = [];
        series &&
          series.length > 0 &&
          series.forEach((item) => {
            const index = legend.indexOf(item.name);
            seriesData.splice(index, 1, item.data);
          });
        this.extranetUser.seriesData = seriesData;
        this.extranetUser.loading = false;
      })();
      (async () => {
        const response = await api.report
          .getFindInUserNewAndAverageData(params)
          .catch((error) => {
            throw error;
          });
        const { legend, category, series } = response.data;
        this.intranetUser.legendData = legend;
        this.intranetUser.xAxisData = category;
        // series.name对应legend
        const seriesData = [];
        series &&
          series.length > 0 &&
          series.forEach((item) => {
            const index = legend.indexOf(item.name);
            seriesData.splice(index, 1, item.data);
          });
        this.intranetUser.seriesData = seriesData;
        this.intranetUser.loading = false;
      })();
    },
    formatCardIncrement(increment) {
      return increment > 0 ? `+${increment}` : increment;
    },
  },
  mounted() {
    this.initTimeRange();
    this.requestChartData();
  },
};
</script>

<style lang="scss" scoped>
.customerAmount {
  .data-picker-wrapper {
    width: 25%;
  }
  .aside {
    ::v-deep .el-card__body {
      padding: 8px 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      text-align: center;
    }
    .card-title {
      color: #999;
    }
    .card-amount {
      font-size: 24px;
      font-weight: 600;
      color: #666;
    }
    .card-increment {
      color: #3c6ef0;
    }
  }
  .main {
    display: flex;
  }
}
</style>