

<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="平台公告" name="first">
        <Content :items="items" :msgType="1" :page="page" :pageSize="pageSize" :total="total"></Content>
      </el-tab-pane>
      <!-- <el-tab-pane label="api消息" name="second">
        <Content :items="items" :msgType="2" :page="page" :pageSize="pageSize" :total="total"></Content>
      </el-tab-pane>-->
    </el-tabs>
  </div>
</template>

<script>
import Content from './content'
import request from '../../utils/request'

export default {
  name: 'Notice',
  components: {
    Content,
  },
  data() {
    return {
      activeName: 'first',
      flag: false,
      items: [],
      netType: 2,
      msgType: 1,
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
      }
    },
    first() {
      const url = '/message/rest/queryMessageList'
      request({
        url,
        method: 'get',
        params: {
          msgType: 1,
          netType: 2,
          rows: this.pageSize,
          page: this.page,
        },
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
      const url = '/message/rest/queryMessageList'
      request({
        url,
        method: 'get',
        params: {
          msgType: 2,
          netType: 2,
          rows: this.pageSize,
          page: this.page,
        },
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
    const url = '/message/rest/queryMessageList'
    request({
      url,
      method: 'get',
      params: { msgType: 1, netType: 2, rows: this.pageSize, page: this.page },
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


