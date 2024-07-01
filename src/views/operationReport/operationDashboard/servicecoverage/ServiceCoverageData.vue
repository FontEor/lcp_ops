<template>
  <el-main>
    <el-row :gutter="20" class="simpleDescList">
      <el-row>
        <el-col :span="6">
          <div>
            <span class="count">物流产品覆盖率：{{
              coveredProductRate
            }}%={{ serviceCoverageSimpDesc.coveredProduct }}/{{ serviceCoverageSimpDesc.totalProduct }}</span>
            <span class="desc">平台已覆盖的产品/物流开放的所有产品</span>
          </div>
        </el-col>
        <el-col :span="6">
          <div>
            <span class="count">行业解决方案覆盖率：{{
              coveredSolutionRate
            }}%={{ serviceCoverageSimpDesc.platformSolution }}/{{ serviceCoverageSimpDesc.logisticsSolution }}</span>
            <span class="desc">平台已覆盖的行业解决方案/物流沉淀的所有行业解决方案</span>
          </div>
        </el-col>
      </el-row>
    </el-row>
    <el-divider />
    <el-row :gutter="20" style="margin-bottom: 15px">
      <el-col :span="12">
        <el-date-picker
          v-model="queryCondition.startTime"
          type="week"
          format="yyyy 第 WW 周"
          placeholder="选择周"
          :picker-options="{'firstDayOfWeek': 5}"
        />
        <span>至</span>
        <el-date-picker
          v-model="queryCondition.endTime"
          type="week"
          format="yyyy 第 WW 周"
          placeholder="选择周"
          :picker-options="{'firstDayOfWeek': 5}"
        />
        <el-button type="primary" style="margin-left: 15px" @click="getChartsDate">查询</el-button>
      </el-col>
    </el-row>
    <el-row type="flex" justify="end">
      <el-col :span="12">
        <el-row>
          <el-col v-if="dataStatus.logisticsProductChartDataStatus" :span="24">
            <LogisticsProduct
              :week-nos="logisticsProductChartData.weekNos"
              :logistics-product="logisticsProductChartData.logisticsProduct"
            />
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="12">
        <el-row>
          <el-col v-if="dataStatus.industrySolutionChartDataStatus" :span="24">
            <IndustrySolution
              :week-nos="industrySolutionChartData.weekNos"
              :industry-solution="industrySolutionChartData.industrySolution"
            />
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </el-main>
</template>
<script>

import IndustrySolution from './IndustrySolution'
import LogisticsProduct from './LogisticsProduct'
import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import gwSmartLog from '@/api/gwSmartLog/index'

