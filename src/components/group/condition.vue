<template>
  <!--弹框添加条件组按钮 -->
  <el-dialog
    title="添加条件组"
    :visible.sync="isDialogVisible"
    width="770px"
    custom-class="config-add-dialog"
  >
    <div class="dialog-content">
      <el-scrollbar wrap-class="scrollbar-wrapper" style="height:100%">
        <el-form ref="dialogForm" label-width="0" class="dialog-form">
          <!-- 用户标签 -->
          <div class="user-label-group">
            <label class="top-label">用户标签</label>
            <el-row
              v-for="(item, i) in userData"
              :key="i"
              :gutter="10" class="user-label-item"
            >
              <el-col :span="5">
                <el-form-item>
                  <el-select
                    v-model="userSelect[i][0]"
                    placeholder="请选择"
                    @change="getLabel2($event, 'userData', i)"
                  >
                    <el-option
                      v-for="uItem0 in userData[i][0]"
                      :key="uItem0.value"
                      :label="uItem0.label"
                      :value="uItem0.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item>
                  <el-select
                    v-model="userSelect[i][1]"
                    placeholder="请选择"
                    @change="getLabel3($event, 'userData', i)"
                  >
                    <el-option
                      v-for="uItem1 in userData[i][1]"
                      :key="uItem1.value"
                      :label="uItem1.label"
                      :value="uItem1.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item>
                  <el-select v-model="userSelect[i][2]" placeholder="请选择">
                    <!--1:包含，2:不包含 默认包含-->
                    <el-option label="包含" value="1" />
                    <el-option label="不含" value="2" />
                  </el-select>
                </el-form-item>
              </el-col>

              <template v-if="userData[i][3]">
                <condition-label
                  :type="userData[i][3].type"
                  :list="userData[i][3].source"
                  :select="userSelect[i][1]"
                  @changeLabel="changeLabel($event, 'userSelect',i,3)"
                />
              </template>

              <el-col v-if="userData.length>1" :span="1">
                <el-button type="text" icon="el-icon-remove" class="del-btn" @click="lessUserLabel(i)" />
              </el-col>
            </el-row>
            <el-button class="lui-btn" @click="addUserLabel">增加</el-button>
          </div>

          <div class="business-label-group pt20">
            <label class="top-label">业务数据</label>
            <!-- 一条业务数据 -->
            <div
              v-for="(item, i) in businessData"
              :key="i" class="business-label-item"
            >
              <el-row :gutter="10">
                <el-col
                  v-if="businessData[i] && businessData[i][0]!=='hide'"
                  :span="5"
                >
                  <el-form-item>
                    <el-select
                      v-model="businessSelect[i][0]"
                      placeholder="请选择"
                      @change="getLabel2($event, 'businessData', i)"
                    >
                      <el-option
                        v-for="bItem0 in businessData[i][0]"
                        :key="bItem0.value"
                        :label="bItem0.label"
                        :value="bItem0.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>

                <template v-if="businessData[i][0]!=='hide'">
                  <el-col v-if="!businessSelect[i][0] || businessSelect[i][0]==='SCDDSJ'" :span="6">
                    <div class="mock-inp" :class="{'selected': businessSelect[i][0]==='SCDDSJ'}">
                      {{ businessSelect[i][0]==='SCDDSJ'?'下单时间':'未选择类型' }}
                    </div>
                    <p v-show="businessSelect[i][0]==='SCDDSJ'" class="form-tip">1、可获取到昨日数据</p>
                  </el-col>

                  <template v-if="businessSelect[i][0]==='SCDDSJ'">
                    <!-- 商城订单数据 必选-->
                    <el-col :span="8">
                      <el-form-item>
                        <el-date-picker
                          v-model="businessRequired[i][0]"
                          type="daterange"
                          range-separator="-"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col v-if="businessData.length!==1" :span="1">
                      <el-button type="text" icon="el-icon-remove" class="del-btn" @click="lessBusinessData(i)" />
                    </el-col>
                  </template>
                </template>

                <template v-if="businessSelect[i][0] && businessSelect[i][0]!=='SCDDSJ'">
                  <!--已选择第一级标签，且选中的不是商城订单数据(右侧的选项)-->
                  <!--运单数量下的选择包含-->
                  <el-row :gutter="10">
                    <el-col :span="6">
                      <el-form-item>
                        <el-select
                          v-model="businessSelect[i][1]"
                          placeholder="请选择"
                          @change="getLabel3($event, 'businessData', i)"
                        >
                          <el-option
                            v-for="bItem1 in businessData[i][1]"
                            :key="bItem1.value"
                            :label="bItem1.label"
                            :value="bItem1.value"
                          />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="3">
                      <el-form-item>
                        <el-select v-model="businessSelect[i][2]" placeholder="请选择">
                          <el-option label="包含" value="1" />
                          <el-option label="不含" value="2" />
                        </el-select>
                      </el-form-item>
                    </el-col>

                    <template v-if="businessData[i][3]">
                      <condition-label
                        :type="businessData[i][3].type"
                        :list="businessData[i][3].source"
                        :select="businessSelect[i][1]"
                        @changeLabel="changeLabel($event, 'businessSelect', i, 3)"
                      />
                    </template>

                    <el-col v-if="businessSelect[i][0]==='SCDDSJ'" :span="2">
                      <el-button type="text" icon="el-icon-circle-plus" class="add-btn" @click="addBusinessDataSame(i)" />
                      <el-button type="text" icon="el-icon-remove" class="del-btn" />
                    </el-col>
                  </el-row>
                </template>
              </el-row>

              <!-- 下单时间出现 -->
              <el-row v-if="businessSelect[i][0] && businessSelect[i][0]==='SCDDSJ'" :gutter="10">
                <!--已选一级菜单时-->
                <el-col :offset="5">
                  <!--运单数量-->
                  <el-row v-if="businessSelect[i][0]==='SCDDSJ' && businessData[i][0]!=='hide'" :gutter="10">
                    <!--商城订单数据 必选-->
                    <el-col :span="6">
                      <div class="mock-inp selected">
                        C2C运单数量≥
                      </div>
                      <p class="form-tip">1、包含揽收完成后无取消的订单、无退回的订单<br>2、不包含逆向单</p>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item>
                        <el-input v-model="businessRequired[i][1]" placeholder="请输入数量" />
                      </el-form-item>
                    </el-col>
                  </el-row>

                  <!--多变化包含-->
                  <el-row :gutter="10">
                    <!--可加减的部分-->
                    <el-col :span="6">
                      <el-form-item>
                        <el-select
                          v-model="businessSelect[i][1]"
                          placeholder="请选择"
                          @change="getLabel3($event, 'businessData', i)"
                        >
                          <el-option
                            v-for="bItem1 in businessData[i][1]"
                            :key="bItem1.value"
                            :label="bItem1.label"
                            :value="bItem1.value"
                          />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="3">
                      <el-form-item>
                        <el-select v-model="businessSelect[i][2]" placeholder="请选择">
                          <el-option label="包含" value="1" />
                          <el-option label="不含" value="2" />
                        </el-select>
                      </el-form-item>
                    </el-col>

                    <template v-if="businessData[i][3]">
                      <condition-label
                        :type="businessData[i][3].type"
                        :list="businessData[i][3].source"
                        :select="businessSelect[i][1]"
                        @changeLabel="changeLabel($event, 'businessSelect', i, 3)"
                      />
                    </template>

                    <el-col v-if="businessSelect[i][0]==='SCDDSJ'" :span="2">
                      <el-button type="text" icon="el-icon-circle-plus" class="add-btn" @click="addBusinessDataSame(i)" />
                      <el-button v-if="businessData.length>1" type="text" icon="el-icon-remove" class="del-btn" />
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </div>
            <el-button class="lui-btn" @click="addBusinessData">增加</el-button>
          </div>
        </el-form>
      </el-scrollbar>
    </div>
    <span slot="footer" class="dialog-footer">
      <template v-if="(userSelect[0] && userSelect[0][0]) || (businessSelect[0] && businessSelect[0][0])">
        <!--已选择标签时，点击取消则显示确认项-->
        <el-popover
          v-model="confirmCancel"
          placement="top"
          width="170"
        >
          <p>已添加标签，确认取消添加条件组吗？</p>
          <div style="text-align: right; margin: 10px 0 0">
            <el-button size="mini" type="text" @click="confirmCancel = false">取消</el-button>
            <el-button type="primary" size="mini" @click="confirmCancelHandle">确定</el-button>
          </div>
          <el-button slot="reference">取 消</el-button>
        </el-popover>
      </template>
      <template v-else>
        <el-button @click="isDialogVisible = false">取 消</el-button>
      </template>

      <el-button type="primary" @click="confirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/babel">
