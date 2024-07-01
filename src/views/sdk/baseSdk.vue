<template>
  <div class="base-sdk app-container">
    <el-tabs v-model="activeName">
      <el-tab-pane
        v-for="{ label, name } in tabPaneList"
        :key="name"
        :label="label"
        :name="name"
      >
        <BaseSdkTable v-if="activeName === name" :name="activeName" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import BaseSdkTable from "@/views/sdk/BaseSdkTable.vue";

export default {
  name: "BaseSdk",
  components: { BaseSdkTable },
  data() {
    return {
      activeName: "JAVA",
      tabPaneList: [
        { label: "Java", name: "JAVA" },
        { label: "PHP", name: "PHP" },
        { label: ".NET", name: "NET" },
        { label: "Python", name: "PYTHON" },
        { label: "Golang", name: "GOLANG" },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
</style>
