<template>
  <div class="lui-view customers-view">
    <div class="lui-tit">添加任务</div>
    <!-- 画像任务配置标签 -->
    <div class="config-group">
      <div class="config-thead cf">
        <span>这里是任务名称（画像任务）</span>
        <div class="fr">
          <el-button type="text" @click="dialogPictureFormVisible = true">编辑</el-button>
          <el-button type="text" @click="handeDelItem">删除</el-button>
          <el-button type="text" :icon="isUnfold?'el-icon-arrow-down':'el-icon-arrow-up'" />
        </div>
      </div>
      <div class="config-tbody">
        <p class="tip">
          <span class="c-666">所关联客群：</span>这里是刚才所关联的客群名称
          <el-tooltip
            class="item"
            effect="dark"
            content="此客群已发生变化，需要重新关联客群"
            placement="top-start"
            offset="30"
          >
            <el-button>上左</el-button>
            <i class="el-icon-warning el-icon--right c-warning" />
          </el-tooltip>
        </p>
        <div class="config-item">
          <h3 class="config-label-title">已选展示标签</h3>
          <div class="tag-group">
            <div class="tag-group-title">基础属性：</div>
            <el-tag
              v-for="item in tagItems"
              :key="item.label"
              size="mini"
              closable
              @close="handleCloseTag(item)"
            >{{ item.label }}</el-tag>
          </div>
          <div class="tag-group">
            <div class="tag-group-title">用户行为：</div>
            <el-tag
              v-for="item in tagItems"
              :key="item.label"
              size="mini"
              closable
              @close="handleCloseTag(item)"
            >{{ item.label }}</el-tag>
          </div>
          <div class="tag-group">
            <div class="tag-group-title">寄件偏好：</div>
            <el-tag
              v-for="item in tagItems"
              :key="item.label"
              size="mini"
              closable
              @close="handleCloseTag(item)"
            >{{ item.label }}</el-tag>
          </div>
        </div>
      </div>
    </div>
    <!-- 排行任务配置标签 -->
    <div class="config-group">
      <div class="config-thead cf">
        <span>这里是任务名称（排行榜任务-区域排行）</span>
        <div class="fr">
          <el-button type="text" @click="dialogRankFormVisible = true">编辑</el-button>
          <el-button type="text" @click="handeDelItem">删除</el-button>
          <el-button type="text" :icon="isUnfold?'el-icon-arrow-down':'el-icon-arrow-up'" />
        </div>
      </div>
      <div class="config-tbody">
        <p class="tip">
          <span class="c-666">所关联客群：</span>这里是刚才所关联的客群名称
          <el-tooltip
            class="item"
            effect="dark"
            content="此客群已发生变化，需要重新关联客群"
            placement="top-start"
            offset="30"
          >
            <el-button>上左</el-button>
            <i class="el-icon-warning el-icon--right c-warning" />
          </el-tooltip>
        </p>
        <ul class="config-rank-info">
          <li class="item">
            <span class="c-666">时间范围：</span>2020.03.10-2020.03.12
          </li>
          <li class="item">
            <span class="c-666">排序规则：</span>销售额
          </li>
          <li class="item">
            <span class="c-666">数据范围：</span>自营
          </li>
        </ul>
        <div class="config-item">
          <div class="tag-group">
            <div class="tag-group-title">品类筛选：</div>
            <el-tag
              v-for="item in tagItems"
              :key="item.label"
              size="mini"
              closable
              @close="handleCloseTag(item)"
            >{{ item.label }}</el-tag>
          </div>
          <div class="tag-group">
            <div class="tag-group-title">品牌筛选：</div>
            <el-tag
              v-for="item in tagItems"
              :key="item.label"
              size="mini"
              closable
              @close="handleCloseTag(item)"
            >{{ item.label }}</el-tag>
          </div>
          <div class="tag-group">
            <div class="tag-group-title">SKU筛选：</div>
            <el-tag
              v-for="item in tagItems"
              :key="item.label"
              size="mini"
              closable
              @close="handleCloseTag(item)"
            >{{ item.label }}</el-tag>
          </div>
          <div class="tag-group">
            <div class="tag-group-title">地区筛选：</div>
            <el-tag
              v-for="item in tagItems"
              :key="item.label"
              size="mini"
              closable
              @close="handleCloseTag(item)"
            >{{ item.label }}</el-tag>
          </div>
          <div class="tag-group">
            <span class="tag-group-title">站点类型：</span>所有站点
          </div>
        </div>
      </div>
    </div>
    <!-- 添加任务按钮 -->
    <div class="config-group-add-btn">
      <el-button class="lui-btn" @click="dialogPictureFormVisible = true">添加画像任务</el-button>
      <el-button class="lui-btn" @click="dialogRankFormVisible = true">添加排行榜任务</el-button>
    </div>

    <!-- 添加画像任务弹框 -->
    <el-dialog
      title="添加画像任务"
      width="830px"
      :visible.sync="dialogPictureFormVisible"
      custom-class="picture-task-dialog"
    >
      <el-form ref="pictureForm" :model="pictureForm" :rules="pictureRules" label-width="80px">
        <el-row :gutter="30">
          <el-col :span="12">
            <el-form-item label="任务名称" prop="taskName">
              <el-input v-model="pictureForm.taskName" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="关联客群" prop="contactCustom">
              <el-select
                v-model="pictureForm.contactCustom"
                filterable
                clearable
                placeholder="请输入或选择"
                style="display:block"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item
          label="选择展示标签"
          label-position="top"
          label-width="110px"
          prop="label"
          class="label-top"
        >
          <div class="label-wrap">
            <h4 class="label-tit">基础属性</h4>
            <el-checkbox-group v-model="pictureForm.label">
              <el-checkbox label="年龄" name="label" />
              <el-checkbox label="性别" name="label" />
              <el-checkbox label="职业" name="label" />
              <el-checkbox label="学历" name="label" />
              <el-checkbox label="大学生用户" name="label" />
              <el-checkbox label="婚姻状况" name="label" />
              <el-checkbox label="是否有小孩" name="label" />
              <el-checkbox label="多胎用户" name="label" />
              <el-checkbox label="孩子出生月份" name="label" />
              <el-checkbox label="购买力分段" name="label" />
              <el-checkbox label="是否有车" name="label" />
              <el-checkbox label="常用支付方式" name="label" />
              <el-checkbox label="常下单方式" name="label" />
              <el-checkbox label="用户生命周期" name="label" />
              <el-checkbox label="用户级别" name="label" />
              <el-checkbox label="黑名单和刷单用户" name="label" />
              <el-checkbox label="公共人士-网络大V" name="label" />
            </el-checkbox-group>
            <h4 class="label-tit">用户行为</h4>
            <el-checkbox-group v-model="pictureForm.label">
              <el-checkbox label="个人快递常下单途径" name="label" />
              <el-checkbox label="个人快递首次下单途径" name="label" />
              <el-checkbox label="个人快递下单频率" name="label" />
            </el-checkbox-group>
            <h4 class="label-tit">寄件偏好</h4>
            <el-checkbox-group v-model="pictureForm.label">
              <el-checkbox label="寄托物种类偏好" name="label" />
              <el-checkbox label="寄件范围偏好" name="label" />
              <el-checkbox label="产品偏好" name="label" />
              <el-checkbox label="寄件日期偏好" name="label" />
              <el-checkbox label="寄件时间偏好" name="label" />
              <el-checkbox label="托寄物重量偏好" name="label" />
            </el-checkbox-group>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogPictureFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitPictureForm('pictureForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加排行榜任务弹框 -->
    <el-dialog
      title="添加排行榜任务"
      width="630px"
      :visible.sync="dialogRankFormVisible"
      custom-class="rank-task-dialog"
    >
      <el-form ref="rankForm" :model="rankForm" :rules="rankRules" label-width="120px">
        <el-form-item label="任务名称" prop="taskName">
          <el-input v-model="rankForm.taskName" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="关联客群" prop="contactCustom">
          <el-select v-model="rankForm.contactCustom" filterable clearable placeholder="请输入或选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="排行类型" prop="rankType">
          <el-radio-group v-model="rankRules.rankType">
            <el-radio label="1">区域排行</el-radio>
            <el-radio label="2">品类排行</el-radio>
            <el-radio label="3">品牌排行</el-radio>
            <el-radio label="4">SKU排行</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="时间范围" prop="taskDateRange">
          <el-date-picker
            v-model="rankRules.taskDateRange"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="排序规则" class="mb0">
          <el-radio-group v-model="rankRules.orderRule">
            <el-radio label="1">销售额</el-radio>
            <el-radio label="2">销量</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="数据范围" class="mb0">
          <el-radio-group v-model="rankRules.dataRange">
            <el-radio label="1">全部</el-radio>
            <el-radio label="2">品类排行</el-radio>
            <el-radio label="3">非自营</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="地区筛选" class="mb0">
          <el-cascader :options="cascaderOptions" :props="props" filterable clearable />
        </el-form-item>
        <el-form-item label="排序维度" class="mb0">
          <el-radio-group v-model="rankRules.orderDimension">
            <el-radio label="1">区域</el-radio>
            <el-radio label="2">一级地址</el-radio>
            <el-radio label="3">二级地址</el-radio>
            <el-radio label="4">三级地址</el-radio>
            <el-radio label="5">站点</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="站点类型" class="mb0">
          <el-radio-group v-model="rankRules.siteType">
            <el-radio label="1">所有站点</el-radio>
            <el-radio label="2">普通站点</el-radio>
            <el-radio label="3">京东派</el-radio>
            <el-radio label="4">星配站</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="品类筛选">
          <el-cascader :options="cascaderOptions" :props="props" filterable clearable />
        </el-form-item>
        <el-form-item label="品牌筛选">
          <el-select
            v-model="pictureForm.brandSelect"
            filterable
            clearable
            multiple
            placeholder="请输入关键词"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="SKU筛选" class="upload-item">
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
            style="width:150px"
          >
            <el-button type="primary" icon="el-icon-upload2">点击上传</el-button>
          </el-upload>
          <el-button type="text" class="download-template-btn">下载SKU模板</el-button>
          <p class="upload-tip">
            1、上传的文件大小不能超过100Mb
            <br />2、文件有效期为30天，请30天内完成项目审核计算
          </p>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogRankFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitRankForm('rankForm')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 固定在底部按钮 -->
    <div class="ft t-right">
      <el-button @click="handelCancel">取消</el-button>
      <el-button type="primary" @click="handellastStep">上一步</el-button>
      <el-button type="primary" @click="handelSubmit">提交</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CustomersProjectTasK',
  props: {
    step: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      isUnfold: false,
      dialogPictureFormVisible: false,
      dialogRankFormVisible: false,
      fileList: [],
      tagItems: [
        { label: '标签一' },
        { label: '标签二' },
        { label: '标签三' },
        { label: '标签四' },
        { label: '标签五' },
      ],
      options: [
        {
          value: '1',
          label: '选项一',
        },
        {
          value: '2',
          label: '选项二',
        },
      ],
      props: { multiple: true },
      cascaderOptions: [
        {
          value: 1,
          label: '东南',
          children: [
            {
              value: 2,
              label: '上海',
              children: [
                { value: 3, label: '普陀' },
                { value: 4, label: '黄埔' },
                { value: 5, label: '徐汇' },
              ],
            },
          ],
        },
      ],
      pictureForm: {
        taskName: '',
        contactCustom: '',
        label: [],
      },
      pictureRules: {
        taskName: [
          { required: true, message: '请输入任务名称', trigger: 'blur' },
        ],
        contactCustom: [
          { required: true, message: '请选择关联客群', trigger: 'change' },
        ],
        label: [
          {
            type: 'array',
            required: true,
            message: '请至少选择一个标签',
            trigger: 'change',
          },
        ],
      },
      rankForm: {
        taskName: '',
        contactCustom: '',
        rankType: '',
        taskDateRange: '',
        orderRule: '',
        dataRange: '',
        area: '',
        orderDimension: '',
        siteType: '',
        typeSelect: '',
        brandSelect: '',
      },
      rankRules: {
        taskName: [
          { required: true, message: '请输入任务名称', trigger: 'blur' },
        ],
        contactCustom: [
          { required: true, message: '请选择关联客群', trigger: 'change' },
        ],
        rankType: [
          { required: true, message: '请至少选择排行类型', trigger: 'change' },
        ],
        taskDateRange: [
          { required: true, message: '请选择日期范围', trigger: 'change' },
        ],
      },
    }
  },
  created() {},
  methods: {
    submitPictureForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$message({
            message: '任务添加成功',
            type: 'success',
          })
          this.dialogPictureFormVisible = false
        } else {
          this.$message.error('添加任务失败')
          return false
        }
      })
    },
    submitRankForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$message({
            message: '任务添加成功',
            type: 'success',
          })
          this.dialogRankFormVisible = false
        } else {
          this.$message.error('添加任务失败')
          return false
        }
      })
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      )
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`, {
        type: 'warning',
        center: true,
      })
    },
    handeDelItem() {
      this.$confirm('确定要删除此任务吗？', {
        type: 'warning',
        center: true,
      })
    },
    handleCloseTag(tag) {
      this.tagItems.splice(this.tagItems.indexOf(tag), 1)
    },
    handelCancel() {
      this.$confirm('已填写部分内容，是否取消创建', {
        confirmButtonText: '暂存任务',
        cancelButtonText: '取消创建',
        type: 'warning',
        center: true,
      })
    },
    handellastStep() {
      this.$emit('changeStep')
    },
    handelSubmit() {
      this.$alert(
        '<div style="text-align:center">项目已创建并提交审批</br>可以在erp流程中心查看审批进度或进行相关操作</div>',
        {
          dangerouslyUseHTMLString: true,
          showCancelButton: false,
          type: 'success',
          center: true,
        }
      )
    },
  },
}
</script>
<style lang="scss" scoped>
@import './index.scss';
//添加排行榜任务弹框样式
.config-rank-info {
  padding: 10px 0 4px;
  .item {
    display: inline-block;
    margin-right: 40px;
  }
}
</style>
<style lang="scss">
//添加画像任务弹框样式
.picture-task-dialog {
  .label-top {
    .el-form-item__label {
      float: none;
    }
    .el-form-item__content {
      margin-left: 0px !important;
    }
    &.el-form-item {
      margin-bottom: 0;
    }
  }
  .label-wrap {
    padding: 16px;
    background: #fafafa;
    border: 1px solid #dadada;
    border-radius: 4px;
    .label-tit {
      color: #333;
      font-weight: 600;
    }
    .el-checkbox {
      width: 20%;
    }
  }
}
//添加排行榜任务弹框样式
.rank-task-dialog {
  .el-input__inner {
    width: 295px;
  }
  .el-form-item:nth-child(n + 4) {
    margin-bottom: 10px;
  }
  .el-form-item:last-child {
    margin-bottom: 0;
  }
  .upload-tip {
    margin-top: 10px;
    font-size: 12px;
    color: #999;
    line-height: 18px;
  }
  .upload-item {
    position: relative;
    .download-template-btn {
      position: absolute;
      top: 0;
      left: 120px;
    }
  }
}
</style>
