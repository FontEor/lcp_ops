<template>
<el-dialog
      width="1100px"
      height="650px"
      :title="title"
      :visible="true"
      :close-on-click-modal="false"
      @close="handleCancel"
    >
      <el-form class="form-wrap" ref="formContent" :model="formData" :rules="formRule" label-width="80px">
        <p class="form-row">
          <el-form-item label="问题类型" prop="workOrderTypeCode">
            <el-cascader disabled 
            class="cascader-item"
            :value="searchKeyList" 
            :options="usedSearchOptions"
            :props="{value:'code', label:'typeName', children:'children'}"
            >
            </el-cascader>
          </el-form-item>
        </p>
        <p class="form-row">
          <el-form-item label="问题描述" prop="remark">
            <el-input v-model="formData.remark"></el-input>
          </el-form-item>
        </p>
      </el-form>
      <Markdown class="markdown-content" ref="editMarkdown" :value="formData.content" />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onChangeSave()"> 保存 </el-button>
        <el-button
          @click="handleCancel"
        >
          取消
        </el-button>
      </div>
    </el-dialog>
</template>
<script>
import Markdown from "@/components/Markdown/index.vue";
import {questionRequest} from "@/api/module/questionMaintain";
const orgRow = {
  workOrderTypeCode: '',
  content: '',
  remark: '',
  id: null
}
let timerOut = null;
export default {
    props: {
        dialogVisible: {
            type: Boolean,
            default: false,
        },
        rowDetail: {
            type:Object,
            default: {}
        },
        editType: {
          type: Number,
          default: 2
        },
        searchKeyList: {
          type:Array,
          default: []
        },
        searchOptions: {
          type:Array,
          default: []
        }
    },
    computed: {
        visible:{
          set(newVal) {
            this.$emit("update:dialogVisible", newVal)
          },
          get() {
            return this.dialogVisible
          }
        },
        title() {
          return +this.type === 1? '编辑问题': '新增问题'
        },
        usedSearchOptions() {
          if(+this.type === 1) {
            const lastItem = this.searchOptions.at(-1)
            if (this.formData.workOrderTypeCode === lastItem) {
              return this.searchOptions
            } else {
              this.$message.error('后台返回的详情数据有问题')
            }
          }
          return this.searchOptions;
        }
    },
    data() {
        return {
            formData: {
             ...orgRow
            },
            formRule: {
                remark: [
                    {
                        required: true, message: '请输入问题描述', trigger: 'change'
                    },
                    {
                        min:2, max: 299, message: '名称长度限制2-200个字符', trigger: 'change'
                    }
                ]
            }
        }
    },
    mounted() {
      this.formData = Object.assign({},this.formData, this.rowDetail);
      timerOut = setTimeout(() => {
        this.$refs.editMarkdown && this.$refs.editMarkdown.setValue(this.formData.content || '');
        clearTimeout(timerOut);
      }, 700)
    },
    methods: {
        async onChangeSave() {
          this.formData.content = this.$refs.editMarkdown.getValue();
          const response = await questionRequest.editQuestion(this.formData);
          const {code, message} = response || {};
          if (+code === 20000) {
            // 保存成功后更新列表
            this.$emit('change', this.editType);
            this.handleCancel();
          } else {
            this.$message.error(message);
          }
        },
        handleCancel () {
          this.$refs.editMarkdown.setValue('');
          this.visible = false;
          this.formData = {...orgRow}
          this.$refs.formContent.clearValidate();
        },

    },
    components: {
        Markdown
    },
    name: 'editQuestion'
}
</script>
<style scoped lang="scss">
.markdown-content {
    height: 400px;
}
.cascader-item {
  min-width: 265px;
}
</style>