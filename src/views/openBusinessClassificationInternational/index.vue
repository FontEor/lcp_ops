<template>
  <div class="app-container">
    <el-tabs v-model="tabName" :before-leave="leaveTab">
       <el-tab-pane label="业务产品对接方案" name="2">
        <Content :type='tabName' v-if="tabName === '2'"/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Content from "@/views/openBusinessClassificationInternational/content.vue";
export default {
  name: "OpenBusinessClassification",
  components: {
    Content
  },
  data(){
    return{
      tabName: '2'
    }
  },
  methods:{
    leaveTab(activeName, oldActiveName) {
      this.tabName = activeName;
    }
  }
};
</script>