import label from './condition.js'
import conditionLabel from './conditionLabel.vue'
export default {
  name: 'Condition',
  components: {
    conditionLabel
  },
  props: {
    isDialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      confirmCancel: false, // 取消确认弹窗

      userData: [], // [ [] ]  用户标签列表(可选项)
      businessData: [], // [ [] ] 业务数据列表(可选项)
      userSelect: [], // [ [] ] 用户标签列表(选中的结果)
      businessSelect: [], // [ [] ] 业务数据列表(选中的结果)
      businessRequired: [] // [ [] ] 业务数据列表(选中的结果，非空的)

      /* userLabel1: [ //用户标签
          {value:1,label:'基本属性'}
        ],
        options2: [  //二级选项
          {value:1,label:'自然属性'},
          {value:2,label:'流量行为'},
          {value:3,label:'常用收件地址'},
          {value:4,label:'默认寄件地址'},
        ], */
    }
  },
  /*    computed:{
      dialogOrderTimeTxt(){
        return true || this.dialogForm.f5 ? true: false
      }
    }, */
  mounted() {
  },
  methods: {
    init() { // 初始化
      Object.assign(this.$data, this.$options.data(), {
        isDialogVisible: this.isDialogVisible
      })
      this.addUserLabel()
      this.addBusinessData()
    },
    getLabel1(target, key, index) { // 获取第一层选择框
      const result = []
      const obj = {}
      label.forEach((item) => {
        if (item[0] === target && !obj[item[2]]) {
          result.push({
            value: item[2],
            label: item[3]
          })
          obj[item[2]] = true
        }
      })
      // this[key][index][0] = result  //对可选项赋值
      this[key][index] = [result] // 对可选项赋值
      console.log('result', this[key][index])
    },
    getLabel2(target, key, index) { // 获取第二层选择框
      const result = []
      const obj = {}
      label.forEach((item) => {
        if (item[2] === target && !obj[item[5]]) {
          result.push({
            value: item[5],
            label: item[6],
            nextLabel: item[7] // 下一层选择框的类型
          })
          obj[item[5]] = true
        }
      })
      this[key][index][1] = result // 对可选项赋值
      this[key][index][2] = ''
    },
    getLabel3(target, key, index) { // 获取第四层选择框
      if (key === 'userData') { // 用户标签的包含关系
        this.userSelect[index][2] = '1' // 1:包含，2:不包含 默认包含
      } else {
        this.businessSelect[index][2] = '1' // 1:包含，2:不包含 默认包含
      }

      const source = this[key][index][1] // 触发此方法的数据源
      for (let i = 0; i < source.length; i += 1) {
        if (target === source[i].value) {
          let item = null
          console.log(source[i].label)
          if (source[i].nextLabel !== '') { // 有内容，第四个选项是个下拉框
            const list = []
            const labelSource = JSON.parse(source[i].nextLabel)
            Object.keys(labelSource).forEach((ckey) => {
              list.push({
                value: labelSource[ckey],
                label: ckey
              })
            })

            item = { // 设置下拉框的数据源
              type: 'select',
              source: list
            }
          } else if (source[i].label.indexOf('时间') !== -1) {
            item = { type: 'dateRange' }
          } else if (source[i].label.indexOf('品牌') !== -1) { // 模糊搜索
            item = { type: 'fuzzySearch' }
          } else if (source[i].label.indexOf('SKU') !== -1) { // 文件上传
            item = { type: 'file' }
          } else if (source[i].label.indexOf('一级品类') !== -1) {
            item = { type: 'category1' }
          } else if (source[i].label.indexOf('二级品类') !== -1) {
            item = { type: 'category2' }
          } else if (source[i].label.indexOf('三级品类') !== -1) {
            item = { type: 'category3' }
          } else if (source[i].label.indexOf('区域') !== -1) {
            if (source[i].label.indexOf('常用收件') !== -1 || source[i].label.indexOf('常用寄件') !== -1 || source[i].label.indexOf('常收货') !== -1) {
              item = { type: 'Mkt1' }
            } else {
              item = { type: 'area1' }
            }
          } else if (source[i].label.indexOf('省份') !== -1) {
            if (source[i].label.indexOf('常用收件') !== -1 || source[i].label.indexOf('常用寄件') !== -1 || source[i].label.indexOf('常收货') !== -1) {
              item = { type: 'Mkt2' }
            } else {
              item = { type: 'area2' }
            }
          } else if (source[i].label.indexOf('市') !== -1) {
            if (source[i].label.indexOf('常用收件') !== -1 || source[i].label.indexOf('常用寄件') !== -1 || source[i].label.indexOf('常收货') !== -1) {
              item = { type: 'Mkt3' }
            } else {
              item = { type: 'area3' }
            }
          } else if (source[i].label.indexOf('县') !== -1) {
            if (source[i].label.indexOf('常用收件') !== -1 || source[i].label.indexOf('常用寄件') !== -1 || source[i].label.indexOf('常收货') !== -1) {
              item = { type: 'Mkt4' }
            } else {
              item = { type: 'area4' }
            }
          } else { // 空字符串，第四个选项是个输入框
            item = { type: 'input' }
          }
          this[key][index][3] = item
          break
        }
      }
    },

    changeLabel(val, labelType, index, index2) { // 修改最后一级的值
      console.log('val', val)
      this[labelType][index][index2] = val
    },
    confirm() { // 确定
      console.log(this.userData, this.userSelect)
      this.$emit('addGroup', {
        userData: this.userData,
        userSelect: this.userSelect,
        businessData: this.businessData,
        businessSelect: this.businessSelect,
        businessRequired: this.businessRequired
      })
      this.isDialogVisible = false
    },
    addUserLabel() { // 增加用户标签
      this.userData.push([])
      this.userSelect.push([])
      this.getLabel1('YHBQ', 'userData', this.userData.length - 1)// 用户标签
    },
    lessUserLabel(i) { // 减去当前用户标签
      this.userData.splice(i, 1)
      this.userSelect.splice(i, 1)
    },
    addBusinessData() { // 添加业务数据
      this.businessData.push([])
      this.businessSelect.push([])
      this.businessRequired.push([])
      this.getLabel1('YWSJ', 'businessData', this.businessData.length - 1) // 业务数据
    },
    addBusinessDataSame(i) { // 添加一个相同的业务数据
      this.businessData.splice(i + 1, 0, ['hide', this.businessData[i][1]]) // 隐藏第一列
      this.businessSelect.splice(i + 1, 0, [this.businessSelect[i][0]])
      this.businessRequired.splice(i + 1, 0, [])
    },
    lessBusinessData(i) { // 删除业务数据
      this.businessData.splice(i, 1)
      this.businessSelect.splice(i, 1)
      this.businessRequired.splice(i, 1)
    },
    showDialog() { // 显示弹窗(父组件调用)
      this.isDialogVisible = true
      this.init()
    },
    confirmCancelHandle() { // 取消确认弹窗，点击确认
      this.confirmCancel = false
      this.isDialogVisible = false
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/ .config-add-dialog{
  .el-dialog__body{
    padding:10px 0;
  }
  .el-scrollbar__bar.is-horizontal{
    display: none;
  }
  .dialog-content{
    height:480px;
    .el-scrollbar__wrap {
      overflow-x: hidden;
      overflow-y: scroll;
    }
    .dialog-form{
      padding:0 20px;
      .top-label{
        display:block;
        color:#333;
        font-size:14px;
        margin-bottom:12px;
      }
      .mock-inp{
        background: #FFFFFF;
        border: 1px solid #D9D9D9;
        border-radius: 4px;
        padding:0 10px;
        height: 32px;
        line-height: 32px;
        color:#b5b5b5;
        &.selected{
          color:#333;
          &:before{
            content:"*";
            display:inline-block;
            color:#e1251b;
          }
        }
      }
      .del-btn,
      .add-btn{
        font-size:15px;
      }
      .del-btn{
        color:#e1251b;
      }
      .add-btn{
        color:#26a874;
      }
      .form-tip{
        color:#b5b5b5;
        font-size:12px;
        line-height:18px;
        padding-bottom:4px;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
    .el-upload-list{
      padding-bottom:5px;
    }
    .mock-inp{
      .el-input__inner{
        border:0;
        height:100%;
        padding:0;
        text-align:center;
      }
    }
    .business-label-item{
      & .el-form-item__content .el-range-editor{
        width: 100%;
      }
    }
  }
}
.el-button {
  font-size: 14px;
}
.ft {
  max-height: 60px;
}
</style>
