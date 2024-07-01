<template>
  <!-- 客群状态 -->
  <div class="lui-container">
    <el-row :gutter="10" type="flex" align="middle">
      <el-col :xs="24" :sm="8" :md="6" :lg="5">
        客群状态：<el-tag type="success" effect="dark" size="mini">计算中</el-tag>
      </el-col>
      <el-col :xs="24" :sm="8" :md="6" :lg="4">
        客群覆盖量：<span class="c-green">83731</span>
      </el-col>
      <el-col :xs="24" :sm="8" :md="6" :lg="3">
        <el-button type="primary" @click="edit">编辑客群</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script type="text/babel">
export default {
  name: 'GroupTitle',
  props: {
  },
  data() {
    return {
    }
  },

  mounted() {
  },
  methods: {
    edit(row) { // 编辑
      this.$router.push({ name: 'labelSelect' }).catch()
    }
  }
}
</script>
