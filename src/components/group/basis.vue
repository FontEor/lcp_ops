<template>
  <!-- 基础信息表单 -->
  <div class="lui-container">
    <h2 class="lui-tit">基础信息</h2>
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="80px" class="config-form-vertical">
      <el-form-item label="客群名称" prop="cgName">
        <el-input v-model="ruleForm.cgName" placeholder="请输入客群名称" />
      </el-form-item>
      <el-form-item label="客群描述" prop="f2">
        <el-input v-model="ruleForm.f2" type="textarea" placeholder="请输入客群描述" />
      </el-form-item>
      <el-form-item label="有效期" prop="effectEndTime" class="date-picker-item">
        <el-date-picker
          v-model="ruleForm.effectStartTime"
          type="date"
          class="date-picker"
          placeholder="开始日期"
          disabled
          :default-value="ruleForm.effectStartTime"
        />
        <span class="separate">-</span>
        <el-date-picker
          v-model="ruleForm.effectEndTime"
          type="date"
          class="date-picker"
          value-format="yyyy-MM-dd"
          placeholder="结束日期"
          :picker-options="{
            disabledDate(time) {
              return time.getTime() < new Date(ruleForm.effectStartTime).getTime()
                || time.getTime() > Date.now()+61*24*3600*1000;
            }
          }"
          @change="changeDate"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script type="text/babel">
export default {
  name: 'Basis',
  props: {
  },
  data() {
    return {
      ruleForm: {
        cgName: '',
        f2: '',
        effectStartTime: new Date().getTime() + 24 * 3600 * 1000,
        effectEndTime: ''
      },
      rules: {
        cgName: [
          { required: true, message: '请输入客群名称', trigger: 'blur' }
        ],
        f2: [
          { required: true, message: '请输入客群描述', trigger: 'blur' }
        ],
        effectEndTime: [
          { required: true, message: '请选择日期', trigger: 'change' }
        ]
      }
    }
  },

  mounted() {
  },
  methods: {
    submitForm() { // 提交表单(父元素调用)
      return new Promise((resolve, reject) => {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            resolve(this.ruleForm)
          } else {
            reject(new Error('error submit!'))
          }
        })
      })
    },
    changeDate(e) { // 修改日期
    }
  }
}
</script>

<style lang="scss" scoped>
.config-form-vertical{
  width:465px;
  margin-top:20px;
}
.date-picker-item /deep/ .el-form-item__content{
  display: flex;
  .el-form-item__error{
    left: 53%;
  }
}
.separate{
  display: inline-block;
  width: 30px;
  text-align: center;
}
</style>
