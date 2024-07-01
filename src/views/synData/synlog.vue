<template>
  <div class="app-container">
    <el-tabs>
      <el-tab-pane label="日志同步">
        <el-form :model="formInline" :inline="true">
          <!--  -->
          <el-form-item label="traceId">
            <el-input
              v-model.trim="formInline.traceId"
              placeholder="请输入traceId"
            />
          </el-form-item>
          <el-form-item label="业务号">
            <el-input
              v-model.trim="formInline.businessNo"
              placeholder="请输入业务号"
            />
          </el-form-item>
          <el-form-item label="状态">
            <el-select
              v-model="formInline.statusTypeValue"
              placeholder="请选择应用状态"
              clearable
            >
              <el-option
                v-for="statusType in formInline.statusTypeList"
                :key="statusType.value"
                :value="statusType.value"
                :label="statusType.label"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="danger" @click="batchDel">批量删除</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="searchTable" @selection-change="handleSelectionChange">
          <el-table-column
              type="selection"
              width="55"
              align="center">
          </el-table-column>
          <el-table-column label="序号" align="center" type="index" />
          <el-table-column label="traceId" align="center" prop="traceId" />
          <el-table-column label="业务号" align="center" prop="businessNo" />
          <el-table-column
            label="同步状态"
            align="center"
            prop="status"
            :formatter="formatStatus"
          />
          <el-table-column
            label="创建时间"
            align="center"
            prop="createTime"
            :formatter="formatTime"
          />
          <el-table-column label="操作" align="center">
            <template slot-scope="{ row }">
              <el-button
                type="primary"
                size="mini"
                plain
                @click="handleUpdate(row)">
                数据同步
              </el-button>
              <el-button
                type="primary"
                size="mini"
                plain
                @click="showDetail(row)">
                详情
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div v-if="searchTable.length !== 0" class="pagination-wrap">
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

      <el-dialog
            width="60%"
            height="100%"
            title="详情"
            :visible.sync="dialogLookFormVisible">
            <el-form :model="formContent" label-width="80px">
              <el-form-item label="消息内容">
                  <el-input  type="textarea" :rows="5" v-model="formContent.params" autocomplete="off" disabled></el-input>
              </el-form-item>
              <el-form-item label="错误内容">
                <el-input type="textarea" :rows="5" v-model="formContent.error" autocomplete="off" disabled></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogLookFormVisible = false">关闭</el-button>
            </div>
          </el-dialog>
  </div>
</template>

<script>
import request from '@/utils/request.js'

export default {
  name: 'SynLog',
  data() {
    return {
      formInline: {
        statusTypeList: [
          { value: 0, label: '初始化' },
          { value: 1, label: '成功' },
          { value: 2, label: '失败' },
        ],
        statusTypeValue:null,
        traceId: '',
        businessNo: ''
      },
      appStatusDict: {
        0: '初始化',
        1: '成功',
        2: '失败'
      },
      searchTable: [],
      type: 0,
      page: 0,
      pageSize: 10,
      total: 100,
      dialogLookFormVisible: false,
      formContent:{
        params:'',
        error:''
      },
      multipleSelection: []
    }
  },
  mounted() {
    const url = '/syndata/rest/querySynDataLogList'
    request({
      url,
      method: 'get',
      params: {}
    })
      .then((res) => {
        console.log(res)
        this.page = res.data.page
        this.pageSize = res.data.pageSize
        this.total = res.data.total
        this.searchTable = res.data.rows
      })
      .catch((e) => {
        console.log('查询请求错误', e)
      })
  },
  methods: {
    handleUpdate(val) {
      this.$confirm('确定要数据同步吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const url = '/syndata/rest/syncLogData'
          request({
            url,
            method: 'get',
            params: {
              id: val.id
            }
          })
            .then((res) => {
              // console.log(res);
              this.$message({
                type: 'success',
                message: '同步成功!'
              })
            })
            .catch((e) => {
              console.log('数据同步错误', e)
            })
        })
        .catch((e) => {
          console.log('取消同步', e)
        })
    },
    showDetail(val){
        this.formContent.params=''
        this.formContent.error=''
        this.dialogLookFormVisible=true
        if(val.params&&val.params!=''){
           this.formContent.params=val.params
        }
        if(val.error&&val.error!=''){
           this.formContent.error=val.error
        }

    },
    formatStatus(row, column, cellValue, index) {
      return this.appStatusDict[cellValue]
    },
    formatTime(row, column, cellValue, index) {
      return cellValue.split('.')[0].replace('T', ' ')
    },
    /**
     * 查询
     */
    onSubmit() {
      const url = '/syndata/rest/querySynDataLogList'
      request({
        url,
        method: 'get',
        params: {
          status:this.formInline.statusTypeValue,
          traceId: this.formInline.traceId,
          businessNo: this.formInline.businessNo
        }
      }).then((res) => {
          this.searchTable = res.data.rows
          this.total = res.data.total
          this.pageSize = res.data.pageSize
          this.page = res.data.page
        })
        .catch((e) => {
          console.log('按钮提交错误：', e)
        })
    },
    handleCurrentChange(val) {
      const url = '/syndata/rest/querySynDataLogList'
      request({
        url,
        method: 'get',
        params: {
          status:this.formInline.statusTypeValue,
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
      const url = '/syndata/rest/querySynDataLogList'
      request({
        url,
        method: 'get',
        params: {
          status:this.formInline.statusTypeValue,
          rows: this.pageSize,
          page: this.page - 1
        }
      }).then((res) => {
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
      const url = '/syndata/rest/querySynDataLogList'
      request({
        url,
        method: 'get',
        params: {
          status:this.formInline.statusTypeValue,
          rows: this.pageSize,
          page: this.page + 1
        }
      }).then((res) => {
          this.searchTable = res.data.rows
          this.total = res.data.total
          this.pageSize = res.data.pageSize
          this.page = res.data.page
        })
        .catch((e) => {
          console.log('请求下一页错误', e)
        })
    },
    /**
     * 选中
     */
    handleSelectionChange(val){
      if(val.length==0){
        this.multipleSelection = []
      }else{
        for(let i=0;i<val.length;i++){
          this.multipleSelection.push(val[i].id)
        }
      }
    },
    /**
     * 批量删除
     */
    batchDel(){
      if(this.multipleSelection.length==0){
        this.$message({
                type: 'warning',
                message: '请选择删除项!'
              })
      }else{
        const url = '/syndata/rest/batchDel'
        request({
          url,
          method: 'post',
          params: {
            ids:this.multipleSelection.toString()
          }
        }).then((res) => {
            if(res.code==20000){
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.onSubmit()
            }
        }).catch((e) => {
            console.log('查询错误', e)
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.pagination-wrap {
  margin-top: 20px;
  text-align: center;
}
::v-deep .cell {
  text-overflow: clip;
}
</style>
