<template>
  <el-dialog
    class="classification-dialog"
    width="670px"
    title="管理选项枚举值"
    :visible="showClassificationDialog"
    :close-on-click-modal="false"
    @opened="handleOpen"
    @close="handleClose"
  >
    <div class="dialog__header">
      <el-button type="text" @click="newClassification"
        >+ 新增分类</el-button
      >
    </div>
    <el-table class="dialog__table" :data="tableData" height="350" row-key="id">
      <el-table-column prop="mockData" label="选项枚举值">
        <template slot-scope="scope">
          <span v-if="!scope.row.editNameState">{{ scope.row.mockData }}</span>
          <el-form :ref="`mockDataForm${scope.row.id}`" v-else :model="scope.row" :rules="rules" style="width: 100%" @submit.native.prevent>
            <el-form-item prop="mockData">
              <el-input
                v-model.trim="scope.row.mockData"
                placeholder="请输入选项枚举值，1-30个字符"
              ></el-input>
              </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="{ row, $index }">
          <el-button
            type="text"
            v-if="!row.editNameState"
            @click="handleEdit(row, $index)"
            >编辑</el-button
          >
          <el-button
            type="text"
            :class="`table__delete table__delete__${row.editNameState}`"
            @click="handleDelete(row, $index)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">关闭</el-button>
      <el-button type="primary" @click="handleSave">保存</el-button>
    </span>
  </el-dialog>
</template>

<script>
import _ from "lodash";
import API from "@/api/index";

export default {
  name: "ClassifyCationDialog",
  props: {
    showClassificationDialog: {
      type: Boolean,
      required: true,
    },
    sandboxNodeApiCode: {
      type: String,
      default: "",
      required: true,
    },
    unitId: {
      type: Number,
      default: 0,
    },
  },
  data () {
    return {
      tableData: [],
      rules: {
        mockData: [
          {
            min: 1, max: 30, message: "1-30个字符", trigger: "blur", required: true,
          }
        ]
      }
    }
  },
  watch: {
  },
  methods: {
    async queryTableList() {
      const response = await API.sandbox.selectDifferentList({sandboxNodeApiCode: this.sandboxNodeApiCode});
      this.tableData = response.data;
      this.tableData.forEach(item => {
        item['editNameState'] = false;
      });
    },
    handleOpen() {
      this.queryTableList();
    },
    // 关闭弹窗
    handleClose() {
      this.$emit("update:showClassificationDialog", false);
      this.tableData = [];
    },
    // 新增，新增列id需要唯一否则拖拽排序会出现混乱
    newClassification() {
      this.tableData.push({
        id: -new Date().getTime(),
        mockData: "",
        sandboxNodeApiCode: this.sandboxNodeApiCode,
        editNameState: true,
      });
    },
    // 编辑
    async handleEdit(row, index) {
      row.editNameState = true;
      this.tableData.splice(index, 1, row);
    },
    // 删除
    async handleDelete(row, index) {
        this.tableData.splice(index, 1);
    },
    beforeSave () {
      return this.tableData.map(item => {
        if (this.$refs[`mockDataForm${item.id}`]) {
          this.$refs[`mockDataForm${item.id}`].validate((valid) => {
            if (!valid) {
              throw new Error("选项枚举值必填")
              return false;
            }
          })
        }
        if (Math.sign(item.id) === -1) {
          item.id = null;
        }
        return item;
      })
    },
    // 保存
    async handleSave () {
      let data = [];
      try {
        data = this.beforeSave()
      } catch(err){
        if (err) {
          return;
        }
      };
      const requestData = {
        code: this.sandboxNodeApiCode,
        sandboxNodeApiDetailDtos: data,
      }
      const response = await API.sandbox.saveDifferent(requestData);
      if (response.code === 20000) {
        this.$message.success("保存成功");
        this.handleClose();
        this.$emit("updateDifferentList")
      } else {
        this.$message.error("保存失败")
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.classification-dialog {
  .dialog__header {
    .header__desc {
      line-height: 32px;
    }
    display: flex;
    justify-content: flex-end;
  }
  .dialog__table {
    .table__delete {
      color: #e1251b;
      &__true {
        margin-bottom: 22px;
      }
    }
  }
  ::v-deep .el-dialog__body {
    padding: 8px 16px;
  }
  ::v-deep .cell {
    display: flex;
    align-items: center;
    .operation-icon {
      display: inline-block;
      height: 18px;
      width: 18px;
      margin: 0 20px;
      // background: url("~@/assets/drag.svg");
      background-size: 100%;
      &:hover {
        cursor: pointer;
      }
    }
  }
}
::v-deep .sortable-chosen {
  cursor: grabbing;
}
</style>
