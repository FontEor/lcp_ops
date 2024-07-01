<template>
  <div class="kk-wrap">
    <el-form label-width="100px" :model="form">
      <el-row :gutter="16" type="flex" justify="space-between" style="flex-wrap: wrap; flex-direction: row">
        <el-col :span="6">
          <el-form-item label="归属省区">
            <el-select v-model="form.belongProvince" multiple placeholder="请选择归属省区" clearable style="width: 100%">
              <el-option v-for="item in belongProvinceList" :key="item.code" :value="item.name" :label="item.name" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="业务范围">
            <el-select v-model="form.business" placeholder="请选择业务范围" clearable style="width: 100%">
              <el-option v-for="item in businessList" :key="item.code" :value="item.code" :label="item.name" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="需求发起时间">
            <el-date-picker v-model="form.startTime" clearable type="datetimerange" align="right" range-separator="至"
                            start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']" style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <div style="float:right;margin-bottom:22px;">
            <el-button type="primary" @click="serachAreaList">查 询</el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>

    <el-table :data="tableData">
      <el-table-column label="归属省区" prop="belongProvince" />
      <el-table-column label="业务范围" prop="business" width="100px">
        <template slot-scope="scope">
          {{ scope.row.business | formatBusiness }}
        </template>
      </el-table-column>
      <el-table-column prop="successor" label="省区接口人" width="240px">
        <template slot-scope="scope">
          <div v-for="item in scope.row.successorList" :key="item">
            {{ item }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="accumulativeDemandNumber" label="累计对接需求数" />
      <el-table-column prop="finishNumber" label="已完成对接需求数" />
      <el-table-column prop="finishAverageElapseTime" label="平均需求耗时" />
      <el-table-column prop="unfinishNumber" label="未完成对接需求数" />
      <el-table-column label="未完成对接的需求中，达到以下状态的需求数量">
        <el-table-column prop="qualificationPassUnfinishNumber" label="资质认证完成" />
        <el-table-column prop="appPassUnfinishNumber" label="创建应用完成" />
        <el-table-column prop="subscriptPassUnfinishNumber" label="订阅方案完成" />
        <el-table-column prop="interfaceCallUnfinishNumber" label="接口调用完成" />
        <el-table-column prop="demandApprovalFinish" label="需求完成申请发起" />
        <el-table-column prop="salesApprovalFinish" label="销售审批完成" />
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import lcp from '@/api/lcp/index'
import { cloneDeep } from 'lodash'

export default {
  name: 'AreaList',
  filters: {
    formatBusiness(value) {
      const hashMap = new Map()
        .set(1, '快递')
        .set(2, '快运')
      return hashMap.get(value) || ''
    }
  },
  props: {
    belongProvinceList: {
      type: Array,
      default: () => []
    },
    businessList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      form: {
        belongProvince: [],
        business: null,
        startTime: null
      },
      tableData: []
    }
  },
  computed: {},
  mounted() {
    this.serachAreaList()
  },
  methods: {
    async serachAreaList() {
      const SearchData = cloneDeep(this.form)
      if (SearchData.startTime) {
        SearchData.fromTime = SearchData.startTime[0] || ''
        SearchData.toTime = SearchData.startTime[1] || ''
        delete SearchData.startTime
      } else {
        SearchData.fromTime = ''
        SearchData.toTime = ''
        delete SearchData.startTime
      }
      if (!SearchData.belongProvince) {
        SearchData.belongProvince = []
      }

      const { code, data, message } = await lcp.kkBoardApi.dockingKk.process(SearchData)
      if (code === 20000) {
        this.tableData = data
        this.tableData.forEach(item => {
          item.successorList = item.successor.split(',')
        })
      } else {
        this.$message.error(message)
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
