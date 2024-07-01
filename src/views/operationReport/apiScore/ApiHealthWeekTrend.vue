<template>
  <el-scrollbar>
    <div
      id="developer_week_increment"
      ref="developer_week_increment"
      style="width: 100%; height: 371px"
    />
  </el-scrollbar>
</template>

<script>
import echarts from "echarts";

export default {
  props: {
    weekNos: Array,
    excellentTotal: Array,
    goodTotal: Array,
    poorTotal: Array,
  },
  data() {
    return {
      incrementEchart: null,
    };
  },
  computed: {
    excellentTotalIncrease: function () {
      return getIncreaseList(this.excellentTotal).slice(1);
    },
    goodTotalIncrease: function () {
      //slice(0)标志这从数组的索引0开始
      return getIncreaseList(this.goodTotal).slice(1);
    },
    poorTotalIncrease: function () {
      return getIncreaseList(this.poorTotal).slice(1);
    },
    excellentTotalRose: function () {
      return this.excellentTotal.reduce((res, curVal, curIndex, array) => {
        if (curIndex > 0) {
          const preVal = array[curIndex - 1];
          if (preVal == undefined || preVal == 0) {
            res.push(0);
          } else {
            const computedVal = (((curVal - preVal) / preVal) * 100).toFixed(1);
            res.push(computedVal);
          }
        }
        return res;
      }, []);
    },
    goodTotalRose: function () {
      return this.goodTotal.reduce((res, curVal, curIndex, array) => {
        if (curIndex > 0) {
          const preVal = array[curIndex - 1];
          if (preVal == undefined || preVal == 0) {
            res.push(0);
          } else {
            const computedVal = (((curVal - preVal) / preVal) * 100).toFixed(1);
            res.push(computedVal);
          }
        }
        return res;
      }, []);
    },
    poorTotalRose: function () {
      return this.poorTotal.reduce((res, curVal, curIndex, array) => {
        if (curIndex > 0) {
          const preVal = array[curIndex - 1];
          if (preVal == undefined || preVal == 0) {
            res.push(0);
          } else {
            const computedVal = (((curVal - preVal) / preVal) * 100).toFixed(1);
            res.push(computedVal);
          }
        }
        return res;
      }, []);
    },
  },
  watch: {
    weekNos: {
      handler: function () {
        this.setUpEchart();
      },
    },
    excellentTotal: {
      handler: function () {
        this.setUpEchart();
      },
    },
    goodTotal: {
      handler: function () {
        this.setUpEchart();
      },
    },

    poorTotal: {
      handler: function () {
        this.setUpEchart();
      },
    },
  },
  mounted() {
    this.setUpEchart();
  },
  methods: {
    setUpEchart() {
      //初始化
      !this.incrementEchart && this.initEchart();
      //画图
      this.incrementEchart && this.drawEchart();
    },
    initEchart() {
      this.incrementEchart = echarts.init(this.$refs.developer_week_increment);
    },
    drawEchart() {
      const option = {
        title: {
          text: "API健康度占比(优、良、差)周趋势柱状图",
          left: "0",
        },
        legend: {
          data: ["优", "良", "差", "优周环比", "良周环比", "差周环比"],
          show: true,
          x: "center",
          y: "bottom",
        },
        grid: {
          top: "18%",
          left: "0",
          right: "0",
          bottom: "10%",
          containLabel: true,
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
          formatter: function (param) {
            let res = `
                        <p style="font-weight: 600;">${param[0]["name"]}</p>`;
            param.forEach((item) => {
              const value = item["value"];
              const seriesName = item["seriesName"];
              const color = item["color"];
              res += `
                                <div>
                                <p style="display:inline-block;margin-right:5px;border-radius:50%;width:10px;height:10px;background-color:${color}"></p>
                                ${seriesName}：${
                value === undefined ? "0" : value
              }${seriesName === "周环比增长" && value !== undefined ? "%" : ""}
                                </div>
                            `;
            });
            return res;
          },
        },
        xAxis: {
          data: this.weekNos,
          axisLabel: {
            interval: 0,
            // rotate: this.weekNos.length > 10 ? -45 : 0,
          },
        },
        yAxis: [
          {
            name: "API数量",
            nameTextStyle: {
              padding: [0, 0, 0, 60],
            },
            type: "value",
            max: (value) => {
              return Math.ceil(getAbsMax(value) * 1.2);
            },
            minInterval: 1,
          },
          {
            name: "周环比增长",
            type: "value",
            splitLine: {
              show: false,
            },
            axisLabel: {
              show: true,
              interval: "auto",
              formatter: "{value} %",
            },
            max: (value) => {
              return Math.ceil(getAbsMax(value) * 1.2);
            },
            min: (value) => {
              return Math.floor(-getAbsMax(value) * 1.2);
            },
          },
        ],
        series: [
          {
            barMaxWidth: 40,
            data: this.poorTotalIncrease,
            name: "差",
            type: "bar",
            stack: "week",
            yAxisIndex: 0,
            itemStyle: {
              normal: {
                color: "#e9cd25",
              },
            },
            label: {
              show: true,
              position: "inside", //在左边显示
            },
          },
          {
            barMaxWidth: 40,
            data: this.goodTotalIncrease,
            name: "良",
            type: "bar",
            stack: "week",
            yAxisIndex: 0,
            itemStyle: {
              normal: {
                color: "#5facf2",
              },
            },
            label: {
              show: true,
              position: "inside", //在左边显示
            },
          },
          {
            barMaxWidth: 40,
            data: this.excellentTotalIncrease,
            name: "优",
            type: "bar",
            stack: "week",
            yAxisIndex: 0,
            itemStyle: {
              normal: {
                color: "#4eca73",
              },
            },
            label: {
              show: true,
              position: "inside", //在左边显示
            },
          },
          {
            name: "优周环比",
            data: this.excellentTotalRose,
            type: "line",
            yAxisIndex: 1,
            itemStyle: {
              normal: {
                lineStyle: {
                  color: "#a85832", //折线颜色
                },
                color: "#a89a32", //拐点颜色
                label: {
                  show: true,
                  formatter: (params) => {
                    return `${params.value}%`;
                  },
                },
              },
            },
          },
          {
            name: "良周环比",
            data: this.goodTotalRose,
            type: "line",
            yAxisIndex: 1,
            itemStyle: {
              normal: {
                lineStyle: {
                  color: "#32a898", //折线颜色
                },
                color: "#3261a8", //拐点颜色
                label: {
                  show: true,
                  formatter: (params) => {
                    return `${params.value}%`;
                  },
                },
              },
            },
          },
          {
            name: "差周环比",
            data: this.poorTotalRose,
            type: "line",
            yAxisIndex: 1,
            itemStyle: {
              normal: {
                lineStyle: {
                  color: "#7b32a8", //折线颜色
                },
                color: "#a83285", //拐点颜色
                label: {
                  show: true,
                  formatter: (params) => {
                    return `${params.value}%`;
                  },
                },
              },
            },
          },
        ],
      };
      this.incrementEchart.setOption(option);
    },
  },
};
function getIncreaseList(list) {
  const lastItemIndex = list.length - 1;
  return list.reduce((res, curVal, curIndex, array) => {
    res.push(curVal);
    return res;
  }, []);
}
function getAbsMax(value = {}) {
  const { max, min } = value;
  const absMax = Math.max(Math.abs(max), Math.abs(min));
  return absMax;
}
</script>

<style lang="scss" scoped>
</style>
