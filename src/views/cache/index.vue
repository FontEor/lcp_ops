
<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="内网应用" name="first">
        <Content :items="items" :type="1" :page="page" :pageSize="pageSize" :total="total"></Content>
      </el-tab-pane>
      <el-tab-pane label="外网应用" name="second">
        <Content :items="items" :type="2" :page="page" :pageSize="pageSize" :total="total"></Content>
      </el-tab-pane>
      <el-tab-pane label="ISV应用" name="third">
        <Content :items="items" :type="3" :page="page" :pageSize="pageSize" :total="total"></Content>
      </el-tab-pane>
      <el-tab-pane label="商家自研应用" name="fourth">
        <Content :items="items" :type="4" :page="page" :pageSize="pageSize" :total="total"></Content>
      </el-tab-pane>
      <el-tab-pane label="合作伙伴应用" name="fifth" :lazy="true">
        <Content :items="items" :type="5" :page="page" :pageSize="pageSize" :total="total"></Content>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Content from './content'
import request from '../../utils/request'

export default {
  name: 'Cache',
  components: {
    Content,
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
      total: 100,
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
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
      }
    },
    first() {
      const url = '/app/rest/queryAppList'
      request({
        url,
        method: 'get',
        params: { type: 1, rows: this.pageSize, page: this.page },
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
      const url = '/app/rest/queryAppList'
      request({
        url,
        method: 'get',
        params: { type: 2, rows: this.pageSize, page: this.page },
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
      const url = '/app/rest/queryAppList'
      request({
        url,
        method: 'get',
        params: { type: 3, rows: this.pageSize, page: this.page },
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
      const url = '/app/rest/queryAppList'
      request({
        url,
        method: 'get',
        params: { type: 4, rows: this.pageSize, page: this.page },
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
    fifth() {
      const url = '/app/rest/queryAppList'
      request({
        url,
        method: 'get',
        params: { type: 5, rows: this.pageSize, page: this.page },
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
  },
  mounted() {
    const url = '/app/rest/queryAppList'
    request({
      url,
      method: 'get',
      params: { type: 1, rows: this.pageSize, page: this.page },
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
}
</script>


