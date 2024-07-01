<template>
  <el-dialog title="审批" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
    <el-input type="textarea" :rows="5" placeholder="请填写审批意见" v-model="audit"></el-input>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleFetchApiAuditEnd(3)">驳回</el-button>
      <el-button type="primary" @click="handleFetchApiAuditEnd(1)">通过</el-button>
    </span>
  </el-dialog>
</template>

<script>
import lopOpenApidepot from "@/api/lopOpenApidepot/index";

export default {
  name: "ApprovalDialog",
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    rowInfo: {
      type: Object,
      default: () => {}
    }
  },
  components: {},
  watch: {
    dialogVisible: {
      handler(newVal) {
        newVal && (this.audit = "");
      },
      immediate: true
    }
  },
  data() {
    return {
      audit: ""
    };
  },
  methods: {
    handleFetchApiAuditEnd(status) {
      if (!this.audit) {
        this.$message({
          type: "warning",
          message: "请填写审批意见"
        });
        return;
      }
      const params = [this.rowInfo.apiId, status, this.audit];
      lopOpenApidepot.PublicApiPublishAudit.apiAuditEnd(params)
        .then(response => {
          let { code, message } = response || {};
          if (+code === 20000) {
            this.$message({
              type: "success",
              message: `${(status === 1 && "审核") || (+status === 3 && "驳回")}成功`
            });
            this.$emit("updateList");
          } else {
            this.$message({
              type: "error",
              message
            });
          }
        })
        .catch(error => {
          this.$message.error({ message: error });
        });
      this.handleClose();
    },
    handleClose() {
      this.$emit("update:dialogVisible", false);
    }
  },
  mounted() {}
};
</script>