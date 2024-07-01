<template>
  <div class="app-container">
    <el-tabs>
      <el-tab-pane label="开发团队信息">
        <el-form :model="formInline" :inline="true">
          <el-form-item label="供应商名称">
            <el-input v-model="formInline.name" placeholder />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="supplierSearchTable">
          <el-table-column label="序号" align="center" type="index" />
          <el-table-column label="供应商名称" align="center" prop="name" />
          <el-table-column label="供应商编码" align="center" prop="code" />
          <el-table-column label="负责人PIN" align="center" prop="managerPin" />
          <el-table-column
            label="供应商状态"
            align="center"
            prop="status"
          />
          <el-table-column label="创建人" align="center" prop="createUser" />
          <el-table-column label="创建时间" align="center" prop="createTime" />
          <el-table-column label="操作" align="center">
            <template slot-scope="{ row }">
              <el-button
                type="primary"
                size="mini"
                plain
                @click="handleUpdate(row)"
              >
                数据同步
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div v-if="supplierSearchTable.length !== 0" class="pagination-wrap">
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
import request from '../../utils/request'

export default {
  name: 'SupplierSearch',
  data() {
    return {
      formInline: {},
      supplierSearchTable: [],
      name: '',
      page: 0,
      pageSize: 10,
      total: 100
    }
  },
  mounted() {
    const url = '/supplier/rest/querySupplierList'
    request({
      url,
      method: 'get',
      params: {}
    })
      .then((res) => {
        // console.log(res);
        this.page = res.data.page
        this.pageSize = res.data.pageSize
        this.total = res.data.total
        this.supplierSearchTable = res.data.rows
      })
      .catch((e) => {
        console.log('开发团队信息请求错误', e)
      })
  },
  methods: {
    handleUpdate(val) {
      // console.log("val", typeof val.id, val.id);
      this.$confirm('确定要数据同步吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // const url = "/supplier/rest/syncIsvToCloud";
          const url = '/supplier/rest/syncSupplierToCloud'
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
    formatTime(val) {
      const date = val.split('T')[0]
      const time = val.split('T')[1]
      const ctime = time.split('.')[0]
      return date + ' ' + ctime
    },
    onSubmit() {
      this.name = this.formInline.name
      const url = '/supplier/rest/querySupplierList'
      request({
        url,
        method: 'get',
        params: {
          name: this.name
        }
      })
        .then((res) => {
          this.supplierSearchTable = res.data.rows
          this.total = res.data.total
          this.pageSize = res.data.pageSize
          this.page = res.data.page
        })
        .catch((e) => {
          console.log('按钮提交错误：', e)
        })
    },
    handleCurrentChange(val) {
      // console.log("/supplier/rest/querySupplierList", val);
      const url = '/supplier/rest/querySupplierList'
      request({
        url,
        method: 'get',
        params: {
          type: this.type,
          page: val
        }
      })
        .then((res) => {
          this.supplierSearchTable = res.data.rows
          this.total = res.data.total
          this.pageSize = res.data.pageSize
          this.page = res.data.page
        })
        .catch((e) => {
          console.log('改变当前页错误', e)
        })
    },
    prevClick() {
      const url = '/supplier/rest/querySupplierList'
      request({
        url,
        method: 'get',
        params: {
          type: this.type,
          rows: this.pageSize,
          page: this.page - 1
        }
      })
        .then((res) => {
          this.supplierSearchTable = res.data.rows
          this.total = res.data.total
          this.pageSize = res.data.pageSize
          this.page = res.data.page
        })
        .catch((e) => {
          console.log('请求下一页错误', e)
        })
    },
    nextClick() {
      const url = '/supplier/rest/querySupplierList'
      request({
        url,
        method: 'get',
        params: {
          type: this.type,
          rows: this.pageSize,
          page: this.page + 1
        }
      })
        .then((res) => {
          this.appSearchTable = res.data.rows
          this.total = res.data.total
          this.pageSize = res.data.pageSize
          this.page = res.data.page
        })
        .catch((e) => {
          console.log('请求下一页错误', e)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.pagination-wrap {
  margin-top: 20px;
  text-align: center;
}
</style>
