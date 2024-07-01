<template>
  <!-- 对接系统 -->
  <div class="lui-container">
    <h2 class="lui-tit">对接系统</h2>
    <el-form ref="ruleForm2" :model="ruleForm2" :rules="rules" label-width="80px" class="config-form-vertical">
      <el-form-item label="来源系统" prop="f1">
        <el-select v-model="ruleForm2.f1" placeholder="请选择" style="display:block;">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="来源编码" prop="f2">
        <el-select v-model="ruleForm2.f2" placeholder="请选择" style="display:block;">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="是否手机号转PIN" label-width="130px">
        <el-radio-group v-model="ruleForm2.f3">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
  </div>
</template>

<script type="text/babel">
export default {
  name: 'ConnectSystem',
  props: {
  },
  data() {
    return {
      ruleForm2: {
        f1: '',
        f2: '',
        f3: '1'
      },
      options: [
        {
          value: '1',
          label: '选项一'
        },
        {
          value: '2',
          label: '选项二'
        },
        {
          value: '3',
          label: '选项三'
        },
        {
          value: '4',
          label: '选项四'
        },
        {
          value: '5',
          label: '选项五'
        },
        {
          value: '6',
          label: '选项六'
        }
      ],
      rules: {
        f1: [
          { required: true, message: '请输入客群名称', trigger: 'blur' }
        ],
        f2: [
          { required: true, message: '请填写客群描述', trigger: 'blur' }
        ],
        f3: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ],
        f4: [
          { required: true, message: '请选择选择方式', trigger: 'change' }
        ]
      }
    }
  },

  mounted() {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
  @import './group.scss';
</style>
