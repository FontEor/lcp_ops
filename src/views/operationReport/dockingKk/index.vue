<template>
  <div class="commentStatistics">
    <div class="app-container">
      <el-tabs v-model="activeName">
        <el-tab-pane label="对接明细表" name="DockingList">
          <DockingList v-if="activeName === 'DockingList'" :belong-province-list="belongProvinceList" :business-list="businessList" />
        </el-tab-pane>
        <el-tab-pane label="省区进展表" name="AreaList">
          <AreaList v-if="activeName === 'AreaList'" :belong-province-list="belongProvinceList" :business-list="businessList" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import DockingList from './dockingList.vue'
import AreaList from './areaList.vue'
import lcp from '@/api/lcp/index'

export default {
  name: 'DockingKk',
  components: { DockingList, AreaList },
  data() {
    return {
      activeName: 'DockingList',
      belongProvinceList: [],
      businessList: []
    }
  },
  mounted() {
    this.getOptionsData()
  },
  methods: {
    async getOptionsData() {
      await lcp.kkBoardApi.dockingKk.baseInfoList()
        .then((res) => {
          if (res.code === 20000) {
            const { data } = res
            const { provinceList, businesses } = data
            this.belongProvinceList = provinceList
            this.businessList = businesses
          }
        })
        .catch((error) => {
          throw new Error(`edit, ${error}`)
        })
    }
  }
}
</script>

<style lang="scss" scoped></style>
