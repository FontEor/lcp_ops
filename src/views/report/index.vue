
<template>
  <div class="app-container">
    <el-tabs v-model="active" @tab-click="handleClick">
      <el-tab-pane label="总体数量" name="first">
        <el-table :data="itemsTotal" style="width: 100%">
          <el-table-column
            label="序号"
            type="index"
            :index="indexMethod"
          />
          <el-table-column label="名称" prop="name" />
          <el-table-column label="总体数量" prop="totalNum" />
          <el-table-column
            label="本周新增数量"
            prop="weekDayNum"
          />
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="开发商数量" name="second">
        <chart
          :category="category"
          :legend="legend"
          :seriesname="seriesname"
          :seriesdata="seriesdata"
          :seriesname_line="seriesname_line"
          :seriesdata_line="seriesdata_line"
        />
      </el-tab-pane>
      <el-tab-pane label="API数量" name="third">
        <el-select
          v-model="List.id"
          clearable
          placeholder="请先选择开发商"
          class="filter-item"
          style="width: 280px; margin-left: 120px; margin-top: 10px"
          @focus="selectSearch"
          @change="selectChange(List.id)"
        >
          <el-option
            v-for="item in List"
            :key="item.id"
            :value="item.id"
            :label="item.nameAndCode"
          />
        </el-select>
        <chart
          :category="category"
          :legend="legend"
          :seriesname="seriesname"
          :seriesdata="seriesdata"
          :seriesname_line="seriesname_line"
          :seriesdata_line="seriesdata_line"
        />
      </el-tab-pane>
      <el-tab-pane label="开发者数量" name="fourth">
        <chart
          :category="category"
          :legend="legend"
          :seriesname="seriesname"
          :seriesdata="seriesdata"
          :seriesname_line="seriesname_line"
          :seriesdata_line="seriesdata_line"
        />
      </el-tab-pane>
      <el-tab-pane label="应用数量" name="fifth">
        <el-select
          v-model="List.id"
          clearable
          placeholder="请先选择开发商"
          class="filter-item"
          style="width: 280px; margin-left: 120px; margin-top: 10px"
          @focus="selectSearchApp"
          @change="selectAPPChange(List.id)"
        >
          <el-option
            v-for="item in List"
            :key="item.id"
            :value="item.id"
            :label="item.nameAndCode"
          />
        </el-select>
        <chart
          :category="category"
          :legend="legend"
          :seriesname="seriesname"
          :seriesdata="seriesdata"
          :seriesname_line="seriesname_line"
          :seriesdata_line="seriesdata_line"
        />
      </el-tab-pane>
      <el-tab-pane label="API申请数量" name="sixth">
        <el-select
          v-model="List.id"
          clearable
          placeholder="请先选择开发商"
          class="filter-item"
          style="width: 280px; margin-left: 120px; margin-top: 10px"
          @focus="selectSearchApply"
          @change="selectApplyChange(List.id)"
        >
          <el-option
            v-for="item in List"
            :key="item.id"
            :value="item.id"
            :label="item.nameAndCode"
          />
        </el-select>
        <chart
          :category="category"
          :legend="legend"
          :seriesname="seriesname"
          :seriesdata="seriesdata"
          :seriesname_line="seriesname_line"
          :seriesdata_line="seriesdata_line"
        />
      </el-tab-pane>
      <el-tab-pane label="API调用量" name="serven">
          <el-form  :inline="true">
          <el-form-item label="API">
            <el-input v-model="apiName" placeholder />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="searchTable">
          <el-table-column label="序号" align="center" type="index" />
          <el-table-column label="api" align="center" prop="api" />
          <el-table-column label="中文名称" align="center" prop="apiName" />
          <el-table-column label="所属开发商名称" align="center" prop="supplierName" />
          <el-table-column label="近7日调用量" align="center" prop="callNum" />
          <el-table-column label="申请（审批通过）使用量" align="center" prop="applyInfoNum" />
        </el-table>
        <div v-if="searchTable && searchTable.length !== 0" style="margin-top: 20px;text-align: center;">
          <el-pagination
            background
            layout="prev, pager, next, jumper"
            :current-page.sync="page"
            :page-size="pageSize"
            :total="total"
            @current-change="handleCurrentChange"
            @prev-click="prevClick"
            @next-click="nextClick"
          />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import echarts from 'echarts' // 引入主题
import Chart from './chart'
import request from '../../utils/request'
require('echarts/theme/shine')

