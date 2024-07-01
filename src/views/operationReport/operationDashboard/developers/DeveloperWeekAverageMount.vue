<template>
  <el-scrollbar>
    <div
      id="developer_week_average_mount"
      ref="developer_week_average_mount"
      style="width: 100%; height: 371px"
    />
  </el-scrollbar>
</template>

<script>
import echarts from "echarts";

export default {
  props: {
    weekNos: Array,
    isv: Array,
    selfDev: Array,
    partner: Array,
    total: Array,
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
    selfDev: {
      handler: function () {
        this.createCharts();
      },
    },
    partner: {
      handler: function () {
        this.createCharts();
      },
    },
    total: {
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
        this.$refs.developer_week_average_mount
      );
      const option = {
        title: {
          text: "开发团队数量周趋势图",
          x: "left",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        legend: {
          data: ['自研商家', "ISV", '合作伙伴', '全部'],
          show: true,
          x: "center",
          y: "bottom",
        },
        grid: {
          top: "10%",
          left: "0%",
          right: "0%",
          bottom: "10%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          boundaryGap: true,
          data: this.weekNos,
          axisLabel: {
            interval: 0,
            rotate: this.weekNos.length > 10 ? -45 : 0,
          },
        },

        yAxis: [
          {
            type: "value",
          },
        ],
        series: [
          {
            name: "自研商家",
            type: "line",
            data: this.selfDev.slice(2),
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
          {
            name: "ISV",
            type: "line",
            data: this.isv.slice(2),
            itemStyle: {
              normal: {
                color: "#3aa1ff",
                label: {
                  show: true,
                  position: "center",
                  textStyle: {
                    color: "#090102",
                    left: "center",
                    margin: "auto 0",
                  },
                },
              },
            },
          },

          {
            name: "合作伙伴",
            type: "line",
            data: this.partner.slice(2),
            itemStyle: {
              normal: {
                color: "#fdde25",
                label: {
                  show: true,
                  position: "center",
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
            name: "全部",
            type: "line",
            data: this.total.slice(2),
            itemStyle: {
              normal: {
                color: "#8089ae",
                label: {
                  show: true,
                  position: "center",
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
* {
  margin: 0px;
  padding: 0px;
}
</style>
