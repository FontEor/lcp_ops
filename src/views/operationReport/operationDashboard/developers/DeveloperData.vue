<template>
  <el-main>
    <!--  数据概览  -->

    <el-row :gutter="20" class="simpleDescList">
      <el-row>
        <el-col :span="6">
          <div>
            <span class="count">开发团队总数：{{ developerSimpDesc.total }}</span>
            <span class="desc">当前外网认证通过的团队数量</span>
          </div>
        </el-col>
        <el-col :span="6">
          <div>
            <span class="count">ISV：{{ developerSimpDesc.isv }}</span>
            <span class="desc">当前认证通过ISV资质的开发团队数量</span>
          </div>
        </el-col>
        <el-col :span="6">
          <div>
            <span class="count">自研商家：{{ developerSimpDesc.selfDev }}</span>
            <span class="desc">当前认证通过自研商家资质的开发团队数量</span>
          </div>
        </el-col>
        <el-col :span="6">
          <div>
            <span class="count">合作伙伴：{{ developerSimpDesc.partner }}</span>
            <span class="desc">当前认证通过合作伙伴资质的开发团队数量</span>
          </div>
        </el-col>
      </el-row>
    </el-row>
    <el-divider />
    <!--    商家周平均量柱状图-->

    <el-row :gutter="20" style="margin-bottom: 15px">
      <el-col :span="12">
        <el-date-picker
          id="endWeekNo"
          v-model="queryCondition.startTime"
          format="yyyy 第 WW 周"
          type="week"
          placeholder="选择周"
          :picker-options="{'firstDayOfWeek': 5}"
        />
        <span class="date-picker_gap">至</span>
        <el-date-picker
          id="endWeekNo"
          v-model="queryCondition.endTime"
          type="week"
          format="yyyy 第 WW 周"
          placeholder="选择周"
          :picker-options="{'firstDayOfWeek': 5}"
        />
        <el-button type="primary" style="margin-left: 15px" @click="getChartsDate">查询</el-button>
      </el-col>
    </el-row>
    <!-- 开发团队增量周趋势图 -->
    <developer-week-increment 
      class="echarts-increment"
      :week-nos="developerData.weekNos"
      :isv="developerData.isv"
      :partner="developerData.partner"
      :self-dev="developerData.selfDev"
      :total="developerData.total"
    />

    <el-row type="flex" justify="end">
      <el-col :span="24">
        <el-row>
          <el-col v-if="showDeveloperData" :span="24">
            <developer-week-average-mount
              :week-nos="developerData.weekNos"
              :isv="developerData.isv"
              :partner="developerData.partner"
              :self-dev="developerData.selfDev"
              :total="developerData.total"
            />
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </el-main>
</template>
<script>

import DeveloperWeekAverageMount from './DeveloperWeekAverageMount'
import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import gwSmartLog from '@/api/gwSmartLog/index'
import DeveloperWeekIncrement from './DeveloperWeekIncrement'

export default {
  components: { DeveloperWeekAverageMount,DeveloperWeekIncrement },
  data() {
    return {
      queryCondition: {
        startTime: '',
        endTime: '',
        eg: ''
      },
      developerSimpDesc: {
        total: 0,
        isv: 0,
        selfDev: 0,
        partner: 0
      },
      developerData: {
        weekNos: [],
        isv: [],
        selfDev: [],
        partner: [],
        total: []
      },
      showDeveloperData: false
    }
  },
  mounted() {
    this.initDayJs()
    this.initQueryCondition()
    try {
      this.queryDeveloperData()
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
        this.queryDeveloperData()
      } catch (e) {
        this.dealTime(-1)
        return
      }
      this.dealTime(-1)
    },
    queryDeveloperData() {
      const params = []
      params[0] = new Date(this.queryCondition.startTime).getTime()
      params[1] = new Date(this.queryCondition.endTime).getTime()
      if (params[1] <= params[0]) {
        this.$message.warning('请输入正确的时间范围!')
        return
      }

      gwSmartLog.supplier.queryDeveloperData(params).then((data) => {
        this.developerSimpDesc.total = data.data.total
        this.developerSimpDesc.isv = data.data.isv
        this.developerSimpDesc.selfDev = data.data.selfDev
        this.developerSimpDesc.partner = data.data.partner
        //
        this.showDeveloperData = true
        this.developerData.selfDev = data.data.selfDevCountList
        this.developerData.isv = data.data.isvCountList
        this.developerData.partner = data.data.partnerCountList
        this.developerData.total = data.data.totalCountList

        this.developerData.weekNos = this.getWeekNos()
      }).catch((error) => {
        this.showDeveloperData = false
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
    },
    getIncrementEchartData () {

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
.echarts-increment {
  margin-bottom:15px;
}
.date-picker_gap {
  padding: 0 8px;
}
</style>
