<template>
  <!-- 复制来源：src/views/userManagement/index.vue -->
  <div class="app-container">
    <el-tabs>
      <el-tab-pane v-loading="table.loading" :label="tabs.paneLabelList[0]">
        <el-form :model="form" :inline="true">
          <el-form-item :label="form.itemLabelList[0]">
            <el-select
              v-model="form.select.value"
              :placeholder="`请选择${form.itemLabelList[0]}`"
              clearable
              filterable
            >
              <el-option
                v-for="(option, index) in form.select.options"
                :key="index"
                :value="option.code"
                :label="option.name"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="form.itemLabelList[1]">
            <el-button type="primary" @click="postUserData">
              {{ form.buttonText[0] }}
            </el-button>
            <!-- 为什么这么写呢？ -->
            <a class="el-button el-button--primary" href="/operation/rest/getErpEmail" download>导出内网用户邮箱</a>
          </el-form-item>
        </el-form>

        <el-table
          :data="table.rowList"
          :row-class-name="tableRowClassName"
          height="px"
          style="height: 50vh"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            align="center"
            :selectable="selectable"
          />
          <el-table-column label="序号" type="index" align="center" />
          <el-table-column
            v-for="(item, index) in table.columnList"
            :key="index"
            :label="item.label"
            :prop="item.prop"
            align="center"
          >
            <template slot-scope="{ row }">
              <span>{{ formatColumn(item.prop, row[item.prop]) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="{ row }">
              <el-button
                type="primary"
                size="mini"
                plain
                @click="handleUpdate(row)"
              >
                数据同步
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div v-show="table.rowList.length" class="paneFooter">
          <el-button
            slot="reference"
            type="primary"
            :disabled="table.selectionListIsEmpty"
            @click="createIDaas"
          >
            创建IDaas账号
          </el-button>
          <el-pagination
            background
            layout="prev, pager, next, jumper"
            :current-page.sync="pagination.page"
            :page-size="pagination.pageSize"
            :total="pagination.total"
            @current-change="postUserData"
            @prev-click="postUserData"
            @next-click="postUserData"
          />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import request from "@/utils/request.js";

export default {
  name: "UserManagement",
  data() {
    return {
      tabs: {
        paneLabelList: ["成员信息"],
      },
      form: {
        itemLabelList: ["开发商名称", ""],
        select: {
          value: null,
          options: [],
        },
        buttonText: ["查询"],
      },
      table: {
        rowList: [],
        columnList: [
          {
            label: "开发商名称",
            prop: "supplierName",
          },
          {
            label: "开发商编码",
            prop: "supplierCode",
          },
          {
            label: "用户账户",
            prop: "pin",
          },
          {
            label: "姓名",
            prop: "name",
          },
          {
            label: "账户类型",
            prop: "typeCode",
          },
          {
            label: "角色",
            prop: "roleCode",
          },
          {
            label: "手机",
            prop: "phone",
          },
          {
            label: "邮箱",
            prop: "email",
          },
          {
            label: "租户ID",
            prop: "tenantId",
          },
          {
            label: "租户Code",
            prop: "tenantCode",
          },
          {
            label: "第三方pin",
            prop: "thirdPartyPin",
          },
          {
            label: "是否已注册IDaas账号",
            prop: "haveFlag",
          },
          {
            label: "创建人",
            prop: "createUser",
          },
          {
            label: "创建时间",
            prop: "createTime",
          },
          {
            label: "更新人",
            prop: "updateUser",
          },
          {
            label: "更新时间",
            prop: "updateTime",
          },
        ],
        typeCodeList: ["erp", "passport", "idaas"],
        roleCodeList: ["员工", "管理员"],
        haveFlagList: ["未注册", "已注册", "不需要注册"],
        loading: false,
        selectionList: [],
        selectionListIsEmpty: true,
      },
      pagination: {
        page: 0,
        pageSize: 10,
        total: null,
      },
    };
  },

  mounted() {
    this.postSupplierData();
    this.postUserData();
  },

  methods: {
    selectable(row, index) {
      return !row.haveFlag;
    },
    tableRowClassName({ row, rowIndex }) {
      return row.haveFlag ? "info-row" : "";
    },
    toggleLoading() {
      this.table.loading = !this.table.loading;
    },
    createIDaas() {
      this.postCreateIDaasData();
    },
    popNotifies(resolveList) {
      let offset = 0;
      resolveList.forEach((item) => {
        if (item.flag) {
          this.$notify({
            title: "成功",
            message: `用户：${item.pin} 提示：${item.errorMessage}`,
            type: "success",
            offset,
          });
        } else {
          this.$notify({
            title: "失败",
            message: `用户：${item.pin} 提示：${item.errorMessage}`,
            type: "error",
            offset,
          });
        }
        offset += 60;
      });
    },
    postCreateIDaasData() {
      // console.log(
      //   "postCreateIDaasData 请求主体",
      //   JSON.stringify({ erpCreateIdaasApiList: this.table.selectionList })
      // );
      request({
        url: "platformUser/rest/batchCreateIdaasAccount",
        method: "post",
        params: {},
        data: { erpCreateIdaasApiList: this.table.selectionList },
      })
        .then((resolve) => {
          // console.log("postCreateIDaasData 请求数据", resolve.data);
          this.postUserData();
          this.popNotifies(resolve.data);
        })
        .catch((error) => {
          console.log("postCreateIDaasData 请求数据错误！", error);
        });
    },
    postSupplierData() {
      request({
        url: "platformUser/rest/querySupplierList",
        method: "post",
        params: {},
        data: {},
      })
        .then((resolve) => {
          // console.log("postSupplierData 请求选择框数据", resolve);
          this.form.select.options = resolve.data;
        })
        .catch((error) => {
          console.log("postSupplierData 请求选择框数据错误！", error);
        });
    },
    postUserData() {
      this.toggleLoading();
      request({
        url: "platformUser/rest/queryUserList",
        method: "post",
        params: {
          page: this.pagination.page,
          pageSize: this.pagination.pageSize,
          total: this.pagination.total,
        },
        data: { supplierCode: this.form.select.value },
      })
        .then((resolve) => {
          // console.log("postUserData 请求表格数据", resolve);
          const { rows, page, pageSize, total } = resolve.data;
          this.table.rowList = rows;
          this.pagination = { page, pageSize, total };
          this.toggleLoading();
        })
        .catch((error) => {
          console.log("postUserData 请求表格数据错误！", resolve);
          this.toggleLoading();
        });
    },
    handleSelectionChange(selection) {
      this.table.selectionListIsEmpty = !selection.length;
      this.table.selectionList = selection.map((item) => {
        const {
          userId,
          roleCode,
          tenantCode,
          operator,
          pin,
          supplierId,
          supplierCode,
          thirdPartyPin,
          typeCode,
        } = item;
        return {
          userId,
          roleCode,
          tenantCode,
          operator,
          pin,
          supplierId,
          supplierCode,
          thirdPartyPin,
          typeCode,
        };
      });
    },
    formatColumn(key, value) {
      if (key) {
        if (key === "typeCode") {
          return this.table.typeCodeList[value];
        } else if (key === "roleCode") {
          return this.table.roleCodeList[value];
        } else if (key === "haveFlag") {
          return this.table.haveFlagList[value];
        } else if (key.endsWith("Time")) {
          return value ? value.replace("T", " ").split(".")[0] : "";
        } else {
          return value;
        }
      }
    },
    handleUpdate(row) {
      console.log(row, "row");
      this.$confirm("确定要数据同步吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          const url = "/platformUser/rest/idaasDataToGateWay";
          request({
            url,
            method: "post",
            data: {
              supplierId: row.supplierId,
              pin: row.pin,
              idaasUserId: row.idaasUserId,
              tenantCode: row.tenantCode,
              typeCode: row.typeCode,
              userId: row.userId,
            },
          })
            .then((res) => {
              // console.log(res);
              this.$message({
                type: "success",
                message: "同步成功!",
              });
            })
            .catch((e) => {
              console.log("数据同步错误", e);
            });
        })
        .catch((e) => {
          console.log("取消同步", e);
        });
    },
    // 导出内网成员邮箱
    exportMembersEmail() {
      axios({
        url: "/operation/rest/getErpEmail",
        method: ""
      })
    }
  },
};
</script>

<style lang="scss" scoped>
.el-table {
  /deep/ .info-row {
    color: #909399;
  }
}

.paneFooter {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
</style>
