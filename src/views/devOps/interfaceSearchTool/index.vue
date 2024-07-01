<template>
  <div class="interface-search-tool app-container">
    <el-tabs v-model="active">
      <el-tab-pane name="interfaceSearchTool" label="接口查询工具">
        <InterfaceSearchTable />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import InterfaceSearchTable from "@/views/devOps/interfaceSearchTool/interfaceSearchTable/index.vue";

export default {
  name: "InterfaceSearchTool",
  components: { InterfaceSearchTable },
  data() {
    return {
      active: "interfaceSearchTool",
    };
  },
};
</script>

<style lang="scss" scoped>
.interface-search-tool {
}
</style>