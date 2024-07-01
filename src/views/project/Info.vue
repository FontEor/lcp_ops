<template>
  <!-- 项目信息 -->
  <div class="lui-mod">
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="view-form">
      <el-form-item label="项目名称" prop="projectName">
        <el-input
          v-model="ruleForm.projectName"
          placeholder="请输入项目名称"
          maxlength="20"
          show-word-limit
        />
      </el-form-item>
      <el-form-item label="项目需求" prop="projectNeed">
        <el-input
          v-model="ruleForm.projectNeed"
          type="textarea"
          placeholder="请输入项目需求说明"
          maxlength="40"
          show-word-limit
        />
      </el-form-item>
      <el-form-item label="客户名称" prop="customerName">
        <el-input
          v-model="ruleForm.customerName"
          placeholder="请输入客户名称"
          maxlength="20"
          show-word-limit
        />
      </el-form-item>
      <el-form-item label="服务对象" prop="serviceObject">
        <el-radio-group v-model="ruleForm.serviceObject">
          <el-radio label="1">内部使用</el-radio>
          <el-radio label="2">外部输出</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="数据用途" prop="dataUse">
        <el-radio-group v-model="ruleForm.dataUse">
          <el-radio label="1">营销决策</el-radio>
          <el-radio label="2">市场洞察</el-radio>
          <el-radio label="3">其他</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <!-- 固定在底部按钮 -->
    <div class="ft t-right">
      <el-button @click="handelCancel">取消</el-button>
      <el-button
        type="primary"
        @click="handelNext('ruleForm')"
      >
        下一步
      </el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CustomersProjectInfo',
  props: {
    step: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      ruleForm: {
        projectName: '',
        projectNeed: '',
        customerName: '',
        serviceObject: '',
        dataUse: ''
      },
      rules: {
        projectName: [
          { required: true, message: '请输入项目名称', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
        projectNeed: [
          { required: true, message: '请输入项目需求说明', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 40 个字符', trigger: 'blur' }
        ],
        customerName: [
          { required: true, message: '请输入客户名称', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
        serviceObject: [
          { required: true, message: '请选择服务对象', trigger: 'change' }
        ],
        dataUse: [
          { required: true, message: '请选择数据用途', trigger: 'change' }
        ]
      }
    }
  },
  created() {
  },
  methods: {
    handelCancel() {
      this.$confirm('已填写部分内容，是否取消创建', {
        confirmButtonText: '暂存任务',
        cancelButtonText: '取消创建',
        type: 'warning',
        center: true
      })
    },
    handelNext(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$emit('changeStep')
        } else {
          this.$message.error('信息未填写完整')
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.view-form{
  width:465px;
  margin:0 auto;
}
</style>