export default {
  components: { LogisticsProduct, IndustrySolution },
  data() {
    return {
      queryCondition: {
        startTime: '',
        endTime: ''
      },
      serviceCoverageSimpDesc: {
        // 平台已覆盖的产品数
        coveredProduct: 0,
        // 物流开放的所有产品数
        totalProduct: 0,

        // 平台已覆盖的行业解决方案
        platformSolution: 0,
        // 物流沉淀的所有行业解决方案
        logisticsSolution: 0
      },
      industrySolutionChartData: {
        weekNos: [],
        industrySolution: []
      },
      logisticsProductChartData: {
        weekNos: [],
        logisticsProduct: []
      },
      dataStatus: {
        logisticsProductChartDataStatus: false,
        industrySolutionChartDataStatus: false

      }

    }
  },
  computed: {
    coveredProductRate() {
      if (this.serviceCoverageSimpDesc.totalProduct !== 0) {
        return (this.serviceCoverageSimpDesc.coveredProduct / this.serviceCoverageSimpDesc.totalProduct * 1.0 * 100).toFixed(2)
      }
      return 0
    },
    coveredSolutionRate() {
      if (this.serviceCoverageSimpDesc.logisticsSolution !== 0) {
        return (this.serviceCoverageSimpDesc.platformSolution / this.serviceCoverageSimpDesc.logisticsSolution * 1.0 * 100).toFixed(2)
      }
      return 0
    }
  },
  mounted() {
    this.initDayJs()
    this.initQueryCondition()
    this.getServiceCoverageSimpDesc()
    try {
      this.getServiceCoverageSimpDesc()
    } catch (e) {
      this.dealEndTime()
      return
    }
    this.dealEndTime()
  },
  methods: {
    dealEndTime() {
      this.queryCondition.endTime = new Date(new Date(this.queryCondition.endTime).getTime() + 6 * 24 * 60 * 60 * 1000 * -1)
      this.queryCondition.startTime = new Date(new Date(this.queryCondition.startTime).getTime() + 1 * 24 * 60 * 60 * 1000 * 1)
    },
    getChartsDate() {
      this.dealTime(1)
      if (!this.checkDateRange()) {
        return
      }
      try {
        this.getServiceCoverageSimpDesc()
      } catch (e) {
        this.dealTime(-1)
        return
      }
      this.dealTime(-1)
    },
    getWeekNos() {
      let startTimeStamp = this.queryCondition.startTime.getTime() - 24 * 60 * 60 * 1000
      const endTimestamp = this.queryCondition.endTime.getTime() + 24 * 60 * 60 * 1000 * 6 - 1
      const weekNos = []
      while (startTimeStamp < endTimestamp) {
        const temp = new Date(startTimeStamp)
        const week = this.dayjs(temp).week() - 1
        const year = temp.getFullYear()
        const weekNo = year + '年第 ' + week + ' 周'
        weekNos.push(weekNo)
        startTimeStamp += 24 * 60 * 60 * 1000 * 7
      }
      return weekNos
    },
    getServiceCoverageSimpDesc() {
      const params = []
      params[0] = (new Date(this.queryCondition.startTime)).getTime()
      params[1] = (new Date(this.queryCondition.endTime)).getTime()
      gwSmartLog.service.queryKanbanData(params).then((data) => {
        this.serviceCoverageSimpDesc.coveredProduct = data.data.coveredProduct
        this.serviceCoverageSimpDesc.logisticsSolution = data.data.logisticsSolution
        this.serviceCoverageSimpDesc.platformSolution = data.data.platformSolution
        this.serviceCoverageSimpDesc.totalProduct = data.data.totalProduct
        //
        this.industrySolutionChartData.industrySolution = data.data.solutionWeekCount
        this.dataStatus.industrySolutionChartDataStatus = true
        this.industrySolutionChartData.weekNos = this.getWeekNos()

        this.logisticsProductChartData.logisticsProduct = data.data.logisticProductWeekCount
        this.dataStatus.logisticsProductChartDataStatus = true
        this.logisticsProductChartData.weekNos = this.getWeekNos()
      }).catch((error) => {
        this.dataStatus.industrySolutionChartDataStatus = false
        this.dataStatus.logisticsProductChartDataStatus = false
        this.$message.error(error.msg)
      })
    },
    initQueryCondition() {
      const todayDate = new Date()
      const year = todayDate.getFullYear()
      const month = todayDate.getMonth() + 1
      const day = todayDate.getDate()
      const str = year + '-' + month + '-' + day
      const defaultDate = new Date(str)
      let week = defaultDate.getDay()
      if (week === 0) {
        week = 7
      }

      const defaultEndTime = defaultDate.getTime() + (5 - week) * 24 * 60 * 60 * 1000
      const defaultStartTime = defaultEndTime - 24 * 60 * 60 * 1000 * 7 * 7
      this.queryCondition.startTime = new Date(defaultStartTime)
      this.queryCondition.endTime = new Date(defaultEndTime)
    },
    initDayJs() {
      dayjs.extend(weekOfYear)
      this.dayjs = dayjs
    },
    dealTime(isEnd) {
      this.queryCondition.endTime = new Date(new Date(this.queryCondition.endTime).getTime() + 6 * 24 * 60 * 60 * 1000 * isEnd)
      this.queryCondition.startTime = new Date(new Date(this.queryCondition.startTime).getTime() - 24 * 60 * 60 * 1000 * isEnd)
    },
    checkDateRange() {
      const params = []
      params[0] = new Date(this.queryCondition.startTime).getTime()
      params[1] = new Date(this.queryCondition.endTime).getTime()
      console.log(params)
      if (params[1] <= params[0]) {
        this.$message.warning('请输入正确的时间范围!')
        return false
      }
      return true
    }
  }
}
</script>

<style lang="scss" scoped>

.simpleDescList {
  margin-left: 0;
  margin-right: 0;
  margin-top: 0;
  margin-bottom: 0;
  padding-top: 0;
  padding-left: 0;
  padding-right: 0;

  .count {
    margin: 0;
    padding: 0;
    height: auto;
    margin-top: 20px;
    margin-bottom: 10px;
    width: 100%;
    font-size: larger;
    font-weight: bold;
    text-align: center;
    display: block;
  }

  .desc {
    margin: 0;
    padding: 0;
    height: auto;
    margin-top: 10px;
    margin-bottom: 10px;
    width: 100%;
    font-size: small;
    text-align: center;
    word-break: normal;
    display: block;
  }
}
</style>
