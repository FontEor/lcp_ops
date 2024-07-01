<template>
  <div>
    <div>
      <el-button type="text" @click="returnBack">&lt;返回至分组列表</el-button>
    </div>
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="标题">
        <el-input v-model="formInline.title" placeholder />
      </el-form-item>
      <el-form-item label="状态">
        <el-select
          v-model="formInline.value"
          placeholder="请选择状态"
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
          :title="dailogTitleType"
          v-if="dialogFormVisible"
          :visible.sync="dialogFormVisible"
          :close-on-click-modal="false"
        >
          <el-form class="form-wrap" ref="form" :model="form" label-width="80px">
            <p class="form-row">
              <el-form-item label="文档类型:" style="width: 100%">
                <el-input
                  v-if="form.type == 1"
                  class="input_style"
                  value="新手指南"
                  disabled
                />
                <el-input
                  v-if="form.type == 2"
                  class="input_style"
                  value="技术文档"
                  disabled
                />
              </el-form-item>
              <el-form-item label="文档分组:" style="width: 100%">
                <el-input
                  class="input_style"
                  v-model="docGroup.groupName"
                  :disabled="true"
                >
                </el-input>
              </el-form-item>
            </p>
            <p class="form-row">
              <el-form-item label="标题:" style="width: 100%">
                <el-input
                  v-model="form.title"
                  class="input_style"
                  autocomplete="off"
                />
              </el-form-item>
              <el-form-item label="排序:" style="width: 100%">
                <el-input
                  v-model="form.seq"
                  class="input_style"
                  type="number"
                  autocomplete="off"
                />
              </el-form-item>
            </p>
            <el-form-item style="display: none">
              <el-input
                v-model="form.status"
                class="input_style"
                autocomplete="off"
              />
            </el-form-item>
          </el-form>
          <el-tabs v-model="languageNew">
            <el-tab-pane label="中文" name="cn">
              <Markdown ref="newMarkdown" idKey="cnNew" v-model="form.content" />
            </el-tab-pane>
            <el-tab-pane label="英文" name="en">
              <Markdown ref="newMarkdownNewEn" idKey="enNew" v-model="form.contentEnglish" />
            </el-tab-pane>
          </el-tabs>
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
      <el-table-column label="发布到对接方案" prop="bizPublish">
        <template slot-scope="scope">
          <span v-if="scope.row.bizPublish == 0">否</span>
          <span v-if="scope.row.bizPublish == 1">是</span>
        </template>
      </el-table-column>
      <el-table-column label="分组">
        <span>{{ docGroup.groupName }}</span>
      </el-table-column>
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
              @click="publicDocPop(scope.$index, scope.row)"
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
              @click="publicDocPop(scope.$index, scope.row)"
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
      :title="dailogTitleType"
      :visible.sync="dialogChangeFormVisible"
      v-if="dialogChangeFormVisible"
      :close-on-click-modal="false"
    >
      <el-form :model="formChange" label-width="80px">
        <p class="form-item-wrap">
          <el-form-item label="文档类型">
            <el-input v-if="formChange.type == 1" value="新手指南" disabled />
            <el-input v-if="formChange.type == 2" value="技术文档" disabled />
            <el-input v-if="formChange.type == 3" value="业务单元" disabled />
            <el-input v-if="formChange.type == 4" value="产品" disabled />
            <el-input v-if="formChange.type == 5" value="新手指南" disabled />
            <el-input v-if="formChange.type == 6" value="技术文档" disabled />
            <el-input v-if="formChange.type == 7" value="API文档" disabled />
            <el-input v-if="formChange.type == 8" value="产品" disabled />
            <el-input v-if="formChange.type == 9" value="开发指南" disabled />
          </el-form-item>
          <el-form-item label="文档分组:">
            <el-input v-model="docGroup.groupName" :disabled="true"> </el-input>
          </el-form-item>
        </p>
        <p class="form-item-wrap">
          <el-form-item label="标题">
            <el-input v-model="formChange.title" autocomplete="off" />
          </el-form-item>
          <el-form-item label="排序">
            <el-input v-model="formChange.seq" type="number" autocomplete="off" />
          </el-form-item>
        </p>
      </el-form>
      <el-tabs v-model="activeLanguage">
        <el-tab-pane label="中文版" name="cn">
          <Markdown key="cn" class="markdown" ref="editMarkdown" idKey="cn" v-model="formChange.content" />
        </el-tab-pane>
        <el-tab-pane label="英文版" name="en">
          <Markdown key="en" class="markdown" ref="editMarkdownEn" idKey="en" v-model="formChange.contentEnglish" />
        </el-tab-pane>
      </el-tabs>
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
        v-if="totalClone>0"
        background
        :current-page.sync="page"
        :page-size="pageSize"
        layout="prev, pager, next, jumper"
        :total="totalClone"
        @current-change="handleCurrentChange"
      />
    </div>

    <el-dialog
      title="提示"
      :visible.sync="dialogPublishVisible"
      width="30%"
      :before-close="handlePublishClose"
    >
      <div style="text-align: center">
        <div>
          <i class="el-icon-warning" style="color: Coral"></i>
          确定将当前内容发布至文档中心?
        </div>
        <div>
          <el-checkbox v-model="checked">同步发布至对接方案</el-checkbox>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogPublishVisible = false">取 消</el-button>
        <el-button type="primary" @click="handlePublic()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Markdown from "@/components/Markdown/index.vue";
