
<template>
  <div class="information app-container">
    <el-tabs v-model="activeName">
      <el-tab-pane label="开发团队管理" name="informationSearch">
        <InformationSearch />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import InformationSearch from '@/views/business/informationSearch.vue'

export default {
  name: 'Information',
  components: {
    InformationSearch
  },
  data() {
    return {
      activeName: 'informationSearch'
    }
  }
}
</script>
