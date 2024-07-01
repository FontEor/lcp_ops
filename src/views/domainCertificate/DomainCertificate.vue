<template>
  <div class="edi-wrapper">
    <div style="margin-bottom: 0.5rem; text-align: right">
      <el-button type="primary" @click="handleAddOrEdit()">新建</el-button>
    </div>
    <el-table v-if="refreshTable" v-loading="loading" :data="tableData">
      <el-table-column label="序号" type="index" />
      <el-table-column label="二级域名" prop="domain" width="200px"/>
      <el-table-column label="文件名" prop="fileName" />
      <el-table-column label="证书颁发日期" prop="publishDate" width="160px"/>
      <el-table-column label="证书截止日期" prop="endDate" width="160px"/>
      <el-table-column label="状态" width="100px">
        <template slot-scope="scope">{{ scope.row.status | formatStatus }}</template>
      </el-table-column>
      <el-table-column label="创建人" prop="createUser" width="180px"/>
      <el-table-column label="创建时间" prop="createTime" width="160px"/>
      <el-table-column label="操作" align="left" width="180px">
        <template slot-scope="scope">
          <el-button-group>
            <!-- 状态。0、待生效；1、生效中；2、已失效 -->
            <!-- 待生效】状态的证书文件，亮起【生效】按钮；【生效中】状态的证书文件，亮起【失效】按钮，【已失效】状态的证书文件「生效」按钮置灰；
点击【生效】按钮，证书文件状态变为【已生效】，校验：当前只能有一个【二级域名】的证书生效，若存在多个，则校验失败，提示：此二级域名存在已生效的域名证书，请检查；
点击【失效】按钮，证书文件状态变为【已失效】 -->
            <el-button style="margin-right: 0.5rem" size="mini" type="text" @click="handleAddOrEdit(scope.row)"
              :disabled="scope.row.status === 2">
              编辑
            </el-button>
            <el-button style="margin-right: 0.5rem" size="mini" type="text" @click="handleDelete(scope.row)"
              :disabled="scope.row.status === 1">
              删除
            </el-button>
            <el-button style="margin-right: 0.5rem" size="mini" type="text" @click="handleStatus(scope.row)"
              :disabled="scope.row.status === 2" v-if="scope.row.status === 0 || scope.row.status === 2">
              生效
            </el-button>
            <el-button style="margin-right: 0.5rem" size="mini" type="text" @click="handleStatus(scope.row)"
              v-if="scope.row.status === 1">
              失效
            </el-button>
            <el-button size="mini" type="text" @click="downloadFile(scope.row)">
              下载
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增和编辑 -->
    <el-dialog width="480px" height="100%" :title="domainCertificateTitle" :close-on-click-modal="false"
      :visible.sync="dialogDetail">
      <div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
          <el-form-item label="二级域名" prop="domain">
            <el-select v-model="ruleForm.domain" placeholder="请选择二级域名" style="width: 100%">
              <el-option v-for="{ label, value } in domainSelectOption" :key="value" :label="label" :value="value" />
            </el-select>
          </el-form-item>
          <el-form-item label="证书颁发日期" prop="publishDate">
            <el-date-picker v-model="ruleForm.publishDate" type="datetime" placeholder="选择证书颁发日期" style="width: 100%">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="证书结束日期" prop="endDate">
            <el-date-picker v-model="ruleForm.endDate" type="datetime" placeholder="选择证书结束日期" style="width: 100%">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="证书文件" prop="filePath">
            <el-upload class="dialog-upload" :action="uploadUrl" :show-file-list="true" :file-list="filePathArr"
              :before-upload="beforeUploadHandle" :on-success="uploadSuccessHandle" :on-error="uploadErrorHandle"
              :limit="1">
              <el-button slot="trigger" type="primary">选择文件</el-button>
              <!-- <div slot="tip" class="el-upload__tip">
                只能上传.zip，.crt格式
              </div> -->
            </el-upload>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" v-model="ruleForm.remark" placeholder="请输入备注"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer" style="text-align: right">
        <el-button @click="closeDialogDetail">取消</el-button>
        <el-button type="primary" @click="saveDomainCertificateData('ruleForm')">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import lcp from "@/api/lcp/index";
