<template>
  <div class="operation-dashboard">
    <div class="my-title">OKR指标</div>
    <div class="my-content">
      <el-row>
        <el-col :offset="1" :span="4">
          <div class="my-span">
            <p class="my-data0">{{ placeAnOrderAvg }}</p>
            <p class="my-name">下单接口调用成功量</p>
            <p class="my-description0">近7日下单接口成功量/7</p>
          </div>
        </el-col>
        <el-col :offset="1" :span="4">
          <div class="my-span">
            <p class="my-data1">{{ publishApiMethodCount }}</p>
            <p class="my-name">接口数量</p>
            <p class="my-description">开放平台已发布接口</p>
            <p class="my-description">方法粒度统计</p>
          </div>
        </el-col>
        <el-col :offset="1" :span="4">
          <div class="my-span">
            <p class="my-data2">{{ intranetApplyApiSuccessCount }}(内网)</p>
            <p class="my-data2">
              {{ ExtranetApplyBizUnitApiSuccessCount }}(外网)
            </p>
            <p class="my-name">活跃接口数量</p>
            <p class="my-description">开放平台已发布接口</p>
            <p class="my-description">有被申请使用成功记录的API</p>
          </div>
        </el-col>
        <el-col :offset="1" :span="4">
          <div class="my-span">
            <p class="my-data2">
              {{ intranetApplyApiSuccessRequestCount }}(内网)
            </p>
            <p class="my-data2">
              {{ ExtranetApplyBizUnitApiSuccessRequestCount }}(外网)
            </p>
            <p class="my-name">接口申请成功总次数</p>
            <p class="my-description">外网+内网申请成功次数之和</p>
            <p class="my-description">API粒度统计</p>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="my-title">服务调用统计</div>
    <div>
      <el-row>
        <el-col :span="3">
          <el-button type="primary" plain size="big" @click="minuteChart">
            当日统计
          </el-button>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" plain size="big" @click="dayChart">
            本月统计
          </el-button>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" plain size="big" @click="monthChart">
            本年度统计
          </el-button>
        </el-col>
      </el-row>
    </div>
    <div class="my-title">服务调用趋势图</div>
    <div>
      <el-row>
        <el-col :span="3">
          <el-button type="primary" plain size="big" @click="minuteChart">
            日分时趋势图
          </el-button>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" plain size="big" @click="dayChart">
            按日趋势图
          </el-button>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" plain size="big" @click="weekChart">
            按周趋势图
          </el-button>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" plain size="big" @click="monthChart">
            按月趋势图
          </el-button>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import api from '@/api'

