<template>
  <el-tabs v-model="activeName">
    <el-tab-pane label="基础属性" name="base">
      <div class="tag-group">
        <span class="tag-group-title">已选展示标签：</span>
        <el-tag
          v-for="item in tagItems"
          :key="item.label"
          size="mini"
        >
          {{ item.label }}
        </el-tag>
      </div>
      <el-row class="chart-wrap">
        <el-col :span="12"><bar-chart :id="domId" :data="barData" /></el-col>
        <el-col :span="12"><pie-chart :dom-pie-id="domPieId" :data="pieData" /></el-col>
        <el-col :span="12"><bar-chart :id="domId2" :data="barData2" /></el-col>
      </el-row>
    </el-tab-pane>
    <el-tab-pane label="用户行为" name="userAction" />
    <el-tab-pane label="寄件偏好" name="preference" />
  </el-tabs>
</template>
<script>
import BarChart from '@/components/charts/BarChart.vue'
import PieChart from '@/components/charts/PieChart.vue'

export default {
  components: {
    BarChart,
    PieChart
  },
  data() {
    return {
      activeName: 'base',
      tagItems: [
        { label: '年龄' },
        { label: '性别' },
        { label: '职业' }
      ],
      domId: 'barChart',
      domId2: 'barChart2',
      barData: {
        title: '年龄',
        xAxisData: ['1951年', '1952年', '1953年', '1954年', '1955年', '1956年', '1957年'],
        seriesData: [120, 200, 150, 80, 70, 110, 130]
      },
      barData2: {
        title: '职业',
        xAxisData: ['1951年', '1952年', '1953年', '1954年', '1955年', '1956年', '1957年'],
        seriesData: [120, 200, 150, 80, 70, 110, 130]
      },
      domPieId: 'pieChart',
      pieData: {
        title: '性别',
        seriesData: [
          { value: 35, name: '男' },
          { value: 25, name: '女' }
        ]
      }
    }
  },
  computed: {
  },
  created() {
  },
  mounted() {

  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
@import './group.scss';
.chart-wrap{
  > div:nth-child(n+2){
    margin-top:20px;
  }
}
</style>
