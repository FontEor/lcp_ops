<template>
  <!-- 添加条件组的最后一级 -->
  <!--下拉多选-->
  <el-col v-if="type === 'select'" :span="7">
    <el-form-item>
      <el-select
        v-model="value"
        multiple
        filterable
        clearable
        placeholder="请选择"
        style="display:block"
      >
        <el-option
          v-for="item in list"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
  </el-col>

  <el-col v-else-if="type === 'input'" :span="7">
    <div class="mock-inp">
      <el-input v-model="value" placeholder="请输入" />
    </div>
  </el-col>

  <el-col v-else-if="type === 'fuzzySearch'" :span="7">
    <!--模糊搜索-->
    <div class="mock-inp">
      <el-autocomplete
        v-model="fuzzySearchVal"
        :fetch-suggestions="queryBrandByName"
        placeholder="请输入内容"
        @select="fuzzySearchSelect"
      />

      <!-- <el-input v-model="value" placeholder="请输入"/>-->
    </div>
  </el-col>

  <!--级联选择器-->
  <!--<el-col :span="7">
    <el-form-item>
      <el-cascader
        v-model="dialogForm.f4"
        :options="cascaderOptions"
        style="display:block">
      </el-cascader>
    </el-form-item>
  </el-col>-->

  <el-col v-else-if="type === 'area1' || type === 'area2' || type === 'area3' || type === 'area4'" :span="7">
    <el-form-item class="cascader">
      <el-cascader
        v-model="value"
        :props="areaProps"
        separator="-"
        collapse-tags
      />
    </el-form-item>
  </el-col>

  <el-col v-else-if="type === 'Mkt1' || type === 'Mkt2' || type === 'Mkt3' || type === 'Mkt4'" :span="7">
    <el-form-item class="cascader">
      <el-cascader
        v-model="value"
        :props="MktProps"
        separator="-"
        collapse-tags
      />
    </el-form-item>
  </el-col>

  <el-col v-else-if="type === 'category1' || type === 'category2' || type === 'category3'" :span="7">
    <el-form-item class="cascader">
      <el-cascader
        v-model="value"
        :props="categoryProps"
        separator="-"
        collapse-tags
      />
    </el-form-item>
  </el-col>

  <!--数据区间-->
  <!--<el-col :span="7">
    <div class="mock-inp">
      <el-row>
        <el-col :span="10"><el-input v-model="f13" placeholder="最小值"/></el-col>
        <el-col :span="4" class="tc">-</el-col>
        <el-col :span="10"><el-input v-model="f14" placeholder="最大值"/></el-col>
      </el-row>
    </div>
  </el-col>-->

  <!--数据区间-->
  <!--  <el-col :span="8" v-else-if="type === 'range'">
    <div class="mock-inp">
      <el-row>
        <el-col :span="10"><el-input v-model="f13" placeholder="最小值"/></el-col>
        <el-col :span="4" class="tc">-</el-col>
        <el-col :span="10"><el-input v-model="f14" placeholder="最大值"/></el-col>
      </el-row>
    </div>
  </el-col>-->

  <el-col v-else-if="type === 'dateRange'" :span="8">
    <el-form-item>
      <el-date-picker
        v-model="value"
        type="daterange"
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      />
    </el-form-item>
  </el-col>

  <!--下拉单选模糊搜索-->
  <!--<el-col :span="8">
    <el-form-item>
      <el-select
      v-model="dialogForm.f12"
      filterable
      clearable
      placeholder="请选择"
      style="display:block">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
  </el-col>-->
  <!--下拉多选-->
  <!--<el-col :span="8">
    <el-form-item>
      <el-select
      v-model="dialogForm.f12"
      multiple
      filterable
      clearable
      placeholder="请选择"
      style="display:block">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
  </el-col>-->
  <!--级联选择器-->
  <!--<el-col :span="8">
    <el-form-item>
      <el-cascader
        v-model="dialogForm.f12"
        :options="cascaderOptions"
        style="display:block">
      </el-cascader>
    </el-form-item>
  </el-col>-->
  <!--文件上传-->
  <el-col v-else-if="type === 'file'" :span="4">
    <el-upload
      class="dialog-upload"
      action="https://jsonplaceholder.typicode.com/posts/"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :before-remove="beforeRemove"
      multiple
      :limit="3"
      :on-exceed="handleExceed"
      :file-list="fileList"
    >
      <el-button type="primary" icon="el-icon-upload2">点击上传</el-button>
    </el-upload>
    <p class="form-tip mb10">1、上传格式支持excel、txt<br>2、上传的文件大小不能超过100Mb</p>
  </el-col>
