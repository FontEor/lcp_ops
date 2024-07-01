<template>
  <!-- 雷达图 -->
  <div :id="id" :class="className" :data="data" :style="{ height:height, width:width }" />
</template>
<script>
import echarts from 'echarts'

export default {
  props: {
    id: {
      type: String,
      default: 'radarChart'
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
      default: '300px'
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
        title: data.config.title,
        radar: {
          indicator: data.radar && data.radar.indicator,
          radius: data.radar && data.radar.radius ? data.radar.radius : 90
        },
        series: [
          {
            type: 'radar',
            data: data.data
          }
        ]
      }
      myChart.setOption(option)
    }
  }
}
</script>
