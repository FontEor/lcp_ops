<template>
  <div>
    <!-- 查询及新增表单 -->
    <el-form :model="formInline" :inline="true">
      <div class="wrapper-left">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model.trim="formInline.name" placeholder="请输入" @keyup.enter.native="onSubmit"></el-input>
        </el-form-item>
        <el-button type="primary" @click="onSubmit()">查询</el-button>
      </div>
      <span class="wrapper-right">
        <el-button type="primary" @click="addNew()">新增</el-button>
      </span>
    </el-form>
    <!-- 表格内容 -->
    <el-table :data="queryBusinessTypeList">
      <el-table-column label="序号" align="center" type="index" />
      <el-table-column label="分类编码" align="center" prop="code" />
      <el-table-column label="分类名称" align="center" prop="name" />
      <el-table-column label="更新人" align="center" prop="updateUser" />
      <el-table-column label="更新时间" align="center" prop="updateTime" />
      <el-table-column label="排序" align="center" prop="seq" />
      <el-table-column label="操作" align="center">
        <template slot-scope="{ row }">
          <el-button type="primary" size="mini" plain @click="handleEdit(row)">编辑</el-button>
          <el-button type="primary" size="mini" plain @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-wrap" v-if="queryBusinessTypeList&&queryBusinessTypeList.length !== 0">
      <el-pagination background layout="prev, pager, next, jumper" :current-page.sync="page" :page-size="rows" :total="total" @current-change="handleCurrentChange" @prev-click="prevClick" @next-click="nextClick"></el-pagination>
    </div>

    <!-- 新增对话框  -->
    <el-dialog width="400px" height="100%" :title="dailogTitleType" :visible="dialogAddFormVisible" v-if="dialogAddFormVisible" :show-close="false">
      <el-form class="edit" ref="formAdd" :model="formAdd" label-width="80px" :rules="rulesAdd">
        <el-form-item label="分类编码" prop="code" :error="errorMsgCode">
          <el-input v-model="formAdd.code"></el-input>
        </el-form-item>
        <el-form-item label="分类名称" prop="name" :error="errorMsgName">
          <el-input v-model="formAdd.name"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="seq">
          <el-input-number v-model="formAdd.seq" :min="0"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onChangeSaveAdd('formAdd')">保存</el-button>
        <el-button @click="resetFormAdd('formAdd')">取消</el-button>
      </div>
    </el-dialog>
    <!-- 编辑对话框  -->
    <el-dialog width="400px" height="100%" :title="dailogTitleType" :visible="dialogFormVisible" v-if="dialogFormVisible" :show-close="false">
      <el-form class="edit" ref="formEdit" :model="formEdit" label-width="80px" :rules="rules">
        <el-form-item label="分类编码" prop="code" :error="errorMsgCode">
          <el-input :disabled="true" v-model="formEdit.code"></el-input>
        </el-form-item>
        <el-form-item label="分类名称" prop="name" :error="errorMsgName">
          <el-input v-model="formEdit.name"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="seq">
          <el-input-number v-model="formEdit.seq" :min="0"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onChangeSave('formEdit')">保存</el-button>
        <el-button @click="resetForm('formEdit')">取消</el-button>
      </div>
    </el-dialog>
    <!-- 删除前检查弹框提示话术 -->
    <el-dialog width="400px" height="100%" :visible.sync="dialogDeleteVisible" :show-close="false" center>
      <p class="textStyle">{{ deleteText }}</p>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogDeleteVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import request from "../../utils/request";

