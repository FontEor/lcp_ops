<template>
  <el-main>
    <!--  数据概览  -->
    <el-row class="simpleDescList">
      <el-row>
        <el-col :span="6">
          <div>
            <span class="count">订单总量：{{ orderSimpleDescData.total }}</span>
            <span class="desc">下单接口累计调用成功次数</span>
          </div>
        </el-col>
        <el-col :span="6">
          <div>
            <span class="count">纯配订单量：{{ orderSimpleDescData.pureDistribution }}</span>
            <span class="desc">快递纯配(不含C2C) 下单接口，累计调用成功次数</span>
          </div>
        </el-col>
        <el-col :span="6">
          <div>
            <span class="count">C2C订单量：{{ orderSimpleDescData.c2c }}</span>
            <span class="desc">C2C下单接口，累计调用成功的次数</span>
          </div>
        </el-col>
        <el-col :span="6">
          <div>
            <span class="count">仓配订单量：{{ orderSimpleDescData.warehouseDistribution }}</span>
            <span class="desc">仓配下单接口，累计调用成功的次数</span>
          </div>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="6">
          <div>
            <span class="count">ISV订单量：{{ orderSimpleDescData.isv }}</span>
            <span class="desc">ISV应用，累计调用下单接口的成功次数</span>
          </div>
        </el-col>
        <el-col :span="6">
          <div>
            <span class="count">自研商家订单量：{{ orderSimpleDescData.selfDev }}</span>
            <span class="desc">自研商家应用，累计调用下单接口的成功次数</span>
          </div>
        </el-col>
        <el-col :span="6">
          <div>
            <span class="count">合作伙伴订单量：{{ orderSimpleDescData.partner }}</span>
            <span class="desc">合作伙伴应用，累计调用下单接口的成功次数</span>
          </div>
        </el-col>

        <el-col :span="6">
          <div>
            <span class="count">宙斯订单量：{{ orderSimpleDescData.jos }}</span>
            <span class="desc">当前周宙斯应用，累计调用下单接口的成功次数</span>
          </div>
        </el-col>
      </el-row>
    </el-row>
    <el-divider />
    <!--    商家周平均量柱状图-->
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
          <el-col v-if="resultStatus.idpcd" :span="24">
            <IsvResearBusinessPartnerChart
              :week-nos="isvDeveloperPartnerChartData.weekNos"
              :isv="isvDeveloperPartnerChartData.isv"
              :self-developer="isvDeveloperPartnerChartData.selfDeveloper"
              :partner="isvDeveloperPartnerChartData.partner"
              :jos="isvDeveloperPartnerChartData.jos"
            />
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="12">
        <el-row>
          <el-col v-if="resultStatus.cpwcd" :span="24">
            <C2cPrueMachDistributionWarehouseDistribution
              :c2c="c2cPrueWarehouseChartData.c2c"
              :week-nos="c2cPrueWarehouseChartData.weekNos"
              :prue="c2cPrueWarehouseChartData.prue"
              :warehouse="c2cPrueWarehouseChartData.warehouse"
            />
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </el-main>
</template>
<script>
import IsvResearBusinessPartnerChart from './IsvResearBusinessPartnerChart'
import C2cPrueMachDistributionWarehouseDistribution from './C2cPrueMachDistributionWarehouseDistribution'
import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import gwSmartLog from '@/api/gwSmartLog/index'

export default {
  components: { C2cPrueMachDistributionWarehouseDistribution, IsvResearBusinessPartnerChart },
  data() {
    return {
      queryCondition: {
        startTime: '',
        endTime: ''
      },
      orderSimpleDescData: {
        total: 0,
        pureDistribution: 0,
        warehouseDistribution: 0,
        c2c: 0,
        isv: 0,
        selfDev: 0,
        partner: 0,
        jos: 0
      },
      isvDeveloperPartnerChartData: {
        // 周号根据startTime 和endTime计算，可以是纯数组[8,9,10,11,12,13,,,]
        weekNos: [],
        // 周平局值
        isv: [],
        selfDeveloper: [],
        partner: [],
        jos: []
      },
      c2cPrueWarehouseChartData: {
        weekNos: [],
        // 周平局值
        c2c: [],
        prue: [],
        warehouse: []
      },
      resultStatus: {
        idpcd: false,
        cpwcd: false
      }

    }
  },
  mounted() {
    this.initDayJs()
    this.getOrderSimpleDescData()
    this.initQueryCondition()
    try {
      this.getIsvDeveloperPartnerChartData()
      this.getC2cPrueWarehouseChartData()
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
        this.getIsvDeveloperPartnerChartData()
        this.getC2cPrueWarehouseChartData()
      } catch (e) {
        this.dealTime(-1)
        return
      }
      this.dealTime(-1)
    },
    // 取最近7周时间范围[5.....5
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
    getOrderSimpleDescData() {
      gwSmartLog.order.searchOrder().then((data) => {
        this.orderSimpleDescData.total = data.data.total
        this.orderSimpleDescData.pureDistribution = data.data.pureDistribution
        this.orderSimpleDescData.warehouseDistribution = data.data.warehouseDistribution
        this.orderSimpleDescData.c2c = data.data.c2c
        this.orderSimpleDescData.isv = data.data.isv
        this.orderSimpleDescData.selfDev = data.data.selfDev
        this.orderSimpleDescData.partner = data.data.partner
        this.orderSimpleDescData.jos = data.data.jos
      }).catch((error) => {
        this.$message.error(error.msg)
      })
    },
    getIsvDeveloperPartnerChartData() {
      const params = []
      params[0] = (new Date(this.queryCondition.startTime)).getTime()
      params[1] = (new Date(this.queryCondition.endTime)).getTime()
      gwSmartLog.order.searchOrderAVGWeekIDP(params).then((data) => {
        this.isvDeveloperPartnerChartData.partner = data.data.partner
        this.isvDeveloperPartnerChartData.isv = data.data.isv
        this.isvDeveloperPartnerChartData.selfDeveloper = data.data.selfDev
        this.isvDeveloperPartnerChartData.jos = data.data.jos
        this.isvDeveloperPartnerChartData.weekNos = this.getWeekNos()
        this.resultStatus.idpcd = true
      }).catch((e) => {
        this.resultStatus.idpcd = false
        this.$message.error(e.msg)
      })
    },
    getC2cPrueWarehouseChartData() {
      const params = []
      params[0] = (new Date(this.queryCondition.startTime)).getTime()
      params[1] = (new Date(this.queryCondition.endTime)).getTime()
      gwSmartLog.order.searchOrderAVGWeekCPW(params).then((data) => {
        console.log('c2c data:', data)
        this.c2cPrueWarehouseChartData.c2c = data.data.c2c
        this.c2cPrueWarehouseChartData.prue = data.data.pureDistribution
        this.c2cPrueWarehouseChartData.warehouse = data.data.warehouseDistribution
        this.c2cPrueWarehouseChartData.weekNos = this.getWeekNos()
        this.resultStatus.cpwcd = true
      }).catch((e) => {
        this.resultStatus.cpwcd = false
        this.$message.error(e.msg)
      })
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
.start-date {
  padding: 0;
  margin-left: 15px;
  margin-right: 0px;
}

.end-date {

}

.line {
  margin: 0;
  padding: 0;
  text-align: center;
  height: 32px;
  line-height: 32px;

}

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
