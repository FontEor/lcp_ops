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
      default: 'lineChart'
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
        grid: {
          top: '20',
          left: '0',
          right: '0',
          bottom: '10'
        },
        xAxis: {
          show: false,
          type: 'category'
        },
        yAxis: {
          show: false,
          type: 'value'
        },
        series: data.series
      }
      myChart.setOption(option)
    }
  }
}
</script>
