
<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="ISV" name="first">
        <Content :items="items" :type="1" :page="page" :page-size="pageSize" :total="total" />
      </el-tab-pane>
      <el-tab-pane label="自研商家" name="second">
        <Content :items="items" :type="2" :page="page" :page-size="pageSize" :total="total" />
      </el-tab-pane>
      <!-- <el-tab-pane label="自营商家" name="third">
        <Content :items="items" :type="3" :page="page" :page-size="pageSize" :total="total" />
      </el-tab-pane> -->
      <el-tab-pane label="合作伙伴" name="fourth">
        <Content :items="items" :type="4" :page="page" :page-size="pageSize" :total="total" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Content from './content'
import request from '../../utils/request'

export default {
  name: 'Bussiness',
  components: {
    Content
  },
  data() {
    return {
      activeName: 'first',
      flag: false,
      items: [],
      netType: 2,
      type: 1,
      pageSize: 10,
      page: 1,
      total: 100
    }
  },
  mounted() {
    const url = '/supplierIsv/rest/querySupplierIsvList'
    request({
      url,
      method: 'get',
      params: { type: 1, rows: this.pageSize, page: this.page }
    })
      .then((res) => {
        this.items = res.data.rows
        this.total = res.data.total
        this.pageSize = res.data.pageSize
        this.page = res.data.page
      })
      .catch((e) => {
        console.log('错误', e)
      })
  },
  methods: {
    handleClick(tab, event) {
      if (tab.name == 'first') {
        this.first()
      } else if (tab.name == 'second') {
        this.second()
      } else if (tab.name == 'third') {
        this.third()
      }else if (tab.name == 'fourth') {
        this.fourth()
      }
    },
    first() {
      const url = '/supplierIsv/rest/querySupplierIsvList'
      request({
        url,
        method: 'get',
        params: { type: 1, rows: this.pageSize, page: this.page }
      })
        .then((res) => {
          this.items = res.data.rows
          this.total = res.data.total
          this.pageSize = res.data.pageSize
          this.page = res.data.page
        })
        .catch((e) => {
          console.log('错误', e)
        })
    },
    second() {
      const url = '/supplierIsv/rest/querySupplierIsvList'
      request({
        url,
        method: 'get',
        params: { type: 2, rows: this.pageSize, page: this.page }
      })
        .then((res) => {
          this.items = res.data.rows
          this.total = res.data.total
          this.pageSize = res.data.pageSize
          this.page = res.data.page
        })
        .catch((e) => {
          console.log('错误', e)
        })
    },
    third() {
      const url = '/supplierIsv/rest/querySupplierIsvList'
      request({
        url,
        method: 'get',
        params: { type: 3, rows: this.pageSize, page: this.page }
      })
        .then((res) => {
          this.items = res.data.rows
          this.total = res.data.total
          this.pageSize = res.data.pageSize
          this.page = res.data.page
        })
        .catch((e) => {
          console.log('错误', e)
        })
    },
    fourth() {
      const url = '/supplierIsv/rest/querySupplierIsvList'
      request({
        url,
        method: 'get',
        params: { type: 4, rows: this.pageSize, page: this.page }
      })
        .then((res) => {
          this.items = res.data.rows
          this.total = res.data.total
          this.pageSize = res.data.pageSize
          this.page = res.data.page
        })
        .catch((e) => {
          console.log('错误', e)
        })
    }
  }
}
</script>
