<template>
  <div>
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="公司名称">
        <el-input v-model="formInline.name" placeholder />
      </el-form-item>
      <el-form-item label="审批状态">
        <el-select v-model="formInline.value" @change="selectChange">
          <el-option
            v-for="item in formInline.options"
            :key="item.label"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="itemsClone" style="width: 100%">
      <el-table-column
        label="序号"
        type="index"
        :index="indexMethod"
      ></el-table-column>
      <el-table-column
        label="类型"
        prop="type"
        :formatter="formatter"
      ></el-table-column>
      <el-table-column label="申请人" prop="createUser"></el-table-column>
      <el-table-column label="申请时间" prop="applyTime"></el-table-column>
      <el-table-column label="公司名称" prop="name"></el-table-column>
      <el-table-column
        label="运营审批状态"
        prop="status"
        :formatter="formatter"
      ></el-table-column>
      <el-table-column label="审批人" prop="approveUser">
        <template slot-scope="{ row }">{{
          formatUser(row.approveUser)
        }}</template>
      </el-table-column>
      <el-table-column label="审批时间" prop="approveTime"></el-table-column>
      <el-table-column label="操作" align="center" width="320">
        <template slot="header" />
        <template slot-scope="scope">
          <el-button
            v-show="
              scope.row.status == 1 ||
              scope.row.status == 2 ||
              scope.row.status == 3
            "
            v-if="type !== 4"
            size="mini"
            type="primary"
            plain
            @click="handleEdit(scope.$index, scope.row)"
            >查看详情</el-button
          >
          <!-- 合作伙伴查看详情 -->
          <el-button
            v-show="
              scope.row.status == 1 ||
              scope.row.status == 2 ||
              scope.row.status == 3
            "
            v-if="type === 4"
            size="mini"
            type="primary"
            plain
            @click="handleEdit(scope.$index, scope.row)"
            >查看详情</el-button
          >
          <el-button
            v-show="scope.row.status == 1 || scope.row.status == 2"
            size="mini"
            type="primary"
            plain
            @click="onClickPassButton(scope.row)"
            >通过</el-button
          >
          <el-button
            v-show="scope.row.status == 1"
            size="mini"
            type="danger"
            plain
            @click="handleReject(scope.$index, scope.row)"
            >驳回</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 查看详情 -->
    <el-dialog
      width="40%"
      height="100%"
      :title="dailogTitleType"
      :visible.sync="dialogChangeFormVisible"
    >
      <el-form :model="formChange" label-width="120px">
        <el-form-item label="联系人姓名">
          <el-input v-model="formChange.contactsName" disabled />
        </el-form-item>
        <el-form-item label="联系人办公电话">
          <el-input
            v-model="formChange.contactsPhone"
            disabled
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input
            v-model="formChange.contactsEmail"
            disabled
            autocomplete="off"
          />
        </el-form-item>
        <template v-if="type === 2">
          <el-form-item label="合同编码">
            <el-input
              v-model="formChange.contractNo"
              disabled
              autocomplete="off"
            />
          </el-form-item>
        </template>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogChangeFormVisible = false">关闭</el-button>
      </span>
    </el-dialog>
    <div class="pagination-wrap" v-if="itemsClone.length !== 0">
      <el-pagination
        background
        @current-change="handleCurrentChange"
        :current-page.sync="pageNumb"
        :page-size="pageSize"
        layout="prev, pager, next, jumper"
        :total="totalClone"
        @prev-click="prevClick"
        @next-click="nextClick"
      />
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";

