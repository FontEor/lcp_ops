<template>
  <el-scrollbar>
    <div id="userJoinUpData" ref="userJoinUpData" style="width: 100%;height: 371px;" />
  </el-scrollbar>
</template>

<script>
import echarts from 'echarts'

export default {
  props: {
    weekNos: Array,
    userAmount: Array
  },
  data() {
    return {
      chartsPicture: null
    }
  },
  watch: {
    weekNos: {
      handler: function() {
        this.createCharts()
      },
    },
    userJoinUpData: {
      handler: function() {
        this.createCharts()
      },
    }
  },
  mounted() {
    this.createCharts()
  },
  methods: {
    createCharts() {
      this.chartsPicture = echarts.init(this.$refs.userJoinUpData)
      const option = {
        title: {
          text: '用户接入周期趋势图',
          x: 'left'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          show: true,
          x: 'center',
          y: 'bottom'

        },
        grid: {
          left: '0%',
          right: '0%',
          bottom: '10%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: this.weekNos,
            axisLabel: {
              interval: 0,
              rotate: this.weekNos.length > 10 ? -60 : 0
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            type: 'line',
            data: this.userAmount,
            itemStyle: {
              normal: {
                color: '#4ecb73',
                label: {
                  show: true,
                  position: 'center',
                  textStyle: {
                    color: '#090102',
                    textAlign: 'center'
                  }
                }
              }
            }

          }
        ]
      }
      this.chartsPicture.setOption(option)
    }
  }

}

</script>

<style lang="scss" scoped>

</style>
