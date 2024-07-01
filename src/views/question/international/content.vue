<template>
  <div>
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="网络类型">
        <el-radio v-model="formInline.radio" :label="1">外网</el-radio>
        <el-radio v-model="formInline.radio" :label="2">内网</el-radio>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
        <el-button
          type="primary"
          @click="
            dialogFormVisible = true;
            onNew();
          "
          >新建</el-button
        >
        <el-dialog
          width="1100px"
          height="650px"
          :title="dailogTitleType"
          v-if="dialogFormVisible"
          :visible.sync="dialogFormVisible"
          :close-on-click-modal="false"
        >
          <el-form class="form-wrap" :model="form" ref="form" label-width="80px">
            <p class="form-row">
            <el-form-item label="网络类型" style="width: 100%">
              <el-radio v-model="form.netType" :label="2">内网</el-radio>
              <el-radio v-model="form.netType" :label="1">外网</el-radio>
            </el-form-item>
            <el-form-item label="问题类型" style="width: 100%">
              <el-input
                class="input_style"
                v-if="form.type == 1"
                value="API相关问题"
                disabled
              ></el-input>
              <el-input
                class="input_style"
                v-if="form.type == 2"
                value="授权相关问题"
                disabled
              ></el-input>
              <el-input
                class="input_style"
                v-if="form.type == 3"
                value="订购相关问题"
                disabled
              ></el-input>
              <el-input
                class="input_style"
                v-if="form.type == 4"
                value="入驻相关问题"
                disabled
              ></el-input>
              <el-input
                class="input_style"
                v-if="form.type == 5"
                value="其他问题"
                disabled
              ></el-input>
              <el-input
                class="input_style"
                v-if="form.type == 6"
                value="API相关问题"
                disabled
              ></el-input>
              <el-input
                class="input_style"
                v-if="form.type == 7"
                value="授权相关问题"
                disabled
              ></el-input>
              <el-input
                class="input_style"
                v-if="form.type == 8"
                value="订购相关问题"
                disabled
              ></el-input>
              <el-input
                class="input_style"
                v-if="form.type == 9"
                value="入驻相关问题"
                disabled
              ></el-input>
              <el-input
                class="input_style"
                v-if="form.type == 10"
                value="其他问题"
                disabled
              ></el-input>
            </el-form-item>
            </p>
            <p class="form-row">
            <el-form-item label="问题描述" style="width: 100%">
              <el-input
                class="input_style"
                v-model="form.question"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="排序" style="width: 100%">
              <el-input
                class="input_style"
                v-model="form.seq"
                type="number"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            </p>
            <el-form-item style="display: none">
              <el-input
                class="input_style"
                v-model="form.status"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </el-form>
          <el-tabs v-model="language">
            <el-tab-pane label="中文" name="cn">
                <Markdown ref="newMarkdown" idKey="cn" v-model="form.solution" />
            </el-tab-pane>
            <el-tab-pane label="英文" name="en">
                <Markdown ref="newMarkdownEn" idKey="en"  v-model="form.solutionEnglish" />
            </el-tab-pane>
          </el-tabs>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="onSave()">保存草稿</el-button>
            <el-button @click="dialogFormVisible = false">取消</el-button>
          </div>
        </el-dialog>
      </el-form-item>
    </el-form>
    <el-table v-loading="loading" :data="itemsClone" style="width: 100%">
      <el-table-column
        label="序号"
        type="index"
        :index="indexMethod"
      ></el-table-column>
      <el-table-column label="问题类型枚举" prop="type">
        <template slot-scope="{ row }">{{ typeRender(row.type) }}</template>
      </el-table-column>
      <el-table-column label="问题描述" prop="question"></el-table-column>
      <el-table-column label="排序" prop="seq"></el-table-column>
      <el-table-column label="创建人" prop="createUser"></el-table-column>
      <el-table-column label="创建时间" prop="createTime"></el-table-column>
      <el-table-column
        label="状态"
        prop="status"
        :formatter="formatter"
      ></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot="header"></template>
        <template slot-scope="scope" style="white-space: nowrap">
          <el-button-group>
            <el-button
              size="mini"
              plain
              @click="handleEdit(scope.$index, scope.row)"
              >修改</el-button
            >
            <el-button
              size="mini"
              plain
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
            <el-button
              size="mini"
              type="primary"
              @click="handleOff(scope.$index, scope.row)"
              plain
              v-show="scope.row.status == 2"
              >下线</el-button
            >
            <el-button
              size="mini"
              type="primary"
              plain
              @click="handlePublic(scope.$index, scope.row)"
              v-show="scope.row.status == 1"
              >发布</el-button
            >
            <el-button
              size="mini"
              type="primary"
              @click="handlePublic(scope.$index, scope.row)"
              plain
              v-show="
                scope.row.status == 3 ||
                scope.row.status == 4 ||
                scope.row.status == 5
              "
              >发布</el-button
            >
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      width="1100px"
      height="650px"
      :title="dailogTitleType"
      v-if="dialogChangeFormVisible"
      :visible.sync="dialogChangeFormVisible"
      :close-on-click-modal="false"
    >
      <el-form class="form-wrap" :model="formChange" label-width="80px">
        <p class="form-row">
        <el-form-item label="网络类型">
          <el-radio v-model="formChange.netType" :label="2">内网</el-radio>
          <el-radio v-model="formChange.netType" :label="1">外网</el-radio>
        </el-form-item>
        <el-form-item label="问题类型">
          <el-input
            v-if="formChange.type == 1"
            value="API相关问题"
            disabled
          ></el-input>
          <el-input
            v-if="formChange.type == 2"
            value="授权相关问题"
            disabled
          ></el-input>
          <el-input
            v-if="formChange.type == 3"
            value="订购相关问题"
            disabled
          ></el-input>
          <el-input
            v-if="formChange.type == 4"
            value="入驻相关问题"
            disabled
          ></el-input>
          <el-input
            v-if="formChange.type == 5"
            value="其他问题"
            disabled
          ></el-input>
          <el-input
            v-if="formChange.type == 6"
            value="API相关问题"
            disabled
          ></el-input>
          <el-input
            v-if="formChange.type == 7"
            value="授权相关问题"
            disabled
          ></el-input>
          <el-input
            v-if="formChange.type == 8"
            value="订购相关问题"
            disabled
          ></el-input>
          <el-input
            v-if="formChange.type == 9"
            value="入驻相关问题"
            disabled
          ></el-input>
          <el-input
            v-if="formChange.type == 10"
            value="其他问题"
            disabled
          ></el-input>
        </el-form-item>
        </p>
        <p class="form-row">
        <el-form-item label="问题描述">
          <el-input v-model="formChange.question" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-input
            v-model="formChange.seq"
            type="number"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        </p>
      </el-form>
      <el-tabs v-model="editLanguage">
        <el-tab-pane label="中文" name="cn">
            <Markdown ref="editMarkdown" idKey="editCn" v-model="editSolution" />
        </el-tab-pane>
        <el-tab-pane label="英文" name="en">
            <Markdown ref="editMarkdownEn" idKey="editEn" v-model="editSolutionEn" />
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onChangeSave()">保存草稿</el-button>
        <el-button
          @click="
            handleCancel();
            dialogChangeFormVisible = false;
          ">取消</el-button>
      </div>
    </el-dialog>
    <div class="pagination-wrap" v-if="itemsClone.length !== 0">
      <el-pagination
        background
        @current-change="handleCurrentChange"
        :current-page.sync="page"
        :page-size="pageSize"
        layout="prev, pager, next, jumper"
        :total="totalClone"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import request from "../../../utils/request";