export default {
  name: "Content",
  props:['type'],
  data() {
    return {
      //表单校验
      rules: {
        code: [
          { required: true, message: "请输入分类编码", trigger: "blur" },
          {
            pattern: /^[a-z0-9A-Z]*$/,
            message: "只允许输入数字、字母，请重新输入",
          },
        ],
        name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
          {
            max: 50,
            message: "长度不得超过50个字符",
          },
        ],
        seq: [{ required: true, message: "请输入排序" }],
      },
      rulesAdd: {
        code: [
          { required: true, message: "请输入分类编码", trigger: "blur" },
          {
            pattern: /^[a-z0-9A-Z]*$/,
            message: "只允许输入数字、字母，请重新输入",
          },
        ],
        name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
          {
            max: 50,
            message: "长度不得超过50个字符",
          },
        ],
        seq: [{ required: true, message: "请输入排序" }],
      },

      queryBusinessTypeList: [],
      dailogTitleType: "",
      formInline: {
        name: "",
      },
      formEdit: {
        code: "",
        name: "",
        seq: 0,
      },
      formAdd: {
        code: "",
        name: "",
        seq: 0,
      },
      value: 1,
      dialogFormVisible: false,
      dialogDetailFormVisible: false,
      page: 1,
      rows: 10,
      total: 100,
      detail: {},
      submitForm: {},
      updateId: 1,
      errorMsgCode: "",
      errorMsgName: "",
      dialogDeleteVisible: false,
      dialogAddFormVisible: false,
      deleteText: "",
    };
  },
  methods: {
    //查询
    onSubmit() {
      console.log("name", this.formInline.name);
      const url = "/businessType/rest/queryBusinessTypeList";
      request({
        url,
        method: "get",
        params: {
          queryName: this.formInline.name,
          page: 1,
          solutionType: this.type
        },
      })
        .then((res) => {
          this.queryBusinessTypeList = res.data.rows;
          this.total = res.data.total;
          this.page = 1;
        })
        .catch((e) => {
          console.log("按钮提交错误：", e);
        });
    },
    fetchData() {
      const url = "/businessType/rest/queryBusinessTypeList";
      request({
        url,
        method: "get",
        params: {
          page: this.page,
          queryName: this.formInline.name,
          solutionType: this.type
        },
      })
        .then((res) => {
          this.queryBusinessTypeList = res.data.rows==null?[]:res.data.rows;
          this.total = res.data.total;
        })
        .catch((e) => {
          console.log("按钮提交错误：", e);
        });
    },

    //更新对接方案分类
    handleEdit(row) {
      this.dialogFormVisible = true;
      this.dailogTitleType = "更新配置分类";
      this.updateId = row.id;
      const url = "/businessType/rest/gotoBusinessTypeEdit";
      request({
        url,
        method: "get",
        params: {
          id: row.id,
          solutionType: this.type
        },
      })
        .then((res) => {
          console.log(res);
          this.formEdit = res.data;
          console.log("this.updateId", this.updateId);
        })
        .catch((e) => {
          console.log("错误", e);
        });
    },
    //删除
    handleDelete(row) {
      console.log("row", row);
      //删除前检查有无关联对接方案
      const url = "/businessType/rest/deleteBusinessTypeCheck";
      request({
        url,
        method: "get",
        params: {
          businessTypeCode: row.code
        },
      }).then((res) => {
          console.log(res);
          if (res.code === 1001) {
            //不可以删除
            this.deleteText = res.message;
            this.dialogDeleteVisible = true;
            this.fetchData();
          } else {
            this.$confirm("是否确定删除此配置分类?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            })
              .then(() => {
                const url = "/businessType/rest/deleteBusinessType";
                request({
                  url,
                  method: "get",
                  params: {
                    id: row.id                  },
                }).then((res) => {
                  this.$message.success("删除成功");
                  this.page = 1;
                  this.fetchData();
                });
              })
              .catch((e) => {
                console.log("错误", e);
              });
          }
        })
        .catch((e) => {
          console.log("错误", e);
        });
    },

    //保存新增
    onChangeSaveAdd(formName) {
      console.log("新增");
      console.log(this.$refs, "保存时的this.$refs");
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.errorMsgCode = "";
          this.errorMsgName = "";
          this.submitForm = {
            id: this.updateId,
            name: this.formAdd.name,
            code: this.formAdd.code,
            seq: this.formAdd.seq,
            solutionType: this.type
          };
          const url = "/businessType/rest/saveBusinessType";
          request({
            url,
            method: "post",
            data: this.submitForm,
          })
            .then((res) => {
              console.log(res);
              if (res.code === 1001) {
                if (res.message === "分类名称已存在，请重新输入") {
                  this.errorMsgName = res.message;
                } else if (res.message === "分类编码已存在，请重新输入") {
                  this.errorMsgCode = res.message;
                }
                return false;
              } else {
                this.dialogAddFormVisible = false;
                this.$message.success("保存成功");
                this.fetchData();
              }
            })
            .catch((e) => {
              console.log("错误", e);
            });
        } else {
          console.log("validate false");
          return false;
        }
      });
    },

    //保存编辑
    onChangeSave(formName) {
      console.log("编辑");
      console.log(this.$refs, "保存时的this.$refs");
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.errorMsgCode = "";
          this.errorMsgName = "";
          this.submitForm = {
            id: this.updateId,
            name: this.formEdit.name,
            code: this.formEdit.code,
            seq: this.formEdit.seq,
            solutionType: this.type
          };
          const url = "/businessType/rest/saveBusinessType";
          request({
            url,
            method: "post",
            data: this.submitForm,
          })
            .then((res) => {
              console.log(res);
              if (res.code === 1001) {
                if (res.message === "分类名称已存在，请重新输入") {
                  this.errorMsgName = res.message;
                } else if (res.message === "分类编码已存在，请重新输入") {
                  this.errorMsgCode = res.message;
                }
                return false;
              } else {
                this.dialogFormVisible = false;
                this.$message.success("保存成功");
                this.fetchData();
              }
            })
            .catch((e) => {
              console.log("错误", e);
            });
        } else {
          console.log("validate false");
          return false;
        }
      });
    },
    //新增对接方案分类
    addNew() {
      this.formAdd.code = "";
      this.formAdd.name = "";
      this.dialogAddFormVisible = true;
      //新增的id传0
      this.updateId = 0;
      this.dailogTitleType = "新增对接方案分类";
    },

    //重置表单
    resetForm(formName) {
      this.$nextTick(() => {
        this.$refs[formName].resetFields();
      });
      this.dialogFormVisible = false;
    },

    resetFormAdd(formName) {
      this.$nextTick(() => {
        this.$refs[formName].resetFields();
      });
      this.dialogAddFormVisible = false;
    },

    handleCurrentChange(val) {
      console.log(val);
      const url = "/businessType/rest/queryBusinessTypeList";
      request({
        url,
        method: "get",
        params: {
          queryName: this.formInline.name,
          page: val,
          solutionType: this.type
        },
      })
        .then((res) => {
          this.queryBusinessTypeList = res.data.rows;
          this.total = res.data.total;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    prevClick() {
      const url = "/businessType/rest/queryBusinessTypeList";
      request({
        url,
        method: "get",
        params: {
          queryName: this.formInline.name,
          page: this.page - 1,
          solutionType: this.type
        },
      })
        .then((res) => {
          this.queryBusinessTypeList = res.data.rows;
          this.total = res.data.total;
        })
        .catch((e) => {
          console.log("请求下一页错误", e);
        });
    },
    nextClick() {
      const url = "/businessType/rest/queryBusinessTypeList";
      request({
        url,
        method: "get",
        params: {
          queryName: this.formInline.name,
          page: this.page + 1,
          solutionType: this.type
        },
      })
        .then((res) => {
          this.queryBusinessTypeList = res.data.rows;
          this.total = res.data.total;
        })
        .catch((e) => {
          console.log("请求下一页错误", e);
        });
    },
  },
  mounted() {
    this.onSubmit();
  },
};
</script>
<style lang="scss" scoped>
.pagination-wrap {
  margin-top: 20px;
  text-align: center;
}
.wrapper-left {
  float: left;
}
.wrapper-right {
  float: right;
  margin-right: 10px;
}
.textStyle {
  text-indent: 32px;
}
</style>