<template>
  <el-row class="search-form" type="flex" justify="space-between" tag="section">
    <el-form
      class="search-form__left-form"
      :model="searchFormData"
      :inline="true"
      @keyup.enter.native="$emit('keyupEnter')"
    >
      <el-form-item label="团队名称" prop="name">
        <el-input
          v-model.trim="searchFormData.name"
          :clearable="true"
          placeholder="请输入团队名称"
          style="width: 160px"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="$emit('keyupEnter')">查询</el-button>
      </el-form-item>
    </el-form>
  </el-row>
</template>

<script>
export default {
  name: "SearchForm",
  props: {
    searchFormData: { type: Object, required: true },
  },
};
</script>

<style lang="scss" scoped>
.search-form {
}
</style>