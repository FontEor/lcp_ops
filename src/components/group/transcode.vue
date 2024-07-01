<template>
  <!--弹框转码教程 -->
  <el-dialog
    title="转码教程"
    :visible.sync="isDialogCodeVisible"
    width="545px"
    class="config-transcode-dialog"
  >
    <div class="config-transcode-dialog-contant">
      <p>Windows系统</p>
      <div class="pt20">
        <el-tag type="info" effect="lightBorder" size="mini">.txt</el-tag>
        <span class="pl10 c-666">格式转码方式如下</span>
        <div class="code-bg" />
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="isDialogCodeVisible = false">取 消</el-button>
      <el-button type="primary" @click="isDialogCodeVisible = false">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/babel">
export default {
  name: 'Transcode',
  props: {
    isDialogCodeVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
    }
  },

  mounted() {
  },
  methods: {
    showDialog() { // 显示弹窗(父组件调用)
      this.isDialogCodeVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
  .config-transcode-dialog{
  .code-bg{
    width:479px;
    height:338px;
    background:url("~@/assets/views/transcode-bg.png") top 15px center no-repeat;
    background-size:100% 100%;
  }
}
</style>
