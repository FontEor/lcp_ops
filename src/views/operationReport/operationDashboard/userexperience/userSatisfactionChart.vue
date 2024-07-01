<template>
  <div
    class="user-satisfaction"
    ref="userSatisfaction"
    style="width: 100%; height: 400px"
  ></div>
</template>

<script>
import echarts from "echarts";

export default {
  name: "UserSatisfaction",
  props: {
    category: { type: Array, default: () => [] },
    legend: { type: Array, default: () => [] },
    series: { type: Array, default: () => [] },
  },
  data() {
    return {
      chartInstance: null,
    };
  },
  computed: {
    // 计算用户满意度图表横坐标文本列表
    computeUserSatisfactionChartXAxisList() {
      const { category } = this;
      return category.map((currentDate) => {
        currentDate = new Date(currentDate);
        const currentYear = currentDate.getFullYear();
        const currentTimestamp = currentDate.getTime();
        const currentNewYearTimestamp = new Date(
          `${currentDate.getFullYear()}/1/1`
        );
        const perWeekMilliseconds = 1000 * 60 * 60 * 24 * 7;
        const diffTimestamp = currentTimestamp - currentNewYearTimestamp;
        return `${currentYear}年第 ${(
          diffTimestamp / perWeekMilliseconds
        ).toFixed()} 周`;
      });
    },
  },
  watch: {
    category: {
      handler() {
        this.createChartInstance();
      },
    },
  },
  methods: {
    createChartInstance() {
      const option = {
        title: {
          text: "用户满意度每周趋势图",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        legend: {
          show: true,
          data: this.legend,
          bottom: 0,
        },
        grid: {
          left: "0",
          containLabel: true,
        },
        xAxis: [
          {
            show: true,
            type: "category",
            data: this.computeUserSatisfactionChartXAxisList,
            axisLine: {
              // 坐标轴线
              show: false,
            },
            axisTick: {
              // 坐标刻度
              show: false,
            },
            axisLabel: {
              interval: 0,
              rotate:
                this.computeUserSatisfactionChartXAxisList.length > 5 ? -30 : 0,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            axisTick: {
              // 坐标刻度
              show: false,
            },
          },
        ],
        series: [
          {
            type: "line",
            name: "对接体验",
            label: {
              show: true,
              position: "top",
            },
            data: this.series.find(({ name }) => name === "对接体验").data,
            itemStyle: {
              normal: {
                color: "#2CA6E1",
                label: {
                  show: true,
                  position: "top",
                  textStyle: {
                    color: "#2CA6E1",
                    textAlign: "center",
                  },
                },
              },
            },
          },
          {
            type: "line",
            name: "平台使用",
            data: this.series.find(({ name }) => name === "平台使用").data,
            itemStyle: {
              normal: {
                color: "#24663E",
                label: {
                  show: true,
                  position: "top",
                  offset: [10, -10],
                  textStyle: {
                    color: "#24663E",
                    textAlign: "center",
                  },
                },
              },
            },
          },
          {
            type: "line",
            name: "运维质量",
            data: this.series.find(({ name }) => name === "运维质量").data,
            itemStyle: {
              normal: {
                color: "#FFBA12",
                label: {
                  show: true,
                  position: "top",
                  offset: [20, -20],
                  textStyle: {
                    color: "#FFBA12",
                    textAlign: "center",
                  },
                },
              },
            },
          },
        ],
      };
      this.chartInstance = echarts.init(this.$refs.userSatisfaction);
      this.chartInstance.setOption(option);
    },
  },
  mounted() {
    this.createChartInstance();
  },
};
</script>

<style lang="scss" scoped>
.user-satisfaction {
}
</style>