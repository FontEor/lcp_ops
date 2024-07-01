<template>
  <div>
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="应用编号/名称">
        <el-input v-model="formInline.queryLikeCodeOrName" placeholder />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
        <el-button type="primary" @click="updateAllCache">刷新所有应用缓存</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="itemsClone" style="width: 100%">
      <el-table-column label="序号" type="index" :index="indexMethod" />
      <el-table-column label="应用编号" prop="code" />
      <el-table-column label="应用密钥" prop="secret" />
      <el-table-column label="应用名称" prop="name" />
      <el-table-column label="应用类型" prop="type">
        <template slot-scope="{ row }">{{ typeRender(row.type) }}</template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime"></el-table-column>
      <el-table-column label="创建人" prop="createUser" />
      <!-- <el-table-column label="一致性" prop="isEqual" align="center">
        <template slot-scope="{ row }">
          <el-button
            plain
            :type="row.isEqual ? 'primary' : 'danger'"
            @click="checkEquality(row)"
          >{{ row.isEqual ? "相同" : "不同" }}</el-button>
          <el-dialog title="查看一致性" :visible.sync="dialogEqualityVisible">
            <el-table :data="equalityTable">
              <el-table-column label="序号" type="index"></el-table-column>
              <el-table-column prop="db" label="数据库"></el-table-column>
              <el-table-column prop="cache" label="缓存"></el-table-column>
            </el-table>
          </el-dialog>
        </template>
      </el-table-column> -->
      <el-table-column label="操作" align="center">
        <template slot-scope="scope" style="white-space: nowrap">
          <el-button-group>
            <el-button
              size="mini"
              plain
              type="primary"
              @click="handleEdit(scope.$index, scope.row)"
            >查看缓存</el-button>
            <el-button
              size="mini"
              type="primary"
              plain
              @click="handleUpdateCache(scope.$index, scope.row)"
            >刷新缓存</el-button>
          </el-button-group>
          <el-dialog
            width="60%"
            height="100%"
            :title="dailogTitleType"
            :visible.sync="dialogChangeFormVisible"
          >
            <el-form :model="form" :inline="true">
              <el-form-item label="服务名称">
                <el-input v-model="form.app" placeholder />
              </el-form-item>
              <el-form-item label="调用方编码">
                <el-input v-model="form.clientAppKey" placeholder />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="searchApp">查询</el-button>
              </el-form-item>
            </el-form>
            <el-table :data="itemsRedis" style="width: 100%">
              <el-table-column prop="app" label="服务名称" width="180" />
              <el-table-column prop="alias" label="服务别名" width="180" />
              <el-table-column prop="clientAppKey" label="调用方编码">
                <!-- <template slot-scope="scope">
                  <template v-for="item in scope.row.appInfoList">
                    <template v-for="clientAppKey in item.clientAppKey">{{ clientAppKey }}</template>
                  </template>
                </template>-->
              </el-table-column>
              <el-table-column prop="clientAppSecret" label="调用方密钥" />
            </el-table>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogChangeFormVisible = false">关闭</el-button>
            </div>
            <div v-if="itemsRedis.length !== 0" class="pagination-wrap">
              <el-pagination
                background
                :current-page.sync="editPage"
                :page-size="size"
                layout="prev, pager, next, jumper"
                :total="editTotal"
                @current-change="handleCurrentChangeRedis"
                @prev-click="prevClickRedis"
                @next-click="nextClickRedis"
              />
            </div>
          </el-dialog>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="itemsClone.length !== 0" class="pagination-wrap">
      <el-pagination
        background
        :current-page.sync="pageClone"
        :page-size="pageSize"
        layout="prev, pager, next, jumper"
        :total="totalClone"
        @current-change="handleCurrentChange"
        @prev-click="prevClick"
        @next-click="nextClick"
      />
    </div>
  </div>
</template>

<script>
import request from '../../utils/request'

