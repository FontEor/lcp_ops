<template>
  <div class="commentStatistics">
    <div class="app-container">
      <el-tabs v-model="activeName">
        <el-tab-pane label="评论统计" name="first">
          <CommentAmount v-if="activeName === 'first'"></CommentAmount>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import CommentAmount from "@/views/operationReport/commentStatistics/CommentAmount.vue";

export default {
  name: "CommentStatistics",
  components: { CommentAmount },
  data() {
    return {
      activeName: "first",
    };
  },
};
</script>

<style lang="scss" scoped>
</style>