<template>
  <!-- 地区范围 -->
  <div class="view-config-area">
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules">
      <el-form-item label="选择方式" prop="area">
        <el-radio-group v-model="ruleForm.area">
          <el-radio label="1">地图选择</el-radio>
          <el-radio label="2">文件导入</el-radio>
          <span class="area-tip">（支持导入多个地址）</span>
        </el-radio-group>
      </el-form-item>
      <template v-if="ruleForm.area ==1">
        <div class="map-wrap">
          <div class="map-inp-wrap">
            <el-input v-model="input" clearable placeholder="请输入内容" class="input-with-select" @focus="handleShowDropdown(2)">
              <el-select slot="prepend" v-model="select" placeholder="请选择" popper-class="city-select-dropdown-popover" @focus="handleShowDropdown(1)" />
              <el-button slot="append" icon="el-icon-search" />
            </el-input>
            <!-- 切换城市 -->
            <div v-if="mapStatus == 1" class="city-search-wrap citys-list-box">
              <p class="filed">当前选择：<span class="fb">全国</span></p>
              <div class="hot-citys">
                <p class="filed">热门城市</p>
                <div class="hot-city-group">
                  <el-button
                    v-for="item in tagItems"
                    :key="item.code"
                    size="small"
                  >
                    <a href="javascript:;"> {{ item.city }}</a>
                  </el-button>
                </div>
              </div>
              <div class="all-citys">
                <p class="filed">全国城市列表</p>
                <div class="city-search cf">
                  <el-radio-group v-model="cityCheckboxVal" size="mini" class="fl">
                    <el-radio-button label="province" name="citys">按省份</el-radio-button>
                    <el-radio-button label="spell" name="citys">按拼音</el-radio-button>
                  </el-radio-group>
                  <!-- 组件input-带输入建议 -->
                  <el-input
                    v-model="searchCity"
                    placeholder="请输入城市"
                    suffix-icon="el-icon-search"
                    :fetch-suggestions="querySearch"
                    :trigger-on-focus="false"
                    size="mini"
                    class="fr"
                  />
                </div>
                <div class="city-province-item">
                  <h4>安徽</h4>
                  <a href="javascript:;">北京</a>
                  <a href="javascript:;">上海</a>
                  <a href="javascript:;">广州</a>
                  <a href="javascript:;">深圳</a>
                  <a href="javascript:;">天津</a>
                  <a href="javascript:;">北京</a>
                  <a href="javascript:;">上海</a>
                  <a href="javascript:;">广州</a>
                  <a href="javascript:;">深圳</a>
                  <a href="javascript:;">天津</a>
                </div>
                <div class="city-province-item">
                  <h4>安徽</h4>
                  <a href="javascript:;">北京</a>
                  <a href="javascript:;">上海</a>
                  <a href="javascript:;">广州</a>
                  <a href="javascript:;">深圳</a>
                  <a href="javascript:;">天津</a>
                  <a href="javascript:;">北京</a>
                  <a href="javascript:;">上海</a>
                  <a href="javascript:;">广州</a>
                  <a href="javascript:;">深圳</a>
                  <a href="javascript:;">天津</a>
                </div>
              </div>
            </div>
            <!-- 本城市内搜索到多个结果 -->
            <div v-if="mapStatus == 2" class="city-search-wrap search-many-box">
              <div class="locations">
                <a href="javascript:;" class="location-item" @click="handleShowDropdown(5)">
                  <span class="sep">京东总部<span class="c-333">A</span></span>北京市大兴区
                  <i class="location-icon">1</i>
                </a>
                <a href="javascript:;" class="location-item" @click="handleShowDropdown(5)">
                  <span class="sep">京东总部<span class="c-333">A</span></span>北京市大兴区
                  <i class="location-icon">2</i>
                </a>
              </div>
              <div class="agination-wrap">
                <el-pagination
                  layout="prev, pager, next"
                  :total="1000"
                />
              </div>
            </div>
            <!-- 输⼊入后提供模糊提示 -->
            <div v-if="mapStatus == 3" class="city-search-wrap search-many-box fuzzy-search-box">
              <div class="locations">
                <a href="javascript:;" class="location-item">
                  <span class="sep">京东总部<span class="c-333">A</span></span>北京市大兴区
                </a>
                <a href="javascript:;" class="location-item">
                  <span class="sep">京东总部<span class="c-333">A</span></span>北京市大兴区
                </a>
              </div>
            </div>
            <!-- 「全国」范围下，搜索结果位于多个城市时 -->
            <div v-if="mapStatus == 4" class="city-search-wrap related-site-box">
              <p>以下城市有相关地点：</p>
              <div class="related-city">
                <a href="javascript:;">北京(231)</a>
                <a href="javascript:;">北京(231)</a>
                <a href="javascript:;">北京(231)</a>
                <a href="javascript:;">北京(231)</a>
                <a href="javascript:;">北京(231)</a>
                <a href="javascript:;">北京(231)</a>
              </div>
              <p class="f12 c-999">若搜索错误，请输入完整词或检查输入是否正确</p>
            </div>
            <!-- 详情 -->
            <div v-if="mapStatus == 5" class="location-detail">
              <el-button type="text" size="small" icon="el-icon-arrow-left" class="top-back">
                返回”京东总部”的搜索结果
              </el-button>
              <div class="detail">
                <div class="site">
                  <p class="mb5">京东总部A</p>
                  <p class="f12 c-666">北京市大兴区科创十一街18号院</p>
                </div>
                <el-form-item label="设置范围">
                  <el-radio-group v-model="range">
                    <el-radio label="2">圆形范围</el-radio>
                    <el-radio label="3">矩形范围</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="选中地点为中心长">
                  <el-input-number
                    v-model="lengthVal"
                    controls-position="right"
                    :min="1" :max="10"
                    size="mini"
                  />
                  <span class="pl10">公里的范围</span>
                </el-form-item>
                <el-form-item label="选中地点为中心宽">
                  <el-input-number
                    v-model="widthVal"
                    controls-position="right"
                    :min="1" :max="10"
                    size="mini"
                  />
                  <span class="pl10">公里的范围</span>
                </el-form-item>
              </div>
            </div>
            <!-- 如果展开浮层时，地图⼤大⼩小滚动则暂时隐藏浮层，停⽌止滚动1s后展开 -->
            <div v-if="mapStatus == 6" class="fold-tip-box">
              已选择：京东总部A
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="upload">
          <label class="lui-label">导入文件</label>
          <el-upload
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            multiple
            :limit="3"
            :on-exceed="handleExceed"
            :file-list="fileList"
            style="width:150px"
          >
            <el-button type="primary">点击导入</el-button>
          </el-upload>
          <el-button type="text" class="txt-btn">下载模板</el-button>
          <p class="c-999 pt10">导入的文件需小于1Mb，导入后需要进行经纬度计算</p>
          <p class="c-999 f13">(为避免计算错误，建议 <el-button type="text" size="small">核对计算结果</el-button>)</p>
        </div>
        <el-form-item label="设置范围">
          <el-radio-group v-model="ruleForm.f5">
            <el-radio label="1">无范围</el-radio>
            <el-radio label="2">圆形范围</el-radio>
            <el-radio label="3">矩形范围</el-radio>
          </el-radio-group>
        </el-form-item>
      </template>
    </el-form>
  </div>
