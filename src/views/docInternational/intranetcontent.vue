<template>
  <div>
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="标题">
        <el-input v-model="formInline.title" placeholder />
      </el-form-item>
      <el-form-item label="状态">
        <el-select
          v-model="formInline.value"
          placeholder="请选择状态"
          @change="selectChange"
        >
          <el-option
            v-for="item in formInline.options"
            :key="item.label"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
        <el-button
          type="primary"
          @click="
            dialogFormVisible = true;
            onNew();
          "
        >
          新建
        </el-button>
        <el-dialog
          width="1100px"
          height="650px"
          v-if="dialogFormVisible"
          :title="dailogTitleType"
          :visible.sync="dialogFormVisible"
          :close-on-click-modal="false"
        >
          <el-form class="form-wrap" ref="form" :model="form" label-width="80px">
            <p class="form-row">
              <el-form-item label="类型" style="width: 100%">
                <el-input
                  v-if="form.type == 1"
                  class="input_style"
                  value="新手指南"
                  disabled
                />
                <el-input
                  v-if="form.type == 2"
                  class="input_style"
                  value="开发支持"
                  disabled
                />
                <el-input
                  v-if="form.type == 3"
                  class="input_style"
                  value="业务单元"
                  disabled
                />
                <el-input
                  v-if="form.type == 4"
                  class="input_style"
                  value="产品"
                  disabled
                />
                <el-input
                  v-if="form.type == 5"
                  class="input_style"
                  value="新手指南"
                  disabled
                />
                <el-input
                  v-if="form.type == 6"
                  class="input_style"
                  value="开发支持"
                  disabled
                />
                <el-input
                  v-if="form.type == 7"
                  class="input_style"
                  value="API文档"
                  disabled
                />
                <el-input
                  v-if="form.type == 8"
                  class="input_style"
                  value="产品"
                  disabled
                />
                <el-input
                  v-if="form.type == 9"
                  class="input_style"
                  value="开发指南"
                  disabled
                />
              </el-form-item>
              <el-form-item label="标题" style="width: 100%">
                <el-input
                  v-model="form.title"
                  class="input_style"
                  autocomplete="off"
                />
              </el-form-item>
            </p>
            <p class="form-row">
              <el-form-item label="排序" style="width: 100%">
                <el-input
                  v-model="form.seq"
                  class="input_style"
                  type="number"
                  autocomplete="off"
                />
              </el-form-item>
              <el-form-item style="display: none">
                <el-input
                  v-model="form.status"
                  class="input_style"
                  autocomplete="off"
                />
              </el-form-item>
            </p>
          </el-form>
          <Markdown ref="newMarkdown" v-model="form.content" />
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="onSave()"> 保存草稿 </el-button>
            <el-button @click="dialogFormVisible = false">取消</el-button>
          </div>
        </el-dialog>
      </el-form-item>
    </el-form>
    <el-table v-loading="loading" :data="itemsClone" style="width: 100%">
      <el-table-column label="序号" type="index" :index="indexMethod" />
      <el-table-column label="标题" prop="title" />
      <el-table-column label="排序" prop="seq" />
      <el-table-column label="创建人" prop="createUser" />
      <el-table-column label="更新人" prop="updateUser" />
      <el-table-column label="创建时间" prop="createTime" />
      <el-table-column label="更新时间" prop="updateTime" />
      <el-table-column label="状态" prop="status" :formatter="formatter" />
      <el-table-column label="操作" align="center">
        <template slot="header" />
        <template slot-scope="scope" style="white-space: nowrap">
          <el-button-group>
            <el-button
              size="mini"
              plain
              @click="handleEdit(scope.$index, scope.row)"
            >
              修改
            </el-button>
            <el-button
              type="danger"
              size="mini"
              plain
              @click="handleDelete(scope.$index, scope.row)"
            >
              删除
            </el-button>
            <el-button
              v-show="scope.row.status == 2"
              size="mini"
              type="primary"
              plain
              @click="handleOff(scope.$index, scope.row)"
            >
              下线
            </el-button>
            <el-button
              v-show="scope.row.status == 1"
              size="mini"
              type="primary"
              plain
              @click="handlePublic(scope.$index, scope.row)"
            >
              发布
            </el-button>
            <el-button
              v-show="
                scope.row.status == 3 ||
                scope.row.status == 4 ||
                scope.row.status == 5 ||
                scope.row.status == 6
              "
              size="mini"
              type="primary"
              plain
              @click="handlePublic(scope.$index, scope.row)"
            >
              发布
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      width="1100px"
      height="650px"
      v-if="dialogChangeFormVisible"
      :title="dailogTitleType"
      :visible.sync="dialogChangeFormVisible"
      :close-on-click-modal="false"
    >
      <el-form class="form-wrap" :model="formChange" label-width="80px">
        <p class="form-row">
          <el-form-item label="类型">
            <el-input v-if="formChange.type == 1" value="新手指南" disabled />
            <el-input v-if="formChange.type == 2" value="开发支持" disabled />
            <el-input v-if="formChange.type == 3" value="业务单元" disabled />
            <el-input v-if="formChange.type == 4" value="产品" disabled />
            <el-input v-if="formChange.type == 5" value="新手指南" disabled />
            <el-input v-if="formChange.type == 6" value="开发支持" disabled />
            <el-input v-if="formChange.type == 7" value="API文档" disabled />
            <el-input v-if="formChange.type == 8" value="产品" disabled />
            <el-input v-if="formChange.type == 9" value="开发指南" disabled />
          </el-form-item>
          <el-form-item label="标题">
            <el-input v-model="formChange.title" autocomplete="off" />
          </el-form-item>
        </p>
        <p class="form-row">
          <el-form-item label="排序">
            <el-input v-model="formChange.seq" type="number" autocomplete="off" />
          </el-form-item>
        </p>
      </el-form>
      <Markdown ref="editMarkdown" v-model="formChange.content" />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onChangeSave()"> 保存草稿 </el-button>
        <el-button
          @click="
            fetchData();
            dialogChangeFormVisible = false;
          "
        >
          取消
        </el-button>
      </div>
    </el-dialog>
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
  </div>