export default {
  name: "DomainCertificate",
  data() {
    return {
      domainCertificateTitle: "",
      refreshTable: true,
      tableData: [],
      dialogDetail: false,

      uploadUrl: `/domaincertificate/rest/fileupload`,

      ruleForm: {
        id: null,
        domain: '',
        publishDate: '',
        endDate: '',
        filePath: '',
        fileName: '',
        remark: '',
        status: 0,
      },
      filePathArr: [],
      rules: {
        domain: [
          { required: true, message: "请选择二级域名", trigger: "change" },
        ],
        publishDate: [
          { required: true, message: "请选择证书颁发日期", trigger: "change" },
        ],
        endDate: [
          { required: true, message: "请选择证书结束日期", trigger: "change" },
        ],
        filePath: [
          { required: true, message: "请上传证书文件", trigger: "change" },
        ]
      },
      loading: true,
      domainSelectOption: [
        { label: "*.jdwl.com", value: "*.jdwl.com" },
        { label: "*.jdl.com", value: "*.jdl.com" },
      ],
    };
  },
  filters: {
    formatStatus(value) {
      const hashMap = new Map()
        .set(0, "待生效")
        .set(1, "生效中")
        .set(2, "已失效");
      return hashMap.get(value) || "";
    },
  },
  computed: {},
  mounted() {
    this.queryDomainCertificatedData();
  },
  methods: {

    //处理新建和编辑的弹框数据
    handleAddOrEdit(row) {
      console.log("row", row);
      if (typeof row !== "undefined") {
        this.ruleForm.id = row.id;
        this.ruleForm.domain = row.domain;
        this.ruleForm.publishDate = row.publishDate;
        this.ruleForm.endDate = row.endDate;
        this.ruleForm.filePath = row.filePath;
        this.filePathArr = [{ name: '', url: '' }]
        this.filePathArr[0].name = row.fileName;
        this.filePathArr[0].url = row.filePath;
        this.ruleForm.remark = row.remark;
        this.ruleForm.status = row.status;
        this.domainCertificateTitle = "编辑证书文件"
      } else {
        this.ruleForm.id = null;
        this.ruleForm.domain = "";
        this.ruleForm.publishDate = null;
        this.ruleForm.endDate = null;
        this.ruleForm.filePath = "";
        this.filePathArr = [];
        this.ruleForm.remark = "";
        this.ruleForm.status = 0;
        this.domainCertificateTitle = "新增证书文件"
      }

      this.dialogDetail = true;
    },
    //新增和编辑
    async saveDomainCertificateData(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const params = {
            id: this.ruleForm.id,
            domain: this.ruleForm.domain,
            publishDate: new Date(this.ruleForm.publishDate).getTime(),
            endDate: new Date(this.ruleForm.endDate).getTime(),
            filePath: this.ruleForm.filePath,
            fileName: this.ruleForm.fileName,
            remark: this.ruleForm.remark,
            status: this.ruleForm.status
          };

          let saveApi = this.ruleForm.id ? lcp.certificate.updateDomainCertificate : lcp.certificate.insertDomainCertificate
          await saveApi(params).then((res) => {
            if (res.code === 20000) {
              this.$message({
                message: "操作成功",
                type: "success",
              });
              this.queryDomainCertificatedData();
              this.dialogDetail = false;
            } else {
              this.$message.error(res.message);
            }
          })
            .catch((error) => {
              throw new Error(`updateDomainCertificate, ${error}`);
            });
        } else {
          return false;
        }
      });
    },

    //获取列表数据
    async queryDomainCertificatedData() {
      this.loading = true;
      await lcp.certificate.findDomainCertificateList()
        .then(async (res) => {
          if (res.code === 20000) {
            this.tableData = [];
            this.tableData = res.data;
            this.loading = false;
          }
        })
        .catch((error) => {
          throw new Error(`queryDomainCertificateList, ${error}`);
        });
    },

    // 上传之前
    beforeUploadHandle(file) {
      // let fileIndex = file.name.lastIndexOf(".");
      // let fileType = file.name.substr(fileIndex + 1, file.name.length);
      // if (['zip', 'crt'].indexOf(fileType.toLowerCase()) === -1) {
      //   this.$message.error('请上传zip、crt格式的附件！');
      //   return false;
      // }
      return true;
    },
    uploadSuccessHandle(response, file) {
      this.ruleForm.filePath = response.data;
      this.ruleForm.fileName = file.name;
    },
    uploadErrorHandle() {
      this.$message.error("上传失败，请重新上传");
      this.filePathArr = [];
    },

    downloadFile(row) {
      window.open(row.filePath, '_blank');
    },
    closeDialogDetail() {
      this.dialogDetail = false;
      this.$refs['ruleForm'].resetFields();
    },

    // 修改 生效，失效状态
    async handleStatus(row) {
      this.$confirm("确定修改当前状态吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let params = {
            id: row.id,
            status: row.status === 0 ? 1 : 2,
          };
          await lcp.certificate.updateDomainCertificateStatusById(params)
            .then(res => {
              if (res.code === 20000) {
                this.queryDomainCertificatedData();
                this.$message({
                  message: "操作成功",
                  type: "success",
                });
              } else {
                this.$message.error(res.message);
              }
            })
            .catch((error) => {
              throw new Error(`deleteWorkOrderTypeCheck, ${error}`);
            });
        })
        .catch((e) => {
          console.log("错误", e);
        });
    },

    //删除 
    async handleDelete(row) {
      this.$confirm("确定删除当前数据吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let params = {
            id: row.id,
          };
          await lcp.certificate.delDomainCertificateById(params)
            .then(res => {
              if (res.code === 20000) {
                this.queryDomainCertificatedData();
                this.$message({
                  message: "操作成功",
                  type: "success",
                });
              } else {
                this.$message.error(res.message);
              }
            })
            .catch((error) => {
              throw new Error(`deleteWorkOrderTypeCheck, ${error}`);
            });
        })
        .catch((e) => {
          console.log("错误", e);
        });
    },
  },
}
</script>

<style lang="scss" scoped>
.dialog-upload {
  /deep/ .el-upload-list {
    height: 36px;
    overflow: hidden;
  }

}
</style>
