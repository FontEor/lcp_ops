<template>
  <div class="kk-wrap">
    <el-form label-width="120px" :model="form">
      <el-row :gutter="16" type="flex" justify="end" style="flex-wrap: wrap; flex-direction: row">
        <el-col :span="8">
          <el-form-item label="客户公司名称">
            <el-input v-model="form.companyName" placeholder="输入公司名称" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="归属省区">
            <el-select v-model="form.belongProvinceList" placeholder="请选择归属省区" multiple clearable style="width: 100%">
              <el-option v-for="item in belongProvinceList" :key="item.code" :value="item.name" :label="item.name" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="业务范围">
            <el-select v-model="form.business" placeholder="请选择业务范围" clearable style="width: 100%">
              <el-option v-for="item in businessList" :key="item.code" :value="item.code" :label="item.name" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="需求承接人">
            <el-input v-model="form.successor" placeholder="请输入承接人erp" clearable />
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
        <el-col :span="8">
          <el-form-item label="需求结束时间">
            <el-date-picker v-model="form.completeTime" clearable type="datetimerange" align="right" range-separator="至"
                            start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']" style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="16" type="flex" justify="space-between" style="flex-wrap: wrap; flex-direction: row">
        <el-col :span="8">
          <el-form-item label="已达到状态">
            <el-select v-model="form.dockingStatusList" placeholder="请选择已达到状态" multiple clearable style="width: 100%">
              <el-option v-for="item in currentStatusList" :key="item.value" :value="item.value" :label="item.label" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <div style="float: right">
            <el-button type="primary" @click="handleQueryList">查 询</el-button>
            <el-button type="primary" :loading="exportLoding" @click="handleExport">导出报表</el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>

    <TableList :table-data.sync="tableData">
      <Pagination :current-page.sync="pagination.pageNumb" :page-size.sync="pagination.pageSize"
                  :total.sync="pagination.total" :reload-table-data="handleQueryList"
      />
    </TableList>
  </div>
</template>

<script>
import TableList from '@/views/operationReport/dockingKk/components/tableList.vue'
import Pagination from '@/components/Pagination.vue'
import lcp from '@/api/lcp/index'
import _ from 'lodash'
import dayjs from 'dayjs'

export default {
  name: 'DockingList',
  components: {
    Pagination,
    TableList
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
        companyName: '',
        belongProvinceList: undefined,
        business: undefined,
        successor: undefined,
        startTime: undefined,
        completeTime: undefined,
        dockingStatusList: undefined,
        completeTimeBegin: '',
        completeTimeEnd: '',
        startTimeBegin: '',
        startTimeEnd: ''
      },
      currentStatusList: [
        { label: '需求发起', value: 0 },
        { label: '注册账号', value: 1 },
        { label: '资质认证', value: 2 },
        { label: '创建应用', value: 3 },
        { label: '订阅方案', value: 4 },
        { label: '首次调用接口', value: 5 },
        { label: '方案连续7天调用量大于10', value: 6 }
      ],
      pagination: {
        pageNumb: 1,
        pageSize: 10,
        total: 0
      },
      tableData: [],
      tableLoading: false,
      exportLoding: false
    }
  },
  computed: {},
  mounted() {
    this.handleQueryList()
  },

  methods: {
    async handleExport() {
      this.exportLoding = true
      const data = this.formatData(this.form, this.pagination)
      await lcp.kkBoardApi.dockingKk.export(data)
        .then((res) => {
          const { data: blob } = res
          if (blob.size !== 0) {
            const url = window.URL.createObjectURL(new Blob([blob], {
              type: 'application/vnd.ms-excel'
            }))

            const link = document.createElement('a')
            link.href = url
            const currentDate = dayjs()
            const formattedDate = currentDate.format('YYYY-MM-DD_HH-mm-ss')
            link.setAttribute('download', `对接明细表_${formattedDate}.xlsx`)
            document.body.appendChild(link)
            link.click()
            this.exportLoding = false
          } else {
            this.$message.error('文件导出失败')
            this.exportLoding = false
          }
        })
        .catch((error) => {
          this.exportLoding = false
          this.$message.error('文件导出失败')
          console.log('error', error)
        })
    },
    async handleQueryList(event) {
      if (event) {
        this.pagination.pageNumb = 1
      }
      // pageList
      const data = this.formatData(this.form, this.pagination)
      await lcp.kkBoardApi.dockingKk.pageList(data)
        .then((res) => {
          if (res.code === 20000) {
            // 获取optionsList
            const { data } = res
            const { list, total } = data
            this.tableData = list
            this.pagination.total = total
            console.log(res)
          }
        })
        .catch((error) => {
          throw new Error(`edit, ${error}`)
        })
    },
    formatData(form, pagination) {
      const data = {
        ...form,
        pageNumb: pagination.pageNumb,
        pageSize: pagination.pageSize
      }
      if (data.startTime) {
        data.startTimeBegin = data.startTime[0] || ''
        data.startTimeEnd = data.startTime[1] || ''
        delete data.startTime
      }
      if (data.completeTime) {
        data.completeTimeBegin = data.completeTime[0] || ''
        data.completeTimeEnd = data.completeTime[1] || ''
        delete data.completeTime
      }
      return data
    }
  }
}
</script>

<style lang="scss" scoped></style>
