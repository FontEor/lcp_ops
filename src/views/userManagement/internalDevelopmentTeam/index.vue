<template>
  <div class="internal-development-team app-container">
    <el-tabs v-model="active">
      <el-tab-pane label="内部开发团队管理" name="internalDevelopmentTeam">
        <InternalDevelopmentTeamPane
          v-if="active === 'internalDevelopmentTeam'"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import InternalDevelopmentTeamPane from "@/views/userManagement/internalDevelopmentTeam/internalDevelopmentTeamPane/index.vue";

export default {
  name: "InternalDevelopmentTeam",
  components: { InternalDevelopmentTeamPane },
  data() {
    return { active: "internalDevelopmentTeam" };
  },
};
</script>

<style lang="scss" scoped>
.internal-development-team {
}
</style>