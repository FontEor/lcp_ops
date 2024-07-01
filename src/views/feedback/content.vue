<template>
  <div>
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="网络类型">
        <el-radio v-model="formInline.radio" :label="1">外网</el-radio>
        <el-radio v-model="formInline.radio" :label="2">内网</el-radio>
      </el-form-item>
      <el-form-item label="内容">
        <el-input v-model="formInline.content" placeholder></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="itemsClone" style="width: 100%">
      <el-table-column label="序号" type="index" :index="indexMethod"></el-table-column>
      <el-table-column label="意见类型" prop="type">
        <template slot-scope="{row}">{{typeRender(row.type)}}</template>
      </el-table-column>
      <el-table-column label="意见内容" prop="content"></el-table-column>
      <el-table-column label="提交人" prop="createUser"></el-table-column>
      <el-table-column label="提交时间" prop="createTime"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot="header"></template>
        <template slot-scope="scope" style="white-space:nowrap">
          <el-button-group>
            <el-button
              size="mini"
              type="primary"
              plain
              @click="handleEdit(scope.$index, scope.row)"
            >查看详情</el-button>
          </el-button-group>
          <el-dialog
            width="35%"
            height="100%"
            :title="dailogTitleType"
            :visible.sync="dialogChangeFormVisible"
          >
            <el-form :model="formChange" label-width="80px">
              <el-form-item label="网络类型">
                <el-radio v-model="formChange.netType" :label="2" disabled>内网</el-radio>
                <el-radio v-model="formChange.netType" :label="1" disabled>外网</el-radio>
              </el-form-item>
              <el-form-item label="意见类型">
                <el-input v-if="formChange.type==1" value="体验优化" disabled></el-input>
                <el-input v-if="formChange.type==2" value="功能改进" disabled></el-input>
                <el-input v-if="formChange.type==3" value="页面优化" disabled></el-input>
                <el-input v-if="formChange.type==4" value="联系我们" disabled></el-input>
                <el-input v-if="formChange.type==5" value="体验优化" disabled></el-input>
                <el-input v-if="formChange.type==6" value="功能改进" disabled></el-input>
                <el-input v-if="formChange.type==7" value="页面优化" disabled></el-input>
                <el-input v-if="formChange.type==8" value="联系我们" disabled></el-input>
              </el-form-item>
              <el-form-item label="创建人">
                <el-input v-model="formChange.createUser" disabled autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="创建时间">
                <el-input v-model="createFormTime" disabled autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="意见内容">
                <el-input v-model="formChange.content" disabled autocomplete="off"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogChangeFormVisible = false">关闭</el-button>
            </div>
          </el-dialog>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-wrap" v-if="itemsClone.length!==0">
      <el-pagination
        background
        @current-change="handleCurrentChange"
        :current-page.sync="page"
        :page-size="pageSize"
        layout="prev, pager, next, jumper"
        :total="totalClone"
        @prev-click="prevClick"
        @next-click="nextClick"
      ></el-pagination>
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
    pageSize: Number,
    total: Number,
  },
  data() {
    return {
      createFormTime: '',
      itemsClone: [],
      totalClone:1,
      updateId: 1,
      flag: false,
      page:1,
      // type: 2,
      netType: 2,
      formInline: {
        radio: 2,
        content: '',
      },
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
    }
  },
  methods: {
    typeRender(type) {
      if (type == 1) {
        return '体验优化'
      } else if (type == 2) {
        return '功能改进'
      } else if (type == 3) {
        return '页面优化'
      } else if (type == 4) {
        return '联系我们'
      } else if (type == 5) {
        return '体验优化'
      } else if (type == 6) {
        return '功能改进'
      } else if (type == 7) {
        return '页面优化'
      } else if (type == 8) {
        return '联系我们'
      }
    },
    formatTime(val) {
      let date = val.split('T')[0]
      let time = val.split('T')[1]
      let ctime = time.split('.')[0]
      return date + ' ' + ctime
    },
    closedReset() {
      console.log('清空表单数据')
      this.$nextTick(() => {
        this.$refs['form'].resetFields()
      })
    },
    fetchData() {
      const url = '/feedback/rest/queryFeedbackList'
      request({
        url,
        method: 'get',
        params: {
          type: this.type,
          netType: this.netType,
          rows: this.pageSize,
          page: this.page,
        },
      })
        .then((res) => {
          this.itemsClone = res.data.rows
          this.totalClone = res.data.total
          this.pageSize = res.data.pageSize
          this.page = res.data.page
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
      const url = '/feedback/rest/queryFeedbackList'
      request({
        url,
        method: 'get',
        params: {
          type: this.type,
          netType: this.formInline.radio,
          page: 1,
          content: this.formInline.content,
        },
      })
        .then((res) => {
          this.itemsClone = res.data.rows
          this.totalClone = res.data.total
          this.pageSize = res.data.pageSize
          this.page = res.data.page
          this.netType = this.formInline.radio
        })
        .catch((e) => {
          console.log('错误', e)
        })
    },
    handleEdit(index, row) {
      this.dialogChangeFormVisible = true
      this.updateId = row.id
      this.dailogTitleType = '意见反馈详情列表'
      this.createFormTime = row.createTime
      this.temp = row
      this.formChange = this.temp
      console.log('this.createFormTime', this.createFormTime)
      console.log('row', row)
    },

    indexMethod(index) {
      return index
    },

    searchData() {
      const url = '/feedback/rest/queryFeedbackList'
      request({
        url,
        method: 'get',
        params: {
          type: this.form.type,
          netType: this.form.netType,
          rows: this.pageSize,
          page: this.page,
        },
      })
        .then((res) => {
          this.itemsClone = res.data.rows
          this.totalClone = res.data.total
          this.pageSize = res.data.pageSize
          this.page = res.data.page
          this.netType = this.form.netType
        })
        .catch((e) => {
          console.log('错误', e)
        })
    },
    searchChangeData() {
      const url = '/feedback/rest/queryFeedbackList'
      request({
        url,
        method: 'get',
        params: {
          type: this.formChange.type,
          netType: this.formChange.netType,
          rows: this.pageSize,
          page: this.page,
        },
      })
        .then((res) => {
          this.itemsClone = res.data.rows
          this.totalClone = res.data.total
          this.pageSize = res.data.pageSize
          this.page = res.data.page
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
      const url = '/feedback/rest/queryFeedbackList'
      request({
        url,
        method: 'get',
        params: {
          type: this.type,
          netType: this.netType,
          rows: this.pageSize,
          page: val,
          //netType: this.formInline.radio,
          content: this.formInline.content,
          status: this.formInline.value,
        },
      })
        .then((res) => {
          this.itemsClone = res.data.rows
          this.totalClone = res.data.total
          this.pageSize = res.data.pageSize
          this.page = res.data.page
        })
        .catch((e) => {
          console.log('错误', e)
        })
    },
    prevClick() {
      const url = '/feedback/rest/queryFeedbackList'
      request({
        url,
        method: 'get',
        params: {
          type: this.type,
          netType: this.netType,
          rows: this.pageSize,
          page: this.page - 1,
          // netType: this.formInline.radio,
          content: this.formInline.content,
          status: this.formInline.value,
        },
      })
        .then((res) => {
          this.itemsClone = res.data.rows
          this.totalClone = res.data.total
          this.pageSize = res.data.pageSize
          this.page = res.data.page
        })
        .catch((e) => {
          console.log('错误', e)
        })
    },
    nextClick() {
      const url = '/feedback/rest/queryFeedbackList'
      request({
        url,
        method: 'get',
        params: {
          type: this.type,
          netType: this.netType,
          rows: this.pageSize,
          page: this.page + 1,
          //netType: this.formInline.radio,
          content: this.formInline.content,
          status: this.formInline.value,
        },
      })
        .then((res) => {
          this.itemsClone = res.data.rows
          this.totalClone = res.data.total
          this.pageSize = res.data.pageSize
          this.page = res.data.page
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