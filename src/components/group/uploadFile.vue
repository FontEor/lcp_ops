<template>
  <!-- 配置文件 -->
  <div>
    <div class="config-file-container">
      <!--      action="/cg/addWithFile"-->
      <el-upload
        class="dialog-upload"
        action="/cg/addWithFile"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        :on-success="success"
        multiple
        :limit="3"
        :on-exceed="handleExceed"
        :before-upload="beforeAvatarUpload"
        :file-list="fileList"
        name="file"
        style="width:150px"
      >
        <!--      :auto-upload="false"   slot="trigger"-->
        <el-button type="primary" icon="el-icon-upload2">点击上传</el-button>
      </el-upload>
      <ul v-if="fileList.length===0" class="f13 c-999 mt10">
        <li>1、支持txt、csv格式，且大小不能超过100Mb</li>
        <li>2、文件名只能包含中字，字母，数字</li>
        <li>3、文件编码需为UTF-8格式 <el-button type="text" size="small" @click="showTranscode">点此查看如何转码</el-button></li>
        <li>4、内容需拆行分隔，并最多100个字符</li>
      </ul>
      <div class="pt10">
        <span class="mr20">是否手机号转PIN</span>
        <el-radio-group v-model="radio">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </div>
    </div>
    <!-- 添加条件组按钮 -->
    <div class="config-group-add-btn">
      <el-button class="lui-btn" @click="addConditionGroup">添加条件组</el-button>
      <span class="c-999">(可添加条件组，进行详细筛选)</span>
    </div>

    <template v-if="groupList.length>0">
      <conditionGroupRelation @addConditionGroup="addConditionGroup" />
    </template>

    <transcode ref="transcode" />

    <!--弹框添加条件组按钮 -->
    <condition ref="condition" @addGroup="addGroup" />
  </div>
</template>

<script type="text/babel">
import transcode from '@/components/group/transcode.vue'
import condition from '@/components/group/condition.vue'
import conditionGroupRelation from '@/components/group/conditionGroupRelation.vue'

export default {
  name: 'UploadFile',
  components: {
    transcode,
    condition,
    conditionGroupRelation
  },
  mixins: [],
  props: {
  },
  data() {
    return {
      fileList: [],
      radio: 1
    }
  },

  mounted() {
  },
  methods: {
    success() {
      console.log(this.fileList)
      // this.fileList = [{}]
      this.$emit('importSuccess', {})
    },
    handlePreview(file) {
      console.log(file)
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
      // this.success()
    },
    beforeRemove(file, fileList) {
      if (file.status !== 'ready') { // 不是不符合规范引起的移除
        this.$confirm(`确定移除 ${file.name}？`, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        })
      }
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    showTranscode() {
      // this.dialogCodeVisible = true
      this.$refs.transcode.showDialog()
    },
    beforeAvatarUpload(file) {
      const isPlain = file.type === 'text/plain'
      const isCsv = file.type === 'text/csv'
      const isLt100M = file.size / 1024 / 1024 < 100 // 大小不能超过 100MB

      if (!isPlain && !isCsv) {
        this.$message.error('上传头像图片只能是 txt或csv 格式!')
      }
      if (!isLt100M) {
        this.$message.error('所上传的文件超过要求大小')
      }
      if ((isPlain || isCsv) && isLt100M) {
        this.fileList.push(file)
        console.log('选择文件成功')
        return true
      }
      return false
    }
  }
}
</script>

<style lang="scss" scoped>
  @import './group.scss';
</style>
