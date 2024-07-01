<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="对接方案" name="first">
          <DokingSchemeManager v-if="activeName=='first'"/>
      </el-tab-pane>
      <el-tab-pane label="对接方案API" name="second">
          <DokingSchemeApi v-if="activeName=='second'"/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import DokingSchemeApi from "@/views/operationReport/dockingScheme/dokingSchemeApi.vue";
import DokingSchemeManager from "@/views/operationReport/dockingScheme/dokingSchemeManager.vue";

export default {
  components: {
    DokingSchemeApi,
    DokingSchemeManager
  },
  data() {
    return {
      activeName: "first",
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab)
    }
  },
};
</script>