<template>
  <div class="app-container">
    <el-tabs v-model="tabName" :before-leave="leaveTab">
      <el-tab-pane label="行业对接方案" name="1">
        <Content :type='tabName' v-if="tabName === '1'"/>
      </el-tab-pane>
       <el-tab-pane label="业务产品对接方案" name="2">
        <Content :type='tabName' v-if="tabName === '2'"/>
      </el-tab-pane>
       <el-tab-pane label="场景对接方案" name="3">
        <Content :type='tabName' v-if="tabName === '3'"/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Content from "@/views/openBusinessClassification/content.vue";
export default {
  name: "OpenBusinessClassification",
  components: {
    Content
  },
  data(){
    return{
      tabName: '1'
    }
  },
  methods:{
    leaveTab(activeName, oldActiveName) {
      this.tabName = activeName;
    }
  }
};
</script>

