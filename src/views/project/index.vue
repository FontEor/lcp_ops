<template>
  <div class="mod-tpl">
    <div class="lui-container">
      <el-steps :active="step" align-center>
        <el-step title="项目信息" />
        <el-step title="任务信息" />
      </el-steps>
    </div>
    <!-- 第一步项目信息 -->
    <project-info
      v-show="step === 0"
      :step="step"
      @changeStep="changeStep"
    />
    <!-- 第二步任务信息 -->
    <project-task
      v-show="step === 1"
      :step="step"
      @changeStep="changeStep"
    />
  </div>
</template>

<script>
import ProjectInfo from '@/views/project/Info.vue'
import ProjectTask from '@/views/project/Task.vue'
export default {
  name: 'CustomersProject',
  components: {
    ProjectInfo,
    ProjectTask
  },
  data() {
    return {
      step: 0
    }
  },
  methods: {
    changeStep() {
      if (this.step++ > 0) this.step = 0
    }
  }
}
</script>
