<template>
  <div class="lui-container">
    <h2 class="lui-tit">条件组关系</h2>
    <!-- 条件组关系合并 -->
    <div class="config-relation-container">
      <div class="config-relation-group-wrap">
        <!-- 条件组关系分开 -->
        <div class="select-dep-group">
          <el-select v-model="configSelect.val1" placeholder="请选择" class="blue-select">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-select v-model="configSelect.val2" placeholder="请选择" class="blue-border-select">
            <el-option label="并且" value="1" />
            <el-option label="或者" value="2" />
            <el-option label="不含" value="3" />
          </el-select>
          <el-select v-model="configSelect.val3" placeholder="请选择" class="blue-select">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <!-- 条件组关系合并 -->
        <div class="select-merge-group">
          <div v-if="!isUnfoldSelect" class="relation-merge-plus">
            <el-select v-model="configSelect.val1" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-dropdown class="avatar-container" trigger="hover">
              <i class="icon el-icon-plus" @click="isUnfoldSelect = true" />
              <el-dropdown-menu slot="dropdown" class="user-dropdown">
                <el-dropdown-item
                  v-for="item in options"
                  :key="item.value"
                >
                  {{ item.label }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div v-else class="relation-merge">
            <el-select v-model="configSelect.val1" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <span>|</span>
            <el-select v-model="configSelect.val2" placeholder="请选择" class="w80">
              <el-option label="并且" value="1" />
              <el-option label="或者" value="2" />
              <el-option label="不含" value="3" />
            </el-select>
            <span>|</span>
            <el-select v-model="configSelect.val3" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <span>|</span>
            <i class="icon el-icon-close" @click="isUnfoldSelect = false" />
          </div>
        </div>
      </div>
      <!-- 条件组关系说明 -->
      <condition-group-tips />
    </div>
  </div>
</template>

<script>
import ConditionGroupTips from '@/components/group/conditionGroupTips.vue'
export default {
  name: 'ConditionRelation',
  components: {
    ConditionGroupTips
  },
  data() {
    return {
      isUnfoldSelect: false,
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
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.config-relation-container{
  .select-dep-group,
  .select-merge-group{
    margin-bottom:20px;
  }
  .example{
    padding-top:8px;
    .tag-group{
      margin-top:10px;
      .el-tag{
        margin:0 5px;
      }
    }
  }
}
.blue-select,
.blue-border-select{
  font-size: 14px;
  text-align: center;
}
/deep/ .select-dep-group{
  .blue-select{
    width:100px;
    margin-right:10px;
    .el-input__inner{
      color:#fff;
      &::placeholder{
        color:#fff;
      }
    }
    .el-input .el-select__caret{
      color:#fff;
    }
  }
  .blue-border-select{
    width:80px;
    margin-right:10px;
  }
}
/deep/ .select-merge-group{
  display:inline-block;
  color:#fff;
  border-radius:4px;
  .w80{
    width:80px;
  }
  .el-input__inner{
    width:100px;
    border-radius:0;
    border:0;
    color:#fff;
    background-color:transparent;
    &::placeholder{
      color:#fff;
    }
  }
  .relation-merge-plus .el-input .el-select__caret,
  .relation-merge .el-input .el-select__caret{
    color:#fff;
  }
  span{
    color:rgba(255,255,255,.65);
  }
  .icon{
    color:#fff;
    padding:10px;
  }
}
</style>
<style lang="scss">
@import "~@/assets/styles/mixins.scss";
.select-dep-group{
  .blue-select{
    .el-input__inner{
      @include background_color("main-color");
      @include border_color("main-color");
    }
  }
  .blue-border-select{
    .el-input__inner{
      @include border_color("main-color");
      @include font_color("main-color");
    }
    .el-input .el-select__caret{
      @include font_color("main-color");
    }
  }
}
.select-merge-group{
  @include background_color("main-color");
}
</style>