import Markdown from "@/components/Markdown/index.vue";
import { questionRequest } from "@/api/module/international/question";
let oldQuestion = "";
let oldNetType;
// TODO:接口请求地址待改为国际站接口地址
export default {
  name: "Content",
  components: { Markdown },
  props: {
    items: Array,
    type: Number,
    pageSize: Number,
    total: Number,
  },
  data() {
    return {
      editSolution: "",
      editSolutionEn: "",
      itemsClone: [],
      totalClone: 1,
      updateId: 1,
      flag: false,
      page: 1,
      // type: 2,
      netType: 2,
      formInline: {
        radio: 2,
      },
      dialogFormVisible: false,
      dialogChangeFormVisible: false,
      dialogVisible: false,
      dialogVisibleDel: false,
      dailogTitleType: "",
      msg: "",
      value: "",
      form: {},
      temp: {},
      formChange: {},
      formLabelWidth: "156px",
      loading: false,
      language: 'cn',
      editLanguage: 'cn',
    };
  },
  methods: {
    formatter(row, column) {
      const questionTable = ["", "草稿", "已发布", "已下线", "待审批", "驳回"];
      return questionTable[row[column.property]];
    },
    formatTime(val) {
      let date = val.split("T")[0];
      let time = val.split("T")[1];
      let ctime = time.split(".")[0];
      return date + " " + ctime;
    },
    typeRender(type) {
      if (type == 1) {
        return "API相关问题";
      } else if (type == 2) {
        return "授权相关问题";
      } else if (type == 3) {
        return "订购相关问题";
      } else if (type == 4) {
        return "入驻相关问题";
      } else if (type == 5) {
        return "其他问题";
      } else if (type == 6) {
        return "API相关问题";
      } else if (type == 7) {
        return "授权相关问题";
      } else if (type == 8) {
        return "订购相关问题";
      } else if (type == 9) {
        return "入驻相关问题";
      } else if (type == 10) {
        return "其他问题";
      }
    },
    handleCancel() {
      this.page = 1;
      this.fetchData();
    },
    fetchData() {
       this.loading = true;
      questionRequest.queryQuestionList({
          type: this.type,
          netType: this.formInline.radio,
          pageSize: this.pageSize,
          pageNumb: this.page,
      })
        .then((res) => {
          this.loading = false;
          this.itemsClone = res.data.list || [];
          this.totalClone = res.data.total;
        })
        .catch((e) => {
          this.loading = false;
          console.log("错误", e);
        });
    },
    onSubmit() {
      this.page = 1;
      this.fetchData();
    },
    onNew() {
      this.dailogTitleType = "通用文档新增";
      this.form = {
        netType: 2,
        title: "",
        solution: "",
        solutionEnglish: "",
        seq: "",
        type: this.type,
        status: 1,
      };
    },
    handleEdit(index, row) {
      this.dialogChangeFormVisible = true;
      this.updateId = row.id;
      this.dailogTitleType = "常见问题更新";
      questionRequest.getQuestionDetailById({
        id: row.id
      })
      .then((res) => {
        this.formChange = res.data;
        this.$refs.editMarkdown.setValue(res.data.solution);
        this.$refs.editMarkdownEn.setValue(res.data.solutionEnglish);
        oldQuestion = res.data.question;
        oldNetType = res.data.netType;
      });
    },
    handleDelete(index, row) {
      this.$confirm("确定删除当前内容?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.dialogVisibleDel = false;
          const {netType, question} = row || {};
          questionRequest.deleteQuestion({
            type: this.type, 
            netType, 
            question
          })
          .then((res) => {
            this.$message.success("删除成功");
            this.fetchData();
          });
        })
        .catch((e) => {
          console.log("错误", e);
        });
    },
    handleOff(index, row) {
      this.$confirm("确定将当前内容从前台界面下线?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.dialogVisibleDel = false;
          const {netType, question} = row;
          questionRequest.downQuestion({
            type: this.type, netType, question
          })
          .then((res) => {
            this.$message.success("操作成功");
            this.fetchData();
          });
        })
        .catch((e) => {
          console.log("错误", e);
        });
    },
    handlePublic(index, row) {
      this.$confirm("确定将当前内容发布到前台?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.dialogVisibleDel = false;
          questionRequest.publishQuestion({
            type: this.type,
            netType: row.netType,
            question: row.question,
          })
          .then((res) => {
            this.$message.success("操作成功");
            this.fetchData();
          });
        })
        .catch((e) => {
          console.log("错误", e);
        });
    },
    indexMethod(index) {
      return index;
    },
    onSave() {
      this.form.solution = this.$refs.newMarkdown.getValue();
      this.form.solutionEnglish = this.$refs.newMarkdownEn.getValue();
      const {type, netType, question, solution, solutionEnglish, seq} = this.form;
      questionRequest.editQuestion({
        type, 
        netType, 
        question: question || "", 
        solution, 
        solutionEnglish, 
        seq,
        id: null,
        oldQuestion: null,
        oldNetType:null,
      })
      .then((res) => {
        this.dialogFormVisible = false;
        this.formInline.radio = this.form.netType;
        this.page = 1;
        this.fetchData()
      });
    },
    onChangeSave() {
      questionRequest.editQuestion({
        oldQuestion: oldQuestion,
        type: this.type,
        netType: this.formChange.netType,
        question: this.formChange.question,
        solution: this.$refs.editMarkdown.getValue(),
        solutionEnglish: this.$refs.editMarkdownEn.getValue(),
        seq: this.formChange.seq,
        id: this.updateId,
        oldNetType: oldNetType,
      })
      .then((res) => {
        this.dialogChangeFormVisible = false;
        this.fetchData();
      });
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    handleCurrentChange(val) {
      this.page = val;
      this.fetchData();
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
.form-wrap {
    display: flex;
    .form-row {
        flex:1;
    }
}
</style>