// const Chart = ()=>import("./chart")
export default {
  components: {
    Chart
  },
  data() {
    return {
      active: 'first',
      chartLine: null,
      category: [],
      legend: [],
      seriesname: '',
      seriesdata: [],
      seriesname_line: '',
      seriesdata_line: [],
      itemsTotal: [],
      List: [],
      apiCallData:[],
      formInline: {},
      searchTable: [],
      apiName: '',
      page: 0,
      pageSize: 10,
      total: 100
    }
  },
  mounted() {
    const url = '/operation/rest/queryTotalNum'
    request({
      url,
      method: 'get',
      params: {}
    })
      .then((res) => {
        this.itemsTotal = res.data
      })
      .catch((e) => {
        console.log('错误', e)
      })
  },
  methods: {
    selectSearch() {
      const url = '/operation/rest/getSupplierList'
      request({
        url,
        method: 'get',
        params: {}
      })
        .then((res) => {
          this.List = res.data
          console.log(this.List)
        })
        .catch((e) => {
          console.log('错误', e)
        })
    },
    selectChange(supplierId) {
      console.log('我选择的id', supplierId)
      this.getBarApiData(supplierId)
      this.getLineApiData(supplierId)
    },
    selectSearchApp() {
      const url = '/operation/rest/getSupplierList'
      request({
        url,
        method: 'get',
        params: {}
      })
        .then((res) => {
          this.List = res.data
          console.log(this.List)
        })
        .catch((e) => {
          console.log('错误', e)
        })
    },
    selectAPPChange(supplierId) {
      console.log('我选择的id', supplierId)
      this.getBarAppData(supplierId)
      this.getLineAppData(supplierId)
    },
    selectSearchApply() {
      const url = '/operation/rest/getSupplierList'
      request({
        url,
        method: 'get',
        params: {}
      })
        .then((res) => {
          this.List = res.data
          console.log(this.List)
        })
        .catch((e) => {
          console.log('错误', e)
        })
    },
    selectApplyChange(supplierId) {
      console.log('我选择的id', supplierId)
      this.getBarApplyData(supplierId)
      this.getLineApplyData(supplierId)
    },
    handleClick(tab, event) {
      // console.log(tab, event);
      if (tab.name == 'first') {
        this.first()
      } else if (tab.name == 'second') {
        this.second()
      } else if (tab.name == 'third') {
        this.third()
      } else if (tab.name == 'fourth') {
        this.fourth()
      } else if (tab.name == 'fifth') {
        this.fifth()
      } else if (tab.name == 'sixth') {
        this.sixth()
      } else if(tab.name == 'serven'){
        this.serven()
      }
    },
    indexMethod(index) {
      return index
    },
    first() {},
    second() {
      this.getBarData()
      this.getLineData()
    },
    third() {
      this.getBarApiData(0)
      this.getLineApiData(0)
    },
    fourth() {
      this.getBarDevData()
      this.getLineDevData()
    },
    fifth() {
      this.getBarAppData(0)
      this.getLineAppData(0)
    },
    sixth() {
      this.getBarApplyData(0)
      this.getLineApplyData(0)
    },
    serven(){
      this.getApiData()
    },
    getBarData() {
      const url = '/operation/rest/querySupplierNumBar'
      request({
        url,
        method: 'get',
        params: {}
      })
        .then((res) => {
          this.category = res.data.category
          this.legend = res.data.legend
          this.seriesname = res.data.series[0].name
          this.seriesdata = res.data.series[0].data
        })
        .catch((e) => {
          console.log('错误', e)
        })
    },
    getLineData() {
      const url = '/operation/rest/querySupplierNumLine'
      request({
        url,
        method: 'get',
        params: {}
      })
        .then((res) => {
          this.category_line = res.data.category
          this.legend_line = res.data.legend
          this.seriesname_line = res.data.series[0].name
          this.seriesdata_line = res.data.series[0].data
        })
        .catch((e) => {
          console.log('错误', e)
        })
    },
    getBarApiData(supplierId) {
      const url = '/operation/rest/queryApiReleaseNumBar'
      request({
        url,
        method: 'get',
        params: { supplierId }
      })
        .then((res) => {
          this.category = res.data.category
          this.legend = res.data.legend
          this.seriesname = res.data.series[0].name
          this.seriesdata = res.data.series[0].data
        })
        .catch((e) => {
          console.log('错误', e)
        })
    },
    getLineApiData(supplierId) {
      const url = '/operation/rest/queryApiReleaseNumLine'
      request({
        url,
        method: 'get',
        params: { supplierId }
      })
        .then((res) => {
          this.category_line = res.data.category
          this.legend_line = res.data.legend
          this.seriesname_line = res.data.series[0].name
          this.seriesdata_line = res.data.series[0].data
        })
        .catch((e) => {
          console.log('错误', e)
        })
    },
    getBarDevData() {
      const url = '/operation/rest/queryUserNumBar'
      request({
        url,
        method: 'get',
        params: {}
      })
        .then((res) => {
          this.category = res.data.category
          this.legend = res.data.legend
          this.seriesname = res.data.series[0].name
          this.seriesdata = res.data.series[0].data
        })
        .catch((e) => {
          console.log('错误', e)
        })
    },
    getLineDevData() {
      const url = '/operation/rest/queryUserNumLine'
      request({
        url,
        method: 'get',
        params: {}
      })
        .then((res) => {
          this.category_line = res.data.category
          this.legend_line = res.data.legend
          this.seriesname_line = res.data.series[0].name
          this.seriesdata_line = res.data.series[0].data
        })
        .catch((e) => {
          console.log('错误', e)
        })
    },
    getBarAppData(supplierId) {
      const url = '/operation/rest/queryAppInfoNumBar'
      request({
        url,
        method: 'get',
        params: { supplierId }
      })
        .then((res) => {
          this.category = res.data.category
          this.legend = res.data.legend
          this.seriesname = res.data.series[0].name
          this.seriesdata = res.data.series[0].data
        })
        .catch((e) => {
          console.log('错误', e)
        })
    },
    getLineAppData(supplierId) {
      const url = '/operation/rest/queryAppInfoNumLine'
      request({
        url,
        method: 'get',
        params: { supplierId }
      })
        .then((res) => {
          this.category_line = res.data.category
          this.legend_line = res.data.legend
          this.seriesname_line = res.data.series[0].name
          this.seriesdata_line = res.data.series[0].data
        })
        .catch((e) => {
          console.log('错误', e)
        })
    },
    getBarApplyData(supplierId) {
      const url = '/operation/rest/queryApplyInfoNumBar'
      request({
        url,
        method: 'get',
        params: { supplierId }
      })
        .then((res) => {
          this.category = res.data.category
          this.legend = res.data.legend
          this.seriesname = res.data.series[0].name
          this.seriesdata = res.data.series[0].data
        })
        .catch((e) => {
          console.log('错误', e)
        })
    },
    getLineApplyData(supplierId) {
      const url = '/operation/rest/queryApplyInfoNumLine'
      request({
        url,
        method: 'get',
        params: { supplierId }
      }).then((res) => {
          this.category_line = res.data.category
          this.legend_line = res.data.legend
          this.seriesname_line = res.data.series[0].name
          this.seriesdata_line = res.data.series[0].data
        })
        .catch((e) => {
          console.log('错误', e)
        })
    },
    handleCurrentChange(val) {
      const url = '/operation/rest/queryApiNum'
      request({
        url,
        method: 'get',
        params: {
          page: val
        }
      }).then((res) => {
          this.searchTable = res.data.rows
          this.total = res.data.total
          this.pageSize = res.data.pageSize
          this.page = res.data.page
        })
        .catch((e) => {
          console.log('改变当前页错误', e)
        })
    },
    prevClick() {
      const url = '/operation/rest/queryApiNum'
      request({
        url,
        method: 'get',
        params: {
          rows: this.pageSize,
          page: this.page - 1
        }
      })
        .then((res) => {
          this.searchTable = res.data.rows
          this.total = res.data.total
          this.pageSize = res.data.pageSize
          this.page = res.data.page
        })
        .catch((e) => {
          console.log('请求下一页错误', e)
        })
    },
    nextClick() {
      const url = '/operation/rest/queryApiNum'
      request({
        url,
        method: 'get',
        params: {
          rows: this.pageSize,
          page: this.page + 1
        }
      }).then((res) => {
          this.appSearchTable = res.data.rows
          this.total = res.data.total
          this.pageSize = res.data.pageSize
          this.page = res.data.page
        })
        .catch((e) => {
          console.log('请求下一页错误', e)
        })
    },
    onSubmit(){
       this.getApiData(this.apiName)
    },
    getApiData(apiName){
      const url = '/operation/rest/queryApiNum'
      request({
        url,
        method: 'get',
        params:{apiName:this.apiName}
      }).then((res) => {
        this.searchTable = res.data.rows
        this.total = res.data.total
        this.pageSize = res.data.pageSize
        this.page = res.data.page
      })
      .catch((e) => {
        console.log('按钮提交错误：', e)
      })
    }
  }
}
</script>