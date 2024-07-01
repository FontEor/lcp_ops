<template>
  <div class="kk-admin-wrap">
    <el-form label-width="120px" :model="form">
      <el-row :gutter="16" type="flex" justify="space-between" style="flex-wrap: wrap; flex-direction: row">
        <el-col :span="8">
          <el-form-item label="管理员姓名/erp">
            <el-input v-model="form.erp" placeholder="请输入管理员姓名/erp" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="8" />
        <el-col :span="8">
          <div style="float:right;">
            <el-button type="primary" @click="onSearch">查 询</el-button>
            <el-button type="primary" @click="onCreate">创 建</el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>

    <el-table :data="tableData">
      <el-table-column prop="erpName" label="管理员姓名" />
      <el-table-column prop="erp" label="管理员erp" />
      <el-table-column prop="createUser" label="权限添加人" />
      <el-table-column prop="createTime" label="权限添加时间" />
      <el-table-column label="操作" width="120px">
        <template slot-scope="scope">
          <el-button size="mini" type="text" style="color:red" @click="handleDelete(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增-->
    <el-dialog

      width="480px"
      height="100%"
      title="新增管理员"
      :close-on-click-modal="false"
      :visible.sync="dialogAdd"
      :before-close="closeDialog"
    >
      <div>
        <el-form ref="addAdmin" :model="dialogForm" :rules="rules" label-width="120px" class="kk-admin-dialog">
          <el-form-item label="管理员erp" prop="erp">
            <el-select
              v-model="dialogForm.erp"
              :filterable="true"
              :remote="true"
              :remote-method="remotePrincipal"
              value-key="userName"
              popper-class="erp-info-dropdown__list"
              style="width: 100%"
              @change="getAdminUserInfo"
            >
              <el-option
                v-for="item in principalOptionList"
                :key="item.userName"
                :label="item.userName"
                :value="item.userName"
              >
                <div class="photo-wrapper">
                  <img :src="item.headImg" style="width: 32px; height: 32px">
                </div>
                <div class="info-wrapper">
                  <p class="name">{{ item.userName }}（{{ item.realName }}）</p>
                  <p class="organization">
                    {{ item.organizationFullName }}
                  </p>
                </div>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="管理员姓名" prop="erpName">
            <el-input v-model="dialogForm.erpName" disabled />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer" style="text-align: right">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="handleSaveAdmin">确定</el-button>
      </div>
    </el-dialog>

    <Pagination
      :current-page.sync="pageNum"
      :page-size.sync="pageSize"
      :total.sync="total"
      :reload-table-data="reloadTableData"
    />
  </div>
</template>

<script>
import lcp from '@/api/lcp/index'
import _ from 'lodash'
import Pagination from '@/components/Pagination.vue'

export default {
  name: 'Admin',
  components: {
    Pagination
  },
  data() {
    return {
      pageNum: 1,
      pageSize: 10,
      total: 0,
      dialogAdd: false,
      principalOptionList: [],
      rules: {
        erp: [
          { required: true, message: '请选择erp', trigger: 'change' }
        ]
      },
      form: {
        erp: ''
      },
      dialogForm: {
        erp: '',
        erpName: ''
      },
      tableData: []
    }
  },
  mounted() {
    this.onSearch()
  },
  methods: {
    async reloadTableData(page = 0) {
      this.pageNum = page || this.pageNum
      await this.onSearch().catch((error) => {
        this.tableData = []
        this.pageSize = 10
        throw new Error(`reloadTableData, ${error}`)
      })
    },
    async onSearch() {
      const searchData = {
        erp: this.form.erp,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      const { code, data } = await lcp.kkBoardApi.adminKk.getAdminUserList(searchData)
      if (code === 20000) {
        const { list, pageNum, total } = data
        this.tableData = list
        this.pageNum = pageNum
        this.total = total
      }
    },
    onCreate() {
      this.dialogAdd = true
    },
    remotePrincipal(erp) {
      const params = {
        erp: erp
      }
      const getSearchErp = _.throttle(async() => {
        const { code, data } = await lcp.kkBoardApi.adminKk.findUser(params)
        if (code === 20000) {
          this.principalOptionList = data
        }
      }, 200)
      getSearchErp()
    },

    closeDialog() {
      this.dialogAdd = false
    },

    changePrincipal() {

    },

    async handleSaveAdmin() {
      this.$refs.addAdmin
        .validate().then(async() => {
          const { code } = await lcp.kkBoardApi.adminKk.createAdminUser(this.dialogForm)
          if (code === 20000) {
            this.dialogAdd = false
            this.dialogForm = {
              erp: '',
              erpName: ''
            }
            this.principalOptionList = []
            await this.onSearch()
          }
        }).catch(() => {})
    },
    getAdminUserInfo(info) {
      this.principalOptionList.forEach(item => {
        if (item.userName === info) {
          this.dialogForm.erpName = item.realName
          this.dialogForm.erp = item.userName
        }
      })
    },

    // 删除
    async handleDelete(row) {
      this.$confirm('确定删除当前数据吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          const params = {
            id: row.id
          }
          const { code, message } = await lcp.kkBoardApi.adminKk.deleteAdminUser(params)
          if (code === 20000) {
            this.onSearch()
            this.$message({
              message: '操作成功',
              type: 'success'
            })
          } else {
            this.$message.error(message)
          }
        })
        .catch((e) => {
          console.log('错误', e)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.kk-admin-wrap {
  margin: 20px;
}

.erp-info-dropdown__list {
  .el-select-dropdown__item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: auto;

    .photo-wrapper {
      margin: 8px;
      border-radius: 50%;
      overflow: hidden;
    }

    .info-wrapper {
      margin-left: 8px;
      line-height: 1.5;

      .organization {
        color: #666;
        font-size: 12px;
      }
    }
  }
}

.erp-info-popover {
  .content-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .el-icon-info {
      margin: 8px;
      color: red;
      font-size: 16px;
    }
  }

  .button-wrapper {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
}</style>
