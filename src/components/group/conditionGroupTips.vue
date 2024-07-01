<template>
  <!-- 条件组关系说明 -->
  <div class="view-config-relation-intr">
    <p>(条件组关系说明)</p>
    <p class="c-666 mt5">请仔细配置条件组关系，否则计算结果会出现误差</p>
    <div class="example">
      <div class="tag-group">
        <div class="tag-group-title">并且：</div>
        <span class="c-999">例：选择</span>
        <el-tag type="info" effect="lightBorder">收货地：北京</el-tag>
        <el-tag type="info" effect="lightBorder">并且</el-tag>
        <el-tag type="info" effect="lightBorder">商品：oppo</el-tag>
        <span class="c-999">时，计算出的结果为</span>
        <el-tag type="info" effect="lightBorder">收货地是北京，且商品是oppo</el-tag>
        <span class="c-999">的用户数量</span>
      </div>
      <div class="tag-group">
        <div class="tag-group-title">或者：</div>
        <span class="c-999">例：选择</span>
        <el-tag type="info" effect="lightBorder">收货地：北京</el-tag>
        <el-tag type="info" effect="lightBorder">并且</el-tag>
        <el-tag type="info" effect="lightBorder">商品：oppo</el-tag>
        <span class="c-999">时，计算出的结果为</span>
        <el-tag type="info" effect="lightBorder">收货地是北京，且商品是oppo</el-tag>
        <span class="c-999">的用户数量</span>
      </div>
      <div class="tag-group">
        <div class="tag-group-title">不含：</div>
        <span class="c-999">例：选择</span>
        <el-tag type="info" effect="lightBorder">收货地：北京</el-tag>
        <el-tag type="info" effect="lightBorder">并且</el-tag>
        <el-tag type="info" effect="lightBorder">商品：oppo</el-tag>
        <span class="c-999">时，计算出的结果为</span>
        <el-tag type="info" effect="lightBorder">收货地是北京，且商品是oppo</el-tag>
        <span class="c-999">的用户数量</span>
      </div>
    </div>
  </div>
</template>

<script type="text/babel">
export default {
  name: 'ConditionGroupTips',
  props: {
  },
  data() {
    return {
    }
  },

  mounted() {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.tag-group{
  .tag-group-title{
    font-size:13px;
    color: #666;
    margin-bottom:5px;
  }
  .el-tag {
    margin: 0 10px 10px 0;
  }
  &.tag-info-group{
    margin:16px 0 0;
    .el-tag{
      margin:0 5px;
    }
  }
}
</style>
