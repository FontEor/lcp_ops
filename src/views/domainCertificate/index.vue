<template>
  <div class="commentStatistics">
    <div class="app-container">
      <el-tabs v-model="activeName">
        <el-tab-pane label="域名证书文件" name="first">
          <DomainCertificate v-if="activeName === 'first'"></DomainCertificate>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import DomainCertificate from "@/views/domainCertificate/DomainCertificate.vue";

export default {
  name: "domainCertificate",
  components: { DomainCertificate },
  data() {
    return {
      activeName: "first",
    };
  },
};
</script>

<style lang="scss" scoped></style>
