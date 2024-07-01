<template>
  <!-- 饼图 -->
  <div :id="id" :class="className" :data="data" :style="{ height:height, width:width }" />
</template>
<script>
import echarts from 'echarts'

export default {
  props: {
    id: {
      type: String,
      default: 'pieChart'
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
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'horizontal',
          bottom: data.config.legend && data.config.legend.bottom ? data.config.legend.bottom : 20,
          left: data.config.legend && data.config.legend.left ? data.config.legend.left : 20,
          right: data.config.legend && data.config.legend.right ? data.config.legend.right : 20,
          itemWidth: data.config.legend && data.config.legend.itemWidth ? data.config.legend.itemWidth : 10,
          itemHeight: data.config.legend && data.config.legend.itemHeight ? data.config.legend.itemHeight : 10,
          itemGap: data.config.legend && data.config.legend.itemGap ? data.config.legend.itemGap : 20,
          icon: 'circle',
          formatter: '{name}',
          textStyle: {
            color: '#666',
            fontSize: 14
          },
          data: data.txtData
        },
        series: [
          {
            name: data.title,
            type: 'pie',
            width: data.config.pie && data.config.pie.width ? data.config.pie.width : 'auto',
            height: data.config.pie && data.config.pie.height ? data.config.pie.height : 'auto',
            radius: data.config.pie && data.config.pie.radius ? data.config.pie.radius : ['50%', '80%'],
            data: data.data
          }
        ]
      }
      myChart.setOption(option)
    }
  }
}
</script>
