<template>
  <el-scrollbar>
    <div
      id="developer_week_increment"
      ref="developer_week_increment"
      style="width: 100%; height: 700px"
    />
  </el-scrollbar>
</template>

<script>
import echarts from "echarts";

export default {
  props: {
    weekNos: Array,
    //没有调用量
    notCallTotal: Array,
    //没有运行时用户使用
    notRuntimeUserTotal: Array,
    //没有管理端用户使用
    notManagerUserTotal: Array,
    //没有负责人
    notOwnerTotal: Array,
    //注册后长时间未发布
    redundantTotal: Array,
    //性能差
    tp99OverFlagTotal: Array,
    //触发告警
    alarmFlagTotal: Array,
    //可用率低
    errorFlagTotal: Array,
    //流量异常
    byteErrorFlagTotal: Array,
    //爬虫风险
    crawlerRiskFlagTotal: Array,
    //无身份认证
    approvedIdentityFlagTotal: Array,
  },
  data() {
    return {
      incrementEchart: null,
    };
  },
  computed: {
    notCallTotalIncrease: function () {
      return getIncreaseList(this.notCallTotal).slice(1);
    },
    notRuntimeUserTotalIncrease: function () {
      return getIncreaseList(this.notRuntimeUserTotal).slice(1);
    },
    notManagerUserTotalIncrease: function () {
      return getIncreaseList(this.notManagerUserTotal).slice(1);
    },
     notOwnerTotalIncrease: function () {
      return getIncreaseList(this.notOwnerTotal).slice(1);
    },
     redundantTotalIncrease: function () {
      return getIncreaseList(this.redundantTotal).slice(1);
    },
    tp99OverFlagTotalIncrease: function () {
      return getIncreaseList(this.tp99OverFlagTotal).slice(1);
    },
     alarmFlagTotalIncrease: function () {
      return getIncreaseList(this.alarmFlagTotal).slice(1);
    },
     errorFlagTotalIncrease: function () {
      return getIncreaseList(this.errorFlagTotal).slice(1);
    },
     byteErrorFlagTotalIncrease: function () {
      return getIncreaseList(this.byteErrorFlagTotal).slice(1);
    },
     crawlerRiskFlagTotalIncrease: function () {
      return getIncreaseList(this.crawlerRiskFlagTotal).slice(1);
    },
    approvedIdentityFlagTotalIncrease: function () {
      return getIncreaseList(this.approvedIdentityFlagTotal).slice(1);
    },
    notCallTotalRose: function () {
      return this.notCallTotal.reduce((res, curVal, curIndex, array) => {
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
    notRuntimeUserTotalRose: function () {
      return this.notRuntimeUserTotal.reduce((res, curVal, curIndex, array) => {
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
    notManagerUserTotalRose: function () {
      return this.notManagerUserTotal.reduce((res, curVal, curIndex, array) => {
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
     notOwnerTotalRose: function () {
      return this.notOwnerTotal.reduce((res, curVal, curIndex, array) => {
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
     redundantTotalRose: function () {
      return this.redundantTotal.reduce((res, curVal, curIndex, array) => {
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
     tp99OverFlagTotalRose: function () {
      return this.tp99OverFlagTotal.reduce((res, curVal, curIndex, array) => {
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
     alarmFlagTotalRose: function () {
      return this.alarmFlagTotal.reduce((res, curVal, curIndex, array) => {
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
     errorFlagTotalRose: function () {
      return this.errorFlagTotal.reduce((res, curVal, curIndex, array) => {
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
     byteErrorFlagTotalRose: function () {
      return this.byteErrorFlagTotal.reduce((res, curVal, curIndex, array) => {
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
     crawlerRiskFlagTotalRose: function () {
      return this.crawlerRiskFlagTotal.reduce((res, curVal, curIndex, array) => {
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
     approvedIdentityFlagTotalRose: function () {
      return this.approvedIdentityFlagTotal.reduce((res, curVal, curIndex, array) => {
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
    notCallTotal: {
      handler: function () {
        this.setUpEchart();
      },
    },
    notRuntimeUserTotal: {
      handler: function () {
        this.setUpEchart();
      },
    },

    notManagerUserTotal: {
      handler: function () {
        this.setUpEchart();
      },
    },
     notOwnerTotal: {
      handler: function () {
        this.setUpEchart();
      },
    },
     redundantTotal: {
      handler: function () {
        this.setUpEchart();
      },
    },
     tp99OverFlagTotal: {
      handler: function () {
        this.setUpEchart();
      },
    },
     alarmFlagTotal: {
      handler: function () {
        this.setUpEchart();
      },
    },
     errorFlagTotal: {
      handler: function () {
        this.setUpEchart();
      },
    },
     byteErrorFlagTotal: {
      handler: function () {
        this.setUpEchart();
      },
    },
     crawlerRiskFlagTotal: {
      handler: function () {
        this.setUpEchart();
      },
    },
     approvedIdentityFlagTotal: {
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
          text: "非健康API的问题占比周趋势柱状图",
          left: "0",
        },
        legend: {
          data: ["没有调用量", "没有运行时用户", "没有管理端用户", "没有负责人","注册后长时间未发布","性能差","触发告警",
          "可用率低","流量异常","爬虫风险","无身份认证",
          "没有调用量周环比", "没有运行时用户周环比", "没有管理端用户周环比","没有负责人周环比","注册后长时间未发布周环比","性能差周环比",
          "触发告警周环比","可用率低周环比","流量异常周环比","爬虫风险周环比","无身份认证周环比",
          ],
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
            name: "问题API数量",
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
            data: this.notCallTotalIncrease,
            name: "没有调用量",
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
            data: this.notRuntimeUserTotalIncrease,
            name: "没有运行时用户",
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
            data: this.notManagerUserTotalIncrease,
            name: "没有管理端用户",
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
            barMaxWidth: 40,
            data: this.notOwnerTotalIncrease,
            name: "没有负责人",
            type: "bar",
            stack: "week",
            yAxisIndex: 0,
            itemStyle: {
              normal: {
                color: "#d9c0bf",
              },
            },
            label: {
              show: true,
              position: "inside", //在左边显示
            },
          },
          {
            barMaxWidth: 40,
            data: this.redundantTotalIncrease,
            name: "注册后长时间未发布",
            type: "bar",
            stack: "week",
            yAxisIndex: 0,
            itemStyle: {
              normal: {
                color: "#80605e",
              },
            },
            label: {
              show: true,
              position: "inside", //在左边显示
            },
          },
          {
            barMaxWidth: 40,
            data: this.tp99OverFlagTotalIncrease,
            name: "性能差",
            type: "bar",
            stack: "week",
            yAxisIndex: 0,
            itemStyle: {
              normal: {
                color: "#bf7424",
              },
            },
            label: {
              show: true,
              position: "inside", //在左边显示
            },
          },
          {
            barMaxWidth: 40,
            data: this.alarmFlagTotalIncrease,
            name: "触发告警",
            type: "bar",
            stack: "week",
            yAxisIndex: 0,
            itemStyle: {
              normal: {
                color: "#d1c815",
              },
            },
            label: {
              show: true,
              position: "inside", //在左边显示
            },
          },
          {
            barMaxWidth: 40,
            data: this.errorFlagTotalIncrease,
            name: "可用率低",
            type: "bar",
            stack: "week",
            yAxisIndex: 0,
            itemStyle: {
              normal: {
                color: "#a9de0b",
              },
            },
            label: {
              show: true,
              position: "inside", //在左边显示
            },
          },
          {
            barMaxWidth: 40,
            data: this.byteErrorFlagTotalIncrease,
            name: "流量异常",
            type: "bar",
            stack: "week",
            yAxisIndex: 0,
            itemStyle: {
              normal: {
                color: "#9eb392",
              },
            },
            label: {
              show: true,
              position: "inside", //在左边显示
            },
          },
          {
            barMaxWidth: 40,
            data: this.crawlerRiskFlagTotalIncrease,
            name: "爬虫风险",
            type: "bar",
            stack: "week",
            yAxisIndex: 0,
            itemStyle: {
              normal: {
                color: "#9daba0",
              },
            },
            label: {
              show: true,
              position: "inside", //在左边显示
            },
          },
          {
            barMaxWidth: 40,
            data: this.approvedIdentityFlagTotalIncrease,
            name: "无身份认证",
            type: "bar",
            stack: "week",
            yAxisIndex: 0,
            itemStyle: {
              normal: {
                color: "#14cc98",
              },
            },
            label: {
              show: true,
              position: "inside", //在左边显示
            },
          },
          ////折线图
          {
            name: "没有调用量周环比",
            data: this.notCallTotalRose,
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
            name: "没有运行时用户周环比",
            data: this.notRuntimeUserTotalRose,
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
            name: "没有管理端用户周环比",
            data: this.notManagerUserTotalRose,
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
          {
            name: "没有负责人周环比",
            data: this.notOwnerTotalRose,
            type: "line",
            yAxisIndex: 1,
            itemStyle: {
              normal: {
                lineStyle: {
                  color: "#12dfe3", //折线颜色
                },
                color: "#f00e16", //拐点颜色
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
            name: "注册后长时间未发布周环比",
            data: this.redundantTotalRose,
            type: "line",
            yAxisIndex: 1,
            itemStyle: {
              normal: {
                lineStyle: {
                  color: "#4a5961", //折线颜色
                },
                color: "#d18486", //拐点颜色
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
            name: "性能差周环比",
            data: this.tp99OverFlagTotalRose,
            type: "line",
            yAxisIndex: 1,
            itemStyle: {
              normal: {
                lineStyle: {
                  color: "#1641c4", //折线颜色
                },
                color: "#5e182c", //拐点颜色
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
            name: "触发告警周环比",
            data: this.alarmFlagTotalRose,
            type: "line",
            yAxisIndex: 1,
            itemStyle: {
              normal: {
                lineStyle: {
                  color: "#57597d", //折线颜色
                },
                color: "#d41772", //拐点颜色
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
            name: "可用率低周环比",
            data: this.errorFlagTotalRose,
            type: "line",
            yAxisIndex: 1,
            itemStyle: {
              normal: {
                lineStyle: {
                  color: "#070b4a", //折线颜色
                },
                color: "#a61e7d", //拐点颜色
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
            name: "流量异常周环比",
            data: this.byteErrorFlagTotalRose,
            type: "line",
            yAxisIndex: 1,
            itemStyle: {
              normal: {
                lineStyle: {
                  color: "#a39be0", //折线颜色
                },
                color: "#b01aad", //拐点颜色
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
            name: "爬虫风险周环比",
            data: this.crawlerRiskFlagTotalRose,
            type: "line",
            yAxisIndex: 1,
            itemStyle: {
              normal: {
                lineStyle: {
                  color: "#8228c7", //折线颜色
                },
                color: "#1cc976", //拐点颜色
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
            name: "无身份认证周环比",
            data: this.approvedIdentityFlagTotalRose,
            type: "line",
            yAxisIndex: 1,
            itemStyle: {
              normal: {
                lineStyle: {
                  color: "#c70dd1", //折线颜色
                },
                color: "#10e81f", //拐点颜色
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