export default {
  data() {
    return {
      placeAnOrderAvg: 0,
      publishApiMethodCount: 0,
      // 内网被申请使用的API的数量
      intranetApplyApiSuccessCount: 0,
      // 外网被申请的对接方案下的所有API数量，
      ExtranetApplyBizUnitApiSuccessCount: 0,
      // 内网申请API成功的申请请求数量
      intranetApplyApiSuccessRequestCount: 0,
      // 外网申请对接方案的数量*对接方案下的API
      ExtranetApplyBizUnitApiSuccessRequestCount: 0
    }
  },
  mounted() {
    this.initPlaceAnOrderAvg()
    this.initPublishApiMethodCount()
    this.initIntranetExtranetApplySuccessApiCount()
    this.initIntranetExtranetApiApplySuccessCount()
  },
  methods: {
    minuteChart() {
      window.open(
        'http://lop.kibana.jdl.com/app/kibana#/dashboard/ec55ec80-de0c-11eb-b5e1-030255e272be?_g=(refreshInterval%3A(display%3AOff%2Cpause%3A!f%2Cvalue%3A0)%2Ctime%3A(from%3Anow%2Fd%2Cmode%3Aquick%2Cto%3Anow%2Fd))',
        '_blank'
      )
    },
    dayChart() {
      window.open(
        'http://lop.kibana.jdl.com/app/kibana#/dashboard/aa0ba040-9da7-11eb-86b5-a1f84ef4f8c4?_g=(refreshInterval%3A(display%3AOff%2Cpause%3A!f%2Cvalue%3A0)%2Ctime%3A(from%3Anow%2FM%2Cmode%3Aquick%2Cto%3Anow%2FM))',
        '_blank'
      )
    },
    weekChart() {
      window.open(
        'http://lop.kibana.jdl.com/app/kibana#/dashboard/f7775e60-beb7-11eb-b5e1-030255e272be?_g=(refreshInterval%3A(display%3AOff%2Cpause%3A!f%2Cvalue%3A0)%2Ctime%3A(from%3Anow%2FM%2Cmode%3Aquick%2Cto%3Anow%2FM))',
        '_blank'
      )
    },
    monthChart() {
      window.open(
        'http://lop.kibana.jdl.com/app/kibana#/dashboard/dd1b4070-beb9-11eb-b5e1-030255e272be?_g=(refreshInterval%3A(display%3AOff%2Cpause%3A!f%2Cvalue%3A0)%2Ctime%3A(from%3Anow%2Fy%2Cmode%3Aquick%2Cto%3Anow%2Fy))',
        '_blank'
      )
    },
    async initPlaceAnOrderAvg() {
      const time = new Date().getTime()
      const params = {
        startTime: time - 7 * 24 * 60 * 60 * 1000,
        endTime: time
      }
      const response = await api.report
        .getPlaceAnOrderNum(params)
        .catch((error) => {
          throw error
        })
      if (response.code === 20000) {
        this.placeAnOrderAvg = parseInt(response.data / 7)
      }
    },
    async initPublishApiMethodCount() {
      const response = await api.report.findApiReleaseCount().catch((error) => {
        const { message } = error
        message && this.$message.error(message)
        throw new Error('initPublishApiMethodCount findApiReleaseCount')
      })
      const { data } = response
      this.publishApiMethodCount = data
    },
    async initIntranetExtranetApplySuccessApiCount() {
      const response = await api.report
        .getIntranetExtranetApplySuccessApiCount()
        .catch((error) => {
          throw error
        })
      if (response.code === 20000) {
        this.intranetApplyApiSuccessCount = response.data[0]
        this.ExtranetApplyBizUnitApiSuccessCount = response.data[1]
      }
    },
    async initIntranetExtranetApiApplySuccessCount() {
      const response = await api.report
        .getIntranetExtranetApiApplySuccessCount()
        .catch((error) => {
          throw error
        })
      if (response.code === 20000) {
        this.intranetApplyApiSuccessRequestCount = response.data[0]
        this.ExtranetApplyBizUnitApiSuccessRequestCount = response.data[1]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.operation-dashboard {
  margin-left: 30px;
  .my-title {
    margin-top: 40px;
    font-size: 24px;
    line-height: 40px;
    font-weight: bold;
  }
  .my-content {
    margin-top: 20px;
    margin-left: 50px;
    .my-span {
      border: 1px solid #d9d9d9;
      .my-data0 {
        color: #333333;
        text-align: center;
        font-size: 20px;
        margin-top: 35px;
        margin-bottom: 33px;
      }
      .my-data1 {
        color: #333333;
        text-align: center;
        font-size: 20px;
        margin-top: 35px;
        margin-bottom: 33px;
      }
      .my-data2 {
        color: #333333;
        text-align: center;
        font-size: 20px;
        margin-top: 15px;
        margin-bottom: 10px;
      }
      .my-name {
        color: #666666;
        text-align: center;
        font-size: 16px;
        margin-bottom: 10px;
      }
      .my-description0 {
        color: #999999;
        text-align: center;
        margin-bottom: 39px;
      }
      .my-description {
        color: #999999;
        text-align: center;
        margin-bottom: 10px;
      }
    }
  }
}
</style>
