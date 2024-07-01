<template>
  <div>
    <!-- 项目状态 -->
    <div class="lui-container">
      <el-row>
        <el-col :span="24">
          项目状态：
          <el-tag type="success" effect="dark" size="mini">计算成功</el-tag>
        </el-col>
      </el-row>
      <el-row class="pt10">
        <el-col :span="24">共5次任务，正在进行第3次任务<el-button type="text" class="pl10">重算失败任务</el-button></el-col>
      </el-row>
    </div>

    <!-- 项目信息 -->
    <div class="lui-container">
      <h2 class="lui-tit">项目信息</h2>
      <el-row :gutter="20" class="customers-list">
        <el-col :span="8"><span class="c-666">项目名称：</span>原来的项目名称</el-col>
        <el-col :span="8"><span class="c-666">项目编码：</span>DA123875862</el-col>
        <el-col :span="8"><span class="c-666">项目类型：</span>分析类项目</el-col>
        <el-col :span="8"><span class="c-666">服务对象：</span>对内使用/对外输出</el-col>
        <el-col :span="8"><span class="c-666">客户名称：</span>这里是客户名称</el-col>
        <el-col :span="8"><span class="c-666">数据用途：</span>营销决策/市场洞察/其他</el-col>
        <el-col :span="8"><span class="c-666">项目需求：</span>这里写的是项目需求</el-col>
      </el-row>
    </div>

    <!-- 任务信息 -->
    <div class="lui-container">
      <h2 class="lui-tit">任务信息</h2>
      <div class="config-group">
        <div class="config-thead cf">
          <h3 class="fl">这里是具体小项目名称（排行榜任务-区域排行）</h3>
          <div class="fr">
            <span class="c-success mlr10">计算完成</span>
            <span class="c-danger mlr10">计算失败</span>
            <el-button
              type="text"
              :icon="isUnfold?'el-icon-arrow-up':'el-icon-arrow-down'"
              @click="toggleFold"
            />
          </div>
        </div>
        <div v-show="isUnfold" class="config-tbody">
          <el-row :gutter="20">
            <el-col :span="6"><span class="c-666">任务编号：</span>DA123875862-2</el-col>
            <el-col :span="6"><span class="c-666">任务类型：</span>排行榜任务-区域排行</el-col>
            <el-col :span="6"><span class="c-666">关联的客群：</span>最强王者800星的大佬</el-col>
            <el-col :span="6" class="t-right"><el-button type="text">查看客群详情</el-button></el-col>
            <el-col :span="6"><span class="c-666">时间范围：</span>2020.03.10-2020.03.12</el-col>
            <el-col :span="6"><span class="c-666">排序规则：</span>销售额</el-col>
            <el-col :span="6"><span class="c-666">数据范围：</span>自营</el-col>
          </el-row>
          <div class="config-item mt10">
            <div class="tag-group">
              <div class="tag-group-title">品类筛选：</div>
              <el-tag
                v-for="item in tagItems"
                :key="item.label"
                size="mini"
              >
                {{ item.label }}
              </el-tag>
            </div>
            <div class="tag-group">
              <div class="tag-group-title">品牌筛选：</div>
              <el-tag
                v-for="item in tagItems"
                :key="item.label"
                size="mini"
              >
                {{ item.label }}
              </el-tag>
            </div>
            <div class="tag-group">
              <div class="tag-group-title">SKU筛选：</div>
              <el-tag
                v-for="item in tagItems"
                :key="item.label"
                size="mini"
              >
                {{ item.label }}
              </el-tag>
            </div>
            <div class="tag-group">
              <div class="tag-group-title">地区筛选：</div>
              <el-tag
                v-for="item in tagItems"
                :key="item.label"
                size="mini"
              >
                {{ item.label }}
              </el-tag>
            </div>
            <div class="tag-group">
              <span class="tag-group-title">站点类型：</span>所有站点
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'RankTaskDetail',
  data() {
    return {
      isUnfold: true,
      tagItems: [
        { label: '标签一' },
        { label: '标签二' },
        { label: '标签三' },
        { label: '标签四' },
        { label: '标签五' }
      ]
    }
  },
  computed: {
  },
  created() {
  },
  mounted() {
  },
  methods: {
    toggleFold() {
      this.isUnfold = !this.isUnfold
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/views/projectManage/index.scss';
</style>
