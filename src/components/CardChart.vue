<template>
  <div class="cardChart">
    <el-card shadow="always">
      <div slot="header">{{ title }}</div>
      <div class="chart-content" ref="chart-content"></div>
    </el-card>
  </div>
</template>

<script>
import echarts from "echarts";

export default {
  name: "CardChart",
  props: {
    title: {
      type: String,
      default: "图表标题",
    },
    scale: {
      type: Number,
      default: 318,
    },
    legendData: {
      type: Array,
      require: true,
    },
    xAxisData: {
      type: Array,
      default: () => [1, 2, 3, 4, 5, 6, 7],
    },
    seriesData: {
      type: Array,
      default: () => [
        [1, 1, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 0],
      ],
    },
    colorData: {
      type: Array,
      default: () => ["#779AF5", "#EA665F"],
    },
    opacityData: {
      type: Array,
      default: () => [0.1, 0.1],
    },
  },
  data() {
    return {
      timer: null,
      option: {
        tooltip: {
          // hover交互提示
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              show: false,
            },
            lineStyle: {
              type: "dashed",
            },
          },
        },
        grid: {
          top: "10",
          left: "50",
          right: "20",
          bottom: "50",
        },
        legend: {
          bottom: 0,
        },
        xAxis: {
          offset: 10,
          axisLine: {
            // 坐标轴线
            show: false,
          },
          axisTick: {
            // 坐标刻度
            show: false,
          },
          splitLine: {
            // 分隔线
            show: false,
            lineStyle: {
              color: ["#eee"],
              type: "dashed",
            },
          },
        },
        yAxis: {
          axisLine: {
            // 坐标轴线
            show: false,
          },
          axisTick: {
            // 坐标刻度
            show: false,
          },
          splitLine: {
            // 分隔线
            show: true,
            lineStyle: {
              color: ["#999"],
              type: "dashed",
            },
          },
        },
        series: [
          {
            type: "line",
            symbol: "circle",
            label: {
              show: false,
              position: "bottom",
            },
            itemStyle: {
              normal: {},
            },
            smooth: true,
            areaStyle: {
              opacity: 0.1,
            },
          },
          {
            type: "line",
            symbol: "circle",
            label: {
              show: false,
              position: "bottom",
            },
            itemStyle: {
              normal: {},
            },
            smooth: true,
            areaStyle: {
              opacity: 0.1,
            },
          },
        ],
      },
    };
  },
  watch: {
    legendData: {
      handler() {
        this.drawChart();
      },
      deep: true,
    },
  },
  methods: {
    drawChart() {
      const myChart = echarts.init(this.$refs["chart-content"]);
      // 指定图表的配置项和数据
      const option = this.option;
      option.legend.data = this.legendData;
      option.xAxis.data = this.xAxisData;
      this.legendData.forEach((item, index) => {
        option.series[index].name = item;
        option.series[index].data = this.seriesData[index];
        option.series[index].itemStyle.normal.color = this.colorData[index];
        option.series[index].areaStyle.opacity = this.opacityData[index];
      });
      // 使用刚指定的配置项和数据显示图表。
      myChart.resize({ height: "auto" });
      myChart.setOption(option);
    },
    resizeChart() {
      const app = document.querySelector("#app");
      const chart = this.$refs["chart-content"];
      chart.style.height = chart
        ? `${app.clientHeight - this.scale}px`
        : "220px";
      if (!this.timmer) {
        this.timer = setTimeout(() => {
          this.timer = null;
          chart.style.height = chart
            ? `${app.clientHeight - this.scale}px`
            : "220px";
          this.drawChart();
        }, 300);
      }
    },
  },
  mounted() {
    const that = this;
    const app = document.querySelector("#app");
    const chart = that.$refs["chart-content"];
    chart.style.height = chart ? `${app.clientHeight - this.scale}px` : "220px";
    this.drawChart();
    window.addEventListener("resize", this.resizeChart, false);
  },
  destroyed() {
    window.removeEventListener("resize", this.resizeChart, false);
  },
};
</script>

<style lang="scss" scoped>
.cardChart {
  padding: 8px 2px;
  width: 50%;
  .el-card {
    ::v-deep .el-card__header {
      padding: 8px 16px;
      font-size: 16px;
      font-weight: 600;
    }
    ::v-deep .el-card__body {
      padding: 0;
      .chart-content {
        width: 100%;
        height: 220px;
      }
    }
  }
}
</style>