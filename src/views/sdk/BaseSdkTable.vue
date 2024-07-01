<template>
  <article class="base-sdk-table">
    <el-row type="flex" justify="end" tag="section">
      <el-button @click="showDialog4Create">新建</el-button>
    </el-row>
    <el-table :data="tableData" border>
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column label="名称" prop="name" />
      <el-table-column label="文件名" prop="fileName" />
      <el-table-column label="版本" prop="version" />
      <el-table-column label="描述" prop="description" />
      <el-table-column label="状态">
        <template slot-scope="scope">
          {{ scope.row.status === 1 ? "已应用" : "未应用" }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="210">
        <template slot-scope="scope">
          <el-button type="text" @click="() => showDialog4Edit(scope.row)"
            >编辑</el-button
          >
          <el-button type="text" @click="() => showDialog4Delete(scope.row)"
            >删除</el-button
          >
          <el-button
            v-if="scope.row.status === 0"
            type="text"
            @click="() => showDialog4Apply(scope.row)"
            >应用</el-button
          >
          <el-button
            v-if="scope.row.status === 1"
            type="text"
            @click="() => cancel(scope.row)"
            >取消应用</el-button
          >
          <el-button type="text">
            <a
              :href="`/base-sdk/rest/fileDownload?jssKey=${scope.row.jssKey}&filename=${scope.row.fileName}`"
            >
              下载
            </a>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="baseSdkDialogVisible" title="新建SDK">
      <el-form>
        <el-form-item label="名称">
          <el-input v-model="baseSdkDialog.name" />
        </el-form-item>

        <el-form-item>
          <template slot="label">
            <span>版本</span>
            <el-tooltip
              style="position: relative; z-index: 3; color: #3c6ef0;padding-left:0.3rem"
              class="item"
              effect="dark"
              content="SDK生成过程中会从此处获取版本号，请合理命名"
              placement="top"
            >
              <i class="el-icon-info"></i>
            </el-tooltip>
          </template>
          <el-input v-model="baseSdkDialog.version" />
        </el-form-item>

        <el-form-item label="描述">
          <el-input v-model="baseSdkDialog.description" />
        </el-form-item>
        <el-form-item label="基础SDK">
          <el-upload
            ref="uploadSdk"
            :auto-upload="true"
            :file-list="baseSdkDialog.files"
            :http-request="uploadFile"
            :limit="1"
            action="#"
          >
            <el-button slot="trigger" size="small" type="primary"
              >选择文件</el-button
            >
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="baseSdkDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="baseSdkApplyDialogVisible" title="应用SDK">
      <div>
        <span
          >应用后，外网前台-对接方案下的基础SDK将显示该SDK，确定应用吗？</span
        >
      </div>
      <span slot="footer">
        <el-button @click="baseSdkApplyDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="apply">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="baseSdkDeleteDialogVisible" title="删除SDK">
      <div>
        <span>确认删除 {{ baseSdkDeleteDialog.name }} SDK?</span>
      </div>
      <span slot="footer">
        <el-button @click="baseSdkDeleteDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="deleteSdk">确定</el-button>
      </span>
    </el-dialog>
  </article>
</template>

<script>
import request from "@/utils/request.js";

const languageNameMap = {
  JAVA: 1,
  NET: 2,
  PHP: 3,
  PYTHON: 4,
  GOLANG: 5,
};

export default {
  name: "BaseSdkTable",
  props: {
    name: String,
  },
  data() {
    return {
      tableData: [],
      baseSdkDialog: {
        id: null,
        name: "",
        fileName: "",
        jssKey: "",
        version: "",
        description: "",
        files: [],
        language: this.language,
      },
      baseSdkApplyDialog: {
        id: null,
      },
      baseSdkDeleteDialog: {
        id: null,
        name: null,
      },
      baseSdkDialogVisible: false,
      baseSdkApplyDialogVisible: false,
      baseSdkDeleteDialogVisible: false,
    };
  },
  computed: {
    language() {
      return languageNameMap[this.name.toUpperCase()];
    },
  },
  methods: {
    getBaseSdks() {
      request({
        url: `/base-sdk/rest/getAllSdkByLanguage?language=${this.language}`,
      })
        .then((response) => response.data)
        .then((data) => {
          this.tableData = data;
        });
    },
    showDialog4Create() {
      this.baseSdkDialog = {
        id: null,
        name: "",
        fileName: "",
        jssKey: "",
        version: "",
        description: "",
        files: [],
      };
      this.baseSdkDialogVisible = true;
    },
    showDialog4Edit(baseSdk) {
      this.baseSdkDialog = Object.assign({}, baseSdk);
      this.baseSdkDialogVisible = true;
    },
    showDialog4Apply(baseSdk) {
      this.baseSdkApplyDialog.id = baseSdk.id;
      this.baseSdkApplyDialogVisible = true;
    },
    showDialog4Delete(baseSdk) {
      this.baseSdkDeleteDialog.id = baseSdk.id;
      this.baseSdkDeleteDialog.name = baseSdk.name;
      this.baseSdkDeleteDialogVisible = true;
    },
    save() {
      console.log(this.baseSdkDialog.files);
      const baseSdk = {
        id: this.baseSdkDialog.id,
        name: this.baseSdkDialog.name,
        version: this.baseSdkDialog.version,
        description: this.baseSdkDialog.description,
        language: this.language,
        fileName: this.baseSdkDialog.fileName,
        jssKey: this.baseSdkDialog.jssKey,
      };
      const url = baseSdk.id ? "/base-sdk/rest/edit" : "/base-sdk/rest/create";
      request({
        url,
        method: "POST",
        data: baseSdk,
      }).then((response) => this.getBaseSdks());
      this.baseSdkDialogVisible = false;
    },
    uploadFile(param) {
      const file = param.file;
      const formData = new FormData();
      formData.append("file", file);
      request({
        url: "/base-sdk/rest/fileupload",
        method: "POST",
        data: formData,
        header: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      })
        .then((response) => response.data)
        .then((data) => {
          console.log(data);
          this.baseSdkDialog.jssKey = data;
          this.baseSdkDialog.fileName = file.name;
          console.log(this.baseSdkDialog);
        });
      console.log(param);
    },
    apply() {
      request({
        url: `/base-sdk/rest/online?id=${this.baseSdkApplyDialog.id}`,
      }).then((response) => this.getBaseSdks());
      this.baseSdkApplyDialogVisible = false;
    },
    cancel(row) {
      request({
        url: `/base-sdk/rest/offline?id=${row.id}`,
      }).then((response) => this.getBaseSdks());
    },
    deleteSdk() {
      request({
        url: `/base-sdk/rest/delete?id=${this.baseSdkDeleteDialog.id}`,
      }).then((response) => this.getBaseSdks());
      this.baseSdkDeleteDialogVisible = false;
    },
  },
  created() {
    this.getBaseSdks();
  },
};
</script>

<style lang="scss" scoped>
</style>
