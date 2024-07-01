<template>
  <div>
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="标题">
        <el-input v-model="formInline.title" placeholder></el-input>
      </el-form-item>
      <el-form-item label="网络类型">
        <el-radio v-model="formInline.radio" :label="1">外网</el-radio>
        <el-radio v-model="formInline.radio" :label="2">内网</el-radio>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
        <el-button type="primary" @click="dialogFormVisible = true;onNew()">新建</el-button>
        <el-dialog
          width="60%"
          height="100%"
          :title="dailogTitleType"
          :visible.sync="dialogFormVisible"
          @close="closedReset"
        >
          <el-form :model="form" ref="form" label-width="80px">
            <el-form-item label="网络类型" style="width: 100%;">
              <el-radio v-model="form.netType" :label="2">内网</el-radio>
              <el-radio v-model="form.netType" :label="1">外网</el-radio>
            </el-form-item>
            <el-form-item label="消息类型" style="width: 100%;">
              <el-input class="input_style" v-if="form.msgType==1" value="平台公告" disabled></el-input>
              <el-input class="input_style" v-if="form.msgType==2" value="api消息" disabled></el-input>
            </el-form-item>
            <el-form-item label="标题" style="width: 100%;">
              <el-input class="input_style" v-model="form.title" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item style="display:none">
              <el-input class="input_style" v-model="form.status" autocomplete="off"></el-input>
            </el-form-item>
            <mavon-editor ref=md @imgAdd="$imgAdd" v-model="form.content"></mavon-editor>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button
              type="primary"
              @click="
                onSave();
                dialogFormVisible = false;
              "
            >保存</el-button>
            <el-button @click="dialogFormVisible = false">取消</el-button>
          </div>
        </el-dialog>
      </el-form-item>
    </el-form>
    <el-table v-loading="loading" :data="itemsClone" style="width: 100%">
      <el-table-column label="序号" type="index" :index="indexMethod"></el-table-column>
      <el-table-column label="标题" prop="title"></el-table-column>
      <el-table-column label="网络类型" prop="netType">
        <template slot-scope="{row}">{{typeRender(row.netType)}}</template>
      </el-table-column>
      <el-table-column label="发布时间" prop="publisTime"></el-table-column>
      <el-table-column label="撤销时间" prop="revocationTime"></el-table-column>
      <el-table-column label="消息类型" prop="msgType" :formatter="formatter"></el-table-column>
      <el-table-column label="创建人" prop="createUser"></el-table-column>
      <el-table-column label="更新人" prop="updateUser"></el-table-column>
      <el-table-column label="创建时间" prop="createTime"></el-table-column>
      <el-table-column label="更新时间" prop="updateTime"></el-table-column>
      <el-table-column label="消息状态" prop="statusName"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot="header"></template>
        <template slot-scope="scope" style="white-space:nowrap">
          <el-button-group>
            <el-button
              size="mini"
              v-show="scope.row.status==1"
              @click="handleLook(scope.$index, scope.row)"
              plain
            >查看</el-button>
            <el-button
              size="mini"
              v-show="scope.row.status==0||scope.row.status==2"
              @click="handleEdit(scope.$index, scope.row)"
              plain
            >修改</el-button>
            <el-button
              size="mini"
              type="danger"
              plain
              @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button>
            <el-button
              size="mini"
              type="primary"
              @click="handleOff(scope.$index, scope.row)"
              v-show="scope.row.status==1"
              plain
            >撤销</el-button>
            <el-button
              size="mini"
              type="primary"
              @click="handlePublic(scope.$index, scope.row)"
              v-show="scope.row.status==0||scope.row.status==2"
              plain
            >发布</el-button>
          </el-button-group>
          <el-dialog
            width="60%"
            height="100%"
            :title="dailogTitleType"
            :visible.sync="dialogChangeFormVisible"
          >
            <el-form :model="formChange" label-width="80px">
              <el-form-item label="网络类型">
                <el-radio v-model="formChange.netType" :label="2">内网</el-radio>
                <el-radio v-model="formChange.netType" :label="1">外网</el-radio>
              </el-form-item>
              <el-form-item label="消息类型">
                <el-input v-if="formChange.msgType==1" value="平台公告" disabled></el-input>
                <el-input v-if="formChange.msgType==2" value="api消息" disabled></el-input>
              </el-form-item>
              <el-form-item label="标题">
                <el-input v-model="formChange.title" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="内容">
                <el-input v-model="formChange.content" autocomplete="off"></el-input>
              </el-form-item>
              <mavon-editor ref=md @imgAdd="$imgAdd" v-model="formChange.content"></mavon-editor>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button
                type="primary"
                @click="
                onChangeSave(scope.$index,scope.row);
                dialogChangeFormVisible = false;
              "
              >保存</el-button>
              <el-button @click="fetchData();dialogChangeFormVisible = false">取消</el-button>
            </div>
          </el-dialog>
          <el-dialog
            width="60%"
            height="100%"
            :title="dailogTitleType"
            :visible.sync="dialogLookFormVisible"
          >
            <el-form :model="formChange" label-width="80px">
              <el-form-item label="网络类型">
                <el-radio v-model="formChange.netType" :label="2" disabled>内网</el-radio>
                <el-radio v-model="formChange.netType" :label="1" disabled>外网</el-radio>
              </el-form-item>
              <el-form-item label="消息类型">
                <el-input v-if="formChange.msgType==1" value="平台公告" disabled></el-input>
                <el-input v-if="formChange.msgType==2" value="api消息" disabled></el-input>
              </el-form-item>
              <el-form-item label="标题">
                <el-input v-model="formChange.title" autocomplete="off" disabled></el-input>
              </el-form-item>
              <el-form-item label="内容">
                <el-input v-model="formChange.content" autocomplete="off" disabled></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogLookFormVisible = false">关闭</el-button>
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
    msgType: Number,
    pageSize: Number,
    total: Number,
  },
  data() {
    return {
      itemsClone: [],
      totalClone:1,
      updateId: 1,
      flag: false,
      page:1,
      // type: 2,
      netType: 2,
      formInline: {
        title: '',
        radio: 2,
        options: [
          {
            value: 1,
            label: '待发布',
          },
          {
            value: 2,
            label: '已发布',
          },
          {
            value: 3,
            label: '已下线',
          },
          {
            value: 4,
            label: '待审批',
          },
          {
            value: 5,
            label: '驳回',
          },
          {
            value: 6,
            label: '编辑中',
          },
        ],
      },
      dialogFormVisible: false,
      dialogChangeFormVisible: false,
      dialogLookFormVisible: false,
      dialogVisible: false,
      dialogVisibleDel: false,
      dailogTitleType: '',
      msg: '',
      value: '',
      form: {},
      temp: {},
      formChange: {},
      formLabelWidth: '156px',
      loading: false,
    }
  },
  methods: {
    formatter(row, column){
      const msgTypeTable = ["","平台公告","API消息"]
      return msgTypeTable[row[column.property]]
    },
    $imgAdd(pos, $file) {
      debugger
      var formdata = new FormData()
      formdata.append('image', $file)
      request({
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        method: 'post',
        url: '/doc/rest/imageUpload',
        data: formdata,
      }).then((res) => {
        console.log(res, 'res')
        this.$refs.md.$img2Url(pos, res.data.url)
      })
    },
    typeRender(type) {
      if (type == 1) {
        return '外网'
      } else if (type == 2) {
        return '内网'
      }
    },
    formatTime(val) {
      if (val == null) {
        return ''
      } else {
        let date = val.split('T')[0]
        let time = val.split('T')[1]
        let ctime = time.split('.')[0]
        return date + ' ' + ctime
      }
    },
    closedReset() {
      console.log('清空表单数据')
      this.$nextTick(() => {
        this.$refs['form'].resetFields()
      })
    },
    fetchData() {
      const url = '/message/rest/queryMessageList'
      request({
        url,
        method: 'get',
        params: {
          msgType: this.msgType,
          netType: this.netType,
          rows: this.pageSize,
          page: this.page,
          title: this.formInline.title,
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
    selectChange(val) {
      console.log('val', val)
    },
    onSubmit() {
      console.log('发送查询接口请求：this.formInline', this.formInline)
      const url = '/message/rest/queryMessageList'
      request({
        url,
        method: 'get',
        params: {
          msgType: this.msgType,
          netType: this.formInline.radio,
          title: this.formInline.title,
        },
      })
        .then((res) => {
          this.itemsClone = res.data.rows
          this.totalClone = res.data.total
          this.pageSize = res.data.pageSize
          this.page = 1
          this.netType = this.formInline.radio
        })
        .catch((e) => {
          console.log('错误', e)
        })
    },
    onNew() {
      this.dailogTitleType = '消息新增'
      this.form = {
        netType: 2,
        title: '',
        content: '',
        msgType: this.msgType,
        status: 1,
      }
    },
    handleEdit(index, row) {
      this.dialogChangeFormVisible = true
      this.updateId = row.id
      this.dailogTitleType = '消息更新'
      // this.temp = row
      // this.formChange = this.temp
      request({
        url: '/message/rest/messageDetail',
        method: 'get',
        params: { id: row.id },
      }).then((res) => {
        console.log('成功', res)
        this.formChange = res.data
      })
      console.log('row', row)
    },
    handleLook(index, row) {
      this.dialogLookFormVisible = true
      this.updateId = row.id
      this.dailogTitleType = '消息更新'
      this.temp = row
      this.formChange = this.temp
    },
    sureDel(index, row) {},
    handleDelete(index, row) {
      console.log('row', row)
      this.$confirm('确定删除当前内容?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.dialogVisibleDel = false
          const url = '/message/rest/deleteMessage'
          request({
            url,
            method: 'delete',
            params: {
              id: row.id,
            },
          }).then((res) => {
            this.$message.success('删除成功')
            this.fetchData()
          })
        })
        .catch((e) => {
          console.log('错误', e)
        })
    },
    handleOff(index, row) {
      this.$confirm('确定将当前内容从前台界面撤销?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.dialogVisibleDel = false
          this.loading = true
          const url = '/message/rest/downMessage'
          request({
            url,
            method: 'post',
            data: {
              id: row.id,
            },
          }).then((res) => {
            this.loading = false
            this.$message.success('操作成功')
            this.fetchData()
          })
        })
        .catch((e) => {
          this.loading = false
          console.log('错误', e)
        })
    },
    handlePublic(index, row) {
      this.$confirm('确定将当前内容发布到前台?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.dialogVisibleDel = false
          this.loading = true
          const url = '/message/rest/publishMessage'
          request({
            url,
            method: 'post',
            data: {
              id: row.id,
            },
          }).then((res) => {
            this.loading = false
            this.$message.success('操作成功')
            this.fetchData()
          })
        })
        .catch((e) => {
          this.loading = false
          console.log('错误', e)
        })
    },
    indexMethod(index) {
      return index
    },
    onSave() {
      console.log('请求保存接口：this.form', this.form)
      request({
        url: '/message/rest/editMessage',
        method: 'post',
        data: this.form,
      }).then((res) => {
        console.log('成功', res)
        this.searchData()
      })
    },
    onChangeSave() {
      var obj = {
        netType: this.formChange.netType,
        content: this.formChange.content,
        title: this.formChange.title,
        msgType: this.formChange.msgType,
        id: this.updateId,
      }
      request({
        url: '/message/rest/editMessage',
        method: 'post',
        data: obj,
      }).then((res) => {
        console.log('成功', res)
        this.fetchData()
      })
    },
    searchData() {
      const url = '/message/rest/queryMessageList'
      request({
        url,
        method: 'get',
        params: {
          msgType: this.form.msgType,
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
      const url = '/message/rest/queryMessageList'
      request({
        url,
        method: 'get',
        params: {
          msgType: this.formChange.msgType,
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
      const url = '/message/rest/queryMessageList'
      request({
        url,
        method: 'get',
        params: {
          msgType: this.msgType,
          netType: this.netType,
          rows: this.pageSize,
          page: val,
          //netType: this.formInline.radio,
          title: this.formInline.title,
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
      const url = '/message/rest/queryMessageList'
      request({
        url,
        method: 'get',
        params: {
          msgType: this.msgType,
          netType: this.netType,
          rows: this.pageSize,
          page: this.page - 1,
          // netType: this.formInline.radio,
          title: this.formInline.title,
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
      const url = '/message/rest/queryMessageList'
      request({
        url,
        method: 'get',
        params: {
          msgType: this.msgType,
          netType: this.netType,
          rows: this.pageSize,
          page: this.page + 1,
          //netType: this.formInline.radio,
          title: this.formInline.title,
          status: this.formInline.value,
        },
      })
        .then((res) => {
          console.log(111, this.page)
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