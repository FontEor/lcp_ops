<template>
  <el-tabs v-model="activeName" class="app-container" @tab-click="handleClick">
    <el-tab-pane label="商家量" name="merchantData">
      <merchant-data v-if="activeName === 'merchantData'" />
    </el-tab-pane>
    <el-tab-pane label="订单量" name="order">
      <order-data v-if="activeName == 'order'" />
    </el-tab-pane>
    <el-tab-pane label="开发团队量" name="developers">
      <developer-data v-if="activeName === 'developers'" />
    </el-tab-pane>
    <el-tab-pane label="用户体验" name="NPS">
      <user-experience-data v-if="activeName === 'NPS'" />
    </el-tab-pane>
    <el-tab-pane label="服务覆盖率" name="serviceCoverage">
      <service-coverage-data v-if="activeName === 'serviceCoverage'" />
    </el-tab-pane>
    <el-tab-pane label="2021监控看板" name="2021-okr">
      <TwoThousandTwentyOne v-if="activeName === '2021-okr'" />
    </el-tab-pane>
    <el-tab-pane label="对接周期" name="dockingCycle">
      <DockingCycle v-if="activeName === 'dockingCycle'" />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import MerchantData from './merchant/MerchantData'
import OrderData from './order/OrderData'
import DeveloperData from './developers/DeveloperData'
import UserExperienceData from './userexperience/UserExperienceData'
import ServiceCoverageData from './servicecoverage/ServiceCoverageData'
import TwoThousandTwentyOne from './oldPage/TwoThousandTwentyOne'
import DockingCycle from '@/views/operationReport/operationDashboard/dockingCycle/index.vue'
export default {
  components: {
    ServiceCoverageData,
    UserExperienceData,
    DeveloperData,
    OrderData,
    MerchantData,
    TwoThousandTwentyOne,
    DockingCycle
  },
  data() {
    return {
      activeName: 'merchantData'
    }
  },
  methods: {
    handleClick() {
      console.log(this.activeName)
    }
  }
}
</script>
