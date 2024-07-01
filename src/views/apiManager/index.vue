<template>
  <div class="api-manager">
    <div class="app-container">
      <el-tabs v-model="activeName">
        <el-tab-pane label="XML查询" name="searchXml">
          <SearchXml></SearchXml>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import SearchXml from "@/views/apiManager/SearchXml.vue";

export default {
  name: "ApiManager",
  components: { SearchXml },
  data() {
    return {
      activeName:"searchXml"
    }
  },
};
</script>

<style lang="scss" scoped>
.api-manager {
}
</style>