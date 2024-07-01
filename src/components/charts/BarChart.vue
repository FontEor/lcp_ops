<template>
  <!-- 柱形图 -->
  <div :id="id" :class="className" :data="data" :style="{ height:height, width:width }" />
</template>
<script>
import echarts from 'echarts'

export default {
  props: {
    id: {
      type: String,
      default: 'chart'
    },
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '100%'
    },
    data: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.chart = echarts.init(document.getElementById(this.id))
      this.initChart(this.chart, this.data)
      this.chart.resize()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart(myChart, data) {
      const option = {
        color: data.config.color,
        title: data.title,
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#666'
            }
          }
        },
        toolbox: {
          feature: {
            saveAsImage: { show: data.config.saveAsImage ? data.config.saveAsImage : false }// 下载
          }
        },
        grid: {
          top: data.config.grid && data.config.grid.top ? data.config.grid.top : '20',
          left: data.config.grid && data.config.grid.left ? data.config.grid.left : '20',
          right: data.config.grid && data.config.grid.right ? data.config.grid.right : '15',
          bottom: data.config.grid && data.config.grid.bottom ? data.config.grid.bottom : '35',
          containLabel: true
        },
        legend: {
          show: true,
          left: data.legend && data.legend.left ? data.legend.left : 'center',
          bottom: data.legend && data.legend.bottom ? data.legend.bottom : '0px',
          data: data.legend && data.legend.data ? data.legend.data : ''
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: data.config.xAxis && data.config.xAxis.boundaryGap,
            data: data.xData,
            axisLabel: data.config.xAxis && data.config.xAxis.axisLabel ? data.config.xAxis.axisLabel : {
              color: '#666'
            },
            axisPointer: {
              type: data.config.xAxis && data.config.xAxis.axisPointer ? data.config.xAxis.axisPointer : 'none'
            }
          }
        ],
        yAxis: [
          {
            type: data.config.yType ? data.config.yType : 'value',
            data: data.yData,
            axisLabel: data.config.yAxis && data.config.yAxis.axisLabel ? data.config.yAxis.axisLabel : {
              color: '#666'
            },
            splitLine: data.config.yAxis && data.config.yAxis.splitLine ? data.config.yAxis.splitLine : {
              lineStyle: {
                color: ['#eaeaea'],
                type: 'dotted'
              }
            }
          }
        ],
        series: data.series
      }
      myChart.setOption(option)
    }
  }
}
</script>
