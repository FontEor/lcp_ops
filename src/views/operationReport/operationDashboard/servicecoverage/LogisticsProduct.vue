<template>
  <el-scrollbar>
    <div
      id="logisticsProduct"
      ref="logisticsProduct"
      style="width: 100%; height: 371px"
    />
  </el-scrollbar>
</template>

<script>
import echarts from "echarts";

export default {
  props: {
    weekNos: Array,
    logisticsProduct: Array,
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
    logisticsProductData: {
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
      this.chartsPicture = echarts.init(this.$refs.logisticsProduct);
      const option = {
        title: {
          text: "物流产品每周覆盖数量趋势图",
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
            type: "line",
            data: this.logisticsProduct,
            itemStyle: {
              normal: {
                color: "#4ecb73",
                label: {
                  show: true,
                  position: "center",
                  textStyle: {
                    color: "#090102",
                    textAlign: "center",
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
* {
  margin: 0px;
  padding: 0px;
}
</style>