import { documentRequest } from "@/api/module/international/document";
let beforeEditOldTitle = "";
export default {
  name: "ExtranetContent",
  components: { Markdown },
  props: {
    items: Array,
    type: Number,
    pageSize: Number,
    page: Number,
    total: Number,
    netType: Number,
    docGroup: Object,
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
      dialogPublishVisible: false,
      checked: false,
      publicDoc: "",
      activeLanguage: 'cn',
      languageNew: 'cn',
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
      return new Promise((resolve) => {
        documentRequest.queryDocList({
          pageNumb: this.page,
          pageSize: this.pageSize,
          netType: this.netType,
          type: this.type,
          status: this.formInline.value,
          title: this.formInline.title,
          docGroupCode: this.docGroup.code,
        })
          .then((res) => {
            this.itemsClone = res.data.list || [];
            this.totalClone = res.data.total;
            resolve();
          })
          .catch((e) => {
            console.log("错误", e);
          });
        })
    },
    onSubmit() {
      this.page = 1;
      this.fetchData()
      .then(() => {
        this.netType = 1;
      })
    },
    onNew() {
      this.dailogTitleType = "通用文档新增";
      this.form = {
        netType: 1,
        title: "",
        content: "",
        seq: "",
        type: this.type,
        status: 1,
        docGroupCode: this.docGroup.code,
      };
    },
    handleEdit(index, row) {
      this.dialogChangeFormVisible = true;
      this.updateId = row.id;
      this.dailogTitleType = "通用文档更新";
      documentRequest.getById({
        id: row.id
      })
      .then((res) => {
        console.log("成功", res);
        this.formChange = res.data;
        this.formChange.content = res.data.content;
        this.formChange.contentEnglish = res.data.contentEnglish;
        this.$refs.editMarkdown.setValue(res.data.content);
        this.$refs.editMarkdownEn.setValue(res.data.contentEnglish);
        beforeEditOldTitle = res.data.title;
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
          documentRequest.deleteDoc({
            type:row.type,
            netType:row.netType,
            title:row.title,
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
          const {type, title, netType} = row||{};
          documentRequest.downDoc({
            type, title, netType
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
    /**
     * 发布文档弹出框
     */
    publicDocPop(index, row) {
      this.dialogPublishVisible = true;
      this.checked = false;
      this.publicDoc = row;
    },
    /**
     * 发布后台事件
     */
    handlePublic() {
      this.dialogVisibleDel = false;
      this.loading = true;
      const {type, netType, title} = this.publicDoc;
      documentRequest.publishDoc({
        type,
        netType,
        title,
        bizPublish: this.checked ? 1 : 0
      })
      .then((res) => {
        this.loading = false;
        this.$message.success("操作成功");
        this.fetchData();
        this.dialogPublishVisible = false;
      });
    },
    indexMethod(index) {
      return index;
    },
    onSave() {
      this.form.content = this.$refs.newMarkdown.getValue();
      this.form.contentEnglish = this.$refs.newMarkdownNewEn.getValue();
      documentRequest.editDoc({
        ...(this.form || {}),
        id: null,
        oldTitle:null,
      })
      .then((res) => {
        console.log("成功", res);
        this.dialogFormVisible = false;
        this.page = 1;
        this.fetchData()
        .then(() => {
          this.netType = this.form.netType;
        })

      });
    },
    onChangeSave() {
      var obj = {
        netType: this.formChange.netType,
        content: this.$refs.editMarkdown.getValue(),
        contentEnglish: this.$refs.editMarkdownEn.getValue(),
        seq: this.formChange.seq,
        title: this.formChange.title,
        type: this.formChange.type,
        id: this.updateId,
        status: this.formChange.status,
        oldTitle: beforeEditOldTitle
      };
      documentRequest.editDoc({
        ...obj
      })
      .then((res) => {
        console.log("成功", res);
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
      console.log("handleCurrentChangeval", val);
      this.page = val;
      this.fetchData();
    },
    // 返回按钮
    returnBack() {
      this.$emit("returnBack", this.docGroup);
    },
    /**
     * 关闭发布弹出框
     */
    handlePublishClose(done) {
      done();
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
.form-item-wrap {
  display: flex;
  ::v-deep .el-form-item {
    flex: 1;
  }
}
.markdown {
  height: 400px;
}
.form-wrap {
  display: flex;
  .fowm-row {
    flex: 1;
  }
}
</style>
