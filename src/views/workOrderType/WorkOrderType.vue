<template>
  <div class="edi-wrapper">
    <div style="margin-bottom: 0.5rem; text-align: right">
      <el-button type="primary" v-if="!isExpandAll" @click="toggleExpandAll"
        >全部展开</el-button
      >
      <el-button type="primary" v-else @click="toggleExpandAll"
        >全部收起</el-button
      >
    </div>
    <el-table
      v-if="refreshTable"
      v-loading="loading"
      :data="tableData"
      :show-tooltip-when-overflow="true"
      :default-expand-all="isExpandAll"
      :row-key="handleRowId"
      height="600"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column
        style="white-space: pre-wrap"
        label="工单类型"
        prop="typeName"
      />
      <el-table-column label="创建人" prop="createUser" />
      <el-table-column label="创建时间" prop="createTime">
        <template slot-scope="scope">
          {{ formatTime(scope.row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column label="更新人" prop="updateUser" />
      <el-table-column label="更新时间" prop="updateTime">
        <template slot-scope="scope">
          {{ formatTime(scope.row.updateTime) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="left" width="200px">
        <template slot-scope="scope">
          <el-button-group>
            <el-button
              style="margin-right: 0.5rem"
              size="mini"
              type="text"
              @click="handleAddOrEdit(0, '新增工单类型', scope.row)"
            >
              新建
            </el-button>
            <el-button
              style="margin-right: 0.5rem"
              size="mini"
              type="text"
              @click="handleAddOrEdit(1, '编辑工单类型', scope.row)"
            >
              编辑
            </el-button>
            <el-button size="mini" type="text" @click="handleDelete(scope.row)">
              删除
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <!-- <Pagination
      v-if="tableData.length"
      :currentPage.sync="pagination.page"
      :pageSize.sync="pagination.pageSize"
      :total.sync="pagination.total"
      :reloadTableData="queryWorkOrderTypedData"
    /> -->
    <el-button
      icon="el-icon-plus"
      v-if="!tableData.length"
      style="width: 100%; margin-top: 1rem"
      @click="handleAddOrEdit(1, '新增工单类型')"
      >添加工单类型</el-button
    >
    <!-- 新增和编辑 -->
    <el-dialog
      width="30%"
      height="100%"
      :title="workOrderTypeTitle"
      :close-on-click-modal="false"
      :visible.sync="dialogDetail"
      center
    >
      <div>
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="类型" prop="workOrderType">
            <el-radio-group
              v-model="ruleForm.workOrderType"
              :disabled="addOrEditType ? true : false"
            >
              <el-radio :label="0">当前目录</el-radio>
              <el-radio :label="1">子目录</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="名称" prop="name">
            <el-input
              v-model="ruleForm.name"
              placeholder="请输入工单类型的名称"
              clearable
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer" style="text-align: right">
        <el-button type="primary" @click="saveWorkOrderTypeData('ruleForm')"
          >保存</el-button
        >
      </div>
    </el-dialog>
    <!-- 删除 -->
    <el-dialog
      width="30%"
      height="100%"
      title="删除提示"
      :close-on-click-modal="false"
      :visible.sync="isChildrenDialog"
      center
    >
      <div>
        <span
          >该工单类型下已有子目录，不允许删除，请删除子目录后再点击删除</span
        >
      </div>
      <div slot="footer" class="dialog-footer" style="text-align: right">
        <el-button @click="isChildrenDialog = false">关闭</el-button>
      </div>
    </el-dialog>
    <el-dialog
      width="30%"
      height="100%"
      title="删除提示"
      :close-on-click-modal="false"
      :visible.sync="dialogDelete"
      center
    >
      <div v-if="!isUse">
        <span>该工单类型已被使用，删除前请选择其它工单类型替换此工单类型</span>
        <el-form
          style="margin-top: 1rem"
          :model="ruleForm"
          :rules="rules"
          ref="deleteruleForm"
          label-width="80px"
          class="demo-ruleForm"
        >
          <el-form-item label="工单类型" prop="workOrderType">
            <el-cascader
              style="width: 70%"
              v-model="ticketTypeVal"
              :options="workOrderTypeOptions"
              :props="cateListProps"
              placeholder="请选择其它工单类型替换此工单类型"
            />
          </el-form-item>
        </el-form>
      </div>
      <div v-else>
        <span>请确认是否删除该工单类型</span>
      </div>
      <div slot="footer" class="dialog-footer" style="text-align: right">
        <el-button @click="dialogDelete = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitDelete('deleteruleForm')"
          >确认</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Sortable from "sortablejs";
import parseTime from "@/utils/parseTime";
import Pagination from "@/components/Pagination.vue";
import lcp from "@/api/lcp/index";
import { cateListProps, pagination, rules, ruleForm } from "./workOrderType";
export default {
  name: "WorkOrderType",
  components: {
    Pagination,
    Sortable,
  },
  data() {
    return {
      addOrEditType: 0, //判断能否编辑
      tempId: "",
      dialogDelete: false,
      isChildrenDialog: false,
      isUse: false, //true表示可以删除
      workOrderTypeOptions: [],
      ticketTypeVal: "",
      workOrderTypeTitle: "",
      isExpandAll: false,
      refreshTable: true,
      parentId: 0,
      workOrderId: null,
      selectedId: null,
      workOrderCode: "",
      tableData: [],
      sortTableData: [],
      flag: true,
      dialogDetail: false,
      ruleForm,
      rules,
      cateListProps,
      pagination,
      loading: true,
    };
  },
  computed: {},
  mounted() {
    this.queryWorkOrderTypedData();
  },
  updated() {
    this.dropRow();
  },
  methods: {
    handleRowId(row) {
      return row.id + "" + row.index;
    },
    //拖动行进行排序
    dropRow() {
      if (this.tableData.length > 0) {
        const tbody = document.querySelector(".el-table__body-wrapper tbody");
        if (!tbody) {
          return;
        }
        const self = this;
        Sortable.create(tbody, {
          onEnd({ newIndex, oldIndex }) {
            let tData = JSON.parse(JSON.stringify(self.tableData));
            self.sortTableData = [];
            self.treeConvertToList(tData);
            const oldNode = self.sortTableData[oldIndex];
            const newNode = self.sortTableData[newIndex];
            if (oldNode.parentId !== newNode.parentId) {
              self.$message.error("只能移动同一层级下的目录或文档");
              return;
            } else {
              let sortArr = [];
              let oldObj = {
                id: oldNode.id,
                seq: newNode.seq,
              };
              let newObj = {
                id: newNode.id,
                seq: oldNode.seq,
              };
              sortArr.push(oldObj);
              sortArr.push(newObj);
              self.setSort(sortArr);
            }
          },
        });
      }
    },
    //把树形数据结构转为LIST数据结构
    treeConvertToList(tree) {
      for (let i in tree) {
        const node = tree[i];
        this.sortTableData.push({
          id: node.id,
          seq: node.seq,
          parentId: node.parentId,
        });
        let children = node.children;
        if (
          children !== null &&
          children !== undefined &&
          children.length > 0
        ) {
          this.recurrenceFun(children, this.sortTableData, node.id);
        }
      }
    },
    //设置排序
    async setSort(sortArr) {
      await lcp.workOrder.workOrderType
        .updateWorkOrderTypeSeq(sortArr)
        .then(async (res) => {
          if (res.code === 20000) {
            this.$message.success(res.message);
          }
          this.loading = true;
          await this.queryWorkOrderTypedData();
          this.loading = false;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    //递归
    recurrenceFun(tree, list, parentId) {
      for (let i in tree) {
        const node = tree[i];
        list.push({
          id: node.id,
          seq: node.seq,
          parentId: parentId,
        });
        let children = node.children;
        if (
          children !== null &&
          children !== undefined &&
          children.length > 0
        ) {
          this.recurrenceFun(children, list, node.id);
        }
      }
    },
    //全部展开和全部收起
    toggleExpandAll() {
      this.refreshTable = false;
      this.isExpandAll = !this.isExpandAll;
      this.$nextTick(() => {
        this.refreshTable = true;
      });
    },
    //提交删除数据
    async handleSubmitDelete(formName) {
      if (!this.isUse) {
        //该工单类型已经被使用
        let ticketId = this.ticketTypeVal[this.ticketTypeVal.length - 1];
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            if (this.workOrderCode === ticketId) {
              this.$message.error("该工单类型已被使用，请选择其它工单类型");
              return;
            }
            let params = {
              code: this.workOrderCode,
              newCode: ticketId,
            };
            await lcp.workOrder.workOrderType
              .replaceWorkOrderType(params)
              .then(async (res) => {
                if (res.code === 20000) {
                  await this.queryWorkOrderTypedData();
                  this.$message({
                    message: "操作成功",
                    type: "success",
                  });
                  this.dialogDelete = false;
                } else {
                  this.$message.error(res.message);
                }
              })
              .catch((error) => {
                throw new Error(`deleteWorkOrderTypeCheck, ${error}`);
              });
          }
        });
      } else {
        //该工单类型未被使用
        let params = {
          id: this.workOrderId,
        };
        await lcp.workOrder.workOrderType
          .deleteWorkOrderType(params)
          .then(async (res) => {
            if (res.code === 20000) {
              await this.queryWorkOrderTypedData();
              this.$message({
                message: "操作成功",
                type: "success",
              });
              this.dialogDelete = false;
            } else {
              this.$message.error(res.message);
            }
          });
      }
    },
    //删除前的校验
    async handleDelete(row) {
      if (row.children && row.children.length) {
        this.isChildrenDialog = true;
      } else {
        this.workOrderId = row.id;
        this.workOrderCode = row.code;
        const params = {
          id: row.id,
        };
        await lcp.workOrder.workOrderType
          .deleteWorkOrderTypeCheck(params)
          .then((res) => {
            this.isUse = res.data;
          })
          .catch((error) => {
            throw new Error(`deleteWorkOrderTypeCheck, ${error}`);
          });
        this.dialogDelete = true;
      }
    },
    //处理新建和编辑工单的弹框数据
    handleAddOrEdit(type, title, row) {
      console.log("row", row);
      this.selectedId = null;
      if (typeof row !== "undefined") {
        this.parentId = row.parentId;
        this.workOrderId = row.id;
        this.ruleForm.workOrderType = row.seq;
        this.ruleForm.name = row.typeName;
        this.tempId = row.id;
      }
      if (title === "新增工单类型") {
        this.workOrderId = null;
        this.ruleForm.workOrderType = 0;
        this.ruleForm.name = "";
        this.selectedId = row.id;
      }
      this.workOrderTypeTitle = title;
      this.addOrEditType = type;
      this.dialogDetail = true;
    },
    //工单的新增和编辑
    async saveWorkOrderTypeData(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const params = {
            id: this.workOrderId,
            parentId: this.ruleForm.workOrderType ? this.tempId : this.parentId,
            typeName: this.ruleForm.name,
            selectedId: this.selectedId || 0,
          };
          await lcp.workOrder.workOrderType
            .saveWorkOrderTypeData(params)
            .then((res) => {
              if (res.code === 20000) {
                this.$message({
                  message: "操作成功",
                  type: "success",
                });
                this.queryWorkOrderTypedData();
                this.dialogDetail = false;
              } else {
                this.$message.error(res.message);
              }
            })
            .catch((error) => {
              throw new Error(`saveWorkOrderTypeData, ${error}`);
            });
        } else {
          return false;
        }
      });
    },
    // 为数组添加index的属性
    addIndexProperty(data, indexPropName) {
      if (Array.isArray(data)) {
        // 遍历数组中的每个元素并递归调用 addIndexProperty 函数
        data.forEach((item, index) => {
          // 在对象上添加索引属性
          item[indexPropName] = index;
          this.addIndexProperty(item, indexPropName);
        });
      } else if (typeof data === "object" && data !== null) {
        // 遍历对象的所有属性值并递归调用 addIndexProperty 函数
        Object.values(data).forEach((value) => {
          this.addIndexProperty(value, indexPropName);
        });
      }
    },
    //获取工单类型数据
    async queryWorkOrderTypedData() {
      this.loading = true;
      await lcp.workOrder.workOrderType
        .queryWorkOrderTypeList()
        .then(async (res) => {
          if (res.code === 20000) {
            this.tableData = [];
            await this.$nextTick();
            this.addIndexProperty(res.data, "index");
            this.tableData = res.data;
            this.workOrderTypeOptions = res.data;
            this.pagination.total = res.data.length;
            this.loading = false;
          }
        })
        .catch((error) => {
          throw new Error(`queryWorkOrderTypeList, ${error}`);
        });
    },
    //时间格式化
    formatTime(time) {
      return parseTime.timeInTable(time) || "-";
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .el-table .cell {
  white-space: pre-wrap;
}
</style>
