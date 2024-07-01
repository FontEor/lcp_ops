<template>
  <el-scrollbar>
    <div
      id="c2cPrueMachDistributionWarehouseDistribution"
      ref="c2cPrueMachDistributionWarehouseDistribution"
      style="width: 100%; height: 371px"
    />
  </el-scrollbar>
</template>

<script>
import echarts from "echarts";

export default {
  props: {
    weekNos: Array,
    warehouse: Array,
    prue: Array,
    c2c: Array,
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
    warehouse: {
      handler: function () {
        this.createCharts();
      },
    },
    prue: {
      handler: function () {
        this.createCharts();
      },
    },
    c2c: {
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
        this.$refs.c2cPrueMachDistributionWarehouseDistribution
      );
      const option = {
        title: {
          text: "纯配、C2C、仓配周平均订单量柱状图",
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
          left: "5%",
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
            name: "仓配",
            type: "bar",
            stack: "week",
            data: this.warehouse,
            itemStyle: {
              normal: {
                color: "#4ecb73",
                label: {
                  show: true,
                  position: "insideTop",
                  textStyle: {
                    color: "#090102",
                    textAlign: "center",
                  },
                },
              },
            },
          },
          {
            data: this.prue,
            name: "纯配",
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
                    left: "auto",
                    margin: "auto 0",
                  },
                },
              },
            },
          },
          {
            data: this.c2c,
            name: "c2c",
            type: "bar",
            stack: "week",
            itemStyle: {
              normal: {
                color: "#fdde25",
                label: {
                  show: true,
                  position: "insideTop",
                  textStyle: {
                    color: "#090102",
                    left: "auto",
                    margin: "auto 0",
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
