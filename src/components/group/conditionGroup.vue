<template>
  <!--  不作为最终文件-->
  <!-- 配置条件组 -->
  <div class="lui-container">
    <h2 class="lui-tit">配置条件组</h2>
    <!-- 原客群 -->
    <div class="config-group">
      <div class="config-thead">
        <h3>原客群</h3>
      </div>
      <div class="config-tbody">
        <span class="lui-label c-666">客群名称：</span>原来的客群名称
      </div>
    </div>
    <!-- 导入文件结果 -->
    <div class="config-group">
      <div class="config-thead"><h3>导入文件结果</h3></div>
      <div class="config-tbody">
        <div><i class="el-icon-link el-icon--left" />文件1.txt</div>
        <div class="tag-group tag-info-group">
          <span class="c-999">以</span>
          <el-tag type="info" effect="lightBorder">文件中经纬度</el-tag>
          <span class="c-999">为中心</span>
          <el-tag type="info" effect="lightBorder">4  X  3</el-tag>
          <span class="c-999">公里的矩形范围</span>
        </div>
      </div>
    </div>
    <!-- 配置文件结果 -->
    <div class="config-group">
      <div class="config-thead"><h3>配置文件结果</h3></div>
      <div class="config-tbody">
        <el-row :gutter="20">
          <el-col :span="8"><div><i class="el-icon-link el-icon--left" />文件1.txt</div></el-col>
          <el-col :span="8"><span class="c-666">是否手机号转PIN：</span>是</el-col>
        </el-row>
      </div>
    </div>
    <!-- 配置标签 -->
    <div class="config-group">
      <div class="config-thead cf">
        <div class="fl">
          <div v-if="!isEditConfigTit">
            <span @click="isEditConfigTit = true">
              {{ input }}
              <i class="el-icon-edit el-icon--right c-666" />
            </span>
            <span class="c-666 f12 pl10">(已选10个标签，2个时间段，2个订单数量要求)</span>
          </div>
          <el-input
            v-else
            v-model="input"
            placeholder="请输入"
            size="mini"
            autofocus
            class="config-edit-tit-inp"
            @blur="isEditConfigTit = false"
          />
        </div>
        <div class="fr">
          <el-button type="text">复制</el-button>
          <el-button type="text" @click="showAddGroupDialog">编辑</el-button>
          <el-button type="text" @click="handeDelConfigItem">删除</el-button>
          <el-button type="text" :icon="isUnfold?'el-icon-arrow-down':'el-icon-arrow-up'" @click="toggleFold" />
        </div>
      </div>
      <div v-show="isUnfold" class="config-tbody">
        <div class="config-item">
          <h3 class="config-label-title">用户标签</h3>
          <div class="tag-group">
            <div class="tag-group-title">包含：</div>
            <el-tag
              v-for="item in tagItems"
              :key="item.label"
              size="mini"
              closable
              @close="handleCloseTag(item)"
            >
              {{ item.label }}
            </el-tag>
          </div>
          <div class="tag-group">
            <div class="tag-group-title">不含：</div>
            <el-tag
              v-for="item in tagItems"
              :key="item.label"
              type="warning"
              size="mini"
              closable
              @close="handleCloseTag(item)"
            >
              {{ item.label }}
            </el-tag>
          </div>
        </div>
        <div class="config-item">
          <h3 class="config-label-title">运营数据</h3>
          <div class="config-time-subitem">
            <p class="config-label-tip">
              <span class="c-666">下单时间：</span>
              <span>2019.6.18 - 2019.6.19</span>
            </p>
            <div class="tag-group">
              <div class="tag-group-title">包含：</div>
              <el-tag
                v-for="item in tagItems"
                :key="item.label"
                size="mini"
                closable
                @close="handleCloseTag(item)"
              >
                {{ item.label }}
              </el-tag>
            </div>
            <div class="tag-group">
              <div class="tag-group-title">不含：</div>
              <el-tag
                v-for="item in tagItems"
                :key="item.label"
                type="warning"
                size="mini"
                closable
                @close="handleCloseTag(item)"
              >
                {{ item.label }}
              </el-tag>
            </div>
          </div>
          <div class="config-time-subitem">
            <p class="config-label-tip">
              <span class="c-666">下单时间：</span>
              <span class="mr20">2019.6.18 - 2019.6.19</span>
              <span class="mr20">C2C订单数量≥4</span>
            </p>
            <div class="tag-group">
              <div class="tag-group-title">包含：</div>
              <el-tag
                v-for="item in tagItems"
                :key="item.label"
                size="mini"
                closable
                @close="handleCloseTag(item)"
              >
                {{ item.label }}
              </el-tag>
            </div>
            <div class="tag-group">
              <div class="tag-group-title">不含：</div>
              <el-tag
                v-for="item in tagItems"
                :key="item.label"
                type="warning"
                size="mini"
                closable
                @close="handleCloseTag(item)"
              >
                {{ item.label }}
              </el-tag>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 配置文件结果 -->
    <div class="config-group">
      <div class="config-thead"><h3>已配置文件</h3></div>
      <div class="config-tbody">
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
        <div class="pt10">
          <span class="mr20">是否手机号转PIN</span>
          <el-radio-group v-model="radio">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </div>
      </div>
    </div>
    <!-- 配置地区选择区域结果 -->
    <div class="config-group">
      <div class="config-thead"><h3>地区选择区域结果</h3></div>
      <div class="config-tbody">
        <el-form ref="ruleForm" :model="ruleForm" :rules="rules">
          <el-form-item label="选择方式" prop="f4">
            <el-radio-group v-model="ruleForm.f4">
              <el-radio label="1">地图选择</el-radio>
              <el-radio label="2">文件导入</el-radio>
            </el-radio-group>
          </el-form-item>
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
          <el-form-item label="设置范围" class="mb0">
            <el-radio-group v-model="ruleForm.f5">
              <el-radio label="1">无范围</el-radio>
              <el-radio label="2">圆形范围</el-radio>
              <el-radio label="3">矩形范围</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="选中地点为中心半径">
            <el-input-number
              v-model="ruleForm.f6"
              controls-position="right"
              :min="1" :max="10"
              size="mini"
            />
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!-- 配置地区 -->
    <div>
      <h2 class="lui-tit">地区范围</h2>
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules">
        <el-form-item label="选择方式" prop="f4">
          <el-radio-group v-model="ruleForm.f4">
            <el-radio label="1">地图选择</el-radio>
            <el-radio label="2">文件导入</el-radio>
          </el-radio-group>
        </el-form-item>
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
        <el-form-item label="选择文件中的经纬度为中心宽">
          <el-input-number
            v-model="ruleForm.f6"
            controls-position="right"
            :min="1" :max="10"
            size="mini"
          />
          <span class="pl10">公里的范围</span>
        </el-form-item>
        <el-form-item label="选择文件中的经纬度为中心长">
          <el-input-number
            v-model="ruleForm.f6"
            controls-position="right"
            :min="1" :max="10"
            size="mini"
          />
          <span class="pl10">公里的范围</span>
        </el-form-item>
      </el-form>
      <!-- 添加条件组按钮 -->
      <div class="config-group-add-btn">
        <el-button class="lui-btn mr10" @click="showAddGroupDialog">添加条件组</el-button>
        <span class="c-999">(可添加条件组，进行详细筛选)</span>
      </div>
    </div>
    <div class="mb20">
      <div><i class="el-icon-link el-icon--left" />文件1.txt</div>
      <div class="tag-group tag-info-group">
        <span class="c-999">以</span>
        <el-tag type="info" effect="lightBorder">文件中经纬度</el-tag>
        <span class="c-999">为中心</span>
        <el-tag type="info" effect="lightBorder">4  X  3</el-tag>
        <span class="c-999">公里的矩形范围</span>
      </div>
    </div>
    <!-- 配置文件 -->
    <div>
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
      <ul class="f13 c-999 mt10">
        <li>1、支持txt、csv格式，且大小不能超过100Mb</li>
        <li>2、文件名只能包含中字，字母，数字</li>
        <li>3、文件编码需为UTF-8格式 <el-button type="text" size="small" @click="showTranscodeDialog">点此查看如何转码</el-button></li>
        <li>4、内容需拆行分隔，并最多100个字符</li>
      </ul>
      <div class="pt10">
        <span class="mr20">是否手机号转PIN</span>
        <el-radio-group v-model="radio">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </div>
    </div>
    <!-- 添加条件组按钮 -->
    <div class="config-group-add-btn">
      <el-button ref="condition" class="lui-btn mr10" @click="showAddGroupDialog">添加条件组</el-button>
      <span class="c-999">(可添加条件组，进行详细筛选)</span>
    </div>
    <!--弹框添加条件组按钮 -->
    <condition ref="condition" />
    <!--弹框转码教程 -->
    <transcode ref="transcode" />
  </div>