export default {
  name: "TabContent",
  components: {},
  props: {
    items: Array,
    type: Number,
    pageSize: Number,
    total: Number,
  },
  data() {
    return {
      flag: false,
      pageNumb: 1,
      netType: 2,
      itemsClone: [],
      totalClone: 1,
      formInline: {
        radio: 2,
        content: "",
        value: 0,
        cooperationValue: 0,
        options: [
          {
            value: 0,
            label: "全部类型",
          },
          {
            value: 1,
            label: "认证中",
          },
          {
            value: 2,
            label: "认证不通过",
          },
          {
            value: 3,
            label: "认证通过",
          },
        ],
      },
      dialogChangeFormVisible: false,
      dialogCooperationVisible: false,
      dialogVisible: false,
      dialogVisibleDel: false,
      dailogTitleType: "",
      dialogMsg: "",
      msg: "",
      value: "",
      form: {},
      temp: {},
      formChange: {},
      addressForm: {},
      // 开发商类型
      typeTable: ["", "ISV", "自研商家", "自营商家", "合作伙伴"],
      // 认证状态
      statusTable: ["", "认证中", "认证不通过", "认证通过"],
      isvDialogVisible: false,
      passButtonDebounceTimer: null,
    };
  },
  methods: {
    formatter(row, column, cellValue) {
      const value2TextTable = {
        type: () => this.typeTable[cellValue],
        status: () => this.statusTable[cellValue],
      };
      return value2TextTable[column.property]();
    },
    fetchData() {
      const url = "/i18n/rest/supplierIsv/querySupplierIsvList";
      request({
        url,
        method: "get",
        params: {
          type: this.type,
          netType: this.netType,
          pageSize: this.pageSize,
          pageNumb: this.pageNumb,
          name: this.formInline.name,
          status: this.formInline.value,
        },
      })
        .then((res) => {
          this.itemsClone = res.data.list;
          this.totalClone = res.data.total;
          this.pageSize = res.data.pageSize;
          this.pageNumb = res.data.pageNumb;
        })
        .catch((e) => {
          console.log("错误", e);
        });
    },
    selectChange(val) {},
    onSubmit() {
      const url = "/i18n/rest/supplierIsv/querySupplierIsvList";
      request({
        url,
        method: "get",
        params: {
          type: this.type,
          pageNumb: 1,
          pageSize: this.pageSize,
          name: this.formInline.name,
          status: this.formInline.value,
        },
      })
        .then((res) => {
          this.itemsClone = res.data.list;
          this.totalClone = res.data.total;
          this.pageSize = res.data.pageSize;
          this.pageNumb = res.data.pageNumb;
          this.netType = this.formInline.radio;
        })
        .catch((e) => {
          console.log("错误", e);
        });
    },
    handleEdit(index, row) {
      this.dialogChangeFormVisible = true;
      this.dailogTitleType = "开发商详情";
      const url = "/i18n/rest/supplierIsv/getSupplierIsvDetail";
      request({
        url,
        method: "post",
        data: {
          isvCode: row.isvCode,
          type: row.type,
          site: row.site,
        },
      })
        .then((res) => {
          this.formChange = res.data;
        })
        .catch((e) => {
          console.log("错误", e);
        });
    },
    //通过
    onClickPassButton(row) {
      clearTimeout(this.passButtonDebounceTimer);
      this.passButtonDebounceTimer = setTimeout(() => {
        let url = "";
        this.$confirm("确定要通过吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.dialogVisibleDel = false;
            url = "/i18n/rest/supplierIsv/approve";
            request({
              url,
              method: "post",
              data: {
                site: row.site,
                isvCode: row.isvCode,
                type: row.type,
              },
            }).then((res) => {
              this.$message.success("操作成功");
              this.fetchData();
            });
          })
          .catch((e) => {
            console.log("错误", e);
          });
      }, 300);
    },
    formatUser(approveUser) {
      if (approveUser === null) {
        return "—";
      } else {
        return approveUser;
      }
    },

    //驳回
    handleReject(index, row) {
      let url = "";
      this.$confirm("确定要驳回吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.dialogVisibleDel = false;
          url = "/i18n/rest/supplierIsv/reject";
          request({
            url,
            method: "post",
            data: {
              site: row.site,
              isvCode: row.isvCode,
              type: row.type,
            },
          }).then((res) => {
            this.$message.success("操作成功");
            this.fetchData();
          });
        })
        .catch((e) => {
          console.log("错误", e);
        });
    },

    //关闭对话框
    closeForm(formName) {
      this.dialogCooperationVisible = false;
      this.$refs[formName].resetFields();
    },

    indexMethod(index) {
      return index;
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },

    handleCurrentChange(val) {
      const url = "/i18n/rest/supplierIsv/querySupplierIsvList";
      request({
        url,
        method: "get",
        params: {
          type: this.type,
          netType: this.netType,
          pageSize: this.pageSize,
          pageNumb: val,
          name: this.formInline.name,
          status: this.formInline.value,
        },
      })
        .then((res) => {
          this.itemsClone = res.data.list;
          this.totalClone = res.data.total;
          this.pageSize = res.data.pageSize;
          this.pageNumb = res.data.pageNumb;
        })
        .catch((e) => {
          console.log("错误", e);
        });
    },
    prevClick() {
      const url = "/i18n/rest/supplierIsv/querySupplierIsvList";
      request({
        url,
        method: "get",
        params: {
          type: this.type,
          netType: this.netType,
          pageSize: this.pageSize,
          pageNumb: this.pageNumb - 1,
          status: this.formInline.value,
          name: this.formInline.name,
        },
      })
        .then((res) => {
          this.itemsClone = res.data.list;
          this.totalClone = res.data.total;
          this.pageSize = res.data.pageSize;
          this.pageNumb = res.data.pageNumb;
        })
        .catch((e) => {
          console.log("错误", e);
        });
    },
    nextClick() {
      const url = "/i18n/rest/supplierIsv/querySupplierIsvList";
      request({
        url,
        method: "get",
        params: {
          type: this.type,
          netType: this.netType,
          pageSize: this.pageSize,
          pageNumb: this.pageNumb + 1,
          status: this.formInline.value,
          name: this.formInline.name,
        },
      })
        .then((res) => {
          this.itemsClone = res.data.list;
          this.totalClone = res.data.total;
          this.pageSize = res.data.pageSize;
          this.pageNumb = res.data.pageNumb;
        })
        .catch((e) => {
          console.log("错误", e);
        });
    },
  },
  watch: {
    items: {
      handler(newVal, oldVal) {
        this.itemsClone = newVal;
      },
      immediate: true,
    },
    total: {
      handler(newVal, oldVal) {
        this.totalClone = newVal;
      },
      immediate: true,
    },
  },
};
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
.btnStyle {
  margin-left: 10px;
}
.dividerStyle {
  margin: 36px 0;
  .title {
    font-size: 16px;
    color: #3c6ef0;
  }
}
/deep/ .el-form-item__label[for="companyCode"] {
  font-size: 14px;
  line-height: 14px;
}
</style>