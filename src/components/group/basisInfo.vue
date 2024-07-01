<template>
  <!-- 基础信息文字 -->
  <div class="lui-container">
    <h2 class="lui-tit">基础信息</h2>
    <el-row :gutter="20">
      <el-col :span="8"><span class="c-666">客群名称：</span>原来的客群名称</el-col>
      <el-col :span="8"><span class="c-666">客群描述：</span>原来的客群描述</el-col>
      <el-col :span="8"><span class="c-666">创建方式：</span>标签筛选</el-col>
      <el-col :span="8" class="pt20"><span class="c-666">创建日期：</span>2020.03.04 12:00:00</el-col>
      <el-col :span="8" class="pt20"><span class="c-666">有效期：</span>2020.03.04 - 2020.03.06</el-col>
    </el-row>
  </div>
</template>

<script type="text/babel">
export default {
  name: 'BasisInfo',
  props: {
  },
  data() {
    return {
    }
  },

  mounted() {
  },
  methods: {
  }
}
</script>
