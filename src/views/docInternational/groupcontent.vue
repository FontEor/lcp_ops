<template>
  <div>
    <el-form :inline="true" :model="formInline" class="demo-form-inline" @submit.native.prevent>
      <el-form-item label="分组名称">
        <el-input v-model="formInline.groupName" placeholder />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
      <el-form-item style="float:right">
        <el-button type="primary" icon="el-icon-plus" @click="addGroup">新增分组</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="loading" :data="itemsClone" style="width: 100%">
      <el-table-column label="序号" type="index" :index="indexMethod" />
      <el-table-column label="分组名称" prop="groupName" />
      <el-table-column label="分组编码" prop="code" />
      <el-table-column label="排序" prop="seq" />
      <el-table-column label="创建时间" prop="createTime" />
      <el-table-column label="更新时间" prop="updateTime" />
      <el-table-column label="操作" align="center">
        <template slot-scope="scope" style="white-space: nowrap">
          <el-button type="text" @click="handleEdit(scope.$index, scope.row)">
            编辑
          </el-button>
          <el-button type="text" @click="groupdoc(scope.$index, scope.row)">
            维护组内文档
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="itemsClone.length !== 0" class="pagination-wrap">
      <el-pagination
        v-if="pageShow"
        background
        :current-page.sync="page"
        :page-size="pageSize"
        layout="prev, pager, next, jumper"
        :total="totalClone"
        @current-change="handleCurrentChange"
        @prev-click="prevClick"
        @next-click="nextClick"
      />
    </div>

    <!--新增分组弹出框-->
    <el-dialog title="新增分组" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="80px">
        <el-form-item label="分组名称" prop="groupName">
          <el-input v-model="ruleForm.groupName" />
        </el-form-item>
        <el-form-item label="分组编码" prop="code">
          <el-input v-model="ruleForm.code" />
        </el-form-item>
        <el-form-item label="排序" prop="seq">
          <el-input v-model="ruleForm.seq" type="number" autocomplete="off" maxlength="4" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSave">确 定</el-button>
      </span>
    </el-dialog>

    <!--编辑分组弹出框-->
    <el-dialog title="编辑分组" :visible.sync="editDialogVisible" width="30%" :before-close="editHandleClose">
      <el-form ref="ruleEditForm" :model="ruleForm" :rules="rules" label-width="80px">
        <el-form-item label="分组名称" prop="groupName">
          <el-input v-model="ruleForm.groupName" />
        </el-form-item>
        <el-form-item label="排序" prop="seq">
          <el-input v-model="ruleForm.seq" type="number" autocomplete="off" maxlength="4" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onEditSave">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import request from "../../utils/request";
import { documentRequest } from "@/api/module/international/document";

export default {
  name: "GroupContent",
  props: {
    groupType: Number,
    items: Array,
    pageSize: Number,
    page: Number,
    total: Number
  },
  data() {
    return {
      itemsClone: [],
      totalClone: 1,
      formInline: {
        groupName: ""
      },
      pageShow: true,
      loading: false,
      dialogVisible: false,
      editDialogVisible: false,
      ruleForm: {
        groupName: "",
        seq: "",
        code: "",
        id: ""
      },
      rules: {
        groupName: [
          { required: true, message: "请输入分组名称", trigger: "blur" },
          { min: 1, max: 255, message: "长度在 1 到 255 个字符", trigger: "blur" }
        ],
        seq: [{ required: true, message: "排序不能为空" }],
        code: [
          { required: true, message: "请输入分组编码", trigger: "blur" },
          { min: 1, max: 5, message: "长度在 1 到 5 个字符", trigger: "blur" }
        ]
      }
    };
  },
  watch: {
    items: {
      handler(newVal, oldVal) {
        this.itemsClone = newVal || [];
      },
      immediate: true
    },
    total: {
      handler(newVal, oldVal) {
        this.totalClone = newVal;
      },
      immediate: true
    }
  },
  methods: {
    indexMethod(index) {
      return index;
    },
    handleCurrentChange(val) {
      this.page = val;
      this.fetchData();
    },
    fetchData() {
      this.itemsClone = [];
      this.totalClon = 0;
      documentRequest.queryDocGroupList({
          groupType: this.groupType,
          pageSize: this.pageSize,
          pageNumb: this.page,
          groupName: this.formInline.groupName
      })
        .then(res => {
          this.itemsClone = res.data.list || [];
          this.totalClone = res.data.total;
        })
        .catch(e => {
          console.log("错误", e);
        });
    },
    /**
     * 查询提交
     */
    onSubmit() {
      this.page = 1;
      this.fetchData();
    },
    nextClick() {
      this.page = this.page + 1;
      this.fetchData();
    },
    prevClick() {
      this.page = this.page - 1;
      this.fetchData();
    },
    /**
     * 弹出添加分组框
     */
    addGroup() {
      this.ruleForm.groupName = "";
      this.ruleForm.seq = "";
      this.ruleForm.id = "";
      this.dialogVisible = true;
      if (this.$refs.ruleForm) {
        this.$refs.ruleForm.resetFields();
      }
    },
    /**
     * 保存分组数据
     */
    onSave() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          documentRequest
            .saveDocGroup({
              seq: this.ruleForm.seq,
              groupName: this.ruleForm.groupName,
              groupType: `${this.groupType}`,
              code: this.ruleForm.code
            })
            .then(res => {
              this.page = 1;
              this.fetchData();
              this.dialogVisible = false;
            })
            .catch(e => {
              console.log("错误", e);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    /**
     * 关闭新增分组框
     */
    handleClose() {
      this.dialogVisible = false;
    },
    /**
     * 取消编辑框
     */
    editHandleClose() {
      this.editDialogVisible = false;
    },
    /**
     * 编辑框弹出
     */
    handleEdit(index, row) {
      if (this.$refs.ruleEditForm) {
        this.$refs.ruleEditForm.resetFields();
      }
      this.ruleForm.groupName = row.groupName;
      this.ruleForm.seq = row.seq;
      this.editDialogVisible = true;
      this.ruleForm.id = row.id;
      this.ruleForm.code = row.code;
    },
    /**
     * 保存编辑
     */
    onEditSave() {
      this.$refs.ruleEditForm.validate(valid => {
        if (valid) {
          documentRequest.update({
            code: this.ruleForm.code,
            groupType: this.groupType,
            seq: this.ruleForm.seq,
            groupName: this.ruleForm.groupName,
          })
            .then(res => {
              this.page = 1;
              this.fetchData();
              this.editDialogVisible = false;
            })
            .catch(e => {
              console.log("错误", e);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    /**
     * 分组内文档展示
     */
    groupdoc(index, row) {
      this.$emit("returnClick", row);
    }
  }
};
</script>
<style lang="scss" scoped>
.pagination-wrap {
  margin-top: 20px;
  text-align: center;
}
</style>
