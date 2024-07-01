<template>
  <div class="commentStatistics">
    <div class="app-container">
      <el-tabs v-model="activeName">
        <el-tab-pane label="场景信息维护" name="first">
          <SceneInfo v-if="activeName === 'first'"></SceneInfo>
        </el-tab-pane>
        <el-tab-pane label="沙箱联调" name="second">
          <SandboxJoin v-if="activeName === 'second'"></SandboxJoin>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import SceneInfo from "./SceneInfo.vue";
import SandboxJoin from "./SandboxJoin.vue";
export default {
  name: "sandbox",
  components: { SceneInfo, SandboxJoin },
  data() {
    return {
      activeName: "first"
    };
  }
};
</script>

<style lang="scss" scoped></style>