</template>

<script type="text/babel">
import Condition from '@/components/group/condition.vue'
import Transcode from '@/components/group/transcode.vue'
export default {
  name: 'ConditionGroup',
  components: {
    Condition,
    Transcode
  },
  props: {
  },
  data() {
    return {
      isDialogVisible: false,
      isDialogCodeVisible: false,
      isUnfold: false,
      isEditConfigTit: false,
      isUnfoldSelect: false,
      input: '条件组1',
      configSelect: {
        val1: '1',
        val2: '1',
        val3: '2'
      },
      options: [
        {
          value: '1',
          label: '选项一'
        },
        {
          value: '2',
          label: '选项二'
        },
        {
          value: '3',
          label: '选项三'
        },
        {
          value: '4',
          label: '选项四'
        },
        {
          value: '5',
          label: '选项五'
        },
        {
          value: '6',
          label: '选项六'
        }
      ],
      fileList: [],
      tagItems: [
        { label: '标签一' },
        { label: '标签二' },
        { label: '标签三' },
        { label: '标签四' },
        { label: '标签五' }
      ],
      radio: 1,
      ruleForm: {
        f1: '',
        f2: '',
        f3: '',
        f4: '',
        f5: '',
        f6: ''
      },
      rules: {
        f1: [
          { required: true, message: '请输入客群名称', trigger: 'blur' }
        ],
        f2: [
          { required: true, message: '请填写客群描述', trigger: 'blur' }
        ],
        f3: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ],
        f4: [
          { required: true, message: '请选择选择方式', trigger: 'change' }
        ]
      }
    }
  },

  mounted() {
  },
  methods: {
    showAddGroupDialog() {
      this.$refs.condition.showDialog()
    },
    showTranscodeDialog() {
      this.$refs.transcode.showDialog()
    },
    toggleFold() {
      this.isUnfold = !this.isUnfold
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
    handleCloseTag(tag) {
      this.tagItems.splice(this.tagItems.indexOf(tag), 1)
    },
    handeDelConfigItem() {
      this.$confirm('确认要删除条件组吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import './group.scss';
</style>
