<template>
  <el-scrollbar>
    <div id="reportChart" ref="reportChart" />
  </el-scrollbar>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/shine') // 引入主题

export default {
  name: 'Chart',
  props: {
    category: Array,
    legend: Array,
    seriesname: String,
    seriesdata: Array,
    seriesname_line: String,
    seriesdata_line: Array,
    max: Number
  },
  data() {
    return { chartLine: null }
  },
  watch: {
    category: function() {
      this.drawLineChart()
    },
    seriesdata: function() {
      this.drawLineChart()
    },
    seriesname: function() {
      this.drawLineChart()
    },
    seriesdata_line: function() {
      this.drawLineChart()
    },
    seriesname_line: function() {
      this.drawLineChart()
    },
    max: function() {
      this.drawLineChart()
    }
  },
  mounted() {
    this.$refs.reportChart.style.setProperty(
      '--vw',
      `${window.innerWidth - 300}px`
    )
    this.$refs.reportChart.style.setProperty(
      '--vh',
      `${window.innerHeight - 350}px`
    )
    this.$nextTick(() => {
      this.drawLineChart()
    })
  },
  methods: {
    drawLineChart() {
      this.chartLine = echarts.init(this.$refs.reportChart, 'shine')
      const option = {
        tooltip: {
          // hover交互提示
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              show: false
            },
            lineStyle: {
              type: 'dashed'
            }
          }
        },
        calculable: true,
        legend: {
          // 图例
          type: 'plain'
        },
        xAxis: [
          {
            type: 'category',
            offset: 20,
            // boundaryGap: false, // 留白
            axisLine: {
              // 坐标轴线
              show: false
            },
            axisTick: {
              // 坐标刻度
              show: false
            },
            splitLine: {
              // 分隔线
              show: true,
              interval: 0,
              lineStyle: {
                color: ['#eee'],
                type: 'dotted'
              }
            },
            data: this.category
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLine: {
              // 坐标轴线
              show: false
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: ['#eee'],
                type: 'dotted'
              }
            }
          }
        ],
        series: [
          {
            name: this.seriesname,
            type: 'line',
            symbol: 'circle',
            label: {
              show: true,
              position: 'bottom'
            },
            itemStyle: {
              normal: {
                color: '#51b98e'
              }
            },
            smooth: true,
            areaStyle: {
              opacity: 0.1
            },
            data: this.seriesdata
          },
          {
            name: this.seriesname_line,
            type: 'line',
            symbol: 'circle',
            label: {
              show: true,
              position: 'top'
            },
            itemStyle: {
              normal: {
                color: '#638bf3'
              }
            },
            smooth: true,
            areaStyle: { opacity: 0.1 },
            data: this.seriesdata_line
          }
        ]
      }
      // 使用刚指定的配置项和数据显示图表
      this.chartLine.setOption(option)
    }
  }
}
</script>

<style lang="scss" scoped>
#reportChart {
  --vw: 1px;
  --vh: 1px;
  width: calc(var(--vw, 1px));
  height: calc(var(--vh, 1px));
  margin-left: auto;
  margin-right: auto;
}
</style>