</template>

<script type="text/babel">

export default {
  name: 'ConditionLabel',
  props: [],
  data() {
    return {
      areaProps: { // 地址级联选择器动态加载
        lazy: true,
        multiple: true,
        lazyLoad(node, resolve) {
          console.log('node', node)
          const typeNum = this.type.slice(-1)
          if (node.level === 0) {
            this.queryArea(resolve, typeNum === '1') // 查询区域(大区)
          } else if (node.level === 1 && typeNum > 1) {
            this.queryProvince(node.data.value, resolve, typeNum === '2') // 根据大区查询省份
          } else if (node.level === 2 && typeNum > 2) {
            this.queryCity(node.data.value, resolve, typeNum === '3') // 根据省份id列表查询城市
          } else if (node.level === 3 && typeNum > 3) {
            this.queryCounty(node.data.value, resolve, typeNum === '4') // 根据城市id列表查询区县
          } else {
            resolve()
          }
        }
      },
      MktProps: { // 地址级联选择器动态加载
        lazy: true,
        multiple: true,
        lazyLoad(node, resolve) {
          console.log('node', node)
          const typeNum = this.type.slice(-1)
          if (node.level === 0) {
            this.queryArea(resolve, typeNum === '1') // 查询区域(大区)
          } else if (node.level === 1 && typeNum > 1) {
            this.queryMktProvince(node.data.value, resolve, typeNum === '2') // 根据大区查询省份
          } else if (node.level === 2 && typeNum > 2) {
            this.queryMktCity(node.data.value, resolve, typeNum === '3') // 根据省份id列表查询城市
          } else if (node.level === 3 && typeNum > 3) {
            this.queryMktCounty(node.data.value, resolve, typeNum === '4') // 根据城市id列表查询区县
          } else {
            resolve()
          }
        }
      },
      categoryProps: { // 品类选择器动态加载
        lazy: true,
        multiple: true,
        lazyLoad(node, resolve) {
          console.log('node', node)
          const typeNum = this.type.slice(-1)
          if (node.level === 0) {
            this.queryFirstCategoryList(resolve, typeNum === '1') // 查询一级品类列表
          } else if (node.level === 1 && typeNum > 1) {
            this.querySecondCategoryList(node.data.value, resolve, typeNum === '2') // 查询二级品类列表
          } else if (node.level === 2 && typeNum > 2) {
            this.queryThirdCategoryList(node.data.value, resolve, typeNum === '3') // 查询三级品类列表
          } else {
            resolve()
          }
        }
      },
      fileList: [],
      value: '',
      fuzzySearchVal: ''
    }
  },
  watch: {
    value(newVal, oldVal) {
      this.$emit('changeLabel', newVal)
    },
    select(newVal) { // 父组件的下拉框选中的值
      this.resetData()
    }
  },
  mounted() {
    console.log(this.list, this.type)
  },
  methods: {
    formatArea(data, value, label, leaf) {
      const result = []
      data.forEach((item) => {
        result.push({
          value: item[value],
          label: item[label],
          leaf: !!leaf
        })
      })
      return result
    },

    fuzzySearchSelect(e) {
      console.log('fuzzySearchSelect', e)
      this.value = e
    },

    handlePreview(file) {
      console.log(file)
    },
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
    resetData() { // 父元素切换时，重置(父元素修改下拉框时调用)
      this.fileList = this.$options.data().fileList
      this.value = this.$options.data().value
      this.fuzzySearchVal = this.$options.data().fuzzySearchVal
    }
  }
}
</script>

<style lang="scss" scoped>
  .cascader /deep/ .el-cascader__tags{
    width: 60%;
    flex-wrap: nowrap;
  }
</style>
