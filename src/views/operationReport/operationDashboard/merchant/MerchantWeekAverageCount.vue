<template>
  <el-scrollbar class="el-row-charts">
    <div
      id="merchant_week_average_amount"
      ref="merchant_week_average_amount"
      style="width: 100%; height: 371px"
    />
  </el-scrollbar>
</template>

<script>
import echarts from "echarts";

export default {
  props: {
    weekNos: Array,
    cloudData: Array,
    ediData: Array,
  },
  data() {
    return {
      chartsPicture: null,
    };
  },
  watch: {
    weekNos: {
      handler: function () {
        this.createCharts();
      },
    },
    cloudData: {
      handler: function () {
        this.createCharts();
      },
    },
    ediData: {
      handler: function () {
        this.createCharts();
      },
    },
  },
  mounted() {
    this.createCharts();
  },
  methods: {
    createCharts() {
      this.chartsPicture = echarts.init(
        this.$refs.merchant_week_average_amount
      );
      const option = {
        title: {
          text: "商家周平均量柱状图",
          x: "left",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        legend: {
          show: true,
          x: "center",
          y: "bottom",
        },
        grid: {
          left: "0%",
          right: "0%",
          bottom: "10%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: this.weekNos,
            axisLabel: {
              interval: 0,
              rotate: this.weekNos.length > 10 ? -45 : 0,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
        series: [
          {
            name: "cloud",
            type: "bar",
            stack: "week",
            // data: [100, 200, 300, 400, 1000, 550, 880, 450, 450],
            data: this.cloudData,
            itemStyle: {
              normal: {
                color: "#4ecb73",
                label: {
                  show: true,
                  position: "insideTop",
                  textStyle: {
                    color: "#090102",
                  },
                },
              },
            },
          },
          {
            data: this.ediData,
            name: "edi",
            type: "bar",
            stack: "week",
            itemStyle: {
              normal: {
                color: "#3aa1ff",
                label: {
                  show: true,
                  position: "insideTop",
                  textStyle: {
                    color: "#090102",
                  },
                },
              },
            },
          },
        ],
      };
      this.chartsPicture.setOption(option);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
