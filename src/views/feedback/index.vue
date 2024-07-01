
<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="体验优化" name="first">
        <Content :items="items" :type="5" :page="page" :pageSize="pageSize" :total="total"></Content>
      </el-tab-pane>
      <el-tab-pane label="功能改进" name="second">
        <Content :items="items" :type="6" :page="page" :pageSize="pageSize" :total="total"></Content>
      </el-tab-pane>
      <el-tab-pane label="页面优化" name="third">
        <Content :items="items" :type="7" :page="page" :pageSize="pageSize" :total="total"></Content>
      </el-tab-pane>
      <el-tab-pane label="联系我们" name="fourth">
        <Content :items="items" :type="8" :page="page" :pageSize="pageSize" :total="total"></Content>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Content from './content'
import request from '../../utils/request'

export default {
  name: 'Feedback',
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
      }
    },
    first() {
      const url = '/feedback/rest/queryFeedbackList'
      request({
        url,
        method: 'get',
        params: { type: 5, netType: 2, rows: this.pageSize, page: this.page },
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
      const url = '/feedback/rest/queryFeedbackList'
      request({
        url,
        method: 'get',
        params: { type: 6, netType: 2, rows: this.pageSize, page: this.page },
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
      const url = '/feedback/rest/queryFeedbackList'
      request({
        url,
        method: 'get',
        params: { type: 7, netType: 2, rows: this.pageSize, page: this.page },
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
      const url = '/feedback/rest/queryFeedbackList'
      request({
        url,
        method: 'get',
        params: { type: 8, netType: 2, rows: this.pageSize, page: this.page },
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
    const url = '/feedback/rest/queryFeedbackList'
    request({
      url,
      method: 'get',
      params: { type: 5, netType: 2, rows: this.pageSize, page: this.page },
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