</template>

<script type="text/babel">

export default {
  name: 'AreaRange',
  components: {
  },
  props: {
  },
  data() {
    return {
      cityCheckboxVal: 'province',
      searchCity: '',
      mapStatus: 0,
      querySearch: [],
      tagItems: [
        {
          city: '北京',
          code: '020'
        },
        {
          city: '上海',
          code: '021'
        },
        {
          city: '广州',
          code: '0531'
        },
        {
          city: '深圳',
          code: '0271'
        },
        {
          city: '天津',
          code: '022'
        },
        {
          city: '重庆',
          code: '023'
        }
      ],
      input: '',
      select: '',
      range: '',
      lengthVal: '',
      widthVal: '',
      ruleForm: {
        area: '2'
      },
      fileList: [],
      rules: {
        area: [
          { required: true, message: '请选择选择方式', trigger: 'change' }
        ]
      }
    }
  },

  mounted() {
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    handlePreview(file) {
      console.log(file)
    },

    handleShowDropdown(status) {
      this.mapStatus = status
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/mixins.scss";
  .map-wrap{
    position:relative;
    width:100%;
    height:540px;
    background:#f5f5f5;
    .map-inp-wrap{
      width:372px;
      position:absolute;
      top:24px;
      left:24px;
      /deep/ .el-select .el-input {
        width: 100px;
      }
      /deep/ .input-with-select .el-input-group__prepend {
        background-color: #fff;
      }
      .fold-tip-box{
        position:absolute;
        top:100%;
        width:100%;
        margin-top:4px;
        background:#fff;
        text-align: left;
        padding:10px;
        border-radius: 4px;
      }
      .city-search-wrap{
        position:absolute;
        top:100%;
        margin-top:4px;
        background:#fff;
        width:100%;
        border-radius: 4px;
        padding:16px;
      }
      .citys-list-box{
        padding-top:6px;
        .filed{
          margin:10px 0;
        }
        .hot-city-group{
          margin:-5px -5px 0;
          /deep/ .el-button{
            margin:5px;
          }
        }
        .city-search{
          /deep/ .el-input{
            width:220px;
          }
        }
        .city-province-item{
          margin:0 -8px;
          h4{
            font-weight:600;
            margin: 10px 8px 2px;
          }
          a{
            display:inline-block;
            color:#666;
            padding:3px 4px;
            margin:0 4px;
          }
        }
      }
      .search-many-box{
        .location-item{
          display: block;
          color:#666;
          padding-left:30px;
          margin-bottom:10px;
          position:relative;
          .sep{
            margin-right:30px;
            @include font_color("main-color");
          }
          .location-icon{
            position:absolute;
            top:50%;
            left:0;
            width:14px;
            height:18px;
            margin-top:-9px;
            @include background_color("main-color");
            text-align:center;
            color:#fff;
            font-size:12px;
            line-height:18px;
            border-radius: 20px 20px 50px 50px;
          }
        }
        .agination-wrap{
          padding-top:5px;
          text-align: center;
          /deep/ .el-pagination{
            display: inline-block;
          }
        }
        &.fuzzy-search-box{
          .location-item{
            padding-left:0;
          }
        }
      }
      .related-site-box{
        .related-city{
          padding:10px 0;
          margin:0 -10px;
          a{
            display: inline-block;
            @include font_color("main-color");
            padding:0 10px;
            line-height:26px;
          }
        }
      }
      .location-detail{
        position:absolute;
        top:100%;
        width:100%;
        border-radius: 4px;
        .top-back{
          margin-top:4px;
          background:#fff;
          width:100%;
          border-radius: 4px;
          text-align: left;
          padding-left:10px;
          padding-right:10px;
        }
        .detail{
          margin-top:4px;
          background:#fff;
          width:100%;
          border-radius: 4px;
          padding:10px;
          font-size:13px;
          .site{
            padding-bottom:5px;
            border-bottom:1px solid #d9d9d9;
            margin-bottom:5px;
          }
          /deep/ .el-form-item{
            margin-bottom:5px;
          }
        }
      }
    }
  }
</style>
<style>
.city-select-dropdown-popover {
  z-index: -999!important;
}
</style>