export default {
  name: 'Content',
  props: {
    items: Array,
    type: Number,
    page: Number,
    pageSize: Number,
    total: Number,
  },
  data() {
    return {
      equalityTable: [],
      itemsClone: [],
      totalClone:1,
      pageClone:1,
      itemsRedis: [],
      updateId: 1,
      flag: false,
      netType: 2,
      formInline: {
        radio: 2,
        queryLikeCodeOrName: '',
      },
      form: {
        app: '',
        clientAppKey: '',
      },
      dialogEqualityVisible: false,
      dialogFormVisible: false,
      dialogChangeFormVisible: false,
      dialogVisible: false,
      dialogVisibleDel: false,
      dailogTitleType: '',
      msg: '',
      value: '',
      form: {},
      temp: {},
      formChange: {},
      formLabelWidth: '156px',
      size: 10,
      editPage: 1,
    }
  },
  methods: {
    // checkEquality(row) {
    //   console.log(row.code)
    //   this.dialogEqualityVisible = true
    //   const url = '/app/rest/getDiffByCode'
    //   request({
    //     url,
    //     method: 'get',
    //     params: {
    //       code: row.code,
    //     },
    //   })
    //     .then((res) => {
    //       console.log(res, 111111111111111)
    //       this.equalityTable = res.data
    //     })
    //     .catch((e) => {
    //       console.log('错误', e)
    //     })
    // },
    searchApp() {
      console.log('this.updateId', this.updateId)
      const url = '/app/rest/getAppRedisDetailById'
      request({
        url,
        method: 'get',
        params: {
          id: this.updateId,
          page: 1,
          pageSize: 10,
          app: this.form.app,
          clientAppKey: this.form.clientAppKey,
        },
      })
        .then((res) => {
          this.itemsRedis = res.data.rows
          this.editPage = res.data.page
          this.size = res.data.pageSize
          this.editTotal = res.data.total
        })
        .catch((e) => {
          console.log('错误', e)
        })
    },
    typeRender(type) {
      if (type == 1) {
        return '内网应用'
      } else if (type == 2) {
        return '外网应用'
      } else if (type == 3) {
        return 'ISV应用'
      } else if (type == 4) {
        return '商家自研应用'
      } else if (type == 5) {
        return '合作伙伴应用'
      }
    },
    formatTime(val) {
      const date = val.split('T')[0]
      const time = val.split('T')[1]
      const ctime = time.split('.')[0]
      return date + ' ' + ctime
    },
    closedReset() {
      console.log('清空表单数据')
      this.$nextTick(() => {
        this.$refs.form.resetFields()
      })
    },
    updateAllCache() {
      const url = '/app/rest/refreshRedisAll'
      request({
        url,
        method: 'get',
        params: {
          type: this.type,
          // netType: this.netType,
          rows: this.pageSize,
          page: 1,
        },
      })
        .then((res) => {
          this.$message.success('操作成功')
          this.pageClone = 1
          this.formInline.queryLikeCodeOrName = ''
          this.fetchData()
        })
        .catch((e) => {
          this.$message.error('操作失败')
          console.log('错误', e)
        })
    },
    handleUpdateCache(index, row) {
      const url = '/app/rest/refreshRedis'
      request({
        url,
        method: 'get',
        params: {
          // type: this.type,
          id: row.id,
          // netType: this.netType,
          rows: this.pageSize,
          page: this.pageClone,
        },
      })
        .then((res) => {
          this.$message.success('操作成功')
        })
        .catch((e) => {
          this.$message.error('操作失败')
          console.log('错误', e)
        })
    },
    fetchData() {
      const url = '/app/rest/queryAppList'
      request({
        url,
        method: 'get',
        params: {
          type: this.type,
          rows: this.pageSize,
          page: this.pageClone,
          queryLikeCodeOrName: this.formInline.queryLikeCodeOrName,
        },
      })
        .then((res) => {
          this.itemsClone = res.data.rows
          this.totalClone = res.data.total
          this.pageSize = res.data.pageSize
          this.pageClone = res.data.page
        })
        .catch((e) => {
          console.log('错误', e)
        })
    },
    selectChange(val) {
      console.log('val', val)
    },
    onSubmit() {
      console.log('发送查询接口请求：this.formInline', this.formInline)
      const url = '/app/rest/queryAppList'
      request({
        url,
        method: 'get',
        params: {
          type: this.type,
          page: 1,
          rows: this.pageSize,
          queryLikeCodeOrName: this.formInline.queryLikeCodeOrName,
        },
      })
        .then((res) => {
          this.itemsClone = res.data.rows
          this.totalClone = res.data.total
          this.pageSize = res.data.pageSize
          this.pageClone = res.data.page
        })
        .catch((e) => {
          console.log('错误', e)
        })
    },
    handleEdit(index, row) {
      this.dialogChangeFormVisible = true
      this.updateId = row.id
      this.dailogTitleType = '应用缓存详情'
      this.temp = row
      this.formChange = this.temp
      const url = '/app/rest/getAppRedisDetailById'
      request({
        url,
        method: 'get',
        params: {
          id: row.id,
          page: 1,
          pageSize: 10,
        },
      })
        .then((res) => {
          this.itemsRedis = res.data.rows
          this.editPage = res.data.page
          this.size = res.data.pageSize
          this.editTotal = res.data.total
        })
        .catch((e) => {
          console.log('错误', e)
        })
    },

    indexMethod(index) {
      return index
    },

    searchData() {
      const url = '/app/rest/queryAppList'
      request({
        url,
        method: 'get',
        params: {
          type: this.form.type,
          // netType: this.form.netType,
          rows: this.pageSize,
          page: this.pageClone,
        },
      })
        .then((res) => {
          this.itemsClone = res.data.rows
          this.totalClone = res.data.total
          this.pageSize = res.data.pageSize
          this.pageClone = res.data.page
          // this.netType = this.form.netType
        })
        .catch((e) => {
          console.log('错误', e)
        })
    },
    searchChangeData() {
      const url = '/app/rest/queryAppList'
      request({
        url,
        method: 'get',
        params: {
          type: this.formChange.type,
          // netType: this.formChange.netType,
          rows: this.pageSize,
          page: this.pageClone,
        },
      })
        .then((res) => {
          this.itemsClone = res.data.rows
          this.totalClone = res.data.total
          this.pageSize = res.data.pageSize
          this.pageClone = res.data.page
        })
        .catch((e) => {
          console.log('错误', e)
        })
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then((_) => {
          done()
        })
        .catch((_) => {})
    },
    handleCurrentChange(val) {
      console.log('handleCurrentChangeval', val)
      this.pageClone = val
      this.fetchData()
    },
    handleCurrentChangeRedis(val) {
      console.log('handleCurrentChangeval', val)
      this.editPage = val
    },
    prevClick() {
      const url = '/app/rest/queryAppList'
      request({
        url,
        method: 'get',
        params: {
          type: this.type,
          // netType: this.netType,
          rows: this.pageSize,
          page: this.pageClone - 1,
          // netType: this.formInline.radio,
          queryLikeCodeOrName: this.formInline.queryLikeCodeOrName,
          status: this.formInline.value,
        },
      })
        .then((res) => {
          this.itemsClone = res.data.rows
          this.totalClone = res.data.total
          this.pageSize = res.data.pageSize
          this.pageClone = res.data.page
        })
        .catch((e) => {
          console.log('错误', e)
        })
    },
    nextClick() {
      const url = '/app/rest/queryAppList'
      request({
        url,
        method: 'get',
        params: {
          type: this.type,
          // netType: this.netType,
          rows: this.pageSize,
          page: this.pageClone + 1,
          // netType: this.formInline.radio,
          queryLikeCodeOrName: this.formInline.queryLikeCodeOrName,
          status: this.formInline.value,
        },
      })
        .then((res) => {
          this.itemsClone = res.data.rows
          this.totalClone = res.data.total
          this.pageSize = res.data.pageSize
          this.pageClone = res.data.page
        })
        .catch((e) => {
          console.log('错误', e)
        })
    },
    prevClickRedis() {
      const url = '/app/rest/getAppRedisDetailById'
      request({
        url,
        method: 'get',
        params: {
          id: this.updateId,
          pageSize: this.size,
          page: this.editPage - 1,
          app: this.form.app,
          clientAppKey: this.form.clientAppKey,
        },
      })
        .then((res) => {
          this.itemsRedis = res.data.rows
          this.editPage = res.data.page
          this.size = res.data.pageSize
          this.editTotal = res.data.total
        })
        .catch((e) => {
          console.log('错误', e)
        })
    },
    nextClickRedis() {
      const url = '/app/rest/getAppRedisDetailById'
      request({
        url,
        method: 'get',
        params: {
          id: this.updateId,
          pageSize: this.size,
          page: this.editPage + 1,
          app: this.form.app,
          clientAppKey: this.form.clientAppKey,
        },
      })
        .then((res) => {
          this.itemsRedis = res.data.rows
          this.editPage = res.data.page
          this.size = res.data.pageSize
          this.editTotal = res.data.total
        })
        .catch((e) => {
          console.log('错误', e)
        })
    },
  },
   watch:{
    items:{
      handler(newVal,oldVal){
        this.itemsClone = newVal
      },
      immediate: true
    },
    total:{
      handler(newVal,oldVal){
        this.totalClone = newVal
      },
      immediate: true
    }
  }
}
</script>

<style lang="scss" scoped>
.input_style {
  width: 150%;
  margin: 5px 0 5px -30px;
}
.pagination-wrap {
  margin-top: 20px;
  text-align: center;
}
</style>
