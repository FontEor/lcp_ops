<template>
  <el-scrollbar>
    <div
      id="isvResearBusinessPartnerChart"
      ref="isvResearBusinessPartnerChart"
      style="width: 100%; height: 371px; margin: 0; padding: 0"
    />
  </el-scrollbar>
</template>

<script>
import echarts from "echarts";

export default {
  props: {
    weekNos: Array,
    isv: Array,
    selfDeveloper: Array,
    partner: Array,
    jos: Array,
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
    isv: {
      handler: function () {
        this.createCharts();
      },
    },
    selfDeveloper: {
      handler: function () {
        this.createCharts();
      },
    },
    partner: {
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
        this.$refs.isvResearBusinessPartnerChart
      );
      const option = {
        title: {
          text: "ISV、自研商家、合作伙伴宙斯周平均订单量柱状图",
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
            name: "self-developed",
            type: "bar",
            stack: "week",
            data: this.selfDeveloper,
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
            data: this.isv,
            name: "isv",
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
            data: this.partner,
            name: "partner",
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
          {
            data: this.jos,
            name: "jos",
            type: "bar",
            stack: "week",
            itemStyle: {
              normal: {
                color: "#435188FF",
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