</template>

<script>
import request from "../../utils/request";
import Markdown from "@/components/Markdown/index.vue";

export default {
  name: "IntranetContent",
  components: { Markdown },
  props: {
    items: Array,
    type: Number,
    pageSize: Number,
    page: Number,
    total: Number,
    netType: Number,
  },
  data() {
    return {
      itemsClone: [],
      totalClone: 1,
      updateId: 1,
      flag: false,
      formInline: {
        title: "",
        radio: 2,
        options: [
          {
            value: 1,
            label: "待发布",
          },
          {
            value: 2,
            label: "已发布",
          },
          {
            value: 3,
            label: "已下线",
          },
          {
            value: 4,
            label: "待审批",
          },
          {
            value: 5,
            label: "驳回",
          },
          {
            value: 6,
            label: "编辑中",
          },
        ],
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
      pageShow: true,
    };
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
  methods: {
    formatter(row, column) {
      const docTable = [
        ,
        "草稿",
        "已发布",
        "已下线",
        "待审批",
        "驳回",
        "编辑中",
      ];
      return docTable[row[column.property]];
    },
    formatTime(val) {
      const date = val.split("T")[0];
      const time = val.split("T")[1];
      const ctime = time.split(".")[0];
      return date + " " + ctime;
    },
    fetchData() {
      const url = "/doc/rest/queryDocList";
      request({
        url,
        method: "get",
        params: {
          type: this.type,
          netType: this.netType,
          rows: this.pageSize,
          page: this.page,
          title: this.formInline.title,
          status: this.formInline.value,
        },
      })
        .then((res) => {
          this.itemsClone = res.data.rows;
          this.totalClone = res.data.total;
          this.pageSize = res.data.pageSize;
        })
        .catch((e) => {
          console.log("错误", e);
        });
    },
    selectChange(val) {
      console.log("val", val);
    },
    onSubmit() {
      console.log("发送查询接口请求：this.formInline", this.formInline);
      const url = "/doc/rest/queryDocList";
      request({
        url,
        method: "get",
        params: {
          type: this.type,
          netType: this.netType,
          title: this.formInline.title,
          status: this.formInline.value,
          page: 1,
        },
      })
        .then((res) => {
          this.pageShow = false;
          this.itemsClone = res.data.rows;
          this.totalClone = res.data.total;
          this.pageSize = res.data.pageSize;
          this.page = 1;
          this.netType = this.formInline.radio;
          this.$nextTick(function () {
            this.pageShow = true;
          });
          this.fetchData();
        })
        .catch((e) => {
          console.log("错误", e);
        });
    },
    onNew() {
      this.dailogTitleType = "通用文档新增";
      this.form = {
        netType: 2,
        title: "",
        content: "",
        seq: "",
        type: this.type,
        status: 1,
        docGroupCode: "",
      };
    },
    handleEdit(index, row) {
      this.dialogChangeFormVisible = true;
      this.updateId = row.id;
      this.dailogTitleType = "通用文档更新";
      request({
        url: "/doc/rest/getById",
        method: "get",
        params: { id: row.id },
      }).then((res) => {
        console.log("成功", res);
        this.formChange = res.data;
        this.$refs.editMarkdown.setValue(res.data.content);
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
          const url = "/doc/rest/deleteDoc";
          request({
            url,
            method: "get",
            params: {
              id: row.id,
            },
          }).then((res) => {
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
          const url = "/doc/rest/downDoc";
          request({
            url,
            method: "get",
            params: {
              id: row.id,
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
    handlePublic(index, row) {
      this.$confirm("确定将当前内容发布到前台?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.dialogVisibleDel = false;
          this.loading = true;
          const url = "/doc/rest/publishDoc";
          request({
            url,
            method: "get",
            params: {
              id: row.id,
              bizPublish: 0,
            },
          }).then((res) => {
            this.loading = false;
            this.$message.success("操作成功");
            this.fetchData();
          });
        })
        .catch((e) => {
          this.loading = false;
          console.log("错误", e);
        });
    },
    indexMethod(index) {
      return index;
    },
    onSave() {
      this.form.content = this.$refs.newMarkdown.getValue();
      request({
        url: "/doc/rest/editDoc",
        method: "post",
        data: this.form,
      }).then((res) => {
        console.log("成功", res);
        this.dialogFormVisible = false;
        this.searchData();
      });
    },
    onChangeSave() {
      var obj = {
        netType: this.formChange.netType,
        content: this.$refs.editMarkdown.getValue(),
        seq: this.formChange.seq,
        title: this.formChange.title,
        type: this.formChange.type,
        id: this.updateId,
        status: this.formChange.status,
      };
      request({
        url: "/doc/rest/editDoc",
        method: "post",
        data: obj,
      }).then((res) => {
        this.dialogChangeFormVisible = false;
        this.fetchData();
      });
    },
    searchData() {
      const url = "/doc/rest/queryDocList";
      request({
        url,
        method: "get",
        params: {
          type: this.form.type,
          netType: this.form.netType,
          rows: this.pageSize,
          page: this.page,
        },
      })
        .then((res) => {
          this.itemsClone = res.data.rows;
          this.totalClone = res.data.total;
          this.pageSize = res.data.pageSize;
          this.netType = this.form.netType;
        })
        .catch((e) => {
          console.log("错误", e);
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
      console.log("handleCurrentChangeval", val);
      this.page = val;
      this.fetchData();
    },
    prevClick() {
      const url = "/doc/rest/queryDocList";
      request({
        url,
        method: "get",
        params: {
          type: this.type,
          netType: this.netType,
          rows: this.pageSize,
          page: this.page - 1,
          title: this.formInline.title,
          status: this.formInline.value,
        },
      })
        .then((res) => {
          this.itemsClone = res.data.rows;
          this.totalClone = res.data.total;
          this.pageSize = res.data.pageSize;
          // this.page = res.data.page
        })
        .catch((e) => {
          console.log("错误", e);
        });
    },
    nextClick() {
      const url = "/doc/rest/queryDocList";
      request({
        url,
        method: "get",
        params: {
          type: this.type,
          netType: this.netType,
          rows: this.pageSize,
          page: this.page + 1,
          title: this.formInline.title,
          status: this.formInline.value,
        },
      })
        .then((res) => {
          console.log(111, this.page);
          this.itemsClone = res.data.rows;
          this.totalClone = res.data.total;
          this.pageSize = res.data.pageSize;
        })
        .catch((e) => {
          console.log("错误", e);
        });
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
::v-deep .el-dialog__body {
  max-height: 66vh;
  overflow: auto;
}
.form-wrap {
  display: flex;
  .form-row {
    flex: 1;
  }
}
</style>
