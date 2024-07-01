
<template>
  <div class="information app-container">
    <el-tabs v-model="activeName">
      <el-tab-pane label="国际开发团队管理" name="informationSearch">
        <InformationSearch />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import InformationSearch from './components/InfomationSearch.vue'

export default {
  name: 'I18nInformation',
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
